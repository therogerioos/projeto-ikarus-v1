import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import pontoReducer from './slices/pontoSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    ponto: pontoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
export const useAppDispatch = () => useDispatch<AppDispatch>()