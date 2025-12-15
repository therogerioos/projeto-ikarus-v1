import { Calendar, CalendarCheck, Search, Users } from "lucide-react";
import { BatchUploadDialog } from "../BatchUploadDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { EscalaResumo } from "../EscalaResumo";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { UserDataIdName } from "../../types/interfaces";


export function EscalaGeralSubTab() {

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const currentYear = new Date().getFullYear();
    const [mes, setMes] = useState<number>(0);
    const [ano, setAno] = useState<number>(0);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
    const usuarios = useSelector((state: RootState) => state.auth.userIdName);
    const tipoPerfilLogado = useSelector((state: RootState) => state.auth.user?.role);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
    const months = [
        { value: "0", label: "Janeiro" },
        { value: "1", label: "Fevereiro" },
        { value: "2", label: "Março" },
        { value: "3", label: "Abril" },
        { value: "4", label: "Maio" },
        { value: "5", label: "Junho" },
        { value: "6", label: "Julho" },
        { value: "7", label: "Agosto" },
        { value: "8", label: "Setembro" },
        { value: "9", label: "Outubro" },
        { value: "10", label: "Novembro" },
        { value: "11", label: "Dezembro" },
    ];

    useEffect(() => {
        setMes(10);
        setAno(2025);
    }, []);

    const handleSearch = () => {
        console.log("Pesquisa de escala");
    };


    return (
        <div className="flex items-start gap-6 flex-col">
            <Card className="bg-gray-200 border-white shadow-card container mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                        <div className="rounded-lg bg-[#E08625]/10 p-3 mr-3">
                            <div className="relative">
                                <Calendar className="h-8 w-8 text-[#E08625]" />
                                <Users className=" h-4 w-4 absolute top-4 left-2 text-[#E08625]" />
                            </div>
                        </div>

                        Escala de Trabalho Geral
                    </CardTitle>
                    <CardDescription>
                        Gerencie as escalas dos colaboradores.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center text-2xl">
                    {tipoPerfilLogado === "MANAGER" &&
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground block">Realize a importação da escala:</label>
                        <div className="container w-70">
                            <BatchUploadDialog />
                        </div>
                    </div>
                    } 
                    {tipoPerfilLogado === "MANAGER" && 
                    <div className="space-y-2 px-3">
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
                        <label className="text-sm font-medium text-foreground block">Mês</label>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="w-30">
                                <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                {months.map((month) => (
                                    <SelectItem key={month.value} value={month.value}>
                                    {month.label}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                    </div>
                    <div className="space-y-2 px-3">
                        <label className="text-sm font-medium text-foreground block">Ano</label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
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
                    <div className="space-y-2 mt-7">
                        <Button variant="secondary" size="base" onClick={handleSearch}>
                            <Search className="h-4 w-4 mr-2" />
                            Buscar
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-gray-200 border-white shadow-card container mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                        <div className="rounded-lg bg-[#E08625]/10 p-3 mr-3">
                            <CalendarCheck className="h-8 w-8 text-[#E08625]" />
                        </div>
                        Resumo da Escala - {(months[mes - 1]?.label) ?? '-'}/{ano}
                    </CardTitle>
                    <CardDescription>
                        Visualização geral das escalas dos colaboradores.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EscalaResumo />
                </CardContent>
            </Card>
        </div>
    );
};