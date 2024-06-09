// Cursos.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import CursoItem from '../components/CursoItem'; // Asegúrate de importar CursoItem
import Materias from '../pages/Materias'; // Asegúrate de importar Materias
import AsignarMaterias from '../pages/AsignarMaterias'; // Asegúrate de importar AsignarMaterias

export function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    grado: '',
    paralelo: ''
  });
  const [editCursoId, setEditCursoId] = useState(null);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const cursosCollection = collection(db, 'cursos');
      const cursosSnapshot = await getDocs(cursosCollection);
      const cursosList = cursosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCursos(cursosList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cursos: ', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCursoId) {
        const cursoDoc = doc(db, 'cursos', editCursoId);
        await updateDoc(cursoDoc, formData);
      } else {
        await addDoc(collection(db, 'cursos'), formData);
      }
      setFormData({
        nombre: '',
        grado: '',
        paralelo: ''
      });
      setShowModal(false);
      setEditCursoId(null);
      fetchCursos();
    } catch (error) {
      console.error('Error adding/updating curso: ', error);
    }
  };

  const handleEdit = (curso) => {
    setFormData(curso);
    setShowModal(true);
    setEditCursoId(curso.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar este curso?`)) {
      try {
        await db.collection('cursos').doc(id).delete();
        fetchCursos();
      } catch (error) {
        console.error('Error removing curso: ', error);
      }
    }
  };

  const handleCancelar = () => {
    setShowModal(false);
    setEditCursoId(null);
    setFormData({
      nombre: '',
      grado: '',
      paralelo: ''
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cursos-container">
      <h2>Lista de Cursos</h2>
      <button onClick={() => setShowModal(true)}>Agregar Curso</button>
      {cursos.map(curso => (
        <CursoItem key={curso.id} curso={curso} onDelete={handleDelete} onEdit={handleEdit} />
      ))}
      {showModal && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del curso" />
            <input type="text" name="grado" value={formData.grado} onChange={handleChange} placeholder="Grado" />
            <input type="text" name="paralelo" value={formData.paralelo} onChange={handleChange} placeholder="Paralelo" />
            <button type="submit">{editCursoId ? 'Actualizar Curso' : 'Agregar Curso'}</button>
            <button type="button" onClick={handleCancelar}>Cancelar</button>
          </form>
        </div>
      )}
      {editCursoId && (
        <>
          <Materias cursoId={editCursoId} />
          <AsignarMaterias cursoId={editCursoId} />
        </>
      )}
    </div>
  );
}
