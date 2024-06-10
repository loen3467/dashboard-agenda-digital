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
    const tareasWithCurso = await Promise.all(
      data.docs.map(async (docSnapshot) => {
        const tareaData = docSnapshot.data();
        const cursoRef = tareaData.id_curso;
        let cursoData = null;

        if (cursoRef) {
          const cursoDoc = await getDoc(cursoRef);
          if (cursoDoc.exists()) {
            cursoData = cursoDoc.data();
          }
        }

        return { ...tareaData, id: docSnapshot.id, id_curso: cursoData };
      })
    );
    setTareas(tareasWithCurso);
  };

  const toggleTarea = async (id, activo) => {
    const tareaDoc = doc(db, "tareas", id);
    await updateDoc(tareaDoc, {
      activo: !activo,
    });
    getTareas();
  };

  const confirmToggle = (id, activo) => {
    MySwal.fire({
      title: activo ? "¿Desactivar la tarea?" : "¿Activar la tarea?",
      text: "¡Podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: activo ? "#d33" : "#5cb85c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: activo ? "¡Sí, desactivar!" : "¡Sí, activar!",
    }).then((result) => {
      if (result.isConfirmed) {
        toggleTarea(id, activo);
        MySwal.fire(
          activo ? "Desactivado!" : "Activado!",
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
            <th>Fecha de entrega</th>
            <th>Cursos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr
              key={tarea.id}
              className={tarea.activo ? styles.activeRow : styles.inactiveRow}
            >
              <td>{tarea.titulo}</td>
              <td>{tarea.descripcion}</td>
              <td>{tarea.fecha_entrega}</td>
              <td>{tarea.id_curso && tarea.id_curso.nombre}</td>
              <td className="actions">
                <Link
                  to={`/tareas/edit/${tarea.id}`}
                  className={styles.editButton}
                >
                  <i className="bx bx-edit"></i> <span>Editar</span>
                </Link>
                <button
                  onClick={() => {
                    confirmToggle(tarea.id, tarea.activo);
                  }}
                  className={`${styles.toggleButton} ${
                    !tarea.activo ? styles.btnActive : ""
                  }`}
                >
                  {tarea.activo ? (
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
