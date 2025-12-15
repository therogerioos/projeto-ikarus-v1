import { ReactNode } from "react";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../sidebar/AppSidebar";
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { RootState } from '../../store';
import { Logout } from "../ui/logout";
import { Menu, X } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const tipoPerfilLogado = useSelector((state: RootState) => state.auth.user?.role);
  const handleToggleSidebar = () => {dispatch(toggleSidebar());};

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full`}>
        <AppSidebar />
        <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-45 lg:ml-40 transition-all duration-500': 'ml-15 transition-all duration-300'}`}>
          {/* Header with Sidebar Trigger */}
        <header className="h-16 flex items-center justify-between border-b border-border bg-card px-6 shadow-sm z-10 fixed w-full bg-[#1e1e1e]">
          {/* Esquerda: SidebarTrigger + Título */}
          <div className="flex items-center">
            {sidebarOpen ? (<X onClick={handleToggleSidebar} className="h-6 w-6 text-white transition-all duration-300 cursor-pointer" />) : (<Menu onClick={handleToggleSidebar} className="h-6 w-6 text-white transition-all duration-400 cursor-pointer" />)}
            
            <h1 className="ml-4 text-xl font-semibold text-foreground text-white">
              Sistema de Ponto Eletrônico {tipoPerfilLogado === "MANAGER" ? "- Perfil: Gerente": tipoPerfilLogado === "ADMIN" ? "- Perfil: Administrador": tipoPerfilLogado === "MASTER" ? "- Perfil: Master": ""}
            </h1>
          </div>
          <div className={`${sidebarOpen ? 'mr-45 transition-all duration-500' : 'mr-15 transition-all duration-300'}`}>
            {/* Direita: Logout */}
            <Logout />
          </div>
        </header>
          {/* Main Content */}
          <main className="flex-1 p-10 bg-gray-300 mt-16 overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}