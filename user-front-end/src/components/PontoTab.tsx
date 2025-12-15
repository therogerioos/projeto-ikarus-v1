import { useState, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Clock, Play, Pause, Square, CheckCircle, CalendarClock, XCircle } from "lucide-react";
import { finalBreakApi, finalTurnApi, registerMe, startBreakApi, startTurnApi } from "../lib/api";
import { setRegistros } from "../store/slices/pontoSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from "./ui/loading";
import { MyToast } from "../components/ui/toast-sonner";
import dayjs from "dayjs";

interface TimeRecord {
  startShift?: string;
  startBreak?: string;
  endBreak?: string;
  endShift?: string;
}

type ActionType = 'startShift' | 'startBreak' | 'endBreak' | 'endShift';

const actionLabels = {
  startShift: 'Iniciar Turno',
  startBreak: 'Iniciar Pausa',
  endBreak: 'Finalizar Pausa',
  endShift: 'Finalizar Turno'
};

const actionIcons = {
  startShift: Play,
  startBreak: Pause,
  endBreak: Play,
  endShift: Square
};

interface RegistroPonto {
  inicioTurno?: string;
  fimTurno?: string;
  inicioPausa?: string;
  fimPausa?: string;
}

export type RegisterResponse = RegistroPonto[];

export function PontoTab() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRecord, setTimeRecord] = useState<TimeRecord>({});
  const [currentStep, setCurrentStep] = useState<ActionType>('startShift');
  const inicioTurno = useSelector((state: any) => state.ponto.registros?.[0]?.inicioTurno);
  const fimTurno = useSelector((state: any) => state.ponto.registros?.[0]?.fimTurno);
  const inicioPausa = useSelector((state: any) => state.ponto.registros?.[0]?.inicioPausa);
  const fimPausa = useSelector((state: any) => state.ponto.registros?.[0]?.fimPausa);
  const horaInicioTurno = useSelector((state: any) => state.auth.user?.horaInicioTurno);
  const horaFimTurno = useSelector((state: any) => state.auth.user?.horaFimTurno);
  const horaInicioPausa = useSelector((state: any) => state.auth.user?.horaInicioPausa);
  const horaFimPausa = useSelector((state: any) => state.auth.user?.horaFimPausa);
  const token = useSelector((state: any) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const parseTime = (timeString: string): Date => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const now = new Date();
  now.setHours(hours, minutes, seconds, 0);
  return now;
  };

  const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':');
  };

