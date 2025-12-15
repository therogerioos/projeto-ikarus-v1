import { forwardRef } from "react";
import { FolhaPonto } from "../types/interfaces";
import { Dialog } from "./ui/dialog";
import { formatarData, formatISOToTime, segundosParaHHMMSS } from "./utils/functions";

// Componente invisível para gerar PDF
interface PDFExportDialogProps {
    nomeFuncionario?: string;
    nomeGestor?: string;
    registros: FolhaPonto[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PDFExportDialog = forwardRef<HTMLDivElement, PDFExportDialogProps>(
  ({ nomeFuncionario, nomeGestor, registros, open, onOpenChange }, ref) => {
    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: "-11170px",
          left: "-11100px",
          width: "1190px",
          height: "1684px",
          background: "#fff",
          padding: "10px",
          fontFamily: "Kanit, sans-serif",
          color: "#000",
        }}
      >
        <div className="flex flex-start pb-3">
          <img className="pl-10 h-25 w-auto" src="/logo_a53_a53.png" alt="Logo" />
          <div className="flex justify-center items-center pl-50 ">
            <h1 className="text-3xl">Folha de Ponto Individual de Trabalho</h1>
          </div>
        </div> 
        <div className="relative">
          <div className="flex ml-10">
            <div>
              <div className="pb-2">
                <label>Empregador:</label>
              </div>
              <div className="border pl-2 w-170 h-7">
                <h3 className="absolute top-6">Viacao Aguia Branca S.A</h3>
              </div>
            </div>
            <div className="ml-2">
              <div className="pb-2">
                <label>CNPJ:</label>
              </div>
              <div className="border pl-2 w-100 h-7">
                <h3 className="absolute top-6">27.486.182/0001-09</h3>
              </div>
            </div>
          </div>
          <div className="flex ml-10 mt-2">
            <div>
              <div className="pb-2">
                <label>Endereço:</label>
              </div>
              <div className="border pl-2 w-272 h-7">
                <h3 className="absolute top-23">Rua da Liberdade, 130, Granjas Rurais Presidente Vargas, Salvador - BA</h3>
              </div>
            </div>
          </div>
          <div className="flex ml-10 mt-2">
            <div>
              <div className="pb-2">
                <label>Funcionário:</label>
              </div>
              <div className="border pl-2 w-126 h-7">
                <h3 className="absolute top-40">{nomeFuncionario}</h3>
              </div> 
            </div>
            <div className="pl-2">
              <div className="pb-2">
                <label>CTPS:</label>
              </div>
              <div className="border pl-2 w-45 h-7">
                <h3 className="absolute top-40">0612007</h3>
              </div>   
            </div>
            <div className="pl-2">
              <div className="pb-2">
                <label>Série:</label>
              </div>
              <div className="border pl-2 w-35 h-7">
                <h3 className="absolute top-40">1547</h3>
              </div>
            </div>
            <div className="pl-2">
              <div className="pb-2">
                <label>Data de Admissão:</label>
              </div>
              <div className="border pl-2 w-60 h-7">
                <h3 className="absolute top-40">14/02/2025</h3>
              </div>
            </div>
          </div>
          <div className="flex ml-10 mt-2 mb-6">
            <div>
              <div className="pb-2">
                <label>Função:</label>
              </div>
              <div className="border pl-2 w-100 h-7">
                <h3 className="absolute top-57">Analista de Desenvolvimento</h3>
              </div>
            </div>
            <div className="pl-2">
              <div className="pb-2">
                <label>Matrícula:</label>
              </div>
              <div className="border pl-2 w-40 h-7">
                <h3 className="absolute top-57">302261</h3>
              </div>
            </div>
            <div className="pl-2">
              <div className="pb-2">
                <label>Gestor Imediato</label>
              </div>
              <div className="border pl-2 w-70 h-7">
                <h3 className="absolute top-57">{nomeGestor}</h3>
              </div>
            </div>
            <div className="pl-2">
              <div className="pb-2">
                <label>Mês/Ano Referência:</label>
              </div>
              <div className="border pl-2 w-56 h-7">
                <h3 className="absolute top-57">Setembro/2025</h3>
              </div>
            </div>
          </div>
        </div>
        <table className="tablePdf">
          <thead>
            <tr style={{ background: "#eee", fontSize: "14px" }}>
              <th style={{ width: "90px", border: "1px solid #000", paddingBottom: "15px", paddingLeft: "5px", paddingRight: "5px", verticalAlign: "middle", textAlign: "center" }}>Data</th>
              <th style={{ border: "1px solid #000", paddingBottom: "15px", verticalAlign: "middle", textAlign: "center" }}>Status</th>
              <th style={{ width: "90px", border: "1px solid #000", paddingBottom: "15px", verticalAlign: "middle", textAlign: "center" }}>Início do Turno</th>
              <th style={{ width: "85px", border: "1px solid #000", paddingBottom: "15px", verticalAlign: "middle", textAlign: "center" }}>Fim do Turno</th>
              <th style={{ width: "90px", border: "1px solid #000", paddingBottom: "15px", verticalAlign: "middle", textAlign: "center" }}>Início da Pausa</th>
              <th style={{ width: "85px", border: "1px solid #000", paddingBottom: "15px", verticalAlign: "middle", textAlign: "center" }}>Fim da Pausa</th>
              <th style={{ width: "90px", border: "1px solid #000", paddingBottom: "15px", verticalAlign: "middle", textAlign: "center" }}>Tempo Logado</th>
              <th style={{ width: "85px", border: "1px solid #000", paddingBottom: "15px", verticalAlign: "middle", textAlign: "center" }}>Tempo Pausa</th>
              <th style={{ width: "90px", border: "1px solid #000", paddingBottom: "15px", verticalAlign: "middle", textAlign: "center" }}>Atraso</th>
              <th style={{ width: "90px", border: "1px solid #000", paddingBottom: "15px"}}>Hora Extra</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, i) => (
              <tr key={i} style={{ fontSize: "13px" }}>
                <td style={{ textAlign: "center", verticalAlign: "middle", border: "1px solid #000", paddingBottom: "15px", paddingLeft: "5px", paddingRight: "5px" }}>{formatarData(r.data)}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle", border: "1px solid #000", paddingBottom: "15px" }}>{r.status}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle", border: "1px solid #000", paddingBottom: "15px" }}>{formatISOToTime(r.inicioTurno) || "-"}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle", border: "1px solid #000", paddingBottom: "15px" }}>{formatISOToTime(r.fimTurno) || "-"}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle", border: "1px solid #000", paddingBottom: "15px" }}>{formatISOToTime(r.inicioPausa) || "-"}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle", border: "1px solid #000", paddingBottom: "15px" }}>{formatISOToTime(r.fimPausa) || "-"}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle", border: "1px solid #000", paddingBottom: "15px" }}>{segundosParaHHMMSS(r.tempoLogado) || "-"}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle", border: "1px solid #000", paddingBottom: "15px" }}>{segundosParaHHMMSS(r.tempoPausa) || "-"}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle", border: "1px solid #000", paddingBottom: "15px" }}>{segundosParaHHMMSS(r.atraso) || "-"}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle",border: "1px solid #000", paddingBottom: "15px" }}>{segundosParaHHMMSS(r.horaExtra) || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{flexDirection: "row", justifyContent: "space-between", marginTop: "1px", marginLeft:"75px", marginRight:"75px", display: "flex"}}>
            <div style={{ textAlign: "center", marginTop: "35px" }}> 
                <h2 style={{fontFamily: "Arial"}}>_______________________________________________</h2>
                <h3>{nomeFuncionario}</h3>
                <p className="text-xs">Funcionário</p>
            </div>
            <div style={{ textAlign: "center", marginTop: "35px" }}> 
                <h2 style={{fontFamily: "Arial"}}>_______________________________________________</h2>
                <h3>{nomeGestor}</h3>
                <p className="text-xs">Gestor</p>
            </div>
        </div>

      </div>
      </Dialog>
    );
  }
);

PDFExportDialog.displayName = "PDFExportDialog";
