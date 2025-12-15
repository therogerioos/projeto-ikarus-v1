import React, { useState, useEffect } from "react";
import { Key, User } from "lucide-react";
import { changePassword } from "../../lib/api";
import { MyToast } from "../../components/ui/toast-sonner";

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [senhaProvisoria, setSenhaProvisoria] = useState<string>("");
  const [novaSenha, setNovaSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  // Estados para controle de erros
  const [erroSenha, setErroSenha] = useState<string | null>(null);
  const [erroConfirmarSenha, setErroConfirmarSenha] = useState<string | null>(null);

  // Validação da senha
  useEffect(() => {
    const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!novaSenha) {
      setErroSenha(null);
      return;
    }

    if (!regexSenha.test(novaSenha)) {
      setErroSenha(
        "Senha fora da política de segurança"
      );
    } else {
      setErroSenha(null);
    }
  }, [novaSenha]);

  // Validação da confirmação da senha
  useEffect(() => {
    if (!confirmarSenha) {
      setErroConfirmarSenha(null);
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErroConfirmarSenha("As senhas não coincidem");
    } else {
      setErroConfirmarSenha(null);
    }
  }, [novaSenha, confirmarSenha]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se tiver erro, não enviar
    if (erroSenha || erroConfirmarSenha) {
      MyToast({ type: "error", message: `Erro ao tentar alterar a senha: Corrija os erros antes de enviar.` });
      return;
    }

    try {
      const data = await changePassword(username, senhaProvisoria, novaSenha);
      if (data.message === "Senha alterada com sucesso.") {
        MyToast({ type: "success", message: 'Senha alterada com sucesso!' });
        window.location.href = "/login";
      } else {
        MyToast({ type: "error", message: "Erro ao alterar a senha: " + data.error });
      }
    } catch (error: any) {
      MyToast({ type: "error", message: "Erro ao tentar alterar a senha. Tente novamente!:" + error.message });
    }
  };

  // Classe para input com erro
  const inputClass =
    "w-full bg-white/5 border rounded-lg px-10 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white/20";

  const inputClassErro = 
    "w-full bg-white/5 border border-purple-900 rounded-lg px-10 py-3 text-white placeholder-white/60 focus:outline-none focus:border-purple-700";

  return (
    <>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Redefinir senha</h1>
          <p className="text-white/80">
            Realize a troca da senha de acesso. 
          </p>
          <p className="text-white/80">
            Política de senha: mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative mb-6">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-5 w-5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(normalizeUsername(e.target.value))}
              placeholder="Username"
              className={inputClass}
            />
          </div>
          <div className="relative mb-6">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-5 w-5" />
            <input
              type="text"
              value={senhaProvisoria}
              onChange={(e) => setSenhaProvisoria(e.target.value)}
              placeholder="Senha Provisória"
              className={inputClass}
            />
          </div>
          <div className="relative mb-6">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-5 w-5" />
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Nova Senha"
              className={erroSenha ? inputClassErro : inputClass}
            />
            <p className="h-1 text-pink-100 text-sm ">
                {erroSenha || "\u00A0" /* &nbsp; para manter espaço quando vazio */}
            </p>
          </div>

          <div className="relative mb-6">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-5 w-5" />
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirmar Nova Senha"
              className={erroConfirmarSenha ? inputClassErro : inputClass}
            />
            <p className="h-1 text-pink-100 text-sm ">
                {erroConfirmarSenha || "\u00A0" /* &nbsp; para manter espaço quando vazio */}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-[#161E42] rounded-lg py-3 font-semibold hover:bg-white/90 cursor-pointer active:scale-95 transition-transform duration-150 ease-in-out"
          >
            Enviar
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
