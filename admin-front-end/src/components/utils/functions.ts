

export function formatTime(date: Date) : string {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
}


export function formatDateBR(dateStr: string): string {
  const [year, month, day] = dateStr.split("-")
  return `${day}/${month}/${year}`
}


export function formatDateTimeBR(date?: Date | null): string {
  if (!date || isNaN(date.getTime())) return "--/--/---- --:--:--"; // retorna "-" se inválido

  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}


export function segundosParaHHMMSS(totalSegundos: number | null): string | null {
  if(!totalSegundos) return null;
  const horas = Math.floor(totalSegundos / 3600)
  const minutos = Math.floor((totalSegundos % 3600) / 60)
  const segundos = totalSegundos % 60

  const pad = (num: number) => num.toString().padStart(2, "0")

  return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`
}

// Formata data no formato DD/MM/AAAA
export function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Converte string ISO para hora no formato HH:MM:SS
export function formatISOToTime(isoString?: string | null): string | undefined | null {
  if (!isoString) return undefined;
  const date = new Date(isoString);
  return date.toLocaleTimeString("pt-BR", { hour12: false });
}


export function concatHoras(hora: string | null, minutos: string | null, segundos: string | null) {
  if(!hora || !minutos || !segundos) return null;
  const formatado = `${hora.padStart(2, "0")}:${minutos.padStart(2, "0")}:${segundos.padStart(2,"0")}`;
  return formatado;
}


export function formatarDiaMesComSemana(dia: number, mes: number, ano: number): string {
  const data = new Date(ano, mes - 1, dia); // meses em JS começam do 0
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const diaSemana = diasSemana[data.getDay()]; 
  const diaFormatado = dia.toString().padStart(2, '0');
  const mesFormatado = mes.toString().padStart(2, '0');
  return `${diaFormatado}/${mesFormatado} (${diaSemana}) `;
}