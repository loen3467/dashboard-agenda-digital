import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./styles/create.module.css";

export function Create() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [cursos, setCursos] = useState([]);
  const [activo, setActivo] = useState(true);
  const navigate = useNavigate();

  const tareasCollection = collection(db, "tareas");

  useEffect(() => {
    const getCursos = async () => {
      const cursosCollection = collection(db, "cursos");
      const data = await getDocs(cursosCollection);
      setCursos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getCursos();
  }, []);

  const crear = async (e) => {
    e.preventDefault();
    const cursoRef = doc(db, "cursos", cursoId);
    await addDoc(tareasCollection, {
      titulo: titulo,
      descripcion: descripcion,
      fecha_entrega: fechaEntrega,
      id_curso: cursoRef,
      activo: activo,
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
          <form onSubmit={crear}>
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
              <label className={styles.formLabel}>Curso</label>
              <select
                value={cursoId}
                onChange={(e) => setCursoId(e.target.value)}
                className={styles.formControl}
              >
                <option value="">Seleccione un curso</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre}
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
