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
      <Route path="/cursos" element={<Cursos />}></Route>
      <Route path="/tareas" element={<Tareas />}></Route>
      <Route path="/anotaciones" element={<Anotaciones />}></Route>
      <Route path="/citaciones" element={<Citaciones />}></Route>
      <Route path="/Usuarios" element={<Usuarios />}></Route>
    </Routes>
  );
}