const getWorkedTime = () => {
  if (!timeRecord.startShift) return null;

  const start = parseTime(timeRecord.startShift);
  const end = timeRecord.endShift
    ? parseTime(timeRecord.endShift)
    : new Date();

  let pauseDuration = 0;

  if (timeRecord.startBreak) {
    const pauseStart = parseTime(timeRecord.startBreak);
    const pauseEnd = timeRecord.endBreak
      ? parseTime(timeRecord.endBreak)
      : new Date(); // pausa ainda em andamento → considera agora
    pauseDuration += pauseEnd.getTime() - pauseStart.getTime();
  }

  const totalWorked = end.getTime() - start.getTime() - pauseDuration;

  return totalWorked > 0 ? formatDuration(totalWorked) : "00:00:00";
};


  const getPausedTime = () => {
  if (!timeRecord.startBreak) return null;

  const pauseStart = parseTime(timeRecord.startBreak);
  const pauseEnd = timeRecord.endBreak
    ? parseTime(timeRecord.endBreak)
    : new Date(); // ainda em pausa

  const pauseDuration = pauseEnd.getTime() - pauseStart.getTime();
  return pauseDuration > 0 ? formatDuration(pauseDuration) : '00:00:00';
  };


  const fetchData = useCallback(async () => {
  try {
      const data: RegisterResponse = await registerMe();
      dispatch(setRegistros(data));
    } catch (err) {
      MyToast({ type: "error", message: `Erro ao registrar: ${err}` });
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [token, dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatISOToTime = (isoString?: string): string | undefined => {
    if (!isoString) return undefined;
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour12: false });
  };

  const updateTimeRecordFromRedux = () => {
    setTimeRecord({
      startShift: formatISOToTime(inicioTurno),
      startBreak: formatISOToTime(inicioPausa),
      endBreak: formatISOToTime(fimPausa),
      endShift: formatISOToTime(fimTurno),
    });
  };

  useEffect(() => {
    if (inicioTurno || inicioPausa || fimPausa || fimTurno) {
      setTimeRecord({
        startShift: formatISOToTime(inicioTurno),
        startBreak: formatISOToTime(inicioPausa),
        endBreak: formatISOToTime(fimPausa),
        endShift: formatISOToTime(fimTurno),
      });

      if (!inicioTurno) setCurrentStep('startShift');
      else if (inicioTurno && !inicioPausa) setCurrentStep('startBreak');
      else if (inicioPausa && !fimPausa) setCurrentStep('endBreak');
      else if (fimPausa && !fimTurno) setCurrentStep('endShift');
      else setCurrentStep('startShift'); // ou qualquer lógica de reset
    }
  }, [inicioTurno, inicioPausa, fimPausa, fimTurno]);

  const handleAction = async (action: ActionType) => {
      try {
        setLoading(true);
        switch (action) {
          case 'startShift':
            await startTurnApi();
            fetchData();
            MyToast({ type: "success", message: 'Registro de início de turno realizado com sucesso.' });
            break;
          case 'startBreak':
            await startBreakApi();
            fetchData();
            MyToast({ type: "success", message: 'Registro de início de pausa realizado com sucesso.' });
            break;
          case 'endBreak':
            await finalBreakApi();
            fetchData();
            MyToast({ type: "success", message: 'Registro de fim de pausa realizado com sucesso.' });
            break;
          case 'endShift':
            await finalTurnApi();
            fetchData();
            MyToast({ type: "success", message: 'Registro de fim de turno realizado com sucesso.' });
            break;
        }
      } catch (error) {
        MyToast({ type: "error", message: `Erro ao executar: ${error}` });
      }

    fetchData();
    updateTimeRecordFromRedux();

    // Determine next step
    const nextSteps = {
      startShift: 'startBreak' as ActionType,
      startBreak: 'endBreak' as ActionType,
      endBreak: 'endShift' as ActionType,
      endShift: 'startShift' as ActionType
    };

    setCurrentStep(nextSteps[action]);

    // Reset if completing full cycle
    if (action === 'endShift') {
      setTimeout(() => {
        setTimeRecord({});
        setCurrentStep('startShift');
      }, 1000);
    }

    setLoading(false);
  };

  const isActionAllowed = (action: ActionType): boolean => {
    if (!timeRecord) return false;

    switch (action) {
      case 'startShift':
        return !Boolean(timeRecord.startShift);
      case 'startBreak':
        return Boolean(timeRecord.startShift) && !Boolean(timeRecord.startBreak);
      case 'endBreak':
        return Boolean(timeRecord.startBreak) && !Boolean(timeRecord.endBreak);
      case 'endShift':
        return Boolean(timeRecord.endBreak) && !Boolean(timeRecord.endShift);
      default:
        return false;
    }
  };

  const getButtonVariant = (action: ActionType) => {
    if (action === currentStep && isActionAllowed(action)) return 'default';
    if (!isActionAllowed(action)) return 'secondary';
    return 'outline';
  };

  function formatDateTime(isoString: string): string {
    return dayjs(isoString).format("DD/MM/YY HH:mm:ss");
  }

  const timelineItems = [
    { key: 'startShift', label: 'Início do turno', time: timeRecord.startShift , timeRegister: inicioTurno ,expectedTime: horaInicioTurno },
    { key: 'startBreak', label: 'Início da pausa', time: timeRecord.startBreak , timeRegister: inicioPausa ,expectedTime: horaInicioPausa },
    { key: 'endBreak', label: 'Fim da pausa', time: timeRecord.endBreak , timeRegister: fimPausa ,expectedTime: horaFimPausa },
    { key: 'endShift', label: 'Fim do turno', time: timeRecord.endShift , timeRegister: fimTurno ,expectedTime: horaFimTurno }
  ];

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="space-y-6">
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
              <Clock className="h-6 w-6 text-primary mr-2" />
              <span className="text-base font-medium">Tempo Logado</span>
            </div>
            <div className="text-4xl font-bold text-foreground">
              {getWorkedTime() ?? '--:--:--'}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-primary mr-2" />
              <span className="text-base font-medium">Tempo em pausa</span>
            </div>
            <div className="text-4xl font-bold text-foreground">
              {getPausedTime() ?? '--:--:--'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="bg-gray-200 border-white shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="h-6 w-6 text-[#1e1e1e] mr-2 mt-0.5" />
            Controle de Ponto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(actionLabels).map(([action, label]) => {
              const IconComponent = actionIcons[action as ActionType];
              const isAllowed = isActionAllowed(action as ActionType);
              const isCurrent = action === currentStep;
              return (
                <Button
                  key={action}
                  variant={getButtonVariant(action as ActionType)}
                  size="lg"
                  onClick={() => handleAction(action as ActionType)}
                  disabled={!isAllowed}
                    className={`
                                h-20 flex flex-col space-y-2 
                                ${isCurrent && isAllowed ? 'bg-amber-500 text-[#1e1e1e] font-bold cursor-pointer' : ''}
                                ${!isAllowed ? 'bg-muted text-muted-foreground cursor-not-allowed' : ''}
                                ${isAllowed && !isCurrent ? 'bg-gray-300 hover:bg-gray-400' : ''}
                                 transition-all
                                `}
                >
                  <IconComponent className="h-8 w-8" />
                  <span className="text-base font-medium">{label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-gray-200 border-white shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarClock className="h-6 w-6 text-[#1e1e1e] mr-2 mt-0.5" />
                Escala
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 ">
              <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 border-gray-300">
                        <TableHead className="font-semibold  text-start">Etapa</TableHead>
                        <TableHead className="font-semibold  text-center">Ação</TableHead>
                        <TableHead className="font-semibold  text-center">Escalado</TableHead>
                        <TableHead className="font-semibold  text-center">Executado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                  
            {timelineItems.map((item, index) => {
              const hasTime = !!item.timeRegister;
              let isLate = false;

              if (hasTime && item.expectedTime) {
                const diff = Math.abs(
                  dayjs(item.timeRegister, "HH:mm").diff(dayjs(item.expectedTime, "HH:mm"), "minute")
                );
                isLate = diff > 10;
              }

              return (
                
                <TableRow key={index} className="hover:bg-gray-300 border-gray-300 transition-colors">
                    <TableCell className="font-medium  text-center">                  
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      !hasTime
                        ? "bg-muted text-muted-foreground"
                        : isLate
                        ? "bg-red-700 text-white"
                        : "bg-green-700 text-white"
                    }`}
                  >
                    {!hasTime ? (
                      <span className="text-base font-bold">{index + 1}</span>
                    ) : isLate ? (
                      <XCircle className="h-6 w-6 text-red-100" />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-100" />
                    )}
                  </div>
                  </TableCell>
                    <TableCell className="font-medium  text-center"> 
                      {hasTime ? (
                        <Badge
                          variant="outline"
                          className={`ml-2 text-sm ${
                            isLate
                              ? "bg-red-500 text-red-100"
                              : "bg-green-600 text-green-100"
                          }`}
                        >
                          {item.label}
                        </Badge>
                        ) : (
                        <Badge variant="secondary" className="ml-2">
                          {item.label}
                        </Badge>
                      )}
                      </TableCell>

                      <TableCell className="font-medium  text-center">
                      {item.expectedTime ? (
                        <Badge
                          variant="outline"
                          className={`ml-2 text-sm ${
                            isLate
                              ? "bg-red-500 text-red-100"
                              : "bg-green-600 text-green-100"
                          }`}
                        >
                          {item.expectedTime ? formatDateTime(item.expectedTime) : 'Sem Escala'}
                          
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="ml-2">
                          Sem Escala
                        </Badge>
                      )}
                      </TableCell>
                      <TableCell className="font-medium  text-center">
                                            {item.time ? (
                                              <Badge
                          variant="outline"
                          className={`ml-2 text-sm ${
                            isLate
                              ? "bg-red-600 text-red-100"
                              : "bg-green-600 text-green-100"
                          }`}
                        >
                        {item.timeRegister ? formatDateTime(item.timeRegister) : 'Pendente'}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="ml-2">
                        Pendente
                      </Badge>
                    )}
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