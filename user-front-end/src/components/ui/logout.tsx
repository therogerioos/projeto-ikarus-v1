import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useAuth } from "../../components/routers/AuthContext";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MyToast } from "./toast-sonner";

export function Logout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { logout } = useAuth();
  const { user } = useSelector((state: RootState) => state.auth);

  function getInitials(fullName: string): string {
    // Divide o nome completo em partes (por exemplo, primeiro nome, sobrenome)
    const nameParts = fullName.split(" ");

    // Pega a primeira letra de cada parte do nome
    const firstNameInitial = nameParts[0].charAt(0).toUpperCase(); // Primeira letra do primeiro nome
    const lastNameInitial =
      nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : ""; // Primeira letra do sobrenome, se houver

    // Retorna as iniciais
    return firstNameInitial + lastNameInitial;
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Abre o menu ao clicar no ícone
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      logout();
      MyToast({ type: "success", message: 'Logout realizado com sucesso.' });
    } catch (error) {
      MyToast({ type: "error", message: `Erro ao executar logout: ${error}` });
    }
  };

  return (
    <div className="flex items-center mr-8">
            <div
              className={`w-10 h-10 rounded-full cursor-pointer bg-white flex items-center justify-center text-[#1e1e1e] font-bold`}
              onClick={handleClick}
            >
              {getInitials(user?.nome ?? "")}{" "}
            </div>
            <div
              className={`ml-2 text-white`}
            >
              <p className="text-sm font-medium">{user?.nome ?? ""}</p>
              <p className="text-xs opacity-75">{user?.username ?? ""}</p>
            </div>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={{ marginTop: 1 }}>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
  );
}
