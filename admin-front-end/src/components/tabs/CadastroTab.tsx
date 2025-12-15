import { Check, ContactRound, Monitor, Play, Plus, RotateCcw, Search, UserRoundCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CadastroUser, Device, DeviceStatus, UserDataIdName } from "../../types/interfaces";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { concatHoras, formatarData } from "../utils/functions";
import { MyToast } from "../ui/toast-sonner";
import { CreatorProfileDialog } from "../CreatorProfileDialog";

interface NewProfileData {
  nome: string;
  username: string;
  email: string;
  cargo: string;
  role: "USER" | "ADMIN";
  tipoEscala: "LIVRE" | "SIMPLES" | "PERSONALIZADA";
}

export function CadastroTab() {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [creatorProfile, setCreatorProfile] = useState<NewProfileData>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const usuarios = useSelector((state: RootState) => state.auth.userIdName);
    const tipoPerfilLogado = useSelector((state: RootState) => state.auth.user?.role);
    const [horasInterjornada, setHorasInterjornada] = useState("00");
    const [minutosInterjornada, setMinutosInterjornada] = useState("00");
    const [segundosInterjornada, setSegundosInterjornada] = useState("00");
    const [horasTempoPausa, setHorasTempoPausa] = useState("00");
    const [minutosTempoPausa, setMinutosTempoPausa] = useState("00");
    const [segundosTempoPausa, setSegundosTempoPausa] = useState("00");
    const [horasTempoHE, setHorasTempoHE] = useState("00");
    const [minutosTempoHE, setMinutosTempoHE] = useState("00");
    const [segundosTempoHE, setSegundosTempoHE] = useState("00");
    const [horasTempoCH, setHorasTempoCH] = useState("00");
    const [minutosTempoCH, setMinutosTempoCH] = useState("00");
    const [segundosTempoCH, setSegundosTempoCH] = useState("00");
    const [redefinicaoSenha, setRedefinicaoSenha] = useState<string | null>(null);
    const [dadosAtualizar, setDadosAtualizar] = useState<CadastroUser>({
            id: null,
            matricula: null,
            username: null,
            nome: null,
            funcao: null,
            gestor: null,
            status: null,
            tipoEscala: null,
            interjornada: null,
            tempoPausa: null,
            limiteHorasExtras: null,
            cargaHoraria: null,
            inicioTurno: null,
            fimTurno: null,
            inicioPausa: null,
            fimPausa: null,
            dataNascimento: null,
            dataAdmissao: null,
            dataDemissao: null,
            ctps: null,
            serieCtps: null,
    });

    const dispositivos: Device[] = [
        { id: "1", hostname: "PC-Rogerio", status: "AUTORIZADO", criadoEm: "2025-10-30", justificativa: "Perfil de usuário com mais de uma máquina cadastrada." },
        { id: "2", hostname: "Laptop-Trabalho", status: "PENDENTE", criadoEm: "2025-10-28", justificativa: "" },
        { id: "3", hostname: "Notebook-Home", status: "AUTORIZADO", criadoEm: "2025-10-29", justificativa: "Perfil de usuário com mais de uma máquina cadastrada." },
        { id: "4", hostname: "Notebook-Car", status: "NEGADO", criadoEm: "2025-10-29", justificativa: "Violação de segurança - duplicidade de acesso." },
    ];

    const handleSearch = () => {
        MyToast({ type: "success", message: `Buscar usuário com ID: ${selectedUser}` });
    };

    const handleSave = () => {
        console.log(dadosAtualizar);

    };

    const handleResetSenha = () => {
        MyToast({ type: "success", message: "Evento de reset disparado." });
        setRedefinicaoSenha("123456");
    };

    const handleTempoInterjornada = (horaInput: string, minutoInput: string, segundoInput: string) => {
        const juntando = concatHoras(horaInput, minutoInput, segundoInput);
        setDadosAtualizar(prev => ({ ...prev, interjornada: juntando}))
    };
      
    const handleHorasInterjornada = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setHorasInterjornada(valor);
        handleTempoInterjornada(valor, minutosInterjornada, segundosInterjornada);
    } 

    const handleMinutosInterjornada = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setMinutosInterjornada(valor);
        handleTempoInterjornada(horasInterjornada, valor, segundosInterjornada);
    } 

    const handleSegundosInterjornada = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setSegundosInterjornada(valor);
        handleTempoInterjornada(horasInterjornada, minutosInterjornada, valor);
    }

    const handleTempoHE = (horaInput: string, minutoInput: string, segundoInput: string) => {
        const juntando = concatHoras(horaInput, minutoInput, segundoInput);
        setDadosAtualizar(prev => ({ ...prev, limiteHorasExtras: juntando}))
    };
      
    const handleHorasHE = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setHorasTempoHE(valor);
        handleTempoHE(valor, minutosTempoHE, segundosTempoHE);
    };

    const handleMinutosHE = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setMinutosTempoHE(valor);
        handleTempoHE(horasTempoHE, valor, segundosTempoHE);
    };

    const handleSegundosHE = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setSegundosTempoHE(valor);
        handleTempoHE(horasTempoHE, minutosTempoHE, valor);
    };

    const handleTempoCH = (horaInput: string, minutoInput: string, segundoInput: string) => {
        const juntando = concatHoras(horaInput, minutoInput, segundoInput);
        setDadosAtualizar(prev => ({ ...prev, cargaHoraria: juntando}))
    };

    const handleHorasCH = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setHorasTempoCH(valor);
        handleTempoCH(valor, minutosTempoCH, segundosTempoCH);
    };

    const handleMinutosCH = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setMinutosTempoCH(valor);
        handleTempoCH(horasTempoCH, valor, segundosTempoCH);
    };

    const handleSegundosCH = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setSegundosTempoCH(valor);
        handleTempoCH(horasTempoCH, minutosTempoCH, valor);
    };

    const handleTempoEmPausa = (horaInput: string, minutoInput: string, segundoInput: string) => {
        const juntando = concatHoras(horaInput, minutoInput, segundoInput);
        setDadosAtualizar(prev => ({ ...prev, tempoPausa: juntando}))
    };
      
    const handleHorasPausa = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setHorasTempoPausa(valor);
        handleTempoEmPausa(valor, minutosTempoPausa, segundosTempoPausa);
    } 

    const handleMinutosPausa = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setMinutosTempoPausa(valor);
        handleTempoEmPausa(horasTempoPausa, valor, segundosTempoPausa);
    } 

    const handleSegundosPausa = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setSegundosTempoPausa(valor);
        handleTempoEmPausa(horasTempoPausa, minutosTempoPausa, valor);
    } 

    const handleDeviceAction = (uuid: string, acao: string) => {
        console.log(uuid, acao);
    };

    const handleSaveProfile = (profile: NewProfileData) => {
        setCreatorProfile(profile);
        setDialogOpen(false);
    };

    useEffect(() => {
        console.log("Dados para criação do perfil: ", creatorProfile)
    }, [creatorProfile]);


    const getStatusBadgeClass = (status: DeviceStatus) => {
        switch (status) {
        case "AUTORIZADO":
            return "bg-green-100 text-white dark:bg-green-500 dark:text-white";
        case "PENDENTE":
            return "bg-yellow-100 text-white dark:bg-yellow-500 dark:text-white";
        case "NEGADO":
            return "bg-red-100 text-white dark:bg-red-500 dark:text-white";
        default:
            return "";
        }
    };

    return (
        <div className="space-y-6">
            {dialogOpen && (
                <CreatorProfileDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSave={handleSaveProfile}
                    />
            )}
            <Card className="bg-gray-200 border-white shadow-card">
                <div className="flex items-center justify-between">
                    <div>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <div className="rounded-lg bg-[#E08625]/10 p-3 mr-3">
                                    <UserRoundCheck className="h-8 w-8 text-[#E08625]" />
                                </div>
                                Pesquisa de Usuários
                            </CardTitle>
                            <CardDescription>
                                Realize a busca dos usuários com perfis criados no sistema.
                            </CardDescription>
                        </CardHeader>
                    </div>
                    {tipoPerfilLogado === "MANAGER" &&
                    <div className="mr-8">
                        <Button variant="primary" size="base" onClick={() => setDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Criar Perfil
                        </Button>
                    </div>
                    }
                </div>
                <CardContent className="pt-2 flex gap-4">
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
                </CardContent>
            </Card>

            <Card className="bg-gray-200 border-white shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <div className="rounded-lg bg-[#E08625]/10 p-3 mr-3">
                            <ContactRound className="h-8 w-8 text-[#E08625]" />
                        </div>
                        Cadastros
                    </CardTitle>
                    <CardDescription>
                        Visualização e edição das informações cadastrais dos funcionários.
                    </CardDescription>

                </CardHeader>
                <CardContent className="pt-2 pl-8 pr-8 flex flex-wrap flex-col gap-4 w-full mx-auto">
                    <div className="flex flex-wrap gap-4 flex-1 min-w-[250px]">
                        <div className="flex-1 min-w-[10%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Matrícula</label>
                            <Input 
                                type="text" 
                                placeholder="Matrícula" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, matricula: e.target.value}))} />
                        </div>
                        <div className="flex-1 min-w-[20%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Login</label>
                            <Input 
                                type="text" 
                                placeholder="Login" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, username: e.target.value}))} />
                        </div>
                        <div className="flex-1 min-w-[60%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Nome do funcionário</label>
                            <Input 
                                type="text" 
                                placeholder="Nome do funcionário" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, nome: e.target.value}))} />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 flex-1 min-w-[250px]">
                        <div className="flex-1 min-w-[30%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Função</label>
                            <Input 
                                type="text" 
                                placeholder="Função" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, funcao: e.target.value}))} />
                        </div>
                        <div className="flex-1 min-w-[30%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Gestor Imediato</label>
                            <Input 
                                type="text" 
                                placeholder="Gestor Imediato" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, gestor: e.target.value}))} />
                        </div>
                        <div className="flex-1 min-w-[15%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Status</label>
                            <Input 
                                type="text" 
                                placeholder="Status" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, status: e.target.value}))} />
                        </div>
                        <div className="flex-1 min-w-[15%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Tipo de Escala</label>
                            <Input 
                                type="text" 
                                placeholder="Tipo de Escala" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, tipoEscala: e.target.value}))} />
                        </div>
                    </div>


                    <div className="flex flex-wrap gap-4 flex-1 min-w-[250px]">
                        <div className="flex-1 min-w-[20%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Data de Nascimento</label>
                            <Input 
                                type="date" 
                                placeholder="Data de Nascimento" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, dataNascimento: e.target.value}))} />
                        </div>                        
                        <div className="flex-1 min-w-[20%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Data de Admissão</label>
                            <Input 
                                type="date" 
                                placeholder="Data de Admissão" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, dataAdmissao: e.target.value}))} />
                        </div>
                        <div className="flex-1 min-w-[20%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Data de Demissão</label>
                            <Input 
                                type="date" 
                                placeholder="Data de Demissão" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, dataDemissao: e.target.value}))} />
                        </div>
                        <div className="flex-1 min-w-[20%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">CTPS</label>
                            <Input 
                                type="number" 
                                placeholder="CTPS" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, ctps: e.target.value}))} />
                        </div>
                        <div className="flex-1 min-w-[10%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Série</label>
                            <Input 
                                type="number" 
                                placeholder="Série" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, serieCtps: e.target.value}))} />
                        </div>
                    </div>


                    <div className="flex flex-wrap gap-4 flex-1 min-w-[250px]">
                        <div className="flex-1 min-w-[15%] md:min-w-[20%] lg:min-w-[20%] xl:min-w-[15%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Interjornada</label>
                            <div className="flex items-center border rounded pt-1.5 pb-1.5 border-gray-300 bg-white">
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="32" 
                                    placeholder="00" 
                                    className="w-12 px-2 appearance-none focus:outline-none ml-2"
                                    onChange={handleHorasInterjornada}
                                />
                                <span>:</span>
                                <input 
                                    type="number" 
                                    value="00" 
                                    min="0" 
                                    max="59" 
                                    readOnly 
                                    className="w-12 px-2 appearance-none focus:outline-none"
                                    onChange={handleMinutosInterjornada}
                                />
                                <span>:</span>
                                <input 
                                    type="number" 
                                    value="00" 
                                    min="0" 
                                    max="59" 
                                    readOnly 
                                    className="w-12 px-2 appearance-none focus:outline-none"
                                    onChange={handleSegundosInterjornada}
                                />
                            </div>
                        </div>
                        <div className="flex-1 min-w-[15%] md:min-w-[20%] lg:min-w-[20%] xl:min-w-[15%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Limite de HE</label>
                            <div className="flex items-center border rounded pt-1.5 pb-1.5 border-gray-300 bg-white">
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="2" 
                                    placeholder="00" 
                                    className="w-12 px-2 appearance-none focus:outline-none ml-2"
                                    onChange={handleHorasHE}
                                />
                                <span>:</span>
                                <input 
                                    type="number" 
                                    value="00" 
                                    min="0" 
                                    max="59" 
                                    readOnly 
                                    className="w-12 px-2 appearance-none focus:outline-none"
                                    onChange={handleMinutosHE}
                                />
                                <span>:</span>
                                <input 
                                    type="number" 
                                    value="00" 
                                    min="0" 
                                    max="59" 
                                    readOnly 
                                    className="w-12 px-2 appearance-none focus:outline-none"
                                    onChange={handleSegundosHE}
                                />
                            </div>
                        </div>
                        <div className="flex-1 min-w-[15%] md:min-w-[20%] lg:min-w-[20%] xl:min-w-[15%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Tempo em Pausa</label>
                            <div className="flex items-center border rounded pt-1.5 pb-1.5 border-gray-300 bg-white">
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="2" 
                                    placeholder="00" 
                                    className="w-12 px-2 appearance-none focus:outline-none ml-2"
                                    onChange={handleHorasPausa}
                                />
                                <span>:</span>
                                <input 
                                    type="number"  
                                    min="0" 
                                    max="59"
                                    placeholder="00" 
                                    className="w-12 px-2 appearance-none focus:outline-none"
                                    onChange={handleMinutosPausa}
                                />
                                <span>:</span>
                                <input 
                                    type="number" 
                                    value="00" 
                                    min="0" 
                                    max="59"
                                    readOnly
                                    className="w-12 px-2 appearance-none focus:outline-none"
                                    onChange={handleSegundosPausa}
                                />
                            </div>
                        </div>

                        <div className="flex-1 min-w-[15%] md:min-w-[20%] lg:min-w-[20%] xl:min-w-[15%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Carga Horária</label>
                            <div className="flex items-center border rounded pt-1.5 pb-1.5 border-gray-300 bg-white">
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="36" 
                                    placeholder="00" 
                                    className="w-12 px-2 appearance-none focus:outline-none ml-2"
                                    onChange={handleHorasCH}
                                />
                                <span>:</span>
                                <input 
                                    type="number"  
                                    min="0" 
                                    max="59"
                                    placeholder="00" 
                                    className="w-12 px-2 appearance-none focus:outline-none"
                                    onChange={handleMinutosCH}
                                />
                                <span>:</span>
                                <input 
                                    type="number" 
                                    value="00" 
                                    min="0" 
                                    max="59"
                                    readOnly
                                    className="w-12 px-2 appearance-none focus:outline-none"
                                    onChange={handleSegundosCH}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 flex-1 min-w-[250px]">
                        <div className="flex-1 min-w-[5%] md:min-w-[20%] lg:min-w-[20%] xl:min-w-[5%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Horário de entrada</label>
                            <Input 
                                type="time" 
                                step="1" 
                                placeholder="Horário de entrada" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, inicioTurno: e.target.value}))} />
                        </div>
                        <div className="flex-1 min-w-[5%] md:min-w-[20%] lg:min-w-[20%] xl:min-w-[5%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Horário de saída</label>
                            <Input 
                                type="time" 
                                step="1" 
                                placeholder="Horário de saída" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, fimTurno: e.target.value}))} />
                        </div>
                        <div className="flex-1 min-w-[5%] md:min-w-[20%] lg:min-w-[20%] xl:min-w-[5%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Início da pausa</label>
                            <Input 
                                type="time" 
                                step="1" 
                                placeholder="Início da pausa" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, inicioPausa: e.target.value}))} />
                        </div>
                        <div className="flex-1 min-w-[5%] md:min-w-[20%] lg:min-w-[20%] xl:min-w-[5%] space-y-2">
                            <label className="text-sm font-medium text-foreground block">Fim da pausa</label>
                            <Input 
                                type="time" 
                                step="1" 
                                placeholder="Fim da pausa" 
                                className="border-gray-300 bg-white focus:border-gray-400"
                                onChange={(e) => setDadosAtualizar(prev => ({ ...prev, fimPausa: e.target.value}))} />
                        </div>
                    </div>



                </CardContent>
                <CardFooter>
                    <Button type="button" variant="primary" size="base" onClick={handleSave}>
                        <Check className="h-4 w-4 mr-2" />
                        Salvar
                    </Button>
                </CardFooter>
            </Card>
            <Card className="bg-gray-200 border-white shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <div className="rounded-lg bg-[#E08625]/10 p-3 mr-3">
                            <RotateCcw className="h-8 w-8 text-[#E08625]" />
                        </div>
                        Reset de Senha
                    </CardTitle>
                    <CardDescription>
                        Redefina a senha do funcionário selecionado.
                    </CardDescription>
                    <CardContent>
                        <div className="space-y-2 mt-7 ml-[-25px] flex items-center justify-start gap-7">
                            <Button type="button" variant="primary" size="base" onClick={handleResetSenha}>
                                <Play className="h-4 w-4 mr-2" />
                                Executar
                            </Button>
                            {redefinicaoSenha != null &&
                            <div className="mb-2">
                                <h2>Senha Provisória: <strong>{redefinicaoSenha}</strong></h2>
                            </div>}
                        </div>
                    </CardContent>
                </CardHeader>
            </Card>
            <Card className="bg-gray-200 border-white shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <div className="rounded-lg bg-[#E08625]/10 p-3 mr-3">
                            <Monitor className="h-8 w-8 text-[#E08625]" />
                        </div>
                        Controle de Dispositivos
                    </CardTitle>
                    <CardDescription>
                        Gerencie as permissões de acesso dos dispositivos dos usuários.
                    </CardDescription>
                    <CardContent>
                        <Card className="shadow-lg bg-white border-gray-300 pb-10 pl-8 pr-8 mt-5">
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-400">
                                    <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                                        Hostname
                                    </th>
                                    <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                                        Criado em:
                                    </th>
                                    <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                                        Observação
                                    </th>
                                    <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                                        Ações
                                    </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dispositivos.map((device) => (
                                    <tr
                                        key={device.id}
                                        className="border-b border-gray-400 hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="py-3 px-4 font-medium text-sm text-center">{device.hostname}</td>
                                        <td className="py-3 px-4 w-26 text-sm text-muted-foreground text-center">
                                        {formatarData(device.criadoEm)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                            device.status
                                            )}`}
                                        >
                                            {device.status}
                                        </span>
                                        </td>
                                        <td className="py-3 px-4 w-45 h-20 text-sm text-muted-foreground text-center">
                                        {device.justificativa}
                                        </td>
                                        <td className="py-3 px-4">
                                        <div className="flex gap-2 items-center justify-center">
                                            <Button
                                            size="mx"
                                            variant="success"
                                            onClick={() => handleDeviceAction(device.id, "permitir")}
                                            >
                                            Permitir
                                            </Button>
                                            <Button
                                            size="mx"
                                            variant="destructive"
                                            onClick={() => handleDeviceAction(device.id, "negar")}
                                            >
                                            Negar
                                            </Button>
                                            <Button
                                            size="mx"
                                            variant="warning"
                                            onClick={() => handleDeviceAction(device.id, "revogar")}
                                            >
                                            Revogar
                                            </Button>
                                        </div>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                        </Card>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    );
}