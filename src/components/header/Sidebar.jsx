import PropTypes from "prop-types"; // Importa PropTypes
import { Link } from "react-router-dom";
import "./styles/sidebar.css";
import { SidebarItem } from "./SidebarItem";
import { useState } from "react";

export function Sidebar({ isSidebarHidden }) {
  const [activeItem, setActiveItem] = useState(0);
  const items = [
    { link: "/", icon: "bx bxs-dashboard", text: "Panel de control" },
    {
      link: "/cursos",
      icon: "bx bxs-shopping-bag-alt",
      text: "Cursos",
    },
    {
      link: "/tareas",
      icon: "bx bxs-doughnut-chart",
      text: "Tareas",
    },
    {
      link: "/anotaciones",
      icon: "bx bxs-message-dots",
      text: "Anotaciones",
    },
    {
      link: "/citaciones",
      icon: "bx bxs-group",
      text: "Citaciones",
    },
    {
      link: "/usuarios",
      icon: "bx bxs-group",
      text: "Usuarios",
    },
  ];

  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  return (
    <section id="sidebar" className={isSidebarHidden ? "hide" : ""}>
      <Link to={"/"} className="brand">
        <i className="bx bxs-smile"></i>
        <span className="text">Agenda Digital</span>
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
          item={{ link: "", icon: "bx bxs-log-out-circle", text: "Logout" }}
          isActive={false}
          onClick={() => {}}
        />
      </ul>
    </section>
  );
}

// Define PropTypes para Sidebar
Sidebar.propTypes = {
  isSidebarHidden: PropTypes.bool.isRequired, // Asegura que isSidebarHidden sea un booleano requerido
};
