import { useNavigate } from "react-router-dom";
import "./styles/pageHeader.css";

export function PageHeader({ title, label }) {
  const navigate = useNavigate();
  return (
    <div className="head-title">
      <div className="left">
        <div className="left-up">
          {(label.includes("Crear") || label.includes("Editar")) && (
            <button onClick={() => navigate(-1)}>
              <i className="bx bx-arrow-back"></i>
            </button>
          )}
          <h1>{label}</h1>
        </div>
        <ul className="breadcrumb">
          <li>
            <a href="../">{title}</a>
          </li>
          <li>
            <i className="bx bx-chevron-right"></i>
          </li>
          <li>
            <a className="active" href="#">
              {label}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
