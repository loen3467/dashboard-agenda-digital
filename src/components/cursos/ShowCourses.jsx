import { useEffect, useState } from "react";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./styles/show.module.css";
import { Link } from "react-router-dom";

export function ShowCourses() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const getCursos = async () => {
      const cursosCollection = collection(db, "cursos");
      const data = await getDocs(cursosCollection);
      const cursosList = [];

      for (const docSnap of data.docs) {
        const cursoData = docSnap.data();
        const estudiantesRefs = cursoData.estudiantes;
        const materiasRefs = cursoData.id_materias;

        const estudiantesData = await Promise.all(
          estudiantesRefs.map(async (estudianteRef) => {
            const estudianteDoc = await getDoc(estudianteRef);
            return estudianteDoc.data();
          })
        );

        const materiasData = await Promise.all(
          materiasRefs.map(async (materiaRef) => {
            const materiaDoc = await getDoc(materiaRef);
            return materiaDoc.data();
          })
        );

        const curso = {
          nombre: cursoData.nombre,
          grado: cursoData.grado,
          paralelo: cursoData.paralelo,
          estudiantes: estudiantesData,
          materias: materiasData,
        };

        cursosList.push(curso);
      }

      setCursos(cursosList);
    };

    getCursos();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cursos</h1>
      <Link to="/cursos/create" className={styles.createButton}>
        <i className="bx bx-plus-circle"></i>
        <span>Crear Curso</span>
      </Link>
      <div className={styles.cursosList}>
        {cursos.map((curso, index) => (
          <div key={index} className={styles.cursoItem}>
            <h2>{curso.nombre}</h2>
            <p>Grado: {curso.grado}</p>
            <p>Paralelo: {curso.paralelo}</p>
            <h3>Estudiantes:</h3>
            <ul>
              {curso.estudiantes.map((estudiante, index) => (
                <li key={index}>{estudiante.nombre}</li>
              ))}
            </ul>
            <h3>Materias:</h3>
            <ul>
              {curso.materias.map((materia, index) => (
                <li key={index}>{materia.nombre}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
