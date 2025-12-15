import { Routes, Route, Navigate } from "react-router-dom";
import { FolhaTab } from "../tabs/FolhaTab";
import { FolhaExtratoGeralSubTab } from "../tabs/FolhaExtratoGeralSubTab";
import { FolhaIndividualSubTab } from "../tabs/FolhaIndividualSubTab";


export function FolhaRoutes() {
    return(
        <Routes>
            <Route path="/" element={<FolhaTab />}>
                <Route path="extrato" element={<FolhaExtratoGeralSubTab />} />
                <Route path="individual" element={<FolhaIndividualSubTab />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};