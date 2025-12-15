
import { User, Users } from "lucide-react";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { EscalaIndividualSubTab } from "./EscalaIndividualSubTab";
import { EscalaGeralSubTab } from "./EscalaGeralSubTab";
import { useNavigate } from "react-router-dom";

export function EscalaTab() {

    const [selectIndividual, setSelectIndividual] = useState(false);
    const [selectGeral, setSelectGeral] = useState(false);
    const navigate = useNavigate();
    
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/escala") {
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
        navigate("geral");
        setSelectGeral(true);
        setSelectIndividual(false);
    }


  if (selectIndividual) return <EscalaIndividualSubTab />;
  if (selectGeral) return <EscalaGeralSubTab />;

  return (
    <div className="flex justify-center items-center">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-200 border-white shadow-card w-90 h-60">
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <CardTitle className="flex flex-col items-center text-2xl pb-2">
                        <User className="h-15 w-15 text-primary mr-2 mt-[1px] mb-3" />
                        Escala de Trabalho Individual
                    </CardTitle>
                    <CardDescription>
                        Gerencie as escalas individuais dos colaboradores
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
                        <Users className="h-15 w-15 text-primary mr-2 mt-[1px] mb-3" />
                        Escala de Trabalho Geral
                    </CardTitle>
                    <CardDescription>
                        Gerencie as escalas dos colaboradores
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
};