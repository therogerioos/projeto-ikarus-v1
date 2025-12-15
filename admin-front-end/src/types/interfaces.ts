

export interface UserDataIdName {
  id: string;
  nome: string;
}


export interface FolhaPonto {
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

export interface ResumoEscala {
  nome: string | null;
  username: string | null;
  mes: number | null;
  ano: number | null;
  data: string | null;
  status: string | null;
  inicioTurno: string | null;
  inicioPausa: string | null;
  fimPausa: string | null;
  fimTurno: string | null;
}

export interface PontoFuncionario {
  userId: string;
  inicioTurno: string;
  inicioPausa: string;
  fimPausa: string;
  fimTurno: string;
  status: string;
}

export interface PontoFuncionarioAusente {
  userId: string;
  data: string;
  status: string;
}

export interface ApiResponse {
  message?: string;
  error?: string;
}

export interface CadastroUser {
  id: number | null;
  matricula: string | null;
  username: string | null;
  nome: string | null;
  funcao: string | null;
  gestor: string | null;
  status: string | null;
  tipoEscala: string | null;
  interjornada: string | null;
  tempoPausa: string | null;
  limiteHorasExtras: string | null;
  cargaHoraria: string | null;
  inicioTurno: string | null;
  fimTurno: string | null;
  inicioPausa: string | null;
  fimPausa: string | null;
  dataNascimento: string | null;
  dataAdmissao: string | null;
  dataDemissao: string | null;
  ctps: string | null;
  serieCtps: string | null;

}

export interface DiaEscala {
  status?: string;
  inicioTurno?: string;
  inicioPausa?: string;
  fimPausa?: string;
  fimTurno?: string;
}

export interface InterfaceEscalaResumo {
  nome: string;
  username: string;
  dias: Partial<Record<string, DiaEscala | null>>;
}

export type DeviceStatus = "AUTORIZADO" | "PENDENTE" | "NEGADO";

export interface TimeInput {
  hours: string;
  minutes: string;
  seconds: string;
}

export interface Device {
  id: string;
  hostname: string;
  status: DeviceStatus;
  criadoEm: string;
  justificativa: string;
}