import "./styles/showTable.scss";
import { Link } from "react-router-dom";
import ShowTareas from "../components/tareas/ShowTareas";

export default function Tareas() {
  return (
    <div className="table-container">
      <div className="show-header">
        <Link to="/tareas/create" className="createButton">
          <i className="bx bx-plus-circle"></i>
          <span>Crear Tarea</span>
        </Link>
      </div>
      <ShowTareas />
    </div>
  );
}
