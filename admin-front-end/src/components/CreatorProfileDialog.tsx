import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Calendar, Save } from "lucide-react";
import { MyToast } from "./ui/toast-sonner";

interface NewProfileData {
  nome: string;
  username: string;
  email: string;
  cargo: string;
  role: "USER" | "ADMIN";
  tipoEscala: "LIVRE" | "SIMPLES" | "PERSONALIZADA";
}

interface CreatorProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (creator: NewProfileData) => void;
}

export const CreatorProfileDialog = ({
  open,
  onOpenChange,
  onSave,
}: CreatorProfileDialogProps) => {

    const modoEscala: NewProfileData["tipoEscala"][] = ["LIVRE", "SIMPLES", "PERSONALIZADA"];
    const roles: NewProfileData["role"][] = ["USER", "ADMIN"];
    const [dadosCreatorProfile, setDadosCreatorProfile] = useState<NewProfileData>({
        nome: "",
        username: "",
        email: "",
        cargo: "",
        role: "USER",
        tipoEscala: "LIVRE",
    })

    const handleSave = () => {
        onSave(dadosCreatorProfile);
        onOpenChange(false);
        MyToast({ type: "success", message: "Devolução de dados" });
    };

    return (
        
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-88">
                <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="w-5 h-5 text-primary" />
                    Criar novo usuário
                </DialogTitle>
                <DialogDescription>
                    Criação de perfis de usuários.
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome" className="text-xs">
                            Nome
                        </Label>
                        <Input
                            id="nome"
                            type="text"
                            placeholder="Nome"
                            value={dadosCreatorProfile.nome}
                            onChange={(e) => setDadosCreatorProfile(prev => ({ ...prev, nome: e.target.value}))}
                            className="text-sm border-gray-300 bg-white cursor-auto w-75"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-xs">
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={dadosCreatorProfile.username}
                            onChange={(e) => setDadosCreatorProfile(prev => ({ ...prev, username: e.target.value}))}
                            className="text-sm border-gray-300 bg-white cursor-auto w-75"
                        />
                    </div>
                    <div className="flex items-center justify-start gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-xs">
                                Perfil
                            </Label>
                            <Select value={dadosCreatorProfile.role.toString()} onValueChange={(value) => setDadosCreatorProfile(prev => ({ ...prev, role: value as NewProfileData["role"] }))}>
                                <SelectTrigger className="w-35">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-xs">
                                Tipo de Escala
                            </Label>
                            <Select value={dadosCreatorProfile.tipoEscala.toString()} onValueChange={(value) => setDadosCreatorProfile(prev => ({ ...prev, tipoEscala: value as NewProfileData["tipoEscala"] }))}>
                                <SelectTrigger className="w-35">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {modoEscala.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} variant="primary" className="w-37">
                        <Save className="w-4 h-4" />
                        Salvar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};