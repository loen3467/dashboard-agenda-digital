import { useState } from 'react';
import PropTypes from 'prop-types';
import CursoItem from '../components/CursoItem';

const gradoNombres = ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto'];

function GradoContainer({ cursosPorGrado, onGradoSelect }) {
  const [gradoActivo, setGradoActivo] = useState(null);

  const toggleShowCursos = (grado) => {
    setGradoActivo(gradoActivo === grado ? null : grado);
  };

  return (
    <div className="grado-container">
      <h3>Cursos Disponibles</h3>
      <div className="grado-header-container">
        {gradoNombres.map((nombre, index) => (
          <div
            key={index}
            className={`grado-header ${gradoActivo === index + 1 ? 'activo' : ''}`}
            onClick={() => {
              toggleShowCursos(index + 1);
              onGradoSelect(index + 1); // Agregamos la función de selección de grado
            }}
            title={`Mostrar/Ocultar cursos de ${nombre}`}
          >
            <h4>{nombre}</h4>
          </div>
        ))}
      </div>
      {gradoActivo && (
        <div className="cursos-list">
          {cursosPorGrado[gradoActivo]?.map((curso) => (
            <CursoItem key={curso.id} curso={curso} />
          ))}
        </div>
      )}
    </div>
  );
}

GradoContainer.propTypes = {
  cursosPorGrado: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        paralelo: PropTypes.string.isRequired,
        grado: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
      })
    )
  ).isRequired,
  onGradoSelect: PropTypes.func.isRequired, // Propiedad para manejar la selección de grado
};

export default GradoContainer;
