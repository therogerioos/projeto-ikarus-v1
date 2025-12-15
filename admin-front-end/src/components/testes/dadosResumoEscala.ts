import { InterfaceEscalaResumo } from "../../types/interfaces";

export const dadosResumoEscala: InterfaceEscalaResumo[] = [
  {
    nome: "Rogerio Oliveira dos Santos",
    username: "rogerio.oliveira",
    dias: {
      "1": { status: "Escalado", inicioTurno: "08:00", fimTurno: "17:00" },
      "2": { status: "Folga" },
      "3": { status: "Escalado", inicioTurno: "08:00", fimTurno: "17:00" },
      "4": { status: "Férias" },
      "5": { status: "Licença" },
    }
  },
  {
    nome: "Paula Santos Soares",
    username: "paula.soares",
    dias: {
      "1": { status: "Escalado", inicioTurno: "07:00", fimTurno: "16:00" },
      "5": { status: "Demitido" },
    }
  },
  {
    nome: "Ana Souza",
    username: "ana.souza",
    dias: {
      "1": { status: "Escalado", inicioTurno: "08:00", fimTurno: "17:00" },
      "2": { status: "Folga" },
      "3": { status: "Escalado", inicioTurno: "08:00", fimTurno: "17:00" },
      "4": { status: "Licença" },
      "5": { status: "Férias" },
    }
  },
  {
    nome: "Carlos Pereira",
    username: "carlos.pereira",
    dias: {
      "1": { status: "Escalado", inicioTurno: "06:00", fimTurno: "15:00" },
      "2": { status: "Folga" },
      "3": { status: "Escalado", inicioTurno: "06:00", fimTurno: "15:00" },
    }
  },
  {
    nome: "Juliana Lima",
    username: "juliana.lima",
    dias: {
      "1": { status: "Escalado", inicioTurno: "09:00", fimTurno: "18:00" },
      "2": { status: "Folga" },
      "3": { status: "Escalado", inicioTurno: "09:00", fimTurno: "18:00" },
      "5": { status: "Licença" },
    }
  },
  {
    nome: "Juliana Mariana Carvalho Batista Souto",
    username: "juliana.souto",
    dias: {
      "1": { status: "Escalado", inicioTurno: "09:00", fimTurno: "18:00" },
      "2": { status: "Folga" },
      "3": { status: "Escalado", inicioTurno: "09:00", fimTurno: "18:00" },
      "5": { status: "Licença" },
    }
  }
];
