import { useState } from 'react';
import PropTypes from 'prop-types';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function CitaForm({ onSuccess }) {
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('');
  const [fecha, setFecha] = useState('');
  const [idcurso, setIdCurso] = useState('');
  const [idmateria, setIdMateria] = useState('');
  const [idpadre, setIdPadre] = useState('');
  const [idprofesor, setIdProfesor] = useState('');
  const [tipo, setTipo] = useState('');
  const [titulo, setTitulo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'citaciones'), {
        descripcion,
        estado,
        fecha: Timestamp.fromDate(new Date(fecha)),
        idcurso,
        idmateria,
        idpadre,
        idprofesor,
        tipo,
        titulo
      });
      onSuccess();
    } catch (error) {
      console.error('Error al crear la citación: ', error);
    }
  };

  return (
    <form className="cita-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <input
        type="text"
        placeholder="Estado"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      />
      <input
        type="datetime-local"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      <input
        type="text"
        placeholder="ID Curso"
        value={idcurso}
        onChange={(e) => setIdCurso(e.target.value)}
      />
      <input
        type="text"
        placeholder="ID Materia"
        value={idmateria}
        onChange={(e) => setIdMateria(e.target.value)}
      />
      <input
        type="text"
        placeholder="ID Padre"
        value={idpadre}
        onChange={(e) => setIdPadre(e.target.value)}
      />
      <input
        type="text"
        placeholder="ID Profesor"
        value={idprofesor}
        onChange={(e) => setIdProfesor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tipo"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <button type="submit">Crear Citación</button>
    </form>
  );
}

CitaForm.propTypes = {
  onSuccess: PropTypes.func.isRequired
};

export default CitaForm;
