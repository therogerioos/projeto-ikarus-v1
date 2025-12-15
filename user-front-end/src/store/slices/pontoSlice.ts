import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegistroPonto {
  inicioTurno?: string;
  fimTurno?: string;
  inicioPausa?: string;
  fimPausa?: string;

}

interface PontoState {
  registros: RegistroPonto[] | null;
  loading: boolean;
  error?: string;
}

const initialState: PontoState = {
  registros: null,
  loading: false,
};

const pontoSlice = createSlice({
  name: 'ponto',
  initialState,
  reducers: {
    setRegistros: (state, action: PayloadAction<RegistroPonto[]>) => {
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
