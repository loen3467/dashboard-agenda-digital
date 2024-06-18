import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function ShowAnot() {
  const [anotaciones, setAnotaciones] = useState([]);

  const anotacionesCollection = collection(db, "anotaciones");
  const getAnotaciones = async () => {
    const data = await getDocs(anotacionesCollection);
    const anotacionesWithEstudiantesProfesores = await Promise.all(
      data.docs.map(async (docSnapshot) => {
        const anotacionData = docSnapshot.data();
        const estudianteRef = anotacionData.id_est;
        const profesorRef = anotacionData.id_profesor;
        let estudianteData = null;
        let profesorData = null;

        if (estudianteRef) {
          const estudianteDoc = await getDoc(estudianteRef);
          if (estudianteDoc.exists()) {
            estudianteData = estudianteDoc.data();
          }
        }

        if (profesorRef) {
          const profesorDoc = await getDoc(profesorRef);
          if (profesorDoc.exists()) {
            profesorData = profesorDoc.data();
          }
        }

        return {
          ...anotacionData,
          id: docSnapshot.id,
          estudiante: estudianteData,
          profesor: profesorData,
        };
      })
    );
    setAnotaciones(anotacionesWithEstudiantesProfesores);
  };

  const toggleAnotacion = async (id, estado) => {
    const anotacionDoc = doc(db, "anotaciones", id);
    await updateDoc(anotacionDoc, {
      estado: !estado,
    });
    getAnotaciones();
  };

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

  useEffect(() => {
    getAnotaciones();
  }, []);

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
