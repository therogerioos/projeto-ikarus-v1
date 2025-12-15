
import { useEffect, useState } from "react";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { FolhaIndividualSubTab } from "./FolhaIndividualSubTab";
import { FolhaExtratoGeralSubTab } from "./FolhaExtratoGeralSubTab";
import { FileText, FileUser } from "lucide-react";


export function FolhaTab() {
    const [selectIndividual, setSelectIndividual] = useState(false);
    const [selectGeral, setSelectGeral] = useState(false);
    const navigate = useNavigate();
    
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/folha") {
        setSelectIndividual(false);
        setSelectGeral(false);
        }
    }, [location.pathname]);

    const handleSelectIndividual = () => {
        navigate("individual");
        setSelectIndividual(true);
        setSelectGeral(false);
    }

    const handleSelectGeral = () => {
        navigate("extrato");
        setSelectGeral(true);
        setSelectIndividual(false);
    }


  if (selectIndividual) return <FolhaIndividualSubTab />;
  if (selectGeral) return <FolhaExtratoGeralSubTab />;

  return (
    <div className="flex justify-center items-center">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-200 border-white shadow-card w-90 h-60">
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <CardTitle className="flex flex-col items-center text-2xl pb-2">
                        <FileUser className="h-15 w-15 text-primary mr-2 mt-[1px] mb-3" />
                        Folha de Trabalho Individual
                    </CardTitle>
                    <CardDescription>
                        Gerencie a folha de ponto dos funcionários.
                    </CardDescription>
                    <div className="space-y-2 mt-4">
                        <Button variant="primary" size="base" onClick={handleSelectIndividual}>
                            Acessar
                        </Button>
                    </div>
                </div>
            </Card>
            <Card className="bg-gray-200 border-white shadow-card w-90 h-60">
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <CardTitle className="flex flex-col items-center text-2xl pb-2">
                        <FileText className="h-15 w-15 text-primary mr-2 mt-[1px] mb-3" />
                        Extrato da Folha de Ponto
                    </CardTitle>
                    <CardDescription>
                        Visualize o extrato da folha de ponto dos funcionários.
                    </CardDescription>
                    <div className="space-y-2 mt-4">
                        <Button variant="primary" size="base" onClick={handleSelectGeral}>
                            Acessar
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    </div>
  );
}