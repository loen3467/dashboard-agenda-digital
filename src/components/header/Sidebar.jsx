import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types"; // Importa PropTypes
import "./styles/sidebar.css";
import { SidebarItem } from "./SidebarItem";
import { useEffect, useState } from "react";
import logoImage from "../.././assets/images/logo_agenda_dig1.png"; // Asegúrate de ajustar la ruta según donde tengas la imagen

export function Sidebar({ isSidebarHidden, onLogout }) {
  const [activeItem, setActiveItem] = useState(0);
  const location = useLocation();

  const items = [
    { link: "/", icon: "bx bxs-dashboard", text: "Panel de Control" },
    { link: "/cursos", icon: "bx bxs-shopping-bag-alt", text: "Cursos" },
    { link: "/tareas", icon: "bx bxs-doughnut-chart", text: "Tareas" },
    { link: "/anotaciones", icon: "bx bxs-message-dots", text: "Anotaciones" },
    { link: "/citaciones", icon: "bx bxs-group", text: "Citaciones" },
    {
      link: "/Estudiantes",
      icon: "bx bxs-group",
      text: "Gestion de Estudiantes",
    },
    { link: "/Padres", icon: "bx bxs-group", text: "Gestion de Padres" },
    {
      link: "/Profesores",
      icon: "bx bxs-group",
      text: "Gestion de Profesores",
    },
  ];

  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const activeIndex = items.findIndex((item) => item.link === currentPath);
    if (activeIndex !== -1) {
      setActiveItem(activeIndex);
    }
  }, [location.pathname, items]);

  return (
    <section id="sidebar" className={isSidebarHidden ? "hide" : ""}>
      <Link to="/" className="brand">
        <img
          src={logoImage}
          alt="MobiQuick Logo"
          className="logo-image"
          width={80}
        />
      </Link>
      <ul className="side-menu top">
        {items.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            isActive={activeItem === index}
            onClick={() => handleItemClick(index)}
          />
        ))}
      </ul>
      <ul className="side-menu">
        <SidebarItem
          item={{ link: "", icon: "bx bxs-cog", text: "Settings" }}
          isActive={false}
          onClick={() => {}}
        />
        <SidebarItem
          item={{
            link: "",
            icon: "bx bxs-log-out-circle",
            text: "Cerrar Sesión",
          }}
          isActive={false}
          onClick={onLogout}
        />
      </ul>
    </section>
  );
}

// Define PropTypes para Sidebar
Sidebar.propTypes = {
  isSidebarHidden: PropTypes.bool.isRequired, // Asegura que isSidebarHidden sea un booleano requerido
  onLogout: PropTypes.func.isRequired, // Asegura que onLogout sea una función requerida
};
