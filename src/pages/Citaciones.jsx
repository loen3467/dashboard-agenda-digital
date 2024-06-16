import { useState, useEffect } from 'react';
import '../pages/styles/citaciones.css'; // Importar los estilos
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import comunicadoImg from '../assets/images/reunion_general.png'; // Ruta a la imagen de comunicado
import entrevistaImg from '../assets/images/entrevista_reunion.png'; // Ruta a la imagen de entrevista

export function Citaciones() {
  const [citas, setCitas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [padres, setPadres] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formType, setFormType] = useState('comunicado');
  const [comunicadoFecha, setComunicadoFecha] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [selectedEstudiantes, setSelectedEstudiantes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCita, setEditingCita] = useState(null);

  useEffect(() => {
    fetchCitas();
    fetchCursos();
    fetchEstudiantes();
    fetchPadres();
  }, []);

  const fetchCitas = async () => {
    const citasSnapshot = await getDocs(collection(db, 'citaciones'));
    const citasList = citasSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCitas(citasList);
  };

  const fetchCursos = async () => {
    const cursosSnapshot = await getDocs(collection(db, 'cursos'));
    const cursosList = cursosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCursos(cursosList);
  };

  const fetchEstudiantes = async () => {
    const estudiantesSnapshot = await getDocs(collection(db, 'estudiantes'));
    const estudiantesList = estudiantesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEstudiantes(estudiantesList);
  };

  const fetchPadres = async () => {
    const padresSnapshot = await getDocs(collection(db, 'padres'));
    const padresList = padresSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPadres(padresList);
  };

  const handleCitaCreada = async () => {
    if (editingCita) {
      await updateDoc(doc(db, 'citaciones', editingCita.id), {
        titulo,
        descripcion,
        tipo: formType,
        fecha: formType === 'comunicado' ? comunicadoFecha : fecha, // Cambio aquí
        id_est: formType === 'entrevista' ? selectedEstudiantes.map((est) => est.id) : null,
        idcurso: formType === 'comunicado' ? cursos.map((curso) => `/cursos/${curso.id}`) : [],
        idprofesor: '/profesores/prof001',
        estado: true,
      });
    } else {
      const newCita = {
        titulo,
        descripcion,
        tipo: formType,
        fecha: formType === 'comunicado' ? comunicadoFecha : fecha, // Cambio aquí
        id_admin: '/administrativo/adm001',
        id_est: formType === 'entrevista' ? selectedEstudiantes.map((est) => est.id) : null,
        idcurso: formType === 'comunicado' ? cursos.map((curso) => `/cursos/${curso.id}`) : [],
        idprofesor: '/profesores/prof001',
        estado: true,
      };
      await addDoc(collection(db, 'citaciones'), newCita);
    }
    fetchCitas();
    setFormVisible(false);
    resetForm();
  };
  
  const resetForm = () => {
    setTitulo('');
    setDescripcion('');
    setFecha('');
    setComunicadoFecha(''); // Reiniciar fecha de comunicado
    setSelectedEstudiantes([]);
    setEditingCita(null);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCitaCreada();
  };

  const handleSelectEstudiante = (estudiante) => {
    setSelectedEstudiantes((prev) => [...prev, estudiante]);
  };

  const handleRemoveEstudiante = (estudiante) => {
    setSelectedEstudiantes((prev) => prev.filter((e) => e.id !== estudiante.id));
  };

  const getParentData = async (idPadre) => {
    try {
      if (typeof idPadre !== 'string' || idPadre.trim() === '') {
        console.log('El ID del padre no es una cadena válida');
        return null;
      }
  
      const padreRef = doc(db, 'padres', idPadre);
      const padreDoc = await getDoc(padreRef);
      if (padreDoc.exists()) {
        const padreData = padreDoc.data();
        return {
          nombre: padreData.nombre,
          apellido: padreData.apellido,
          ocupacion: padreData.ocupacion,
          telefono: padreData.telefono,
          correo: padreData.correo,
          direccion: padreData.direccion,
        };
      } else {
        console.log(`No existe un padre con el ID ${idPadre}`);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos del padre:', error);
      return null;
    }
  };
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'citaciones', id));
    fetchCitas();
  };
  
  const handleEdit = (cita) => {
    setTitulo(cita.titulo);
    setDescripcion(cita.descripcion);
    setFormType(cita.tipo);
    setFecha(cita.fecha);
    setComunicadoFecha(cita.tipo === 'comunicado' ? cita.fecha : ''); // Establecer fecha de comunicado
    setSelectedEstudiantes(estudiantes.filter((est) => cita.id_est.includes(est.id)));
    setEditingCita(cita);
    setFormVisible(true);
  };

  const filteredEstudiantes = estudiantes.filter((estudiante) =>
    estudiante.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="citaciones-container">
      <h2>Comunicados y Citaciones</h2>
      <div className="content-wrapper">
        <div className="citas-list-container">
          {citas.map((cita, index) => (
            <div key={index} className="cita-item">
              <div className="cita-content">
                <h3>{cita.titulo}</h3>
                <div className="barra separadora"></div>
                <p>{cita.descripcion}</p>
                <p>Fecha: {cita.fecha}</p>
                <p>Tipo: {cita.tipo === 'comunicado' ? 'Comunicado' : 'Entrevista'}</p>
                {cita.tipo === 'entrevista' && (
                  <>
                    {cita.id_est.map((id_est, idx) => {
                      const estudiante = estudiantes.find((est) => est.id === id_est);
                      if (!estudiante) return null;

                      const padre = padres.find((padre) => padre.id === estudiante.id_padre);
                      const nombrePadre = padre ? padre.nombre : 'No encontrado';
                      const apellidoPadre = padre ? padre.apellido : 'No encontrado';

                      return (
                        <div key={idx}>
                          <p>Estudiante: {estudiante.nombre} {estudiante.apellido}</p>
                          <div>
                            <p>Nombre del Padre: {nombrePadre}</p>
                            <p>Apellido del Padre: {apellidoPadre}</p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              <div className="imagen-container">
                {cita.tipo === 'comunicado' ? (
                  <img src={comunicadoImg} alt="Comunicado" className="imagen-comunicado" />
                ) : (
                  <img src={entrevistaImg} alt="Entrevista" className="imagen-entrevista" />
                )}
              </div>
              <div className="buttons edits">
                <button className="edit-button" onClick={() => handleEdit(cita)}>Editar</button>
                <button className="delete-button" onClick={() => handleDelete(cita.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="buttons-container">
        <button onClick={() => { setFormType('comunicado'); setFormVisible(true); }}>Nuevo Comunicado</button>
        <button onClick={() => { setFormType('entrevista'); setFormVisible(true); }}>Entrevista a Estudiante(s)</button>
      </div>
      {formVisible && (
  <div className="form-container">
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título:</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        ></textarea>
      </div>
      {formType === 'comunicado' && (
        <div>
          <label>Fecha:</label>
          <input
            type="text"
            value={comunicadoFecha}
            onChange={(e) => setComunicadoFecha(e.target.value)}
            required
          />
        </div>
          )}
            {formType === 'entrevista' && (
              <>
                <div>
            <label>Fecha:</label>
            <input
              type="text"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
                <div>
                  <label>Buscar Estudiante:</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <ul>
                    {filteredEstudiantes.map((estudiante, index) => (
                      <li key={index}>
                        {estudiante.nombre}
                        {selectedEstudiantes.find((e) => e.id === estudiante.id) ? (
                          <div className='button quit'>
                            <button
                              type="button"
                              onClick={() => handleRemoveEstudiante(estudiante)}
                            >
                              Quitar
                            </button>
                          </div>

                        ) : (
                          <div className='button selec'>
                            <button
                              type="button"
                              onClick={() => handleSelectEstudiante(estudiante)}
                            >
                              Seleccionar
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {selectedEstudiantes.map((estudiante, index) => (
                      <div key={index}>
                        <p>Nombre: {estudiante.nombre} {estudiante.apellido}</p>
                        {estudiante.id_padre && (
                          <div>
                            {getParentData(estudiante.id_padre.id) ? ( // Acceder al id del documento del padre
                              <>
                                <p>Nombre del Padre: {getParentData(estudiante.id_padre.id).nombre}</p>
                                <p>Apellido del Padre: {getParentData(estudiante.id_padre.id).apellido}</p>
                              </>
                            ) : (
                              <p>No se encontraron datos del padre</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
              </>
            )}
            <button type="submit">Crear Citación</button>
          </form>
        </div>
      )}
    </div>
  );
}