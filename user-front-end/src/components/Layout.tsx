import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../store/slices/uiSlice';
import { RootState } from '../store';
import { Logout } from "./ui/logout";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const handleToggleSidebar = () => {dispatch(toggleSidebar());};

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full`}>
        <AppSidebar />
        
        <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-45 transition-all duration-500': 'ml-15 transition-all duration-300'}`}>
          {/* Header with Sidebar Trigger */}
        <header className="h-16 flex items-center justify-between border-b border-border bg-card px-6 shadow-sm z-10 fixed w-full bg-[#1e1e1e]">
          {/* Esquerda: SidebarTrigger + Título */}
          <div className="flex items-center">
            <SidebarTrigger onClick={handleToggleSidebar} className="h-8 w-8 rounded-md hover:bg-muted transition-colors" />
            <h1 className="ml-4 text-xl font-semibold text-foreground text-white">
              Sistema de Ponto Eletrônico
            </h1>
          </div>
          <div className={`${sidebarOpen ? 'mr-45 transition-all duration-500' : 'mr-15 transition-all duration-300'}`}>
            {/* Direita: Logout */}
            <Logout />
          </div>

        </header>

          {/* Main Content */}
          <main className="flex-1 p-10 bg-gray-300 mt-15">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}