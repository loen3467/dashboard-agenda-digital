// Materias.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importamos PropTypes desde prop-types
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../pages/styles/cursos.css'; // Asegúrate de importar los estilos CSS
function Materias({ cursoId }) {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterias();
  }, [cursoId]);

  const fetchMaterias = async () => {
    try {
      const materiasCollection = collection(db, 'materias');
      const q = query(materiasCollection, where('idCurso', '==', cursoId));
      const materiasSnapshot = await getDocs(q);
      const materiasList = materiasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterias(materiasList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching materias: ', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="materias-container">
      <h2>Materias del Curso</h2>
      <ul>
        {materias.map(materia => (
          <li key={materia.id}>
            <strong>{materia.nombre}</strong> - Profesor: {materia.idProfesor}
          </li>
        ))}
      </ul>
    </div>
  );
}

Materias.propTypes = {
  cursoId: PropTypes.string.isRequired,
};

export default Materias;
