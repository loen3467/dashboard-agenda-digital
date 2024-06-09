// CursoItem.jsx
import PropTypes from 'prop-types';
import '../../pages/styles/cursos.css'; // Asegúrate de importar los estilos CSS
function CursoItem({ curso, onDelete, onEdit }) {
  const handleDelete = () => {
    onDelete(curso.id);
  };

  const handleEdit = () => {
    onEdit(curso);
  };

  return (
    <div className="curso-item">
      <h3>{curso.nombre}</h3>
      <p>Grado: {curso.grado}, Paralelo: {curso.paralelo}</p>
      <div>
        <button onClick={handleEdit}>Editar</button>
        <button onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  );
}

CursoItem.propTypes = {
  curso: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default CursoItem;
