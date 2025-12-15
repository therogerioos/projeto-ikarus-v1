import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CalendarDays, Eye, Edit, Download, Search } from "lucide-react";
import { getMonth, getYear } from "date-fns";
import { useSelector } from 'react-redux';
import { folhaPontoUser } from "../lib/api";
import { MyToast } from "../components/ui/toast-sonner";


interface FolhaPonto {
  id: number | null;
  atraso: number | null;
  data: string;
  fimPausa: string | null;
  fimTurno: string | null;
  horaExtra: number | null;
  inicioPausa: string | null;
  inicioTurno: string | null;
  status: string;
  tempoLogado: number | null;
  tempoPausa: number | null;
}

export function FolhaTab() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(getMonth(currentDate));
  const [selectedYear, setSelectedYear] = useState(getYear(currentDate));
  const idUser = useSelector((state: any) => state.auth.user?.id);
  const [registros, setRegistros] = useState<FolhaPonto[]>([]);

  const formatarData = (data: string) => {
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
  };

  const formatISOToTime = (isoString?: string): string | undefined => {
    if (!isoString) return undefined;
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour12: false });
  };

  function segundosParaHHMMSS(totalSegundos: number): string {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    // Adiciona zero à esquerda se necessário
    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
  }

  const fetchData = async (userId: number, mes: number, ano: number) => {
    try {
        const data = await folhaPontoUser(userId, mes, ano);
        setRegistros(data);
        MyToast({ type: "success", message: 'Folha de ponto carregada com sucesso.' });
      } catch (err) {
        MyToast({ type: "error", message: `Erro ao carregar folha de ponto: ${err}` });
      }
  };

  const handleSearch = () => {
    fetchData(idUser, selectedMonth, selectedYear);
  };

  const handleExport = () => {
    MyToast({ type: "info", message: 'Seu perfil não tem permissão para exportar dados.' });
  }

  const handleViewDetails = () => {
    MyToast({ type: "info", message: 'Seu perfil não tem permissão para ver detalhes.' });
  }

  const handleEditRecord = () => {
    MyToast({ type: "info", message: 'Seu perfil não tem permissão para editar registros.' });
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
      'LICENCA': 'folga',
      'FERIAS': 'folga'
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <Card className="bg-gray-200 border-white shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="h-5 w-5 text-primary mr-2" />
            Folha de Ponto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mês</label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger className="w-48">
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
              <label className="text-sm font-medium">Ano</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-32">
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

            <div className="space-y-2 mt-5.5">
              <Button variant="outline" size="base" className="active:bg-[#E08625] active:border-white active:text-white bg-[#1e1e1e] border-[#1e1e1e] text-[#E08625]" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>

            <div className="ml-auto">
              <Button variant="outline" size="sm" className="active:bg-[#E08625] active:border-white active:text-white bg-[#1e1e1e] border-[#1e1e1e] text-[#E08625]" onClick={handleExport}>
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
                          {record.horaExtra}
                        </Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={handleViewDetails}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleEditRecord}>
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