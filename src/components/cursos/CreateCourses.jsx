import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./styles/create.module.css";

export function CreateCourses() {
  const [nombre, setNombre] = useState("");
  const [grado, setGrado] = useState("");
  const [paralelo, setParalelo] = useState("");
  const [selectedEstudiantes, setSelectedEstudiantes] = useState([]);
  const [selectedMaterias, setSelectedMaterias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEstudiantes = async () => {
      const estudiantesCollection = collection(db, "estudiantes");
      const data = await getDocs(estudiantesCollection);
      const estudiantesList = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEstudiantes(estudiantesList);
    };

    const getMaterias = async () => {
      const materiasCollection = collection(db, "materias");
      const data = await getDocs(materiasCollection);
      const materiasList = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterias(materiasList);
    };

    getEstudiantes();
    getMaterias();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    const cursoRef = collection(db, "cursos");
    const estudiantesRefs = selectedEstudiantes.map((id) =>
      doc(db, "estudiantes", id)
    );
    const materiasRefs = selectedMaterias.map((id) => doc(db, "materias", id));
    await addDoc(cursoRef, {
      nombre: nombre,
      grado: parseInt(grado),
      paralelo: paralelo,
      estudiantes: estudiantesRefs,
      id_materias: materiasRefs,
    });
    navigate("/cursos");
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.header}>
            <button onClick={() => navigate("/cursos")}>
              <i className="bx bx-arrow-back"></i>
            </button>
            <h1>Añadir Curso</h1>
          </div>
          <form onSubmit={create}>
            <div className={styles.formGroup}>
              <label>Nombre</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                type="text"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Grado</label>
              <input
                value={grado}
                onChange={(e) => setGrado(e.target.value)}
                type="number"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Paralelo</label>
              <input
                value={paralelo}
                onChange={(e) => setParalelo(e.target.value)}
                type="text"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Estudiantes</label>
              <select
                value={selectedEstudiantes}
                onChange={(e) =>
                  setSelectedEstudiantes(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                multiple
              >
                {estudiantes.map((estudiante) => (
                  <option key={estudiante.id} value={estudiante.nombre}>
                    {estudiante.nombre}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={selectedEstudiantes.join(", ")}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label>Materias</label>
              <select
                value={selectedMaterias}
                onChange={(e) =>
                  setSelectedMaterias(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                multiple
              >
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
              <input type="text" value={selectedMaterias.join(", ")} readOnly />
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
