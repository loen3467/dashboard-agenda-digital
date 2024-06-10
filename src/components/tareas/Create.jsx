import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./styles/create.module.css";

export function Create() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState(0);
  const [fechaEntrega, setFechaEntrega] = useState("");
  const navigate = useNavigate();

  const tareasCollection = collection(db, "tareas");

  const editar = async (e) => {
    e.preventDefault();
    await addDoc(tareasCollection, {
      titulo: titulo,
      descripcion: descripcion,
      fecha_entrega: fechaEntrega,
    });
    navigate("/tareas");
    //console.log(e.target[0].value)
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <h1>Create Product</h1>
          <form onSubmit={editar}>
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
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
