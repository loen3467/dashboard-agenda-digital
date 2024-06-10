import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./styles/edit.module.css";

export function Edit() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const update = async (e) => {
    e.preventDefault();
    const tarea = doc(db, "tareas", id);
    const data = {
      titulo: titulo,
      descripcion: descripcion,
      fecha_entrega: fechaEntrega,
    };
    await updateDoc(tarea, data);
    navigate("/tareas");
  };

  const getTareaById = async (id) => {
    const tarea = await getDoc(doc(db, "tareas", id));
    if (tarea.exists()) {
      //console.log(tarea.data())
      setTitulo(tarea.data().titulo);
      setDescripcion(tarea.data().descripcion);
      setFechaEntrega(tarea.data().fecha_entrega);
    } else {
      console.log("La tarea no existe");
    }
  };

  useEffect(() => {
    getTareaById(id);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <h1>Edit tarea</h1>
          <form onSubmit={update}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Título</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                type="text"
                className={styles.formControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Descripción</label>
              <input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                type="text"
                className={styles.formControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Fecha de Entrega</label>
              <input
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                type="date"
                className={styles.formControl}
              />
            </div>
            <button type="submit" className={styles.btnPrimary}>
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
