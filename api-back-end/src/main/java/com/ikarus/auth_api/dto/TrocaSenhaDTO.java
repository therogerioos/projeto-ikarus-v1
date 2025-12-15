package com.ikarus.auth_api.dto;

public class TrocaSenhaDTO {
    private String username;
    private String senhaProvisoria;
    private String novaSenha;
    private String confirmarSenha;

    // Getters e Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getSenhaProvisoria() { return senhaProvisoria; }
    public void setSenhaProvisoria(String senhaProvisoria) { this.senhaProvisoria = senhaProvisoria; }

    public String getNovaSenha() { return novaSenha; }
    public void setNovaSenha(String novaSenha) { this.novaSenha = novaSenha; }

    public String getConfirmarSenha() { return confirmarSenha; }
    public void setConfirmarSenha(String confirmarSenha) { this.confirmarSenha = confirmarSenha; }
}
