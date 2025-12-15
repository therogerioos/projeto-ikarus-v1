
// timelineUtils.ts

export interface TimelineItem {
  id?: string;
  username?: string;
  nome?: string;
  role?: string;
  status?: string;
  inicioTurno?: string | null;
  fimTurno?: string | null;
  inicioPausa?: string | null;
  fimPausa?: string | null;
}

export interface TimelineResult {
  timelineItems: TimelineItem[];
  totalLogados: number;
  totalEmPausa: number;
}

interface UsersResponse {
  id?: string;
  username?: string;
  nome?: string;
  role?: string;
  status?: string;
  horaInicioTurno?: string;
  horaFimTurno?: string;
  horaInicioPausa?: string;
  horaFimPausa?: string;
}

export function processUsers(listUsersLogados: UsersResponse[] | null): TimelineResult {
  if (!listUsersLogados) {
    return { timelineItems: [], totalLogados: 0, totalEmPausa: 0 };
  }

  const timelineItems: TimelineItem[] = listUsersLogados.map(user => ({
    id: user.id,
    username: user.username,
    nome: user.nome,
    role: user.role,
    status: user.status,
    inicioTurno: user.horaInicioTurno,
    fimTurno: user.horaFimTurno,
    inicioPausa: user.horaInicioPausa,
    fimPausa: user.horaFimPausa
  }));

  const totalLogados = listUsersLogados.filter(u => u.horaInicioTurno != null).length;

  const totalEmPausa = listUsersLogados.filter(
    u => u.horaInicioPausa != null && u.horaFimPausa == null
  ).length;

  return { timelineItems, totalLogados, totalEmPausa };
}

