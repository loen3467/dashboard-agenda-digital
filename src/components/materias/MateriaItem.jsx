import "../styles/materiasCursos.scss";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export function MateriaItem({ materia, onToggleStatus }) {
  const { id, nombre, cursoNombre, profesorNombre, activa } = materia;

  const handleToggleStatus = () => {
    const newStatus = !activa;
    Swal.fire({
      title: `¿Estás seguro de ${
        newStatus ? "activar" : "desactivar"
      } esta materia?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onToggleStatus(id, newStatus);
        Swal.fire(
          `¡Materia ${newStatus ? "activada" : "desactivada"}!`,
          "",
          "success"
        );
      }
    });
  };

  return (
    <div className={`materia-item ${!activa && "activo"}`}>
      <h2>{nombre}</h2>
      <p>Curso: {cursoNombre}</p>
      <p>Profesor: {profesorNombre}</p>
      <p>Estado: {activa ? "Activa" : "Inactiva"}</p>
      <div className="actions">
        <Link to={`/materias/edit/${id}`} className="edit-link">
          Editar Materia
        </Link>
        <button
          onClick={handleToggleStatus}
          className={`status-button ${!activa && "activo"}`}
        >
          {activa ? "Desactivar" : "Activar"}
        </button>
      </div>
    </div>
  );
}
