
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Clock, UserRoundCheck, BookUser, MonitorPause } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { LoadingOverlay } from "../ui/loading";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { processUsers } from "../../lib/timelineUtils";
import { formatTime } from "../utils/functions";
import { Callout } from "../ui/callout";
import { MyToast } from "../ui/toast-sonner";

export function PainelTab() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading] = useState(false);
  const listUsersLogados = useSelector((state: RootState) => state.ponto.registros);
  const user = useSelector((state: RootState) => state.auth.user);

  const flatListUsersLogados = listUsersLogados.flat();

  const { timelineItems, totalLogados, totalEmPausa } = processUsers(flatListUsersLogados);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

const calcularTempoLogado = (
  inicioTurno?: string | Date | null,
  fimTurno?: string | Date | null,
  inicioPausa?: string | Date | null,
  fimPausa?: string | Date | null
): { tempoFormatado: string; totalMs: number } | null => {
  // Validação: sem inicioTurno não calcula nada
  if (!inicioTurno) return null;

  const inicioDate = new Date(inicioTurno);
  const fimDate = fimTurno ? new Date(fimTurno) : new Date();

  let diffMs = fimDate.getTime() - inicioDate.getTime();

  // Caso inicioPausa e fimPausa existam → desconta tempo de pausa
  if (inicioPausa && fimPausa) {
    const inicioPausaDate = new Date(inicioPausa);
    const fimPausaDate = new Date(fimPausa);
    diffMs -= fimPausaDate.getTime() - inicioPausaDate.getTime();
  }

  // Caso esteja em pausa no momento (inicioPausa existe mas fimPausa não)
  if (inicioPausa && !fimPausa) {
    const inicioPausaDate = new Date(inicioPausa);
    diffMs = inicioPausaDate.getTime() - inicioDate.getTime();
  }

  if (diffMs < 0) diffMs = 0; // evita negativo

  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return {
    tempoFormatado: `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`,
    totalMs: diffMs
  };
};

const calcularTempoPausa = (inicioPausa?: string | Date | null, fimPausa?: string | Date | null) => {
  if (!inicioPausa) return null; // sem início de pausa, não contabiliza

  const inicio = new Date(inicioPausa);
  const fim = fimPausa ? new Date(fimPausa) : new Date(); // se fimPausa não existe, usar hora atual

  let diffMs = fim.getTime() - inicio.getTime();
  if (diffMs < 0) diffMs = 0; // evita negativo por dados inconsistentes

  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
};


  const formatISOToTime = (isoString?: string): string | undefined => {
    if (!isoString) return undefined;
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour12: false });
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="space-y-6">
      {user?.mensagem !== null &&
        <Callout
          variant="warning"
          title="Ação Necessária"
          dismissible
          onClose={() => MyToast({ type: "info", message: 'Solicite a atualização das informações do cadastro do seu perfil.' })}
        >
          {user?.mensagem}
        </Callout>
      }


      {/* Current Time Display */}
      <Card className="bg-gray-200 border-white shadow-card">
        <CardContent className="pt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-primary mr-2" />
              <span className="text-base font-medium">Horário Atual</span>
            </div>
            <div className="text-4xl font-bold text-foreground">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {currentTime.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BookUser className="h-6 w-6 text-primary mr-2" />
              <span className="text-base font-medium">Agentes Logados</span>
            </div>
            <div className="text-4xl font-bold text-foreground">
              {totalLogados ?? '0'}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MonitorPause className="h-6 w-6 text-primary mr-2" />
              <span className="text-base font-medium">Agentes em pausa</span>
            </div>
            <div className="text-4xl font-bold text-foreground">
              {totalEmPausa ?? '0'}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-gray-200 border-white shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="rounded-lg bg-[#E08625]/10 p-3 mr-3">
                <UserRoundCheck className="h-8 w-8 text-[#E08625]" />
              </div>
                Painel de Logados
            </CardTitle>
            <CardDescription>
              Acompanhe em tempo real, o comportamento dos funcionários logados no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 ">
              <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 border-gray-300">
                        <TableHead className="font-bold  text-center">Usuário</TableHead>
                        <TableHead className="font-bold  text-center">Nome</TableHead>
                        <TableHead className="font-bold  text-center">Início do turno</TableHead>
                        <TableHead className="font-bold  text-center">Fim do turno</TableHead>
                        <TableHead className="font-bold  text-center">Início da pausa</TableHead>
                        <TableHead className="font-bold  text-center">Fim da pausa</TableHead>
                        <TableHead className="font-bold  text-center">Tempo Logado</TableHead>
                        <TableHead className="font-bold  text-center">Tempo em Pausa</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                  
            {timelineItems.map((item, index) => {

              return (
                
                <TableRow key={index} className="hover:bg-gray-300 border-gray-300 transition-colors">
                  <TableCell className="font-medium  text-center">                  
                    <div><span className="text-sm font-semibold">{item.username}</span></div>
                  </TableCell>
                  <TableCell className="font-medium  text-center">
                    <div><span className="text-sm font-semibold">{item.nome}</span></div>
                  </TableCell>
                  <TableCell className="font-medium  text-center">
                    <div><span className="text-sm font-semibold">{formatISOToTime(item.inicioTurno ?? undefined)}</span></div>
                  </TableCell>
                  <TableCell className="font-medium  text-center">
                    <div><span className="text-sm font-semibold">{formatISOToTime(item.fimTurno ?? undefined)}</span></div>
                  </TableCell>
                  <TableCell className="font-medium  text-center">
                    <div><span className="text-sm font-semibold">{formatISOToTime(item.inicioPausa ?? undefined)}</span></div>
                  </TableCell>
                  <TableCell className="font-medium  text-center">
                    <div><span className="text-sm font-semibold">{formatISOToTime(item.fimPausa ?? undefined)}</span></div>
                  </TableCell>
                  <TableCell className="font-medium  text-center">
                    <div><span className="text-sm font-semibold">{calcularTempoLogado(item.inicioTurno, item.fimTurno, item.inicioPausa, item.fimPausa)?.tempoFormatado ?? "--:--:--"}</span></div>
                  </TableCell>
                  <TableCell className="font-medium  text-center">
                    <div><span className="text-sm font-semibold">{calcularTempoPausa(item.inicioPausa, item.fimPausa) ?? "--:--:--"}</span></div>
                  </TableCell>
                </TableRow>
              );
            })}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}