import { Clock, FileText } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar";
import companyLogo from "../assets/Vector.png";
import nameLogo from "../assets/Ikarus.png";
//import { useSelector } from 'react-redux';
//import { RootState } from '../store';





const navigationItems = [
  { title: "Ponto", url: "/", icon: Clock },
  { title: "Folha", url: "/folha", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "expanded"
  //const { sidebarOpen } = useSelector((state: RootState) => state.ui);



  return (
    <Sidebar
      className={`${
        isCollapsed ? "w-45" : "w-16"
      } bg-[#E08625] z-11 border-white shadow-sidebar transition-all duration-300`}
      collapsible="icon"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-400 border-border/50 bg-[#1e1e1e]">
        <div className="flex items-center">
          <img
            src={companyLogo}
            alt="PointePro"
            className="h-8 w-8 object-contain"
          />
          {isCollapsed && (
          <img
            src={nameLogo}
            alt="Ikarus"
            className="object-contain w-16 ml-1 mt-3 transition-all duration-600"
          />
          )}
        </div>
      </div>

      <SidebarContent className="mt-4">
        <SidebarGroup>
          {isCollapsed && (
            <SidebarGroupLabel className="text-white/90 text-xs uppercase tracking-wider">
              Menu Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`
                      transition-all duration-200 mx-2 my-1
                      ${!isCollapsed
                        ? isActive(item.url)
                        ? "bg-[#1e1e1e] shadow-button rounded-2xl text-[#E08625]"
                        : "text-white/80 hover:bg-white/10 hover:text-white rounded-2xl"
                        : isActive(item.url)
                        ? "bg-[#1e1e1e] text-[#E08625] shadow-button rounded-tl-2xl rounded-bl-2xl rounded-tr-xs rounded-br-xs"
                        : "text-white/80 hover:bg-white/10 hover:text-white rounded-tl-2xl rounded-bl-2xl rounded-tr-xs rounded-br-xs"
                      }
                    `}
                  >
                    <NavLink to={item.url} end>
                      <item.icon className="h-6 w-6" />
                      {isCollapsed && <span className="ml-3 font-bold text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
      </SidebarContent>
    </Sidebar>
  );
}