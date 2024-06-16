import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import PadreItem from '../header/PadreItem'; // Asegúrate de que la ruta sea correcta
import CryptoJS from 'crypto-js';
import './styles/padres.css';

export function Padres() {
  const [padres, setPadres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    apellido: '',
    correo: '',
    direccion: '',
    fecha_nacimiento: '',
    genero: '',
    id_est: '',
    nombre: '',
    carnet: '',
    telefono: '',
    ocupacion: '',
    password: '' // Añadir el campo de contraseña
  });
  const [editUserId, setEditUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPadres();
  }, []);

  const fetchPadres = async () => {
    try {
      const padresCollection = collection(db, 'padres');
      const padresSnapshot = await getDocs(padresCollection);
      const padresList = padresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPadres(padresList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching padres: ', error);
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

    const padreData = {
      ...formData,
      password: hashedPassword
    };

    try {
      if (editUserId) {
        const userDoc = doc(db, 'padres', editUserId);
        await updateDoc(userDoc, padreData);
      } else {
        await addDoc(collection(db, 'padres'), padreData);
      }
      setFormData({
        apellido: '',
        correo: '',
        direccion: '',
        fecha_nacimiento: '',
        genero: '',
        id_est: '',
        nombre: '',
        carnet: '',
        telefono: '',
        ocupacion: '',
        password: '' // Resetear el campo de contraseña
      });
      setShowModal(false);
      setEditUserId(null);
      fetchPadres();
    } catch (error) {
      console.error('Error adding/updating padre: ', error);
    }
  };

  const toggleEstado = async (id, currentState) => {
    try {
      const userDoc = doc(db, 'padres', id);
      await updateDoc(userDoc, { estado: !currentState });
      setPadres((prevPadres) =>
        prevPadres.map((padre) =>
          padre.id === id ? { ...padre, estado: !currentState } : padre
        )
      );
    } catch (error) {
      console.error('Error updating padre state: ', error);
    }
  };

  const handleEdit = (padre) => {
    setFormData(padre);
    setShowModal(true);
    setEditUserId(padre.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar a este padre?`)) {
      try {
        const userDoc = doc(db, 'padres', id);
        await deleteDoc(userDoc);
        fetchPadres();
      } catch (error) {
        console.error('Error removing padre: ', error);
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
      id_est: '',
      nombre: '',
      carnet: '',
      telefono: '',
      ocupacion: '',
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
    <div className="padres-container">
      <h2>Lista de Padres</h2>
      <div className='container linea'></div>
      <div className="lista-padres">
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
        <table className="padres-table">
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
            {padres
              .filter((padre) =>
                padre.nombre.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((padre) => (
                <PadreItem
                  key={padre.id}
                  padre={padre}
                  toggleEstado={toggleEstado}
                  handleEdit={() => handleEdit(padre)}
                  handleDelete={() => handleDelete(padre.id)}
                />
              ))}
          </tbody>
        </table>
      </div>
      <button className="agregar-padre-button" onClick={() => setShowModal(true)}>
        Agregar Nuevo Padre
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editUserId ? 'Editar Padre' : 'Agregar Padre'}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
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
                <label htmlFor="ocupacion">Ocupación</label>
                <input
                  type="text"
                  id="ocupacion"
                  name="ocupacion"
                  value={formData.ocupacion}
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
                />
              </div>
              <div className="modal-buttons">
                <button type="submit">{editUserId ? 'Guardar Cambios' : 'Agregar'}</button>
                <button type="button" onClick={handleCancelar}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}