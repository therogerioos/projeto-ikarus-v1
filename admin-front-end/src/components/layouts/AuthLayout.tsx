import { ReactNode } from "react";
import "../../index.css";
import ikarusLogoWhite from "../../assets/ikarus_white.png";


interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {

  return (
    <div className="min-h-screen relative bg-amber-700 grid grid-cols-2 p-4 font-[Montserrat] ">
      {/* Div "Sheets" alinhada à esquerda */}
        <div className="relative flex-1 flex items-center justify-start ml-15">
          <div className="relative w-[80%]">
              <img src={ikarusLogoWhite} alt="Ikarus" className="w-full h-auto" />
              <h1 className="absolute inset-0 flex items-center justify-center text-amber-700 font-bold text-[5vw] ml-8 mt-10">
              Ikarus
              </h1>
          </div>
        </div>
      {/* Tela de login alinhada à direita */}
      <div className="relative flex-1 flex items-center justify-end mr-30">
        <div key={window.location.pathname} className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 animate__animated animate__zoomIn">
          {children}
        </div>
      </div>
    </div>
  );
};
