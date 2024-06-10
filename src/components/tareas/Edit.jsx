import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDoc,
  updateDoc,
  doc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./styles/edit.module.css";

export function Edit() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getCursos = async () => {
      const cursosCollection = collection(db, "cursos");
      const data = await getDocs(cursosCollection);
      setCursos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const getTareaById = async (id) => {
      const tareaDoc = await getDoc(doc(db, "tareas", id));
      if (tareaDoc.exists()) {
        const tarea = tareaDoc.data();
        setTitulo(tarea.titulo);
        setDescripcion(tarea.descripcion);
        setFechaEntrega(tarea.fecha_entrega);
        setCursoId(tarea.id_curso.id);
      } else {
        console.log("La tarea no existe");
      }
    };

    getCursos();
    getTareaById(id);
  }, [id]);

  const update = async (e) => {
    e.preventDefault();
    const tareaRef = doc(db, "tareas", id);
    const cursoRef = doc(db, "cursos", cursoId);
    const data = {
      titulo,
      descripcion,
      fecha_entrega: fechaEntrega,
      id_curso: cursoRef,
    };
    await updateDoc(tareaRef, data);
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
            <h1>Editar Tarea</h1>
          </div>
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
                <i className="bx bx-upload"></i>
                <span>Actualizar</span>
              </button>
              <button
                onClick={() => navigate("/tareas")}
                type="button"
                className={styles.btnSecondary}
              >
                <i className="bx bx-x-circle"></i>
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
