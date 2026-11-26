import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LineupPage from "./pages/LineupPage";
import StudioPage from "./pages/StudioPage";
import ReplayPage from "./pages/ReplayPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/d/:id/lineup" element={<LineupPage />} />
      <Route path="/d/:id/studio" element={<StudioPage />} />
      <Route path="/d/:id/replay" element={<ReplayPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
