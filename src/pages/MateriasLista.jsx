// MateriasLista.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import PropTypes from 'prop-types';

function MateriasLista({ cursoId }) {
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
    <div className="materias-lista">
      <h4>Lista de Materias</h4>
      <ul>
        {materias.map(materia => (
          <li key={materia.id}>{materia.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

MateriasLista.propTypes = {
  cursoId: PropTypes.string.isRequired,
};

export default MateriasLista;