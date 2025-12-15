import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { MyToast } from "./ui/toast-sonner";

interface BatchUploadDialogProps {
  onUploadComplete?: () => void;
}

export const BatchUploadDialog = ({ onUploadComplete }: BatchUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/plain") {
      setFile(selectedFile);
      setResult(null);
    } else {
        MyToast({ type: "error", message: 'Arquivo inválido. Por favor, selecione um arquivo .txt' });
    }
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      const errors: string[] = [];
      let successCount = 0;

      // Process each line (skip header if exists)
      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const parts = line.split(',').map(p => p.trim());

        if (parts.length < 10) {
          errors.push(`Linha ${lineNumber}: formato inválido (campos insuficientes)`);
          return;
        }

        const [nome, username, mes, ano, data, status, inicioTurno, inicioPausa, fimPausa, fimTurno] = parts;

        // Validate required fields
        if (!nome || !username || !mes || !ano || !data || !status) {
          errors.push(`Linha ${lineNumber}: campos obrigatórios faltando`);
          return;
        }

        // Validate status
        const validStatuses = ["Escalado", "Folga", "Demitido", "Férias", "Licença"];
        if (!validStatuses.includes(status)) {
          errors.push(`Linha ${lineNumber}: status inválido (${status})`);
          return;
        }

        // If status is "Escalado", validate time fields
        if (status === "Escalado") {
          if (!inicioTurno || !inicioPausa || !fimPausa || !fimTurno) {
            errors.push(`Linha ${lineNumber}: horários obrigatórios para status "Escalado"`);
            return;
          }
        }

        // TODO: Save to database/state
        // For now, just count as success
        successCount++;
      });

      setResult({ success: successCount, errors });
      
      if (successCount > 0) {
        MyToast({ type: "success", message: `Importação concluída! ${successCount} registro(s) processado(s) com sucesso` });
        
        if (errors.length === 0) {
          onUploadComplete?.();
        }
      }
    } catch (error) {
        MyToast({ type: "error", message: `Erro ao processar arquivo:  ${error}` });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Incluir Escala em Lote
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Escala em Lote</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo .txt com os dados das escalas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Formato esperado (TXT separado por vírgula):</strong>
              <br />
              nome, username, mes, ano, data, status, inicio_turno, inicio_pausa, fim_pausa, fim_turno
              <br />
              <br />
              <strong>Status válidos:</strong> Escalado, Folga, Demitido, Férias, Licença
              <br />
              <strong>Nota:</strong> Campos de horário são obrigatórios apenas para status "Escalado"
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="text-sm font-medium ">Selecione o arquivo</label>
            <Input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              {file.name}
            </div>
          )}

          {result && (
            <div className="space-y-2">
              {result.success > 0 && (
                <Alert className="bg-status-scheduled/10 border-status-scheduled">
                  <CheckCircle2 className="h-4 w-4 text-status-scheduled" />
                  <AlertDescription>
                    {result.success} registro(s) processado(s) com sucesso
                  </AlertDescription>
                </Alert>
              )}
              
              {result.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Erros encontrados:</strong>
                    <ul className="mt-2 space-y-1 text-xs">
                      {result.errors.slice(0, 5).map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                      {result.errors.length > 5 && (
                        <li>... e mais {result.errors.length - 5} erro(s)</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              onClick={processFile}
              disabled={!file || isProcessing}
              className="px-6"
            >
              {isProcessing ? "Processando..." : "Processar Arquivo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
