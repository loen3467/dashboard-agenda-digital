import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCursos } from "../../context/CursosContext";
import styles from "./styles/create.module.css";
import { doc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function EditCurso() {
  const { cursos, updateCurso, estudiantes, materias } = useCursos();
  const { id } = useParams();
  const curso = cursos.find((curso) => curso.id === id);

  const [nombre, setNombre] = useState(curso?.nombre || "");
  const [grado, setGrado] = useState(curso?.grado || "");
  const [paralelo, setParalelo] = useState(curso?.paralelo || "");
  const [selectedEstudiantes, setSelectedEstudiantes] = useState(
    curso?.estudiantes.map((estudiante) => estudiante.id) || []
  );
  const [selectedMaterias, setSelectedMaterias] = useState(
    curso?.materias.map((materia) => materia.id) || []
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (curso) {
      setNombre(curso.nombre);
      setGrado(curso.grado);
      setParalelo(curso.paralelo);
      setSelectedEstudiantes(
        curso.estudiantes.map((estudiante) => estudiante.id)
      );
      setSelectedMaterias(curso.materias.map((materia) => materia.id));
    }
  }, [curso]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const cursoData = {
      nombre,
      grado: parseInt(grado),
      paralelo,
      estudiantes: selectedEstudiantes.map((id) => doc(db, "estudiantes", id)),
      id_materias: selectedMaterias.map((id) => doc(db, "materias", id)),
    };
    await updateCurso(id, cursoData, selectedEstudiantes);
    navigate(`/cursos`);
  };

  if (!curso) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <form onSubmit={handleUpdate}>
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
