import PropTypes from 'prop-types';
import { useState } from 'react';
import '../../pages/styles/Usuarios.css';

function UsuarioItem({ usuario, toggleEstado, editarUsuario }) {
  const [showModal, setShowModal] = useState(false);
  const [editedUsuario, setEditedUsuario] = useState({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    correo: usuario.correo,
    rol: usuario.rol,
    telefono: usuario.telefono,
    estado: usuario.estado,
  });

  const handleToggleEstado = () => {
    toggleEstado(usuario.id, !usuario.estado);
  };

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditedUsuario({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: usuario.rol,
      telefono: usuario.telefono,
      estado: usuario.estado,
    });
  };

  const handleSaveEdit = () => {
    editarUsuario(usuario.id, editedUsuario);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUsuario({ ...editedUsuario, [name]: value });
  };

  return (
    <>
      <tr>
        <td>{usuario.nombre}</td>
        <td>{usuario.apellido}</td>
        <td>{usuario.correo}</td>
        <td>{usuario.rol}</td>
        <td>{usuario.telefono}</td>
        <td>
          <button
            className={`switch-button ${usuario.estado ? '' : 'disabled'}`}
            onClick={handleToggleEstado}
          >
            {usuario.estado ? 'Activo' : 'Inactivo'}
          </button>
        </td>
        <td>
          <button className="icon-button" onClick={handleEditClick}>
            <i className="fas fa-edit"></i>
          </button>
        </td>
      </tr>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Usuario</h3>
            <form>
              <div>
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={editedUsuario.nombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Apellido:</label>
                <input
                  type="text"
                  name="apellido"
                  value={editedUsuario.apellido}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Correo:</label>
                <input
                  type="email"
                  name="correo"
                  value={editedUsuario.correo}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Rol:</label>
                <input
                  type="text"
                  name="rol"
                  value={editedUsuario.rol}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Teléfono:</label>
                <input
                  type="text"
                  name="telefono"
                  value={editedUsuario.telefono}
                  onChange={handleChange}
                />
              </div>
              <div className="switch-container">
                <span className="switch-label">Estado:</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={editedUsuario.estado}
                    onChange={(e) =>
                      setEditedUsuario({ ...editedUsuario, estado: e.target.checked })
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="button-container">
                <button className="button" onClick={handleSaveEdit}>
                  Guardar
                </button>
                <button className="cancelar-button" onClick={handleCloseModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

UsuarioItem.propTypes = {
  usuario: PropTypes.object.isRequired,
  toggleEstado: PropTypes.func.isRequired,
  editarUsuario: PropTypes.func.isRequired,
};

export default UsuarioItem;