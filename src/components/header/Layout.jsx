import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function Layout() {
  const navigate = useNavigate();
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
  return (
    <>
      <Sidebar isSidebarHidden={isSidebarHidden} onLogout={handleLogout} />
      <section id="content">
        <Navbar toogleSidebar={toogleSidebar} />
        <Outlet />
      </section>
    </>
  );
}
