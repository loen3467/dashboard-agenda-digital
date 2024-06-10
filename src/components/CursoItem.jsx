import { useState } from 'react';
import PropTypes from 'prop-types';
import EstudiantesLista from '../pages/EstudiantesLista';
import MateriasLista from '../pages/MateriasLista';
import '../pages/styles/cursos.css';

function CursoItem({ curso }) {
  const [showEstudiantes, setShowEstudiantes] = useState(false);
  const [showMaterias, setShowMaterias] = useState(false);

  const toggleShowEstudiantes = () => {
    setShowEstudiantes(!showEstudiantes);
  };

  const toggleShowMaterias = () => {
    setShowMaterias(!showMaterias);
  };

  return (
    <div className="curso-item">
      <div className="curso-header">
        <h4>{curso.nombre}</h4>
        <p>
          Grado: {curso.grado} - Paralelo: {curso.paralelo}
        </p>
      </div>
      <div className="curso-buttons">
        <button onClick={toggleShowEstudiantes}>
          {showEstudiantes ? 'Ocultar Estudiantes' : 'Ver Estudiantes'}
        </button>
        <button onClick={toggleShowMaterias}>
          {showMaterias ? 'Ocultar Materias' : 'Ver Materias'}
        </button>
      </div>
      {showEstudiantes && <EstudiantesLista cursoId={curso.id} />}
      {showMaterias && <MateriasLista cursoId={curso.id} />}
    </div>
  );
}

CursoItem.propTypes = {
  curso: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    grado: PropTypes.string.isRequired,
    paralelo: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default CursoItem;
