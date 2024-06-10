// TodasMaterias.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

function TodasMaterias() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterias();
  }, []);

  const fetchMaterias = async () => {
    try {
      const materiasCollection = collection(db, 'materias');
      const materiasSnapshot = await getDocs(materiasCollection);
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
    <div className="todas-materias">
      <h3>Todas las Materias</h3>
      <ul>
        {materias.map(materia => (
          <li key={materia.id}>{materia.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodasMaterias;