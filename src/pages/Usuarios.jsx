import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import UsuarioItem from '../components/header/UsuarioItem';
import CryptoJS from 'crypto-js';
import './styles/Usuarios.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    apellido: '',
    correo: '',
    estado: true,
    nombre: '',
    nombreUsuario: '',
    rol: 'profesor',
    telefono: '',
    password: '' // Añadir el campo de contraseña
  });
  const [editUserId, setEditUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const usuariosCollection = collection(db, 'usuarios');
      const usuariosSnapshot = await getDocs(usuariosCollection);
      const usuariosList = usuariosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(usuariosList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching usuarios: ', error);
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

    const usuarioData = {
      ...formData,
      password: hashedPassword
    };

    try {
      if (editUserId) {
        const userDoc = doc(db, 'usuarios', editUserId);
        await updateDoc(userDoc, usuarioData);
      } else {
        await addDoc(collection(db, 'usuarios'), usuarioData);
      }
      setFormData({
        apellido: '',
        correo: '',
        estado: true,
        nombre: '',
        nombreUsuario: '',
        rol: 'profesor',
        telefono: '',
        password: '' // Resetear el campo de contraseña
      });
      setShowModal(false);
      setEditUserId(null);
      fetchUsuarios();
    } catch (error) {
      console.error('Error adding/updating user: ', error);
    }
  };

  const toggleEstado = async (id, currentState) => {
    try {
      const userDoc = doc(db, 'usuarios', id);
      await updateDoc(userDoc, { estado: !currentState });
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((user) =>
          user.id === id ? { ...user, estado: !currentState } : user
        )
      );
    } catch (error) {
      console.error('Error updating user state: ', error);
    }
  };

  const handleEdit = (usuario) => {
    setFormData(usuario);
    setShowModal(true);
    setEditUserId(usuario.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar a este usuario?`)) {
      try {
        await db.collection('usuarios').doc(id).delete();
        fetchUsuarios();
      } catch (error) {
        console.error('Error removing user: ', error);
      }
    }
  };

  const handleCancelar = () => {
    setShowModal(false);
    setEditUserId(null);
    setFormData({
      apellido: '',
      correo: '',
      estado: true,
      nombre: '',
      nombreUsuario: '',
      rol: 'profesor',
      telefono: '',
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
    <div className="usuarios-container">
      <h2>Lista de Usuarios</h2>
      <div className='container linea'></div>
      <div className="lista-usuarios">
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
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios
              .filter((usuario) =>
                usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((usuario) => (
                <UsuarioItem
                  key={usuario.id}
                  usuario={usuario}
                  toggleEstado={toggleEstado}
                  handleEdit={() => handleEdit(usuario)}
                  handleDelete={() => handleDelete(usuario.id)}
                />
              ))}
          </tbody>
        </table>
      </div>
      <button className="agregar-usuario-button" onClick={() => setShowModal(true)}>
        Agregar Nuevo Usuario
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editUserId ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
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
                <label htmlFor="rol">Rol</label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="director">Director</option>
                  <option value="profesor">Profesor</option>
                  <option value="padre">Padre</option>
                  <option value="estudiante">Estudiante</option>
                </select>
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
                  {editUserId ? 'Actualizar Usuario' : 'Agregar Usuario'}
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
