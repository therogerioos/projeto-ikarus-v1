import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Calendar, Search, User } from "lucide-react";
import { CalendarGrid } from "../CalendarGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { UserDataIdName } from "../../types/interfaces";

export function EscalaIndividualSubTab() {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [userId, setUserId] = useState("");
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const usuarios = useSelector((state: RootState) => state.auth.userIdName);
    const tipoPerfilLogado = useSelector((state: RootState) => state.auth.user?.role);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  
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

  const handleSearch = () => {
    console.log("Usuário selecionado:", selectedUser);
    setUserId(selectedUser ? selectedUser : '');

  };

  return (
    <div className="space-y-6">
        <Card className="bg-gray-200 border-white shadow-card">
            <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                    <div className="rounded-lg bg-[#E08625]/10 p-3 mr-3">
                        <div className="relative">
                            <Calendar className="h-8 w-8 text-[#E08625]" />
                            <User className=" h-4 w-4 absolute top-4 left-2 text-[#E08625]" />
                        </div>
                    </div>

                    Escala de Trabalho Individual
                </CardTitle>
                <CardDescription>
                    Gerencie as escalas individuais dos colaboradores
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 items-center">
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
                    <div className="space-y-2">
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
                </div>
            </CardContent>
            <CardContent>
                <div className="container mx-auto px-4 py-8">
                    <CalendarGrid month={parseInt(selectedMonth)} year={parseInt(selectedYear)} userId={userId}/>
                </div>
            </CardContent>
      </Card>
    </div>
  );
};