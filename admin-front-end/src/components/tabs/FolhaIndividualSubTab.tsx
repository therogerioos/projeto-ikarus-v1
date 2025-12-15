/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CalendarDays, Eye, Edit, Download, Search } from "lucide-react";
import { getMonth, getYear} from "date-fns";
import { useSelector } from 'react-redux';
import { addPontoAusenteFuncionarioAdmin, addPontoFuncionarioAdmin, folhaPontoUserIdAdmin, updatePontoAusenteFuncionarioAdmin, updatePontoFuncionarioAdmin } from "../../lib/api";
import { MyToast } from "../ui/toast-sonner";
import { RootState } from "../../store";
import { ApiResponse, FolhaPonto, UserDataIdName } from "../../types/interfaces";
import { ViewRecordDialog } from "../ViewRecordDialog";
import { EditRecordDialog } from "../EditRecordDialog";
import { LoadingOverlay } from "../ui/loading";
import { gerarPdf } from "../../hooks/useGerarPdf";
import { PDFExportDialog } from "../PDFExportDialog";
import { formatarData, formatISOToTime, segundosParaHHMMSS } from "../utils/functions";


export function FolhaIndividualSubTab() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(getMonth(currentDate));
  const [selectedYear, setSelectedYear] = useState(getYear(currentDate));
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const idUser = useSelector((state: any) => state.auth.user?.id);
  const nomeGestor = useSelector((state: any) => state.auth.user?.nome);
  const usuarios = useSelector((state: RootState) => state.auth.userIdName);
  const tipoPerfilLogado = useSelector((state: RootState) => state.auth.user?.role);
  const [registros, setRegistros] = useState<FolhaPonto[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<FolhaPonto | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  //const { gerarPdf } = gerarPdf({
    //onFinish: () => MyToast({ type: "success", message: "PDF gerado com sucesso!" }),
  //});

  const fetchData = async (userId: number, mes: number, ano: number) => {
    setLoading(true);
    try {
        const data = await folhaPontoUserIdAdmin(idUser, userId, mes, ano);
        setRegistros(data);
        setLoading(false);
        MyToast({ type: "success", message: 'Folha de ponto carregada com sucesso.' });
      } catch (err) {
        setLoading(false);
        MyToast({ type: "error", message: `Erro ao carregar folha de ponto: ${err}` });
      }
  };

  useEffect(() => {
    console.log("Usuários disponíveis:", selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    console.log("Nome Usuários disponíveis:", usuarios);
  }, [usuarios]);

  const handleSearch = () => {
    fetchData(selectedUser ? parseInt(selectedUser) : 0, selectedMonth, selectedYear);
  };

  useEffect(() => {
    const nome = usuarios?.reduce(
      (acc, u) => Number(u.id) === Number(selectedUser) ? u.nome : acc,
      ''
    ) || '';

    console.log("Usuário selecionado:", selectedUser);
    console.log("Nome do usuário:", nome);

    setNomeUsuario(nome);
  }, [usuarios, selectedUser]);



  useEffect(() => {

    if (!apiResponse) return;

    if (apiResponse.message) {
      MyToast({ type: "success", message: apiResponse.message });
    } else if (apiResponse.error) {
      MyToast({ type: "error", message: apiResponse.error });
    }
  }, [apiResponse]);

  const handleSave = async (updatedRecord: FolhaPonto) => {
    setLoading(true);
    try {
      if (updatedRecord.id == null && ["FERIAS", "FOLGA", "DEMITIDO", "ATESTADO"].includes(updatedRecord.status ?? "")) {

        const response = await addPontoAusenteFuncionarioAdmin(selectedUser ? selectedUser : '', updatedRecord.data ?? '', updatedRecord.status ?? '');
        setApiResponse(response);


      } else if (updatedRecord.id != null && ["FERIAS", "FOLGA", "DEMITIDO", "ATESTADO"].includes(updatedRecord.status ?? "")) {

        const response = await updatePontoAusenteFuncionarioAdmin(updatedRecord.id, selectedUser ? selectedUser : '', updatedRecord.data ?? '', updatedRecord.status ?? '');
        setApiResponse(response);


      } else if (updatedRecord.id == null) {

        const response = await addPontoFuncionarioAdmin(selectedUser ? selectedUser : '', updatedRecord.inicioTurno ?? '', updatedRecord.inicioPausa ?? '', updatedRecord.fimPausa ?? '', updatedRecord.fimTurno ?? '', updatedRecord.status ?? '');
        setApiResponse(response);

      } else {

        const response = await updatePontoFuncionarioAdmin(updatedRecord.id, selectedUser ? selectedUser : '', updatedRecord.inicioTurno ?? '', updatedRecord.inicioPausa ?? '', updatedRecord.fimPausa ?? '', updatedRecord.fimTurno ?? '', updatedRecord.status ?? '');
        setApiResponse(response);

      }

      if (apiResponse?.message) {
        handleSearch();
      }

      setEditOpen(false);
      setLoading(false);

    } catch (error) {
      setLoading(false);
      setApiResponse({ error: (error as Error).message });
    }
  };


  const pdfRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    setLoading(true);
    setPdfOpen(true);
    if (!registros.length) {
      MyToast({ type: "info", message: "Nenhum registro para exportar." });
      setLoading(false);
      return;
    }

    if (pdfRef.current) {
      await gerarPdf(pdfRef.current, "relatorio_pontos.pdf");
    }
    setPdfOpen(false);
    setLoading(false);
  };

  const handleViewDetails = (record: FolhaPonto) => {
    setSelectedRecord(record)
    setViewOpen(true)
  }

  const handleEditRecord = (record: FolhaPonto) => {
    setSelectedRecord(record)
    setEditOpen(true)
  }

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  const getStatusBadge = (status: string) => {
    const variants = {
      'PRESENTE': 'presente',
      'FALTA': 'falta',
      'FERIADO': 'feriado',
      'FOLGA': 'folga',
      'APONTAMENTO': 'presente',
      'AUTO_FECHAMENTO': 'atraso',
      'ATESTADO': 'atraso',
      'LICENCA': 'folga',
      'FERIAS': 'folga'
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  if (loading) {
      return <LoadingOverlay />;
  }

  return (
    <div className="space-y-6">
      <ViewRecordDialog open={viewOpen} onOpenChange={setViewOpen} record={selectedRecord} />
      <EditRecordDialog open={editOpen} onOpenChange={setEditOpen} record={selectedRecord} onSave={handleSave} />
      <PDFExportDialog ref={pdfRef} nomeGestor={nomeGestor} nomeFuncionario={nomeUsuario} registros={registros} open={pdfOpen} onOpenChange={setPdfOpen} />
      {/* Month Selector */}
      <Card className="bg-gray-200 border-white shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="rounded-lg bg-[#E08625]/10 p-3 mr-3">
                <CalendarDays className="h-8 w-8 text-[#E08625]" />
            </div>
            Folha de Ponto
          </CardTitle>
          <CardDescription>
            Gerencie as informações de ponto dos funcionários.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Mês</label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger className="w-30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Ano</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {tipoPerfilLogado === "MANAGER" &&
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Gestor</label>
                <Select value={selectedUser?.toString() || ''} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-60">
                  <SelectValue />
                  </SelectTrigger>
                    <SelectContent>
                      {usuarios?.map((u: UserDataIdName) => (
                        <SelectItem key={u.id} value={u.id.toString()}>
                          {u.nome}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            }
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Nome do funcionário</label>
              <Select value={selectedUser?.toString() || ''} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-70">
                  <SelectValue />
                </SelectTrigger>
                  <SelectContent>
                    {usuarios?.map((u: UserDataIdName) => (
                      <SelectItem key={u.id} value={u.id.toString()}>
                        {u.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 mt-7">
              <Button variant="secondary" size="base" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>

            <div className="space-y-2 mt-7">
              <Button variant="secondary" size="base" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="bg-gray-200 border-white shadow-card ">
        <CardContent className="p-0 ">
          <div className="overflow-x-auto ">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-gray-300">
                  <TableHead className="font-semibold  text-center">Data</TableHead>
                  <TableHead className="font-semibold  text-center">Status</TableHead>
                  <TableHead className="font-semibold  text-center">Início do Turno</TableHead>
                  <TableHead className="font-semibold  text-center">Fim do Turno</TableHead>
                  <TableHead className="font-semibold  text-center">Tempo Logado</TableHead>
                  <TableHead className="font-semibold  text-center">Tempo em Pausa</TableHead>
                  <TableHead className="font-semibold  text-center">Atraso</TableHead>
                  <TableHead className="font-semibold  text-center">Hora Extra</TableHead>
                  <TableHead className="font-semibold  text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map((record, index) => (
                  <TableRow key={index} className="hover:bg-gray-300 border-gray-300 transition-colors">
                    <TableCell className="font-medium  text-center">{formatarData(record.data)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusBadge(record.status) as any}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{record.inicioTurno == null ? '-' : formatISOToTime(record.inicioTurno)}</TableCell>
                    <TableCell className="text-center">{record.fimTurno == null ? '-' : formatISOToTime(record.fimTurno)}</TableCell>
                    <TableCell className="text-center">{record.tempoLogado == null ? '-' : segundosParaHHMMSS(record.tempoLogado)}</TableCell>
                    <TableCell className="text-center">{record.tempoPausa == null ? '-' : segundosParaHHMMSS(record.tempoPausa)}</TableCell>
                    <TableCell className="text-center">{record.atraso == null ? '-' : segundosParaHHMMSS(record.atraso)}</TableCell>
                    <TableCell className="text-center">
                      {record.horaExtra ? (
                        <Badge variant="feriado" className="text-warning">
                          {segundosParaHHMMSS(record.horaExtra)}
                        </Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(record)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditRecord(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}