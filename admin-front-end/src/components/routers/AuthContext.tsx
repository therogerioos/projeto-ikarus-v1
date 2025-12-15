/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { invokeMe, listUsersIdName, listUsersLogados, loginUser } from "../../lib/api";
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingFalse } from '../../store/slices/uiSlice';
import { clearAuth, setIsLogged, setUserData, setUserDataIdName } from "../../store/slices/authSlice";
import { LoadingOverlay } from '../ui/loading';
import { setRegistros } from "../../store/slices/pontoSlice";
import { RootState } from "../../store";
import { MyToast } from "../../components/ui/toast-sonner";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";



interface AuthContextType {
  handleLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
}


interface UsersResponse {
  id?: string;
  username?: string;
  nome?: string;
  role?: string;
  status?: string;
  inicioTurno?: string;
  fimTurno?: string;
  inicioPausa?: string;
  fimPausa?: string;
}

export type RegisterResponse = UsersResponse[];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {

      if(user?.role === "MANGER") {
        alert("A funcionalidade de atualização em tempo real para gerentes ainda não está implementada.");
        return;
      } else if (user?.role === "ADMIN") {
        const data: UsersResponse = await listUsersLogados();
        dispatch(setRegistros([data]));
      } else {
        MyToast({ type: "error", message: "Não foi possível carregar os dados." });
      }
    } catch (err) {
      MyToast({ type: "error", message: `Erro ao registrar: ${err}` });
      window.location.href = "/login";
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function loadUserData() {
        try {
          const userData = await invokeMe();
          const userIdNameData = await listUsersIdName();
          dispatch(setUserData(userData));
          dispatch(setUserDataIdName(userIdNameData));
        } catch (error) {
          dispatch(clearAuth());
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
  }, [token, dispatch, fetchData]);

  const refreshUserData = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

useEffect(() => {
  if (!user || !user.organizacaoId) return;

  const stompClient = Stomp.over(() => new SockJS("https://localhost:8080/ws/admin"));

  stompClient.connect({}, () => {
    stompClient.subscribe(`/topic/admin/${user.id}`, (message: { body: string; }) => {
      const body = JSON.parse(message.body);
      console.log("Atualização recebida:", body);
      fetchData();
    });
  });

  return () => {
    stompClient.disconnect();
  };
}, [fetchData, user]);

  

  const handleToggleLoadingFalse = () => {dispatch(setLoadingFalse());};

    async function handleLogin(username: string, password: string) {

      try {
        const data = await loginUser(username, password);

        if (data.message === "Direcionando para troca de senha") {
          dispatch(setIsLogged(true));
          MyToast({ type: "info", message: `Redirecionando para troca de senha` });
          window.location.href = "/forgot-password";
        } else if (data.message === "Login efetuado com sucesso") {
          dispatch(setIsLogged(true));
          const userData = await invokeMe();
          const userIdNameData = await listUsersIdName();
          refreshUserData();
          dispatch(setUserData(userData));
          dispatch(setUserDataIdName(userIdNameData));
        } else {
          MyToast({ type: "error", message: `Token JWT não encontrado na resposta` });
          //window.location.href = "/login";
        }
      } catch (error: any) {
          MyToast({ type: "error", message: `Erro ao fazer login: ${error.message}` });
          handleToggleLoadingFalse();
          console.error("Login error:", error);
          //window.location.href = "/login";
        }
    }

  const logout = () => {
    dispatch(clearAuth());
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
