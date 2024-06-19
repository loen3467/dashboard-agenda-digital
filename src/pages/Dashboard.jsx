import { Link } from "react-router-dom";
import "./styles/dashboard.css";
import { items } from "../components/header/Sidebar";
const newItems = [...items];

export default function Dashboard() {
  return (
    <main>
      <div className="dashboard-content">
        {/* Contenido del dashboard */}
        <h1>Bienvenido al Panel de Control</h1>
        <p>Selecciona una opción del menú para comenzar.</p>
      </div>
      <div className="dashboard-container">
        {newItems.map((item, index) => (
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
