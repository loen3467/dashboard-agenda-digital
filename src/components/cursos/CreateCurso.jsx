import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCursos } from "../../context/CursosContext";
import styles from "./styles/create.module.css";
import { doc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function CreateCurso() {
  const { createCurso, estudiantes, materias } = useCursos();
  const [nombre, setNombre] = useState("");
  const [grado, setGrado] = useState("");
  const [paralelo, setParalelo] = useState("");
  const [selectedEstudiantes, setSelectedEstudiantes] = useState([]);
  const [selectedMaterias, setSelectedMaterias] = useState([]);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const cursoData = {
      nombre,
      grado: parseInt(grado),
      paralelo,
      estudiantes: selectedEstudiantes.map((id) => doc(db, "estudiantes", id)),
      id_materias: selectedMaterias.map((id) => doc(db, "materias", id)),
    };
    await createCurso(cursoData, selectedEstudiantes);
    navigate(`/cursos`);
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
          <form onSubmit={handleCreate}>
            <div className={styles.form - group}>
              <label>Nombre</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                type="text"
              />
            </div>
            <div className={styles.form - group}>
              <label>Grado</label>
              <input
                value={grado}
                onChange={(e) => setGrado(e.target.value)}
                type="number"
              />
            </div>
            <div className={styles.form - group}>
              <label>Paralelo</label>
              <input
                value={paralelo}
                onChange={(e) => setParalelo(e.target.value)}
                type="text"
              />
            </div>
            <div className={styles.form - group}>
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
                  <option key={estudiante.id} value={estudiante.id}>
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
            <div className={styles.form - group}>
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
            <button type="submit" className={styles.btn - primary}>
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
