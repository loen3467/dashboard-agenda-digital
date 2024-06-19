import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../components/header/Layout";
import { Estudiantes } from "../components/usuarios/Estudiantes";
import { Padres } from "../components/usuarios/Padres";
import { Profesores } from "../components/usuarios/Profesores";
import Cursos from "../pages/Cursos";
import Materias from "../pages/Materias";
import Tareas from "../pages/Tareas";
import Anotaciones from "../pages/Anotaciones";
import Citaciones from "../pages/Citaciones";
import Usuarios from "../pages/Usuarios";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import CreateTareas from "../components/tareas/CreateTareas";
import EditTareas from "../components/tareas/EditTareas";
import CreateAnot from "../components/anotaciones/CreateAnot";
import EditAnot from "../components/anotaciones/EditAnot";
import CreateCurso from "../components/cursos/CreateCurso";
import EditCurso from "../components/cursos/EditCurso";
import CreateMateria from "../components/materias/CreateMateria";
import EditMateria from "../components/materias/EditMateria";

export function MyRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/create" element={<CreateCurso />} />
          <Route path="/cursos/edit/:id" element={<EditCurso />} />
          <Route path="/materias" element={<Materias />} />
          <Route path="/materias/create" element={<CreateMateria />} />
          <Route path="/materias/edit/:id" element={<EditMateria />} />
          <Route path="/tareas" element={<Tareas />} />
          <Route path="/tareas/create" element={<CreateTareas />} />
          <Route path="/tareas/edit/:id" element={<EditTareas />} />
          <Route path="/anotaciones" element={<Anotaciones />} />
          <Route path="/anotaciones/create" element={<CreateAnot />} />
          <Route path="/anotaciones/edit/:id" element={<EditAnot />} />
          <Route path="/citaciones" element={<Citaciones />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/Estudiantes" element={<Estudiantes />} />
          <Route path="/Padres" element={<Padres />} />
          <Route path="/Profesores" element={<Profesores />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
