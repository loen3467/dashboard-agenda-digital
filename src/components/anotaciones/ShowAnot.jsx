import { useEffect } from "react";
import { Loader } from "../../utils/Loader";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAnotaciones } from "../../context/AnotacionesContext";
const MySwal = withReactContent(Swal);

export default function ShowAnot() {
  const { anotaciones, loading, getAnotaciones, toggleAnotacion } =
    useAnotaciones();

  useEffect(() => {
    if (anotaciones.length === 0) {
      getAnotaciones();
    }
  }, []);

  const confirmToggle = (id, estado) => {
    MySwal.fire({
      title: estado ? "¿Desactivar la anotación?" : "¿Activar la anotación?",
      text: "¡Podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: estado ? "#d33" : "#5cb85c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: estado ? "¡Sí, desactivar!" : "¡Sí, activar!",
    }).then((result) => {
      if (result.isConfirmed) {
        toggleAnotacion(id, estado);
        MySwal.fire(
          estado ? "Desactivado!" : "Activado!",
          "La anotación ha sido modificada.",
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
          <th>Estudiante</th>
          <th>Profesor</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {anotaciones.map((anotacion) => (
          <tr
            key={anotacion.id}
            className={anotacion.estado ? "activeRow" : "inactiveRow"}
          >
            <td>{anotacion.titulo}</td>
            <td>{anotacion.descripcion}</td>
            <td>{anotacion.estudiante && anotacion.estudiante.nombre}</td>
            <td>{anotacion.profesor && anotacion.profesor.nombre}</td>
            <td className="actions">
              <Link
                to={`/anotaciones/edit/${anotacion.id}`}
                className="editButton"
              >
                <i className="bx bx-edit"></i> <span>Editar</span>
              </Link>
              <button
                onClick={() => {
                  confirmToggle(anotacion.id, anotacion.estado);
                }}
                className={`toggleButton ${
                  !anotacion.estado ? "btnActive" : ""
                }`}
              >
                {anotacion.estado ? (
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
