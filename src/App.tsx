import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SallePage from "./pages/SallePage";
import FilierePage from "./pages/FilierePage";
import EnseignantPage from "./pages/EnseignantPage";
import CoursPage from "./pages/CoursPage";
import SemestrePage from "./pages/SemestrePage";
import EmploiPage from "./pages/EmploiPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<Layout />}>
        <Route path="/salles" element={<SallePage />} />
        <Route path="/filiere" element={<FilierePage />} />
        <Route path="/enseignant" element={<EnseignantPage />} />
        <Route path="/cours" element={<CoursPage />} />
        <Route path="/semestre" element={<SemestrePage />} />
        <Route path="/emplois" element={<EmploiPage />} />
      </Route>
    </Routes>
  );
}

export default App;