import styles from "./styles/show.module.css";
import { Link } from "react-router-dom";

export function CursoItem({ curso }) {
  const { id, nombre, grado, paralelo, estudiantes, materias } = curso;

  return (
    <div className={styles.cursoItem}>
      <h2>{nombre}</h2>
      <p>Grado: {grado}</p>
      <p>Paralelo: {paralelo}</p>
      <h3>Estudiantes:</h3>
      <ul>
        {estudiantes.map((estudiante, index) => (
          <li key={index}>{estudiante.nombre}</li>
        ))}
      </ul>
      <h3>Materias:</h3>
      <ul>
        {materias.map((materia, index) => (
          <li key={index}>{materia.nombre}</li>
        ))}
      </ul>
      <Link to={`/cursos/edit/${id}`} className={styles.editLink}>
        Editar Curso
      </Link>
    </div>
  );
}
