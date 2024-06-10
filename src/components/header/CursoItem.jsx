import PropTypes from 'prop-types';
import '../../pages/styles/cursos.css';

function CursoItem({ curso, onDelete, onEdit, onVerEstudiantes, onVerMaterias }) {
  const handleDelete = () => {
    onDelete(curso.id);
  };

  const handleEdit = () => {
    onEdit(curso);
  };

  const handleVerMaterias = () => {
    onVerMaterias(curso.id);
  };

  const handleVerEstudiantes = () => {
    onVerEstudiantes(curso.id);
  };

  return (
    <div className="curso-item">
      <h3>{curso.nombre}</h3>
      <p>Grado: {curso.grado}, Paralelo: {curso.paralelo}</p>
      <div>
        <button onClick={handleEdit}>Editar</button>
        <button onClick={handleDelete}>Eliminar</button>
        <button onClick={handleVerEstudiantes}>Ver Estudiantes</button>
        <button onClick={handleVerMaterias}>Ver Materias</button>
      </div>
    </div>
  );
}

CursoItem.propTypes = {
  curso: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    grado: PropTypes.string.isRequired,
    paralelo: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onVerEstudiantes: PropTypes.func.isRequired,
  onVerMaterias: PropTypes.func.isRequired,
};

export default CursoItem;
