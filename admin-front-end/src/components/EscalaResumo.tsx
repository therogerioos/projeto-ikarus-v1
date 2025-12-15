import { useEffect, useState } from "react";
import { InterfaceEscalaResumo } from "../types/interfaces";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { formatarDiaMesComSemana } from "./utils/functions";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { dadosResumoEscala } from "./testes/dadosResumoEscala";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function EscalaResumo() {
  const [resumo, setResumo] = useState<InterfaceEscalaResumo[]>([]);
  const [mes, setMes] = useState<number>(0);
  const [ano, setAno] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const statusColors: Record<string, string> = {
    "Escalado": "bg-green-500 text-green-100 hover:bg-green-700 font-semibold",
    "Folga": "bg-yellow-500 text-yellow-100 hover:bg-yellow-700 font-semibold",
    "Férias": "bg-blue-500 text-blue-100 hover:bg-blue-700 font-semibold",
    "Licença": "bg-purple-500 text-purple-100 hover:bg-purple-700 font-semibold",
    "Demitido": "bg-red-500 text-red-100 hover:bg-red-700 font-semibold",
    "-": "bg-gray-100 text-gray-600",
  };

  useEffect(() => {
    setResumo(dadosResumoEscala);
    setMes(10);
    setAno(2025);
  }, []);

  const diasDoMes = Array.from({ length: 31 }, (_, i) => i + 1);

  // Paginação
  const totalPages = Math.ceil(resumo.length / rowsPerPage);
  const currentRows = resumo.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (!resumo) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <h4>Linhas por página:</h4>
          <Select value={String(rowsPerPage)} onValueChange={(value) => {
            setRowsPerPage(Number(value));
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"2"}>2</SelectItem>
              <SelectItem value={"5"}>5</SelectItem>
              <SelectItem value={"10"}>10</SelectItem>
              <SelectItem value={"15"}>15</SelectItem>
              <SelectItem value={"20"}>20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          Página {currentPage} de {totalPages}
        </div>
      </div>

      {/* Container da tabela */}
      <div className="border border-gray-100 rounded-lg shadow-sm overflow-x-auto container-custom">
        <Table className="table-auto">
          <TableHeader>
            <TableRow className="bg-muted/50 border-gray-100">
              <TableHead className="font-semibold border border-r border-gray-300 bg-white text-center sticky left-0 w-16 min-w-[130px]">Colaborador</TableHead>
              {diasDoMes.map((dia) => (
                <TableHead key={dia} className="font-semibold border border-gray-300 bg-white text-center w-16 min-w-[115px]">{formatarDiaMesComSemana(dia, mes, ano)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((colab) => (
              <TableRow key={colab.username} className="border-gray-300 bg-white border transition-colors">
                <TableCell className="flex flex-col p-3 items-start justify-center sticky left-0 bg-white border border-gray-300 w-60 h-18 min-h-[40px]">
                  <span>{colab.nome}</span>
                  <span className="text-xs text-gray-500">{colab.username}</span>
                </TableCell>
                {diasDoMes.map((dia) => {
                  const diaData = colab.dias[dia];
                  const status = diaData?.status ?? "-";
                  const cor = statusColors[status] || "bg-gray-100 text-gray-600";

                  return (
                    <TableCell
                      key={dia}
                      className={`text-center cursor-pointer border border-gray-300 ${cor}`}
                      title={
                        diaData
                          ? `${status}\n${diaData.inicioTurno ?? ""} - ${diaData.fimTurno ?? ""}`
                          : ""
                      }
                    >
                      {status === "-" ? "" : status}
                      {status === "Escalado" && `\n${diaData?.inicioTurno ?? ""} - ${diaData?.fimTurno ?? ""}`}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
