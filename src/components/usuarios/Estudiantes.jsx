import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import EstudianteItem from '../header/EstudianteItem';
import CryptoJS from 'crypto-js';
import './styles/estudiantes.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    apellido: '',
    correo: '',
    direccion: '',
    fecha_nacimiento: '',
    genero: '',
    id_curso: '',
    id_padre: '',
    nombre: '',
    carnet: '',
    telefono: '',
    alergias: [],
    password: '' // Añadir el campo de contraseña
  });
  const [editUserId, setEditUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const estudiantesCollection = collection(db, 'estudiantes');
      const estudiantesSnapshot = await getDocs(estudiantesCollection);
      const estudiantesList = estudiantesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEstudiantes(estudiantesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching estudiantes: ', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hashear la contraseña antes de enviarla a Firebase
    const hashedPassword = CryptoJS.SHA256(formData.password).toString(CryptoJS.enc.Hex);

    const estudianteData = {
      ...formData,
      password: hashedPassword
    };

    try {
      if (editUserId) {
        const userDoc = doc(db, 'estudiantes', editUserId);
        await updateDoc(userDoc, estudianteData);
      } else {
        await addDoc(collection(db, 'estudiantes'), estudianteData);
      }
      setFormData({
        apellido: '',
        correo: '',
        direccion: '',
        fecha_nacimiento: '',
        genero: '',
        id_curso: '',
        id_padre: '',
        nombre: '',
        carnet: '',
        telefono: '',
        alergias: [],
        password: '' // Resetear el campo de contraseña
      });
      setShowModal(false);
      setEditUserId(null);
      fetchEstudiantes();
    } catch (error) {
      console.error('Error adding/updating estudiante: ', error);
    }
  };

  const toggleEstado = async (id, currentState) => {
    try {
      const userDoc = doc(db, 'estudiantes', id);
      await updateDoc(userDoc, { estado: !currentState });
      setEstudiantes((prevEstudiantes) =>
        prevEstudiantes.map((estudiante) =>
          estudiante.id === id ? { ...estudiante, estado: !currentState } : estudiante
        )
      );
    } catch (error) {
      console.error('Error updating estudiante state: ', error);
    }
  };

  const handleEdit = (estudiante) => {
    setFormData(estudiante);
    setShowModal(true);
    setEditUserId(estudiante.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar a este estudiante?`)) {
      try {
        const userDoc = doc(db, 'estudiantes', id);
        await deleteDoc(userDoc);
        fetchEstudiantes();
      } catch (error) {
        console.error('Error removing estudiante: ', error);
      }
    }
  };

  const handleCancelar = () => {
    setShowModal(false);
    setEditUserId(null);
    setFormData({
      apellido: '',
      correo: '',
      direccion: '',
      fecha_nacimiento: '',
      genero: '',
      id_curso: '',
      id_padre: '',
      nombre: '',
      carnet: '',
      telefono: '',
      alergias: [],
      password: '' // Resetear el campo de contraseña
    });
  };

  const handleSearch = () => {
    // Implementa la lógica de búsqueda aquí si es necesario
    console.log('Implementa la lógica de búsqueda aquí');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="estudiantes-container">
      <h2>Lista de Estudiantes</h2>
      <div className='container linea'></div>
      <div className="lista-estudiantes">
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
        <table className="estudiantes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Carnet</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes
              .filter((estudiante) =>
                estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((estudiante) => (
                <EstudianteItem
                  key={estudiante.id}
                  estudiante={estudiante}
                  toggleEstado={toggleEstado}
                  handleEdit={() => handleEdit(estudiante)}
                  handleDelete={() => handleDelete(estudiante.id)}
                />
              ))}
          </tbody>
        </table>
      </div>
      <button className="agregar-estudiante-button" onClick={() => setShowModal(true)}>
        Agregar Nuevo Estudiante
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editUserId ? 'Editar Estudiante' : 'Agregar Estudiante'}</h3>
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
                  required
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
                  required
                />
              </div>
              <div>
                <label htmlFor="genero">Género</label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  required
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
              <div>
                <label htmlFor="id_curso">ID Curso</label>
                <input
                  type="text"
                  id="id_curso"
                  name="id_curso"
                  value={formData.id_curso}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="id_padre">ID Padre</label>
                <input
                  type="text"
                  id="id_padre"
                  name="id_padre"
                  value={formData.id_padre}
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
                  required
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
                <label htmlFor="alergias">Alergias</label>
                <input
                  type="text"
                  id="alergias"
                  name="alergias"
                  value={formData.alergias.join(', ')}
                  onChange={(e) =>
                    setFormData({ ...formData, alergias: e.target.value.split(', ') })
                  }
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
                  {editUserId ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
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
