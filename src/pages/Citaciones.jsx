import { useState, useEffect } from 'react';
import '../pages/styles/citaciones.css'; // Importar los estilos
import CitaForm from './CitaForm';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export function Citaciones() {
  const [citas, setCitas] = useState([]);

  const fetchCitas = async () => {
    const citasSnapshot = await getDocs(collection(db, 'citaciones'));
    const citasList = citasSnapshot.docs.map(doc => doc.data());
    setCitas(citasList);
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const handleCitaCreada = () => {
    fetchCitas();
  };

  return (
    <div className="citaciones-container">
      <h2>Comunicados y Citaciones</h2>
      <CitaForm onSuccess={handleCitaCreada} />
      <div className="citas-list">
        {citas.map((cita, index) => (
          <div key={index} className="cita-item">
            <p>{cita.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
