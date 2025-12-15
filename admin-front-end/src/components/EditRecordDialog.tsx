/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { DatePicker } from "./DatePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Separator } from "./ui/separator"
import { FolhaPonto } from "../types/interfaces"
import { formatDateBR } from "./utils/functions"
import * as React from "react"
import { useEffect, useState } from "react"
import { Textarea } from "./ui/textarea"

interface EditRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: FolhaPonto | null
  onSave: (updated: FolhaPonto) => void // <- adicionado
}

export function EditRecordDialog({ open, onOpenChange, record, onSave }: EditRecordDialogProps) {

  const STATUS_VALORES = ["PRESENTE", "FALTA", "FERIAS", "FOLGA", "DEMITIDO", "ATESTADO"] as const;
  type StatusTipo = typeof STATUS_VALORES[number];
  
  // Estado local para cada campo editável
  const [inicioTurno, setInicioTurno] = useState(record?.inicioTurno ?? "")
  const [fimTurno, setFimTurno] = useState(record?.fimTurno ?? "")
  const [inicioPausa, setInicioPausa] = useState(record?.inicioPausa ?? "")
  const [fimPausa, setFimPausa] = useState(record?.fimPausa ?? "")
  const [status, setStatus] = useState(record?.status ?? "")
  const [justificativa, setJustificativa] = useState(record?.justificativa ?? "")
  const [statusAjuste, setStatusAjuste] = useState<StatusTipo>(
    STATUS_VALORES.includes(record?.status as StatusTipo) 
      ? (record?.status as StatusTipo) 
      : "PRESENTE"
    );

  useEffect(() => {
      setInicioTurno("")
      setFimTurno("")
      setInicioPausa("")
      setFimPausa("")
  }, [onOpenChange])

  useEffect(() => {
    setInicioTurno(record?.inicioTurno ?? "")
    setFimTurno(record?.fimTurno ?? "")
    setInicioPausa(record?.inicioPausa ?? "")
    setFimPausa(record?.fimPausa ?? "")
    setStatus(record?.status ?? "")
    setJustificativa(record?.justificativa ?? "")
  }, [record])


  useEffect(() => {
    if (!STATUS_VALORES.includes(status as StatusTipo)) {
      setStatusAjuste("PRESENTE");
    } else {
      setStatusAjuste(status as StatusTipo);
    }
  }, [status]);
  

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedRecord: FolhaPonto = {
      ...record,
      inicioTurno,
      fimTurno,
      inicioPausa,
      fimPausa,
      status: statusAjuste,
    }

    onSave(updatedRecord)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar ponto de {formatDateBR(record.data)}</DialogTitle>
          <DialogDescription>Atualize os dados do registro</DialogDescription>
        </DialogHeader>

        <Separator orientation="horizontal" className="bg-gray-300 mb-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium">Status</label>
            <Select value={statusAjuste} onValueChange={(v) => setStatus(v)}>
              <SelectTrigger className="w-116 border-gray-300 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="PRESENTE">PRESENTE</SelectItem>
                <SelectItem value="FALTA">FALTA</SelectItem>
                <SelectItem value="ATESTADO">ATESTADO</SelectItem>
                <SelectItem value="FERIAS">FERIAS</SelectItem>
                <SelectItem value="FOLGA">FOLGA</SelectItem>
                <SelectItem value="DEMITIDO">DEMITIDO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {statusAjuste === "PRESENTE" && (
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Início do turno</label>
                <DatePicker valueISO={inicioTurno} onChange={(d) => setInicioTurno(d?.toString() ?? "")} className="border-gray-300 bg-white w-56"/>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Fim do turno</label>
                <DatePicker valueISO={fimTurno} onChange={(d) => setFimTurno(d?.toString() ?? "")} className="border-gray-300 bg-white w-56"/>
              </div>
            </div>
          )}

          {statusAjuste === "PRESENTE" && (
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Início da pausa</label>
                <DatePicker valueISO={inicioPausa} onChange={(d) => setInicioPausa(d?.toString() ?? "")} className="border-gray-300 bg-white w-56"/>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Fim da pausa</label>
                <DatePicker valueISO={fimPausa} onChange={(d) => setFimPausa(d?.toString() ?? "")} className="border-gray-300 bg-white w-56"/>
              </div>
            </div>
          )}

          {statusAjuste === "PRESENTE" && (
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <Textarea
                  label="Observações"
                  value={justificativa ?? "Sem observações"}
                  disabled
                  className="border-gray-400 bg-white w-116"
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
