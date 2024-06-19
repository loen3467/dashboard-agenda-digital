import React from "react";
import { Link } from "react-router-dom";
import { useCursos } from "../../context/CursosContext";
import { CursoItem } from "./CursoItem";
import styles from "./styles/show.module.css";
import { Loader } from "../../utils/Loader";

export function ShowCursos() {
  const { cursos, loading } = useCursos();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <Link to="/cursos/create" className={styles.createButton}>
        <i className="bx bx-plus-circle"></i>
        <span>Crear Curso</span>
      </Link>
      <div className={styles.cursosList}>
        {cursos.map((curso) => (
          <CursoItem key={curso.id} curso={curso} />
        ))}
      </div>
    </div>
  );
}
