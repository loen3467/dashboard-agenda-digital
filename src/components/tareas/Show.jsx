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
import styles from "./styles/show.module.css";

const MySwal = withReactContent(Swal);

export default function Show() {
  const [tareas, setTareas] = useState([]);

  const tareasCollection = collection(db, "tareas");
  const getTareas = async () => {
    const data = await getDocs(tareasCollection);
    const tareasWithMaterias = await Promise.all(
      data.docs.map(async (docSnapshot) => {
        const tareaData = docSnapshot.data();
        const tareaRef = tareaData.idmateria;
        let materiaData = null;

        if (tareaRef) {
          const materiaDoc = await getDoc(tareaRef);
          if (materiaDoc.exists()) {
            materiaData = materiaDoc.data();
          }
        }

        return { ...tareaData, id: docSnapshot.id, idmateria: materiaData };
      })
    );
    setTareas(tareasWithMaterias);
  };

  const toggleTarea = async (id, estado) => {
    const tareaDoc = doc(db, "tareas", id);
    await updateDoc(tareaDoc, {
      estado: !estado,
    });
    getTareas();
  };

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

  useEffect(() => {
    getTareas();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tareas</h1>
        <Link to="/tareas/create" className={styles.createButton}>
          <i className="bx bx-plus-circle"></i>
          <span>Crear Tarea</span>
        </Link>
      </div>
      <table className={styles.table}>
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
              className={tarea.estado ? styles.activeRow : styles.inactiveRow}
            >
              <td>{tarea.titulo}</td>
              <td>{tarea.descripcion}</td>
              <td>{tarea.fecha_creacion}</td>
              <td>{tarea.fecha_entrega}</td>
              <td>{tarea.idmateria && tarea.idmateria.nombre}</td>
              <td className="actions">
                <Link
                  to={`/tareas/edit/${tarea.id}`}
                  className={styles.editButton}
                >
                  <i className="bx bx-edit"></i> <span>Editar</span>
                </Link>
                <button
                  onClick={() => {
                    confirmToggle(tarea.id, tarea.estado);
                  }}
                  className={`${styles.toggleButton} ${
                    !tarea.estado ? styles.btnActive : ""
                  }`}
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
    </div>
  );
}
