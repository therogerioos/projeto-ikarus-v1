
import { NavLink } from "react-router-dom";
import {
  PanelBottom,
  FileText,
  Users,
  CalendarRange,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import companyLogo from "../../assets/Vector.png";
import nameLogo from "../../assets/Ikarus.png";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const navigationItems = [
  { title: "Painel", url: "/", icon: PanelBottom },
  { title: "Folha", url: "/folha", icon: FileText },
  { title: "Cadastro", url: "/cadastro", icon: Users },
  { title: "Escala", url: "/escala", icon: CalendarRange },
];

export function AppSidebar() {
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`fixed h-screen bg-[#E08625] text-white flex flex-col justify-between border-r border-white shadow-lg transition-[width] duration-300 z-20 ${
          sidebarOpen ? "w-40" : "w-15"
        }`}
      >
        {/* Topo com logo */}
        <div className="p-4 border-b border-white/20 bg-[#1e1e1e] flex items-center justify-between">
          <div className="flex items-center overflow-hidden">
            <img
              src={companyLogo}
              alt="Logo"
              className="h-8 w-8 object-contain shrink-0"
            />
            <div
              className={`transition-all duration-300 ${
                sidebarOpen ? "opacity-100 ml-2 w-auto" : "opacity-0 w-0"
              }`}
            >
              <img
                src={nameLogo}
                alt="Ikarus"
                className="object-contain w-16 mt-2"
              />
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 mt-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.title}>
                <Tooltip>
                  <TooltipTrigger>
                    <div>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 mx-2 py-2  pl-3 font-medium
                          ${sidebarOpen ? "expand-width rounded-l-lg rounded-r-none": "recue-width rounded-lg"}
                          ${
                            isActive
                              ? "bg-[#1e1e1e] text-[#E08625] shadow-button"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                          }`
                        }
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span
                          className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                            sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                          }`}
                        >
                          {item.title}
                        </span>
                      </NavLink>
                    </div>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent className="text-[#E08625]" side="right">{item.title}</TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>

        {/* Rodapé (opcional) */}
        <div className="border-t border-white/20 bg-[#1e1e1e] p-3 text-center">
        {sidebarOpen && (
          <p
            className={`text-xs text-white/70 transition-all h-5 duration-300 expand-opacity`}
          >
            by <strong>THEROGERIOOS</strong>
          </p>)}
          {!sidebarOpen && (
          <p
            className={`text-xs text-white/70 transition-all h-5 duration-300 expand-opacity`}
          >
            v<strong>1.0.0</strong>
          </p>)}
        </div>
      </aside>
    </TooltipProvider>
  );
}
