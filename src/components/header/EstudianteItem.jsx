import PropTypes from 'prop-types';

function EstudianteItem({ estudiante, handleEdit, handleDelete }) {
  const handleEliminarClick = () => {
    if (window.confirm(`¿Estás seguro de eliminar a ${estudiante.nombre} ${estudiante.apellido}?`)) {
      handleDelete(estudiante.id);
    }
  };

  return (
    <tr>
      <td>{estudiante.nombre}</td>
      <td>{estudiante.apellido}</td>
      <td>{estudiante.correo}</td>
      <td>{estudiante.carnet}</td>
      <td>{estudiante.telefono}</td>

      <td className="action-column">
        <button className="icon-button edit-button" onClick={() => handleEdit(estudiante)}>
          <i className="fas fa-edit"></i> Editar
        </button>
        <button className="icon-button delete-button" onClick={handleEliminarClick}>
          <i className="fas fa-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  );
}

EstudianteItem.propTypes = {
  estudiante: PropTypes.object.isRequired,
  toggleEstado: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default EstudianteItem;