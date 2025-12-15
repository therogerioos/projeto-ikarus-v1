import { useState } from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "../ui/table";
import { Separator } from "../ui/separator";
import { Download, CalendarDays, Users, Search } from "lucide-react";
import { getMonth, getYear} from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { UserDataIdName } from "../../types/interfaces";

interface DadosColaborador {
  nome: string;
  horas: number;
  extras: number;
  faltas: number;
  banco: number;
}

const dadosMockados: Record<string, DadosColaborador[]> = {
    "2025-02": [],
  "2025-10": [
    { nome: "Rogério Oliveira", horas: 176, extras: 8, faltas: 0, banco: 4 },
    { nome: "Ana Souza", horas: 168, extras: 2, faltas: 1, banco: -3 },
    { nome: "Carlos Mendes", horas: 176, extras: 12, faltas: 0, banco: 8 },
    { nome: "Beatriz Lima", horas: 160, extras: 0, faltas: 2, banco: -8 },
  ],
  "2024-12": [
    { nome: "Rogério Oliveira", horas: 168, extras: 6, faltas: 1, banco: 2 },
    { nome: "Ana Souza", horas: 176, extras: 4, faltas: 0, banco: 0 },
    { nome: "Carlos Mendes", horas: 170, extras: 10, faltas: 0, banco: 6 },
    { nome: "Beatriz Lima", horas: 164, extras: 2, faltas: 1, banco: -5 },
  ],
  "2024-11": [
    { nome: "Rogério Oliveira", horas: 176, extras: 5, faltas: 0, banco: 1 },
    { nome: "Ana Souza", horas: 172, extras: 3, faltas: 0, banco: -1 },
    { nome: "Carlos Mendes", horas: 176, extras: 8, faltas: 0, banco: 4 },
    { nome: "Beatriz Lima", horas: 168, extras: 0, faltas: 1, banco: -4 },
  ],
  "2024-10": [
    { nome: "Rogério Oliveira", horas: 176, extras: 10, faltas: 0, banco: 6 },
    { nome: "Ana Souza", horas: 170, extras: 2, faltas: 1, banco: -2 },
    { nome: "Carlos Mendes", horas: 176, extras: 15, faltas: 0, banco: 11 },
    { nome: "Beatriz Lima", horas: 165, extras: 1, faltas: 1, banco: -6 },
  ],
};

