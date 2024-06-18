import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { PageHeader } from "./PageHeader";

const MySwal = withReactContent(Swal);

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUserName(user.displayName);
          console.log(user.displayName);
        } else {
          setUserName("");
          navigate("/login");
        }
      }),
    []
  );
  const logOut = () => {
    auth.signOut();
    navigate("/login");
  };

  const handleLogout = () => {
    MySwal.fire({
      title: "¿Estás seguro de cerrar sesión?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, cerrar sesión!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut();
        MySwal.fire("¡Cerrado!", "Tu sesión ha sido cerrada.", "success");
      }
    });
  };

  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const toogleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  const [title, setTitle] = useState("Panel De Control");
  const [label, setLabel] = useState("Inicio");
  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setTitle("Panel De Control");
        setLabel("Inicio");
        break;
      case "/cursos":
        setTitle("Cursos");
        setLabel("Ver Cursos");
        break;
      case "/cursos/create":
        setLabel("Crear Curso");
        break;

      case "/tareas":
        setTitle("Tareas");
        setLabel("Ver Tareas");
        break;
      case "/tareas/create":
        setLabel("Crear Tarea");
        break;
      case "/anotaciones":
        setTitle("Anotaciones");
        setLabel("Ver Anotaciones");
        break;
      case "/anotaciones/create":
        setLabel("Crear Anotación");
        break;
      case "/citaciones":
        setTitle("Citaciones");
        setLabel("Ver Citaciones");
        break;
      case "/citaciones/create":
        setLabel("Crear Citación");
        break;

      default:
        setLabel("Editar");
    }
  }, [location.pathname]);
  return (
    <>
      <Sidebar isSidebarHidden={isSidebarHidden} onLogout={handleLogout} />
      <section id="content">
        <Navbar toogleSidebar={toogleSidebar} />
        <main>
          <PageHeader title={title} label={label} />
          <Outlet />
        </main>
      </section>
    </>
  );
}
