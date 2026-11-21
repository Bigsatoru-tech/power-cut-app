import { Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage";
import SkillSwapPage from "./pages/SkillSwapPage";
import SkillDetail from "./pages/SkillDetail";
import OfferSkill from "./pages/OfferSkill";
import DirectMessage from "./pages/DirectMessage";
import LocationGate from "./components/LocationGate";
import WalletPage from "./pages/WalletPage";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <LocationGate>
      <Navbar />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/skills" element={<SkillSwapPage />} />
        <Route path="/skills/offer" element={<OfferSkill />} />
        <Route path="/skills/:id" element={<SkillDetail />} />
        <Route path="/dm/:userId" element={<DirectMessage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </LocationGate>
  );
}
