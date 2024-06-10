// EstudiantesLista.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

function EstudiantesLista({ cursoId }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstudiantes();
  }, [cursoId]);

  const fetchEstudiantes = async () => {
    try {
      const estudiantesCollection = collection(db, 'estudiantes');
      const q = query(estudiantesCollection, where('idCurso', '==', cursoId));
      const estudiantesSnapshot = await getDocs(q);
      const estudiantesList = estudiantesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEstudiantes(estudiantesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching estudiantes: ', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="estudiantes-lista">
      <h4>Lista de Estudiantes</h4>
      <ul>
        {estudiantes.map(estudiante => (
          <li key={estudiante.id}>{estudiante.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

EstudiantesLista.propTypes = {
  cursoId: PropTypes.string.isRequired,
};

export default EstudiantesLista;
