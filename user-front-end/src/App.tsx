// Authentication Pages
import Login from '../src/pages/autenticador/Login';
import ForgotPassword from '../src/pages/autenticador/RecuperarSenha';

// Components
import PrivateRoute from '../src/components/routers/PrivateRoute';
import { AuthLayout } from '../src/components/layouts/AuthLayout';


import { Toaster } from 'sonner'
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Folha from "./pages/Folha";
import NotFound from "./pages/NotFound";
import { AuthProvider } from './components/routers/AuthContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
      <Toaster richColors expand={true} position="bottom-right"/>
      <BrowserRouter>
        <Routes>
            {/* Routes para páginas de autenticação */}
          <Route path="login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
            {/* Private routes (somente acessíveis se o usuário estiver autenticado) */}
          <Route path="/" element={<PrivateRoute element={<Layout><Outlet /></Layout>} />}>
            <Route index element={<Index />} />
            <Route path="folha" element={<Folha />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
