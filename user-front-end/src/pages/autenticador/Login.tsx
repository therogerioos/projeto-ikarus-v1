import React, { useEffect, useState } from "react";
import { Lock, LogIn, User } from "lucide-react";
import { useAuth } from "../../components/routers/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setLoadingTrue, setLoadingFalse } from '../../store/slices/uiSlice';
import { RootState } from '../../store';
import { MyToast } from "../../components/ui/toast-sonner";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const { isLoadingRedux } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const handleToggleLoadingTrue = () => {dispatch(setLoadingTrue());};
  const handleToggleLoadingFalse = () => {dispatch(setLoadingFalse());};

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleLoginQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    handleToggleLoadingTrue();

    try {
      await handleLogin(email, password);
    } catch (error: any) {
        handleToggleLoadingFalse();
        MyToast({ type: "error", message: `Erro ao executar login: ${error.message}` });
        
    }
  };


  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Bem-vindo de volta
        </h1>
        <p className="text-white/80">Entre com sua conta para continuar</p>
      </div>

      <form onSubmit={handleLoginQuery} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-5 w-5" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white hover:border-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-5 w-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white hover:border-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoadingRedux} // Desabilita o botão enquanto o login está em andamento
          className={`w-full ${isLoadingRedux ? "bg-gray-500" : "bg-white text-[#161E42]"} rounded-lg py-3 font-semibold flex items-center justify-center space-x-2 hover:bg-white/90  cursor-pointer active:scale-95 transition-transform duration-150 ease-in-out`}
        >
          {isLoadingRedux ? (
            <div className="w-5 h-5 border-4 border-t-transparent border-white/60 rounded-full animate-spin"></div> // Exibe um loading
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          <span>{isLoadingRedux ? "Entrando..." : "Entrar"}</span>
        </button>
      </form>
    </div>
  );
};

export default Login;
