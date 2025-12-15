
use rusqlite::{Connection, params};
use hostname::get;
use sha2::{Sha256, Digest};
use uuid::Uuid;
use rusqlite::OptionalExtension;

use aes_gcm::{Aes256Gcm, Key, KeyInit, Nonce, aead::{Aead}};

use rand::RngCore;
use base64::{engine::general_purpose, Engine as _};

// Divida a chave em partes para dificultar engenharia reversa
const PART1: &str = "mK8x9vQ2pLs3";
const PART2: &str = "AzXf7rTy5MwGnYzE";

fn get_secret_key() -> Key<Aes256Gcm> {
    let mut key_bytes = [0u8; 32];
    let combined = format!("{}{}", PART1, PART2);
    let combined_bytes = combined.as_bytes();
    let len = combined_bytes.len().min(32);
    key_bytes[..len].copy_from_slice(&combined_bytes[..len]);

    Key::<Aes256Gcm>::from_slice(&key_bytes).clone()
}

fn get_hostname() -> Result<String, String> {
    get()
        .map_err(|e| e.to_string())?
        .into_string()
        .map_err(|_| "Failed to convert hostname to string".into())
}

// Criptografa texto, retorna base64(nonce + ciphertext)
fn encrypt(plaintext: &str, key: &Key<Aes256Gcm>) -> Result<String, String> {
    let cipher = Aes256Gcm::new(key);

    // Gera nonce aleatório de 12 bytes
    let mut nonce_bytes = [0u8; 12];
    rand::thread_rng().fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    let ciphertext = cipher.encrypt(nonce, plaintext.as_bytes())
        .map_err(|e| format!("Encrypt error: {:?}", e))?;

    // Concatena nonce + ciphertext para salvar juntos
    let mut result = nonce_bytes.to_vec();
    result.extend(ciphertext);

    Ok(general_purpose::STANDARD.encode(&result))
}

fn hash_username(username: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(username.as_bytes());
    hex::encode(hasher.finalize())
}

// Descriptografa base64(nonce + ciphertext) para texto
fn decrypt(data_b64: &str, key: &Key<Aes256Gcm>) -> Result<String, String> {
    let data = general_purpose::STANDARD.decode(data_b64).map_err(|e| format!("Base64 decode error: {:?}", e))?;

    if data.len() < 12 {
        return Err("Data too short".into());
    }

    let (nonce_bytes, ciphertext) = data.split_at(12);
    let nonce = Nonce::from_slice(nonce_bytes);

    let cipher = Aes256Gcm::new(key);
    let plaintext_bytes = cipher.decrypt(nonce, ciphertext)
        .map_err(|e| format!("Decrypt error: {:?}", e))?;

    String::from_utf8(plaintext_bytes).map_err(|e| format!("UTF8 error: {:?}", e))
}

#[tauri::command]
pub fn get_or_create_device(username: String) -> Result<(String, String, String), String> {
    let hostname = get_hostname()?;
    let secret_key = get_secret_key();

    let conn = Connection::open("device_data.db").map_err(|e| e.to_string())?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS dispositivos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username_encrypted TEXT NOT NULL UNIQUE,
            uuid_encrypted TEXT NOT NULL,
            hostname_encrypted TEXT NOT NULL,
            hash_encrypted TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    ).map_err(|e| e.to_string())?;

    // Criptografa username para busca
    let username_enc = hash_username(&username);

    let mut stmt = conn.prepare(
        "SELECT uuid_encrypted, hash_encrypted, hostname_encrypted FROM dispositivos WHERE username_encrypted = ?1"
    ).map_err(|e| e.to_string())?;

    let registro = stmt.query_row(params![&username_enc], |row| {
        Ok((
            row.get::<_, String>(0)?,
            row.get::<_, String>(1)?,
            row.get::<_, String>(2)?,
        ))
    }).optional().map_err(|e| e.to_string())?;

    if let Some((uuid_enc, hash_enc, hostname_enc)) = registro {
        // Descriptografa e retorna
        let uuid = decrypt(&uuid_enc, &secret_key)?;
        let hash = decrypt(&hash_enc, &secret_key)?;
        let hostname = decrypt(&hostname_enc, &secret_key)?;
        Ok((uuid, hostname, hash))
    } else {
        // Não existe, cria novo

        let uuid = Uuid::new_v4().to_string();

        // Gera hash sha256(uuid + hostname)
        let mut hasher = Sha256::new();
        hasher.update(uuid.as_bytes());
        hasher.update(hostname.as_bytes());
        let hash_bytes = hasher.finalize();
        let hash_str = hex::encode(hash_bytes);

        // Criptografa todos
        let uuid_enc = encrypt(&uuid, &secret_key)?;
        let hash_enc = encrypt(&hash_str, &secret_key)?;
        let hostname_enc = encrypt(&hostname, &secret_key)?;

        conn.execute(
            "INSERT INTO dispositivos (username_encrypted, uuid_encrypted, hostname_encrypted, hash_encrypted) VALUES (?1, ?2, ?3, ?4)",
            params![&username_enc, &uuid_enc, &hostname_enc, &hash_enc],
        ).map_err(|e| e.to_string())?;

        Ok((uuid, hostname, hash_str))
    }
}
