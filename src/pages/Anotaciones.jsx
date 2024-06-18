import "./styles/showTable.scss";

import { Link } from "react-router-dom";
import ShowAnot from "../components/anotaciones/ShowAnot";

export default function Anotaciones() {
  return (
    <div className="table-container">
      <div className="show-header">
        <Link to="/anotaciones/create" className="createButton">
          <i className="bx bx-plus-circle"></i>
          <span>Crear Anotación</span>
        </Link>
      </div>
      <ShowAnot />
    </div>
  );
}
