// AsignarMaterias.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes desde prop-types
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import '../pages/styles/cursos.css'; // Asegúrate de importar los estilos CSS
function AsignarMaterias({ cursoId }) {
  const [materias, setMaterias] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState('');

  useEffect(() => {
    fetchMaterias();
  }, []);

  const fetchMaterias = async () => {
    try {
      const materiasCollection = collection(db, 'materias');
      const materiasSnapshot = await getDocs(materiasCollection);
      const materiasList = materiasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterias(materiasList);
    } catch (error) {
      console.error('Error fetching materias: ', error);
    }
  };

  const handleAsignarMateria = async () => {
    try {
      const cursoRef = doc(db, 'cursos', cursoId);
      await updateDoc(cursoRef, {
        idMateria: arrayUnion(selectedMateria)
      });
      // Lógica adicional después de asignar materia...
    } catch (error) {
      console.error('Error asignando materia: ', error);
    }
  };

  return (
    <div className="asignar-materias-container">
      <h2>Asignar Materias al Curso</h2>
      <select value={selectedMateria} onChange={(e) => setSelectedMateria(e.target.value)}>
        <option value="">Selecciona una materia</option>
        {materias.map(materia => (
          <option key={materia.id} value={materia.id}>{materia.nombre}</option>
        ))}
      </select>
      <button onClick={handleAsignarMateria}>Asignar Materia</button>
    </div>
  );
}

AsignarMaterias.propTypes = {
  cursoId: PropTypes.string.isRequired, // Define cursoId como una propiedad requerida de tipo string
};

export default AsignarMaterias;
