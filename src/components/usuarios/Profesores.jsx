import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import ProfesorItem from '../header/ProfesorItem';
import CryptoJS from 'crypto-js';
import './styles/profesores.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    apellido: '',
    carnet: '',
    correo: '',
    direccion: '',
    especialidad: '',
    fecha_nacimiento: '',
    genero: '',
    id_materia: '',
    nombre: '',
    password: '',
    telefono: ''
  });
  const [editProfesorId, setEditProfesorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfesores();
  }, []);

  const fetchProfesores = async () => {
    try {
      const profesoresCollection = collection(db, 'profesores');
      const profesoresSnapshot = await getDocs(profesoresCollection);
      const profesoresList = profesoresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProfesores(profesoresList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profesores: ', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const toggleEstado = async (id, currentState) => {
    try {
      const userDoc = doc(db, 'profesores', id);
      await updateDoc(userDoc, { estado: !currentState });
      setPadres((prevProfesores) =>
        prevProfesores.map((prof) =>
          prof.id === id ? { ...profesor, estado: !currentState } : profesor
        )
      );
    } catch (error) {
      console.error('Error updating padre state: ', error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hash the password before sending it to Firebase
    const hashedPassword = CryptoJS.SHA256(formData.password).toString(CryptoJS.enc.Hex);

    const profesorData = {
      ...formData,
      password: hashedPassword
    };

    try {
      if (editProfesorId) {
        const profesorDoc = doc(db, 'profesores', editProfesorId);
        await updateDoc(profesorDoc, profesorData);
      } else {
        await addDoc(collection(db, 'profesores'), profesorData);
      }
      setFormData({
        apellido: '',
        carnet: '',
        correo: '',
        direccion: '',
        especialidad: '',
        fecha_nacimiento: '',
        genero: '',
        id_materia: '',
        nombre: '',
        password: '',
        telefono: ''
      });
      setShowModal(false);
      setEditProfesorId(null);
      fetchProfesores();
    } catch (error) {
      console.error('Error adding/updating profesor: ', error);
    }
  };

  const handleEdit = (profesor) => {
    setFormData(profesor);
    setShowModal(true);
    setEditProfesorId(profesor.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar a este profesor?`)) {
      try {
        await db.collection('profesores').doc(id).delete();
        fetchProfesores();
      } catch (error) {
        console.error('Error removing profesor: ', error);
      }
    }
  };

  const handleCancelar = () => {
    setShowModal(false);
    setEditProfesorId(null);
    setFormData({
      apellido: '',
      carnet: '',
      correo: '',
      direccion: '',
      especialidad: '',
      fecha_nacimiento: '',
      genero: '',
      id_materia: '',
      nombre: '',
      password: '',
      telefono: ''
    });
  };

  const handleSearch = () => {
    console.log('Implementa la lógica de búsqueda aquí');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profesores-container">
      <h2>Lista de Profesores</h2>
      <div className='container linea'></div>
      <div className="lista-profesores">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="icon-search" onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>
        <table className="profesores-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Carnet</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Género</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesores
              .filter((profesor) =>
                profesor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((profesor) => (
                <ProfesorItem
                  key={profesor.id}
                  profesor={profesor}
                  toggleEstado={toggleEstado}
                  handleEdit={() => handleEdit(profesor)}
                  handleDelete={() => handleDelete(profesor.id)}
                />
              ))}
          </tbody>
        </table>
      </div>
      <button className="agregar-profesor-button" onClick={() => setShowModal(true)}>
        Agregar Nuevo Profesor
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editProfesorId ? 'Editar Profesor' : 'Agregar Profesor'}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="carnet">Carnet</label>
                <input
                  type="text"
                  id="carnet"
                  name="carnet"
                  value={formData.carnet}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="correo">Correo</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="especialidad">Especialidad</label>
                <input
                  type="text"
                  id="especialidad"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="genero">Género</label>
                <input
                  type="text"
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="id_materia">ID Materia</label>
                <input
                  type="text"
                  id="id_materia"
                  name="id_materia"
                  value={formData.id_materia}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="button-container">
                <button type="submit" className="button">
                  {editProfesorId ? 'Actualizar Profesor' : 'Agregar Profesor'}
                </button>
                <button type="button" className="cancelar-button" onClick={handleCancelar}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profesores;
