import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "../tareas/styles/create.module.css";

export function CreateAnot() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [id_est, setIdEst] = useState("");
  const [id_profesor, setIdProfesor] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [estado, setEstado] = useState(true);
  const navigate = useNavigate();

  const anotacionesCollection = collection(db, "anotaciones");

  useEffect(() => {
    const getEstudiantes = async () => {
      const estudiantesCollection = collection(db, "estudiantes");
      const data = await getDocs(estudiantesCollection);
      setEstudiantes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const getProfesores = async () => {
      const profesoresCollection = collection(db, "profesores");
      const data = await getDocs(profesoresCollection);
      setProfesores(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getEstudiantes();
    getProfesores();
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
    const estudianteRef = doc(db, "estudiantes", id_est);
    const profesorRef = doc(db, "profesores", id_profesor);
    await addDoc(anotacionesCollection, {
      titulo: titulo,
      descripcion: descripcion,
      fecha_creacion: getCurrentDate(),
      id_est: estudianteRef,
      id_profesor: profesorRef,
      estado: estado,
    });
    navigate("/anotaciones");
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.header}>
            <button onClick={() => navigate("/anotaciones")}>
              <i className="bx bx-arrow-back"></i>
            </button>
            <h1>Crear Anotación</h1>
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
              <label className={styles.formLabel}>Estudiante</label>
              <select
                value={id_est}
                onChange={(e) => setIdEst(e.target.value)}
                className={styles.formControl}
              >
                <option value="">Seleccione un Estudiante</option>
                {estudiantes.map((estudiante) => (
                  <option key={estudiante.id} value={estudiante.id}>
                    {estudiante.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Profesor</label>
              <select
                value={id_profesor}
                onChange={(e) => setIdProfesor(e.target.value)}
                className={styles.formControl}
              >
                <option value="">Seleccione un Profesor</option>
                {profesores.map((profesor) => (
                  <option key={profesor.id} value={profesor.id}>
                    {profesor.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.buttons}>
              <button type="submit" className={styles.btnPrimary}>
                <i className="bx bxs-save"></i>
                <span>Guardar</span>
              </button>
              <button
                onClick={() => navigate("/anotaciones")}
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
