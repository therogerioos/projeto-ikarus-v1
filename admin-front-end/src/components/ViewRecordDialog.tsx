import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { FolhaPonto } from "../types/interfaces"
import { formatDateBR, segundosParaHHMMSS } from "./utils/functions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Separator } from "./ui/separator"
import { DatePicker } from "./DatePicker"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

interface ViewRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: FolhaPonto | null
}

export function ViewRecordDialog({ open, onOpenChange, record }: ViewRecordDialogProps) {
  if (!record) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do ponto de {formatDateBR(record.data)}</DialogTitle>
        </DialogHeader>
        <Separator orientation="horizontal" className=" bg-gray-300" />
        <div className="space-y-1 flex flex-col md:flex-row md:justify-between mb-1">
          <div>
            <label className="text-sm font-medium">Data</label>
              <Select value={formatDateBR(record.data)} disabled>
                <SelectTrigger className="w-40 border-gray-400 bg-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={formatDateBR(record.data)}>
                    {formatDateBR(record.data)}
                  </SelectItem>
                </SelectContent>
              </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
              <Select value={record.status} disabled>
                <SelectTrigger className="w-60 border-gray-400 bg-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={record.status}>
                    {record.status}
                  </SelectItem>
                </SelectContent>
              </Select>
          </div>
        </div>

        <div className="space-y-1 flex flex-col md:flex-row md:justify-between mb-1">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Início do turno</label>
            <DatePicker valueISO={record.inicioTurno ?? "-"} disabled={true} className="w-55 border-gray-400 bg-gray-200" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Fim do turno</label>
            <DatePicker valueISO={record.fimTurno ?? "-"} disabled={true} className="w-55 border-gray-400 bg-gray-200" />
          </div>
        </div>

        <div className="space-y-1 flex flex-col md:flex-row md:justify-between mb-1">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Início da pausa</label>
            <DatePicker valueISO={record.inicioPausa ?? "-"} disabled={true} className="w-55 border-gray-400 bg-gray-200" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Fim da pausa</label>
            <DatePicker valueISO={record.fimPausa ?? "-"} disabled={true} className="w-55 border-gray-400 bg-gray-200" />
          </div>
        </div>

        <div className="space-y-1 flex flex-col md:flex-row md:justify-between mb-1">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Logado</label>
            <Input type="text" value={segundosParaHHMMSS(record.tempoLogado ?? 0) ?? "-"} disabled={true} className="w-20 border border-gray-400 bg-gray-200" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Pausa</label>
            <Input type="text" value={segundosParaHHMMSS(record.tempoPausa ?? 0) ?? "-"} disabled={true} className="w-20 border border-gray-400 bg-gray-200" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Atraso</label>
            <Input type="text" value={segundosParaHHMMSS(record.atraso ?? 0) ?? "-"} disabled={true} className="w-20 border border-gray-400 bg-gray-200" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Hora Extra</label>
            <Input type="text" value={segundosParaHHMMSS(record.horaExtra ?? 0) ?? "-"} disabled={true} className="w-20 border border-gray-400 bg-gray-200" />
          </div>
        </div>
            <div className="flex flex-col md:flex-row md:space-x-1">
              <div className="flex-1">
                <Textarea
                  label="Observações"
                  value={record.justificativa ?? "Sem observações"}
                  className="border-gray-400 bg-gray-200"
                  disabled
                />
              </div>
            </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
