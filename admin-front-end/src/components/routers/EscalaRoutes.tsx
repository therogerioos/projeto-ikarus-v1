// EscalaRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { EscalaTab } from "../tabs/EscalaTab";
import { EscalaIndividualSubTab } from "../tabs/EscalaIndividualSubTab";
import { EscalaGeralSubTab } from "../tabs/EscalaGeralSubTab";

export function EscalaRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EscalaTab />}>
        <Route path="individual" element={<EscalaIndividualSubTab />} />
        <Route path="geral" element={<EscalaGeralSubTab />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
