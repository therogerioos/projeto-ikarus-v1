import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearAuth, setUserData, setToken } from "../store/slices/authSlice";
import { invokeMe } from "../lib/api";

export function useAuthCheck() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    if (!storedToken) return;

    dispatch(setToken(storedToken));

    const checkUserData = async () => {
      try {
        const userData = await invokeMe();
        dispatch(setUserData(userData));
      } catch {
        dispatch(clearAuth());
        window.location.href = "/login";
      }
    };

    // Checa logo na montagem
    checkUserData();

    // Checa a cada 20 minutos
    const interval = setInterval(checkUserData, 20 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);
}
