import { Routes, Route } from "react-router-dom";
import { Cursos } from "../pages/Cursos";
import { Tareas } from "../pages/Tareas";
import { Anotaciones } from "../pages/Anotaciones";
import { Citaciones } from "../pages/Citaciones";
import { Usuarios } from "../pages/Usuarios";
import { Dashboard } from "../pages/Dashboard";
export function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/Cursos" element={<Cursos />}></Route>
      <Route path="/Tareas" element={<Tareas />}></Route>
      <Route path="/Anotaciones" element={<Anotaciones />}></Route>
      <Route path="/Citaciones" element={<Citaciones />}></Route>
      <Route path="/Usuarios" element={<Usuarios />}></Route>
    </Routes>
  );
}