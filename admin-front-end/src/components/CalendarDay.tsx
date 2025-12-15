import { Clock, Pause } from "lucide-react";
import { cn } from "../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

interface DaySchedule {
  status: "escalado" | "folga" | "demitido" | "ferias" | "licenca" | null;
  horaEntrada?: string;
  horaSaida?: string;
  inicioPausa?: string;
  fimPausa?: string;
}

interface CalendarDayProps {
  day: number;
  schedule?: DaySchedule;
  onClick: () => void;
}

const statusConfig = {
  escalado: {
    label: "Escalado",
    className: "bg-green-500 dark:bg-green-500 border-green-300 dark:border-green-600 text-green-800 dark:text-green-100 hover:bg-green-700 dark:hover:bg-green-700 cursor-pointer",
    dotColor: "bg-green-300"
  },
  folga: {
    label: "Folga",
    className: "bg-gray-500 dark:bg-gray-500 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-700 cursor-pointer",
    dotColor: "bg-gray-300"
  },
  demitido: {
    label: "Demitido",
    className: "bg-red-500 dark:bg-red-500 border-red-300 dark:border-red-600 text-red-800 dark:text-red-100 hover:bg-red-700 dark:hover:bg-red-700 cursor-pointer",
    dotColor: "bg-red-300"
  },
  ferias: {
    label: "Férias",
    className: "bg-yellow-500 dark:bg-yellow-500 border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-100 hover:bg-yellow-700 dark:hover:bg-yellow-700 cursor-pointer",
    dotColor: "bg-yellow-300"
  },
  licenca: {
    label: "Licença",
    className: "bg-purple-500 dark:bg-purple-500 border-purple-300 dark:border-purple-600 text-purple-800 dark:text-purple-100 hover:bg-purple-700 dark:hover:bg-purple-700 cursor-pointer",
    dotColor: "bg-purple-300"
  },
};


export const CalendarDay = ({ day, schedule, onClick }: CalendarDayProps) => {
  const config = schedule?.status ? statusConfig[schedule.status] : null;
  const isToday = new Date().getDate() === day && 
                  new Date().getMonth() === new Date().getMonth();

  const tooltipContent = schedule?.status === "escalado" && schedule.horaEntrada ? (
    <div className="text-xs space-y-1">
      <div className="font-semibold mb-1">Horários</div>
      <div>Status: {config?.label}</div>
      <div>Entrada: {schedule.horaEntrada}</div>
      <div>Saída: {schedule.horaSaida}</div>
      {schedule.inicioPausa && (
        <>
          <div className="border-t border-border/50 pt-1 mt-1 font-semibold">Pausa</div>
          <div>Início: {schedule.inicioPausa}</div>
          <div>Fim: {schedule.fimPausa}</div>
        </>
      )}
    </div>
  ) : null;

  const dayContent = (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-full aspect-square p-3 border-r border-b border-t border-l border-gray-200",
        "hover:bg-accent/5 transition-all duration-200 hover:shadow-[var(--shadow-soft)]",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset cursor-pointer hover:border-gray-400",
        "group relative",
        config?.className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-2 ">
          <span className={cn(
            "text-lg font-semibold",
            isToday && "text-primary "
          )}>
            {day}
          </span>
          {config && (
            <div className={cn("w-4 h-4 mt-[6px] rounded-full", config.dotColor)} />
          )}
        </div>
        
        {schedule?.status && (
          <div className="flex-1 flex flex-col items-start justify-center ">
            <span className="text-lg font-medium mb-1">
              {config?.label}
            </span>
            {schedule.status === "escalado" && schedule.horaEntrada && (
                <div>
                    <div className="flex items-center gap-1 text-sm opacity-90">
                        <Clock className="w-3 h-3" />
                        <span>{schedule.horaEntrada}</span> - <span>{schedule.horaSaida}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm opacity-90">
                        <Pause className="w-3 h-3" />
                        <span>{schedule.inicioPausa}</span> - <span>{schedule.fimPausa}</span>
                    </div>
                </div>
            )}
          </div>
        )}
      </div>

      {isToday && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
      )}
    </button>
  );

  if (tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {dayContent}
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-white text-popover-foreground border-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return dayContent;
};