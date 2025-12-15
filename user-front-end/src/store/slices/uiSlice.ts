import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  darkMode: boolean;
  sidebarOpen: boolean;
  isLoadingRedux: boolean;
}

const initialState: UiState = {
  darkMode: localStorage.getItem('darkMode') === 'true' ? true : false,
  sidebarOpen: localStorage.getItem('menuVisible') === 'true' ? true : false,
  isLoadingRedux: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoadingTrue: (state) => {
      state.isLoadingRedux = true;
    },
    setLoadingFalse: (state) => {
      state.isLoadingRedux = false;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setDarkModeToogle(state, action) {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', String(action.payload));
    },
    setMenuVisibleToogle(state, action) {
      state.sidebarOpen = action.payload;
      localStorage.setItem('menuVisible', String(action.payload));
    },
  },
});

export const { setLoadingTrue, setLoadingFalse, toggleDarkMode, toggleSidebar, setDarkModeToogle, setMenuVisibleToogle  } = uiSlice.actions;

export default uiSlice.reducer;