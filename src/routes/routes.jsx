import React, { Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../components/header/Layout";
import { Loader } from "../utils/Loader";
import { Estudiantes } from "../components/usuarios/Estudiante";
import { Padres } from "../components/usuarios/Padre";
import {Profesores} from "../components/usuarios/Profesores";

const Cursos = React.lazy(() => import("../pages/Cursos"));
const Tareas = React.lazy(() => import("../pages/Tareas"));
const Anotaciones = React.lazy(() => import("../pages/Anotaciones"));
const Citaciones = React.lazy(() => import("../pages/Citaciones"));
const Usuarios = React.lazy(() => import("../pages/Usuarios"));
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Login = React.lazy(() => import("../pages/Login"));


const CreateTareas = React.lazy(() =>
  import("../components/tareas/CreateTareas")
);
const EditTareas = React.lazy(() => import("../components/tareas/EditTareas"));
const CreateAnot = React.lazy(() =>
  import("../components/anotaciones/CreateAnot")
);
const EditAnot = React.lazy(() => import("../components/anotaciones/EditAnot"));
const CreateCourses = React.lazy(() =>
  import("../components/cursos/CreateCourses")
);
const EditCourses = React.lazy(() =>
  import("../components/cursos/EditCourses")
);
export function MyRoutes() {
  const routes = useMemo(
    () => (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/create" element={<CreateCourses />} />
          <Route path="/cursos/edit/:id" element={<EditCourses />} />
          <Route path="/tareas" element={<Tareas />} />
          <Route path="/tareas/create" element={<CreateTareas />} />
          <Route path="/tareas/edit/:id" element={<EditTareas />} />

          <Route path="/anotaciones" element={<Anotaciones />} />
          <Route path="/anotaciones/create" element={<CreateAnot />} />
          <Route path="/anotaciones/edit/:id" element={<EditAnot />} />
          <Route path="/citaciones" element={<Citaciones />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/Estudiantes" element={<Estudiantes />}></Route>
          <Route path="/Padres" element={<Padres />}></Route>
          <Route path="/Profesores" element={<Profesores />}></Route>
        </Route>
      </Routes>
    ),
    []
  );

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>{routes}</Suspense>
    </BrowserRouter>
  );
}
