import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  id: string;
  nome: string;
  username: string;
  status: string;
  horaInicioTurno?: string;
  horaFimTurno?: string;
  horaInicioPausa?: string;
  horaFimPausa?: string;
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('jwt_token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('jwt_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
    state.token = action.payload;
    state.isAuthenticated = true;
    localStorage.setItem("jwt_token", action.payload);
    },
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: UserData }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('jwt_token', action.payload.token);
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('jwt_token');
    },
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
  },
});

export const { setToken, setCredentials, clearAuth, setUserData } = authSlice.actions;
export default authSlice.reducer;
