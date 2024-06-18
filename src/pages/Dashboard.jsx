import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./styles/dashboard.css";

// eslint-disable-next-line no-unused-vars
import { SidebarItem } from "../components/header/SidebarItem";

// eslint-disable-next-line no-unused-vars
export default function Dashboard({ isSidebarHidden, onLogout }) {
  const items = [
    { link: "/cursos", icon: "bx bxs-shopping-bag-alt", text: "Cursos" },
    { link: "/tareas", icon: "bx bxs-doughnut-chart", text: "Tareas" },
    { link: "/anotaciones", icon: "bx bxs-message-dots", text: "Anotaciones" },
    { link: "/citaciones", icon: "bx bxs-group", text: "Citaciones" },
    { link: "/Estudiantes", icon: "bx bxs-group", text: "Gestion de Estudiantes" },
    { link: "/Padres", icon: "bx bxs-group", text: "Gestion de Padres" },
    { link: "/Profesores", icon: "bx bxs-group", text: "Gestion de Profesores" },
  ];

  return (
    <main>
      <div className="dashboard-content">
        {/* Contenido del dashboard */}
        <h1>Bienvenido al Panel de Control</h1>
        <p>Selecciona una opción del menú para comenzar.</p>
      </div>
      <div className="dashboard-container">
        {items.map((item, index) => (
          <Link to={item.link} key={index} className="dashboard-item">
            <div className="dashboard-icon">
              <i className={item.icon}></i>
            </div>
            <div className="dashboard-text">{item.text}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}

// Define PropTypes para Dashboard
Dashboard.propTypes = {
  isSidebarHidden: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};
