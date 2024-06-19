import "../styles/materiasCursos.scss";
import { Link } from "react-router-dom";
import { useMaterias } from "../../context/MateriasContext";
import { MateriaItem } from "./MateriaItem";
import { Loader } from "../../utils/Loader";

export default function ShowMaterias() {
  const { materias, loading, toggleMateriaStatus } = useMaterias();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="showMaterias-container">
      <Link to="/materias/create" className="create-button">
        <i className="bx bx-plus-circle"></i>
        <span>Crear Materia</span>
      </Link>
      <div className="materias-list">
        {materias.map((materia) => (
          <MateriaItem
            key={materia.id}
            materia={materia}
            onToggleStatus={toggleMateriaStatus}
          />
        ))}
      </div>
    </div>
  );
}
