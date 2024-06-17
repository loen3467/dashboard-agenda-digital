import { useState, useEffect } from 'react';
import '../pages/styles/citaciones.css'; // Importar los estilos
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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
  const [selectedCursos, setSelectedCursos] = useState([]);
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
    const newCita = {
      titulo,
      descripcion,
      tipo: formType,
      fecha: formType === 'comunicado' ? comunicadoFecha : fecha,
      id_admin: '/administrativo/adm001',
      id_est: formType === 'entrevista' ? selectedEstudiantes.map((est) => est.id) : null,
      idcurso: formType === 'cursos' ? selectedCursos.map((curso) => `/cursos/${curso}`) : [],
      idprofesor: '/profesores/prof001',
      estado: true,
    };

    if (editingCita) {
      await updateDoc(doc(db, 'citaciones', editingCita.id), newCita);
    } else {
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
    setComunicadoFecha('');
    setSelectedEstudiantes([]);
    setSelectedCursos([]);
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

  const handleSelectCurso = (curso) => {
    setSelectedCursos((prev) =>
      prev.includes(curso) ? prev.filter((c) => c !== curso) : [...prev, curso]
    );
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'citaciones', id));
    fetchCitas();
  };

  const handleEdit = (cita) => {
    setEditingCita(cita);
    openFormForEditing(cita);
  };

  const openFormForEditing = (cita) => {
    const { tipo, titulo, descripcion, fecha, id_est, idcurso } = cita;
  
    if (tipo === 'comunicado') {
      setFormType('comunicado');
      setTitulo(titulo);
      setDescripcion(descripcion);
      setComunicadoFecha(fecha);
      setFormVisible(true);
    } else if (tipo === 'cursos') {
      setFormType('cursos');
      setTitulo(titulo);
      setDescripcion(descripcion);
      setSelectedCursos(idcurso.map((curso) => curso.replace('/cursos/', '')));
      setFormVisible(true);
    } else if (tipo === 'entrevista') {
      setFormType('entrevista');
      setTitulo(titulo);
      setDescripcion(descripcion);
      setFecha(fecha);
      setSelectedEstudiantes(estudiantes.filter((est) => id_est.includes(est.id)));
      setFormVisible(true);
    }
  };

  const getParentData = (parentId) => {
    return padres.find((padre) => padre.id === parentId);
  };

  const filteredEstudiantes = estudiantes.filter((estudiante) =>
    estudiante.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openFormForCreation = (type) => {
    resetForm();
    setFormType(type);
    setFormVisible(true);
  };

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
                <p>Tipo: {cita.tipo === 'comunicado' ? 'Comunicado' : cita.tipo === 'entrevista' ? 'Entrevista' : 'Cursos'}</p>
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
                {cita.tipo === 'cursos' && (
                  <div>
                    <p>Cursos:</p>
                    <ul>
                      {cita.idcurso.map((idCurso, idx) => {
                        const curso = cursos.find((curso) => `/cursos/${curso.id}` === idCurso);
                        return curso ? <li key={idx}>{curso.nombre}</li> : null;
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <div className="imagen-container">
                {cita.tipo === 'comunicado' ? (
                  <img src={comunicadoImg} alt="Comunicado" className="imagen-comunicado" />
                ) : cita.tipo === 'entrevista' ? (
                  <img src={entrevistaImg} alt="Entrevista" className="imagen-entrevista" />
                ) : (
                  <img src={entrevistaImg} alt="Citacion a Cursos" className="imagen-entrevista" />
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
        <button onClick={() => openFormForCreation('comunicado')}>Nuevo Comunicado</button>
        <button onClick={() => openFormForCreation('entrevista')}>Entrevista a Estudiante(s)</button>
        <button onClick={() => openFormForCreation('cursos')}>Citación a Cursos</button>
      </div>
      {formVisible && (
        <>
          <div className="overlay active" onClick={() => setFormVisible(false)}></div>
          <div className="form-container">
            <div className="form-wrapper active">
              <div>
                <h2>{formType === 'comunicado' ? 'Nuevo Comunicado' : formType === 'entrevista' ? 'Entrevista a Estudiante(s)' : 'Citación a Cursos'}</h2>
              </div>
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
                    </div>
                    <div className='busca-est'>
                      <ul>
                        {filteredEstudiantes.map((estudiante, index) => (
                          <li key={index}>
                            {estudiante.nombre}
                            {selectedEstudiantes.find((e) => e.id === estudiante.id) ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveEstudiante(estudiante)}
                              >
                                Quitar
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelectEstudiante(estudiante)}
                              >
                                Seleccionar
                              </button>
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
                            {getParentData(estudiante.id_padre) ? (
                              <>
                                <p>Nombre del Padre: {getParentData(estudiante.id_padre).nombre}</p>
                                <p>Apellido del Padre: {getParentData(estudiante.id_padre).apellido}</p>
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
                {formType === 'cursos' && (
                  <div>
                    <label>Seleccionar Cursos:</label>
                    <div className='busc-cursos'>
                      {cursos.map((curso) => (
                        <div key={curso.id}>
                          <input
                            type="checkbox"
                            id={`curso-${curso.id}`}
                            checked={selectedCursos.includes(curso.id)}
                            onChange={() => handleSelectCurso(curso.id)} />
                          <label htmlFor={`curso-${curso.id}`}>{curso.nombre}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="button-container">
                  <button type="submit">{editingCita ? 'Guardar Cambios' : 'Crear Citación'}</button>
                  <button type="button" className="cancel-button" onClick={() => setFormVisible(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
