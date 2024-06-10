import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import CursoItem from '../components/header/CursoItem';
import Materias from '../pages/Materias';
import AsignarMaterias from '../pages/AsignarMaterias';
import Modal from '../pages/Modal'; // Importamos el componente Modal
import '../pages/styles/cursos.css';

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
  const [viewPanel, setViewPanel] = useState('');

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

  const handleVerMaterias = (cursoId) => {
    setViewPanel('materias');
    setEditCursoId(cursoId);
  };

  const handleVerEstudiantes = (cursoId) => {
    setViewPanel('estudiantes');
    setEditCursoId(cursoId);
  };

  const handleVolver = () => {
    setViewPanel('');
    setEditCursoId(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cursos-container">
      <h2>Gestion de Cursos</h2>
      <div className="panel-buttons">
        <button onClick={() => setShowModal(true)}>Agregar Curso</button>
        <button onClick={() => setViewPanel('cursos')}>Ver Cursos</button>
        <button onClick={() => setViewPanel('materias')}>Ver Materias</button>
      </div>
      {viewPanel === 'cursos' && (
        <div className="cursos-list">
          {cursos.map(curso => (
            <CursoItem
              key={curso.id}
              curso={curso}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onVerEstudiantes={handleVerEstudiantes} // Nuevo prop
              onVerMaterias={handleVerMaterias}     // Nuevo prop
            />
          ))}
        </div>
      )}
      {viewPanel === 'materias' && (
        <>
          <div className="section-container">
            <h3>Materias del Curso</h3>
            <Materias cursoId={editCursoId} />
          </div>
          <div className="section-container">
            <h3>Asignar Materias al Curso</h3>
            <AsignarMaterias cursoId={editCursoId} />
          </div>
          <button onClick={handleVolver}>Volver</button>
        </>
      )}
      {viewPanel === 'estudiantes' && (
        <>
          <div className="section-container">
            <h3>Lista de Estudiantes del Curso</h3>
            {/* Aquí debes agregar el componente para mostrar la lista de estudiantes */}
          </div>
          <button onClick={handleVolver}>Volver</button>
        </>
      )}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        handleCancelar={handleCancelar}
        editCursoId={editCursoId}
      />
    </div>
  );
}