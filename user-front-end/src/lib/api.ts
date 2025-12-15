// api.ts

const API_BASE_URL = "https://localhost:8080";

interface LoginResponse {
  message: string;
  [key: string]: any;
}

interface UserData {
  id: string;
  nome: string;
  username: string;
  status: string;
}

interface RegisterPonto {
  inicioTurno: string;
  inicioPausa: string;
  fimPausa: string;
  fimTurno: string;
}

interface FolhaPonto {
  id: number | null;
  atraso: number | null;
  data: string;
  fimPausa: string | null;
  fimTurno: string | null;
  horaExtra: number | null;
  inicioPausa: string | null;
  inicioTurno: string | null;
  status: string;
  tempoLogado: number | null;
  tempoPausa: number | null;
}

export type RegisterResponse = RegisterPonto[];

export async function loginUser(
  username: string,
  password: string,
  uuid: string,
  hostname: string,
  hashMaquina: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/center-security/login-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, uuid, hostname, hashMaquina }),
  });

  const data: LoginResponse = await response.json();

  if (!response.ok) {
        const errorMessage = data.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
  }
  return data;
}




export async function changePassword(
  username: string,
  oldPassword: string,
  newPassword: string,
): Promise<LoginResponse> {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(`${API_BASE_URL}/center-security/trocar-senha`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ username, senhaProvisoria: oldPassword, novaSenha: newPassword, confirmarSenha: newPassword }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  return data;
}



export async function invokeMe(): Promise<UserData> {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(`${API_BASE_URL}/api/usuarios/me`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: UserData = await response.json();
  console.log("Dados do usuário:", data);
  return data;
}



export async function startTurnApi(): Promise<LoginResponse> {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(`${API_BASE_URL}/api/ponto/iniciar-turno`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data: LoginResponse = await response.json();
  console.log("Erro ao logar no data.message:", data.message);

    if (!response.ok) {
      throw new Error(data["Erro:"] || "Erro desconhecido");
    }

  return data;
}



export async function startBreakApi(): Promise<LoginResponse> {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(`${API_BASE_URL}/api/ponto/iniciar-pausa`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  return data;
}


export async function finalBreakApi(): Promise<LoginResponse> {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(`${API_BASE_URL}/api/ponto/finalizar-pausa`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  return data;
}


export async function finalTurnApi(): Promise<LoginResponse> {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(`${API_BASE_URL}/api/ponto/finalizar-turno`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  return data;
}



export async function registerMe(): Promise<RegisterResponse> {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(`${API_BASE_URL}/api/ponto/me-register`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: RegisterResponse = await response.json();
  console.log("Dados do usuário do registerMe:", data);
  return data;
}


export async function folhaPontoUser(userId: number, mes: number, ano: number): Promise<FolhaPonto[]> {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(`${API_BASE_URL}/api/ponto/folha-ponto-user/${userId}/${mes}/${ano}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: FolhaPonto[] = await response.json();
  return data;
}