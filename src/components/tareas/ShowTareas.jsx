import { useEffect } from "react";
import { Loader } from "../../utils/Loader";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useTareas } from "../../context/TareasContext";
const MySwal = withReactContent(Swal);

export default function ShowTareas() {
  const { tareas, loading, getTareas, toggleTarea } = useTareas();
  useEffect(() => {
    if (tareas.length === 0) {
      getTareas();
    }
  }, []);

  const confirmToggle = (id, estado) => {
    MySwal.fire({
      title: estado ? "¿Desactivar la tarea?" : "¿Activar la tarea?",
      text: "¡Podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: estado ? "#d33" : "#5cb85c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: estado ? "¡Sí, desactivar!" : "¡Sí, activar!",
    }).then((result) => {
      if (result.isConfirmed) {
        toggleTarea(id, estado);
        MySwal.fire(
          estado ? "Desactivado!" : "Activado!",
          "La tarea ha sido modificada.",
          "success"
        );
      }
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Fecha de creación</th>
          <th>Fecha de entrega</th>
          <th>Materia</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {tareas.map((tarea) => (
          <tr
            key={tarea.id}
            className={tarea.estado ? "activeRow" : "inactiveRow"}
          >
            <td>{tarea.titulo}</td>
            <td>{tarea.descripcion}</td>
            <td>{tarea.fecha_creacion}</td>
            <td>{tarea.fecha_entrega}</td>
            <td>{tarea.idmateria && tarea.idmateria.nombre}</td>
            <td className="actions">
              <Link to={`/tareas/edit/${tarea.id}`} className="editButton">
                <i className="bx bx-edit"></i> <span>Editar</span>
              </Link>
              <button
                onClick={() => {
                  confirmToggle(tarea.id, tarea.estado);
                }}
                className={`toggleButton ${!tarea.estado ? "btnActive" : ""}`}
              >
                {tarea.estado ? (
                  <>
                    <i className="bx bxs-toggle-right"></i>
                    <span>Desactivar</span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-toggle-left"></i>
                    <span>Activar</span>
                  </>
                )}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
