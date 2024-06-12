import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./styles/create.module.css";

export function Create() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [materias, setMaterias] = useState([]);
  const [estado, setEstado] = useState(true);
  const navigate = useNavigate();

  const tareasCollection = collection(db, "tareas");

  useEffect(() => {
    const getMaterias = async () => {
      const materiasCollection = collection(db, "materias");
      const data = await getDocs(materiasCollection);
      setMaterias(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getMaterias();
  }, []);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}/${month}/${day}`;
    return formattedDate;
  };

  const create = async (e) => {
    e.preventDefault();
    const materiaRef = doc(db, "materias", materiaId);
    await addDoc(tareasCollection, {
      titulo: titulo,
      descripcion: descripcion,
      fecha_entrega: fechaEntrega,
      fecha_creacion: getCurrentDate(),
      idmateria: materiaRef,
      estado: estado,
    });
    navigate("/tareas");
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.header}>
            <button onClick={() => navigate("/tareas")}>
              <i className="bx bx-arrow-back"></i>
            </button>
            <h1>Crear Tarea</h1>
          </div>
          <form onSubmit={create}>
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
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Materia</label>
              <select
                value={materiaId}
                onChange={(e) => setMateriaId(e.target.value)}
                className={styles.formControl}
              >
                <option value="">Seleccione una Materia</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.buttons}>
              <button type="submit" className={styles.btnPrimary}>
                <i class="bx bxs-save"></i>
                <span>Guardar</span>
              </button>
              <button
                onClick={() => navigate("/tareas")}
                type="button"
                className={styles.btnSecondary}
              >
                <i class="bx bx-x-circle"></i>
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
