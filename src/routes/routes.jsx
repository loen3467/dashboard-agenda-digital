import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Cursos } from "../pages/Cursos";
import { Tareas } from "../pages/Tareas";
import { Anotaciones } from "../pages/Anotaciones";
import { Citaciones } from "../pages/Citaciones";
import { Usuarios } from "../pages/Usuarios";
import { Dashboard } from "../pages/Dashboard";
import { Layout } from "../components/header/Layout";
import { Create } from "../components/tareas/Create";
import { Edit } from "../components/tareas/Edit";
import { Login } from "../pages/Login";
export function MyRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/cursos" element={<Cursos />}></Route>
          <Route path="/tareas" element={<Tareas />}></Route>
          <Route path="/tareas/create" element={<Create />}></Route>
          <Route path="/tareas/edit/:id" element={<Edit />}></Route>
          <Route path="/anotaciones" element={<Anotaciones />}></Route>
          <Route path="/citaciones" element={<Citaciones />}></Route>
          <Route path="/usuarios" element={<Usuarios />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
