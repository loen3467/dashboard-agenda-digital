import PropTypes from 'prop-types';
import { getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

const fetchPadreData = async (padreDocRef) => {
  try {
    const docSnap = await getDoc(padreDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};
function EstudianteItem({ estudiante, toggleEstado, handleEdit, handleDelete }) {
  const handleEliminarClick = () => {
    if (window.confirm(`¿Estás seguro de eliminar a ${estudiante.nombre} ${estudiante.apellido}?`)) {
      handleDelete(estudiante.id);
    }
  };
  const [padreData, setPadreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatosPadre = async () => {
     
        try {
          const padreDocRef = estudiante.id_padre;
          const data = await fetchPadreData(padreDocRef);
          setPadreData(data);
        } catch (err) {
          setError(err);
        } 
      
    };

    obtenerDatosPadre();
  }, [estudiante.id_padre]);


  return (
    <tr>
      <td>{estudiante.nombre}</td>
      <td>{estudiante.apellido}</td>
      <td>{estudiante.correo}</td>
      <td>{estudiante.carnet}</td>
      <td>{estudiante.telefono}</td>
      <td>{padreData ? `${padreData.nombre} ${padreData.apellido}` : "no asignado"}</td>
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
