import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { invokeMe, loginUser, registerMe } from "../../lib/api";
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingFalse } from '../../store/slices/uiSlice';
import { clearAuth, setToken, setUserData } from "../../store/slices/authSlice";
import { LoadingOverlay } from '../ui/loading';
import { setRegistros } from "../../store/slices/pontoSlice";
import { MyToast } from "../../components/ui/toast-sonner";


interface AuthContextType {
  handleLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface RegistroPonto {
  inicioTurno?: string;
  fimTurno?: string;
  inicioPausa?: string;
  fimPausa?: string;
  previstoInicioTurno?: string;
  previstoFimTurno?: string;
  previstoInicioPausa?: string;
  previstoFimPausa?: string;
}

export type RegisterResponse = RegistroPonto[];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.token);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const data: RegisterResponse = await registerMe();
      dispatch(setRegistros(data));
    } catch (err) {
      MyToast({ type: "error", message: `Erro ao registrar: ${err}` });
      window.location.href = "/login";
    }
  }, [dispatch]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function loadUserData() {
      try {
        const userData = await invokeMe();
        dispatch(setUserData(userData));
      } catch (error) {
        dispatch(clearAuth());
        localStorage.removeItem('jwt_token');
        MyToast({ type: "error", message: `Erro ao executar: ${error}` });
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [token, dispatch]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
      fetchData();
  }, [token, dispatch]);

  const refreshUserData = async () => {
    setLoading(true);
    await fetchData();
  };
  

  const handleToggleLoadingFalse = () => {dispatch(setLoadingFalse());};

    async function getDeviceInfo(username: string) {
        try {
            const [uuid, hostname, hash]: [string, string, string] = await invoke('get_or_create_device', { username });
            return { uuid, hostname, hash };
        } catch (error) {
            MyToast({ type: "error", message: `Erro ao obter dispositivo: ${error}` });
            throw error;
        }
    }

    async function handleLogin(username: string, password: string) {

      const { uuid, hostname, hash } = await getDeviceInfo(username);

      try {
        const data = await loginUser(username, password, uuid, hostname, hash);

        if (data.message === "Direcionando para troca de senha") {
          if (data.token) {
            dispatch(setToken(data.token));
            localStorage.setItem('jwt_token', data.token);
          }
          MyToast({ type: "info", message: `Redirecionando para troca de senha` });
          window.location.href = "/forgot-password";
        } else if (data.token) {
          dispatch(setToken(data.token));
          const userData = await invokeMe();
          refreshUserData();
          dispatch(setUserData(userData));
          localStorage.setItem('jwt_token', data.token);
        } else {
          MyToast({ type: "error", message: `Token JWT não encontrado na resposta` });
          window.location.href = "/login";
        }
      } catch (error: any) {
          MyToast({ type: "error", message: `Erro ao executar: ${error.message}` });
          handleToggleLoadingFalse();
          window.location.href = "/login";
        }
    }

  const logout = () => {
    dispatch(clearAuth());
    localStorage.removeItem('jwt_token');
    window.location.href = "/login";
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <AuthContext.Provider value={{ handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
