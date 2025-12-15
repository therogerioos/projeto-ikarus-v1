import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Calendar, Save } from "lucide-react";
import { MyToast } from "./ui/toast-sonner";

interface DaySchedule {
  status: "escalado" | "folga" | "demitido" | "ferias" | "licenca" | null;
  horaEntrada?: string;
  horaSaida?: string;
  inicioPausa?: string;
  fimPausa?: string;
}

interface DayStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: number;
  month: number;
  year: number;
  initialSchedule?: DaySchedule;
  onSave: (schedule: DaySchedule) => void;
}

const statusOptions = [
  { value: "escalado", label: "Escalado", color: "text-green-700 dark:text-green-500 font-semibold" },
  { value: "folga", label: "Folga", color: "text-gray-600 dark:text-gray-400 font-semibold" },
  { value: "demitido", label: "Demitido", color: "text-red-600 dark:text-red-400 font-semibold" },
  { value: "ferias", label: "Férias", color: "text-yellow-600 dark:text-yellow-400 font-semibold" },
  { value: "licenca", label: "Licença", color: "text-purple-600 dark:text-purple-400 font-semibold" },
];

export const DayStatusDialog = ({
  open,
  onOpenChange,
  day,
  month,
  year,
  initialSchedule,
  onSave,
}: DayStatusDialogProps) => {
  const [status, setStatus] = useState<DaySchedule["status"]>(initialSchedule?.status || null);
  const [horaEntrada, setHoraEntrada] = useState(initialSchedule?.horaEntrada || "");
  const [horaSaida, setHoraSaida] = useState(initialSchedule?.horaSaida || "");
  const [inicioPausa, setInicioPausa] = useState(initialSchedule?.inicioPausa || "");
  const [fimPausa, setFimPausa] = useState(initialSchedule?.fimPausa || "");

  useEffect(() => {
    if (open) {
      setStatus(initialSchedule?.status || null);
      setHoraEntrada(initialSchedule?.horaEntrada || "");
      setHoraSaida(initialSchedule?.horaSaida || "");
      setInicioPausa(initialSchedule?.inicioPausa || "");
      setFimPausa(initialSchedule?.fimPausa || "");
    }
  }, [open, initialSchedule]);

  const handleSave = () => {
    if (!status) {
      MyToast({ type: "error", message: "Selecione um status para o dia" });
      return;
    }

    if (status === "escalado" && (!horaEntrada || !horaSaida)) {
      MyToast({ type: "error", message: "Preencha os horários de entrada e saída" });
      return;
    }

    const schedule: DaySchedule = {
      status,
      ...(status === "escalado" && {
        horaEntrada,
        horaSaida,
        ...(inicioPausa && fimPausa && { inicioPausa, fimPausa }),
      }),
    };

    onSave(schedule);
    MyToast({ type: "success", message: "Escala salva com sucesso!" });
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const isEscalado = status === "escalado";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-primary" />
            Definir Escala
          </DialogTitle>
          <DialogDescription>
            {day} de {monthNames[month]} de {year}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-semibold text-foreground block">
              Status do Dia *
            </Label>
            <Select value={status || ""} onValueChange={(value) => setStatus(value as DaySchedule["status"])}>
              <SelectTrigger id="status" className="border-gray-300 bg-white">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className={option.color}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Fields - Only shown when Escalado */}
          {isEscalado && (
            <div className="space-y-4 p-4 bg-secondary/50 rounded-lg border border-gray-300 bg-gray-100">
              <h4 className="text-sm font-semibold text-foreground">Horários de Trabalho</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horaEntrada" className="text-xs">
                    Hora de Entrada *
                  </Label>
                  <Input
                    id="horaEntrada"
                    type="time"
                    value={horaEntrada}
                    onChange={(e) => setHoraEntrada(e.target.value)}
                    className="text-sm border-gray-300 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaSaida" className="text-xs">
                    Hora de Saída *
                  </Label>
                  <Input
                    id="horaSaida"
                    type="time"
                    value={horaSaida}
                    onChange={(e) => setHoraSaida(e.target.value)}
                    className="text-sm border-gray-300 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-400">
                <h4 className="text-sm font-semibold text-foreground mb-3">Pausa (Opcional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inicioPausa" className="text-xs">
                      Início da Pausa
                    </Label>
                    <Input
                      id="inicioPausa"
                      type="time"
                      value={inicioPausa}
                      onChange={(e) => setInicioPausa(e.target.value)}
                      className="text-sm border-gray-300 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fimPausa" className="text-xs">
                      Fim da Pausa
                    </Label>
                    <Input
                      id="fimPausa"
                      type="time"
                      value={fimPausa}
                      onChange={(e) => setFimPausa(e.target.value)}
                      className="text-sm border-gray-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info message for non-escalado status */}
          {status && !isEscalado && (
            <div className="p-3 bg-muted rounded-lg border border-yellow-300 bg-yellow-400">
              <p className="text-sm text-muted-foreground">
                Nenhum horário precisa ser definido para este status.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="primary" className="w-48">
            <Save className="w-4 h-4" />
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};