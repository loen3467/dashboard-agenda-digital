import PropTypes from 'prop-types';

function PadreItem({ padre, handleEdit, handleDelete }) {
  const handleEliminarClick = () => {
    if (window.confirm(`¿Estás seguro de eliminar a ${padre.nombre} ${padre.apellido}?`)) {
      handleDelete(padre.id);
    }
  };

  return (
    <tr>
      <td>{padre.nombre}</td>
      <td>{padre.apellido}</td>
      <td>{padre.correo}</td>
      <td>{padre.carnet}</td>
      <td>{padre.telefono}</td>

      <td className="action-column">
        <button className="icon-button edit-button" onClick={() => handleEdit(padre)}>
          <i className="fas fa-edit"></i> Editar
        </button>
        <button className="icon-button delete-button" onClick={handleEliminarClick}>
          <i className="fas fa-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  );
}

PadreItem.propTypes = {
  padre: PropTypes.object.isRequired,
  toggleEstado: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default PadreItem;