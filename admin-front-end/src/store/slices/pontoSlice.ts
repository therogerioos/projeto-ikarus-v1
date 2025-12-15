import { createSlice, PayloadAction } from '@reduxjs/toolkit';



interface UsersResponse {
  id?: string;
  username?: string;
  nome?: string;
  role?: string;
  status?: string;
  horaInicioTurno?: string;
  horaFimTurno?: string;
  horaInicioPausa?: string;
  horaFimPausa?: string;
}


interface PontoState {
  registros: UsersResponse[];
  loading: boolean;
  error?: string;
}

const initialState: PontoState = {
  registros: [],
  loading: false,
};

const pontoSlice = createSlice({
  name: 'ponto',
  initialState,
  reducers: {
    setRegistros: (state, action: PayloadAction<UsersResponse[]>) => {
      state.registros = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setRegistros, setLoading, setError } = pontoSlice.actions;
export default pontoSlice.reducer;
