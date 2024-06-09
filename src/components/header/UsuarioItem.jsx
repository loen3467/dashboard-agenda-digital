import PropTypes from 'prop-types';

function UsuarioItem({ usuario, toggleEstado, handleEdit, handleDelete }) {
  const handleEliminarClick = () => {
    if (window.confirm(`¿Estás seguro de eliminar a ${usuario.nombre} ${usuario.apellido}?`)) {
      handleDelete(usuario.id);
    }
  };

  return (
    <tr>
      <td>{usuario.nombre}</td>
      <td>{usuario.apellido}</td>
      <td>{usuario.correo}</td>
      <td>{usuario.rol}</td>
      <td>{usuario.telefono}</td>
      <td>
        <label className="switch">
          <input
            type="checkbox"
            checked={usuario.estado}
            onChange={() => toggleEstado(usuario.id, usuario.estado)}
          />
          <span className="slider round"></span>
        </label>
      </td>
      <td className="action-column">
        <button className="icon-button edit-button" onClick={() => handleEdit(usuario)}>
          <i className="fas fa-edit"></i> Editar
        </button>
        <button className="icon-button delete-button" onClick={handleEliminarClick}>
          <i className="fas fa-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  );
}

UsuarioItem.propTypes = {
  usuario: PropTypes.object.isRequired,
  toggleEstado: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default UsuarioItem;
