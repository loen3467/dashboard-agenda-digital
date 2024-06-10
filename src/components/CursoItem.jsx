import PropTypes from 'prop-types';
import '../../pages/styles/cursos.css';

function CursoItem({ curso, onVerEstudiantes, onVerMaterias }) {
  const handleVerMaterias = () => {
    onVerMaterias(curso.id);
  };

  const handleVerEstudiantes = () => {
    onVerEstudiantes(curso.id);
  };

  return (
    <div className="curso-item">
      <h3>{curso.nombre}</h3>
      <p>Grado: {curso.grado} Paralelo: {curso.paralelo}</p>
      <div>
        <button onClick={handleVerEstudiantes}>Ver </button>
        <button onClick={handleVerMaterias}>Ver Materias</button>
      </div>
    </div>
  );
}

CursoItem.propTypes = {
  curso: PropTypes.object.isRequired,
  onVerEstudiantes: PropTypes.func.isRequired,
  onVerMaterias: PropTypes.func.isRequired,
};

export default CursoItem;
