/* eslint-disable @typescript-eslint/no-explicit-any */
// api.ts

import { ApiResponse } from "../types/interfaces";

const API_BASE_URL = "https://localhost:8080";

interface LoginResponse {
  message: string;
  [key: string]: any;
}

interface UserData {
  id: string;
  nome: string;
  username: string;
  organizacaoId: number;
  role: string;
  status: string;
  admin?: string;
  manager?: string;
  mensagem?: string;
}

interface UsersResponse {
  id: string;
  username: string;
  nome: string;
  role: string;
  status: string;
  inicioTurno: string;
  fimTurno: string;
  inicioPausa: string;
  fimPausa: string;
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
  justificativa: string | null;
  tempoLogado: number | null;
  tempoPausa: number | null;
}



export type RegisterResponse = RegisterPonto[];

export async function loginUser(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/center-security/login-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
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
  const response = await fetch(`${API_BASE_URL}/center-security/trocar-senha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, senhaProvisoria: oldPassword, novaSenha: newPassword, confirmarSenha: newPassword }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  return data;
}



export async function invokeMe(): Promise<UserData> {
  const response = await fetch(`${API_BASE_URL}/api/administradores/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data: UserData = await response.json();
  console.log("Dados do usuário:", data);
  return data;
}

export async function listUsersLogados(): Promise<UsersResponse> {
  const response = await fetch(`${API_BASE_URL}/api/administradores/funcionarios/logados`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data: UsersResponse = await response.json();
  console.log("Dados do usuário logados:", data);
  return data;
}

export async function listUsersIdName(): Promise<UsersResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/administradores/funcionarios/list-name-id`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data: UsersResponse[] = await response.json();
  console.log("Dados de Id e Nome dos usuários:", data);
  return data;
}

export async function startTurnApi(): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ponto/iniciar-turno`, {
    method: "POST",
    credentials: "include",
  });

  const data: LoginResponse = await response.json();
  console.log("Erro ao logar no data.message:", data.message);

    if (!response.ok) {
      throw new Error(data["Erro:"] || "Erro desconhecido");
    }

  return data;
}



export async function startBreakApi(): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ponto/iniciar-pausa`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  return data;
}


export async function finalBreakApi(): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ponto/finalizar-pausa`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  return data;
}


export async function finalTurnApi(): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ponto/finalizar-turno`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  return data;
}



export async function registerMe(): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ponto/me-register`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: RegisterResponse = await response.json();
  console.log("Dados do usuário do registerMe:", data);
  return data;
}


export async function folhaPontoUserIdAdmin(adminId: number, userId: number, mes: number, ano: number): Promise<FolhaPonto[]> {
  const response = await fetch(`${API_BASE_URL}/api/administradores/folha-ponto-user/${adminId}/${userId}/${mes}/${ano}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: FolhaPonto[] = await response.json();
  console.log("Dados da folha de ponto do usuário:", data);
  return data;
}


export async function addPontoFuncionarioAdmin(userId: string, inicioTurno: string, inicioPausa: string, fimPausa: string, fimTurno: string, status: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/administradores/funcionarios/folha-ponto/adicionar`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      inicioTurno,
      inicioPausa,
      fimPausa,
      fimTurno,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse = await response.json();
  return data;
}

export async function updatePontoFuncionarioAdmin(id: number, userId: string, inicioTurno: string, inicioPausa: string, fimPausa: string, fimTurno: string, status: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/administradores/funcionarios/folha-ponto/atualizar/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      inicioTurno,
      inicioPausa,
      fimPausa,
      fimTurno,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse = await response.json();
  return data;
}



export async function addPontoAusenteFuncionarioAdmin(userId: string, data: string, status: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/administradores/funcionarios/folha-ponto/adicionar-turno-ausente`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      data,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const dataReturn: ApiResponse = await response.json();
  return dataReturn;
}


export async function updatePontoAusenteFuncionarioAdmin(id: number, userId: string, data: string,status: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/administradores/funcionarios/atualizar-ponto-ausente/atualizar/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      data,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const dataReturn: ApiResponse = await response.json();
  return dataReturn;
}