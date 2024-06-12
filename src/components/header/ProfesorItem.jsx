import PropTypes from 'prop-types';

function ProfesorItem({ profesor, handleEdit, handleDelete }) {
  const handleEliminarClick = () => {
    if (window.confirm(`¿Estás seguro de eliminar a ${profesor.nombre} ${profesor.apellido}?`)) {
      handleDelete(profesor.id);
    }
  };

  return (
    <tr>
      <td>{profesor.nombre}</td>
      <td>{profesor.apellido}</td>
      <td>{profesor.carnet}</td>
      <td>{profesor.correo}</td>
      <td>{profesor.direccion}</td>
      <td>{profesor.especialidad}</td>
      <td>{profesor.fecha_nacimiento}</td>
      <td>{profesor.genero}</td>
      <td>{profesor.id_materia}</td>
      <td>{profesor.telefono}</td>
      <td className="action-column">
        <button className="icon-button edit-button" onClick={() => handleEdit(profesor)}>
          <i className="fas fa-edit"></i> Editar
        </button>
        <button className="icon-button delete-button" onClick={handleEliminarClick}>
          <i className="fas fa-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  );
}

ProfesorItem.propTypes = {
  profesor: PropTypes.object.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default ProfesorItem;
