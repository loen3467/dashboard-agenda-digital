import PropTypes from 'prop-types';

const Modal = ({ isOpen, onSubmit, formData, handleChange, handleCancelar, editCursoId }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editCursoId ? 'Actualizar Curso' : 'Agregar Curso'}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Nombre del curso:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del curso"
                  required
                />
              </div>
              <div>
                <label>Grado:</label>
                <input
                  type="text"
                  name="grado"
                  value={formData.grado}
                  onChange={handleChange}
                  placeholder="Grado"
                  required
                />
              </div>
              <div>
                <label>Paralelo:</label>
                <input
                  type="text"
                  name="paralelo"
                  value={formData.paralelo}
                  onChange={handleChange}
                  placeholder="Paralelo"
                  required
                />
              </div>
              <div className="button-container">
                <button type="submit">{editCursoId ? 'Actualizar Curso' : 'Agregar Curso'}</button>
                <button type="button" onClick={handleCancelar}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleCancelar: PropTypes.func.isRequired,
  editCursoId: PropTypes.string,
};

export default Modal;