export function FolhaExtratoGeralSubTab() {
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(getMonth(currentDate));
    const [selectedYear, setSelectedYear] = useState(getYear(currentDate));
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const usuarios = useSelector((state: RootState) => state.auth.userIdName);
    const tipoPerfilLogado = useSelector((state: RootState) => state.auth.user?.role);
    const [mesAnoSelecionado, setMesAnoSelecionado] = useState<string | null>(null);

    const [dados, setDados] = useState<DadosColaborador[]>([]);
    const [carregando, setCarregando] = useState(false);

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

    const handleSearch = () => {
        const ajustandoMes = selectedMonth + 1;
        const juncao = `${selectedYear}-${ajustandoMes.toString().padStart(2, '0')}`;
        setMesAnoSelecionado(juncao);
        console.log(juncao);
        setCarregando(true);
        const timeout = setTimeout(() => {
        setDados(dadosMockados[juncao]);
        setCarregando(false);
        }, 500);

        return () => clearTimeout(timeout);
    }

    const totais = dados.reduce(
        (acc, curr) => ({
        horas: acc.horas + curr.horas,
        extras: acc.extras + curr.extras,
        faltas: acc.faltas + curr.faltas,
        banco: acc.banco + curr.banco,
        }),
        { horas: 0, extras: 0, faltas: 0, banco: 0 }
    );

    const exportToCSV = () => {
    const headers = ["Nome", "Horas Trabalhadas", "Horas Extras", "Faltas", "Banco de Horas"];
    const rows = dados.map((d) => [d.nome, d.horas, d.extras, d.faltas, d.banco]);
    
    // Cria o conteúdo CSV
    const csvContent = [headers, ...rows].map((e) => e.join(";")).join("\n");

    // Adiciona BOM para Excel
    const bom = "\uFEFF";

    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `extrato-mensal-${mesAnoSelecionado}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    };


  return (
    <div className="space-y-6">
        <Card className="bg-gray-200 border-white shadow-card">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1 ml-2">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <div className="rounded-lg bg-[#E08625]/10 p-3 mr-3">
                                <CalendarDays className="h-8 w-8 text-[#E08625]" />
                            </div>
                            Extrato Mensal
                        </CardTitle>
                        <CardDescription>
                            Visualize e exporte o resumo de horas trabalhadas por colaborador.
                        </CardDescription>
                    </CardHeader>
                </div>
                <div className="flex items-center gap-3 mr-9">
                    {tipoPerfilLogado === "MANAGER" &&
                    <Select value={selectedUser?.toString() || ''} onValueChange={setSelectedUser}>
                    <SelectTrigger className="w-60">
                    <SelectValue placeholder="Gestor"/>
                    </SelectTrigger>
                        <SelectContent>
                        {usuarios?.map((u: UserDataIdName) => (
                            <SelectItem key={u.id} value={u.id.toString()}>
                            {u.nome}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    }                
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
                    <Button variant="secondary" size="base" onClick={handleSearch}>
                        <Search className="h-4 w-4 mr-2" />
                        Buscar
                    </Button>
                    <Button variant="secondary" size="base" onClick={exportToCSV} disabled={carregando || dados.length === 0} className="gap-2 shadow-sm">
                    <Download className="h-4 w-4" />
                    Exportar CSV
                    </Button>
                </div>
            </div>
            <Separator />
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3 ml-2 mr-2">
                    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow bg-white border-gray-300">
                        <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#E08625]/10 p-3">
                            <Users className="h-6 w-6 text-[#E08625]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Total de Colaboradores</p>
                            <p className="text-2xl font-bold text-foreground">{dados.length}</p>
                        </div>
                        </div>
                    </Card>

                    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow bg-white border-gray-300">
                        <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#E08625]/10 p-3">
                            <CalendarDays className="h-6 w-6 text-[#E08625]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Horas Totais Trabalhadas</p>
                            <p className="text-2xl font-bold text-foreground">{totais.horas}h</p>
                        </div>
                        </div>
                    </Card>

                    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow bg-white border-gray-300">
                        <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#E08625]/10 p-3">
                            <CalendarDays className="h-6 w-6 text-[#E08625]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Horas Extras Totais</p>
                            <p className="text-2xl font-bold text-foreground">{totais.extras}h</p>
                        </div>
                        </div>
                    </Card>
                </div>

                {/* Table */}
                <Card className="shadow-lg mt-6 ml-2 mr-2 bg-white border-gray-300">
                <div className="p-6">
                    {carregando ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                    ) : dados.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Nenhum dado disponível para o mês selecionado</p>
                    </div>
                    ) : (
                    <div className="rounded-lg border border-white overflow-hidden">
                        <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-semibold text-foreground">Nome do Colaborador</TableHead>
                            <TableHead className="text-center font-semibold text-foreground">Horas Trabalhadas</TableHead>
                            <TableHead className="text-center font-semibold text-foreground">Horas Extras</TableHead>
                            <TableHead className="text-center font-semibold text-foreground">Faltas</TableHead>
                            <TableHead className="text-center font-semibold text-foreground">Banco de Horas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dados.map((colaborador, index) => (
                            <TableRow 
                                key={index} 
                                className="hover:bg-muted/30 transition-colors border-gray-300"
                            >
                                <TableCell className="font-medium">{colaborador.nome}</TableCell>
                                <TableCell className="text-center">{colaborador.horas}h</TableCell>
                                <TableCell className="text-center">
                                <span className={colaborador.extras > 0 ? "text-success font-medium" : ""}>
                                    {colaborador.extras}h
                                </span>
                                </TableCell>
                                <TableCell className="text-center">
                                <span className={colaborador.faltas > 0 ? "text-destructive font-medium" : ""}>
                                    {colaborador.faltas}
                                </span>
                                </TableCell>
                                <TableCell className="text-center">
                                <span
                                    className={`font-medium ${
                                    colaborador.banco > 0
                                        ? "text-success"
                                        : colaborador.banco < 0
                                        ? "text-destructive"
                                        : ""
                                    }`}
                                >
                                    {colaborador.banco > 0 ? "+" : ""}
                                    {colaborador.banco}h
                                </span>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow className="bg-muted/50 font-semibold hover:bg-muted/50 border-gray-500">
                            <TableCell>Total Geral</TableCell>
                            <TableCell className="text-center">{totais.horas}h</TableCell>
                            <TableCell className="text-center text-success">{totais.extras}h</TableCell>
                            <TableCell className="text-center text-destructive">{totais.faltas}</TableCell>
                            <TableCell className="text-center">
                                <span
                                className={`${
                                    totais.banco > 0 ? "text-success" : totais.banco < 0 ? "text-destructive" : ""
                                }`}
                                >
                                {totais.banco > 0 ? "+" : ""}
                                {totais.banco}h
                                </span>
                            </TableCell>
                            </TableRow>
                        </TableFooter>
                        </Table>
                    </div>
                    )}
                </div>
                </Card>
            </CardContent>
            <CardFooter>
                <Card className="p-4 bg-muted/30 shadow-lg grid gap-4 md:grid-cols-1 w-full bg-white border-gray-300 ml-2 mr-2">
                <p className="text-sm text-gray-500 text-center">
                    💡 <strong>Dica:</strong> Utilize o seletor de mês para visualizar extratos de períodos anteriores.
                    O botão de exportar CSV permite salvar os dados para análise externa.
                </p>
                </Card>                
            </CardFooter>
        </Card>
      </div>
  );
}
