import "../styles/createEdit.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAnotaciones } from "../../context/AnotacionesContext";

export default function CreateAnot() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [id_est, setIdEst] = useState("");
  const [id_profesor, setIdProfesor] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [estado, setEstado] = useState(true);
  const navigate = useNavigate();
  const { createAnotacion } = useAnotaciones();

  useEffect(() => {
    const getEstudiantes = async () => {
      const estudiantesCollection = collection(db, "estudiantes");
      const data = await getDocs(estudiantesCollection);
      setEstudiantes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const getProfesores = async () => {
      const profesoresCollection = collection(db, "profesores");
      const data = await getDocs(profesoresCollection);
      setProfesores(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getEstudiantes();
    getProfesores();
  }, []);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };

  const create = async (e) => {
    e.preventDefault();
    const estudianteRef = doc(db, "estudiantes", id_est);
    const profesorRef = doc(db, "profesores", id_profesor);
    await createAnotacion({
      titulo,
      descripcion,
      fecha_creacion: getCurrentDate(),
      id_est: estudianteRef,
      id_profesor: profesorRef,
      estado,
    });
    navigate("/anotaciones");
  };

  return (
    <div className="create-container">
      <div className="row">
        <div className="col">
          <form onSubmit={create}>
            <div className="form-group">
              <label className="form-label">Título</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                type="text"
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                type="text"
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estudiante</label>
              <select
                value={id_est}
                onChange={(e) => setIdEst(e.target.value)}
                className="form-control"
                required
              >
                <option value="">Seleccione un Estudiante</option>
                {estudiantes.map((estudiante) => (
                  <option key={estudiante.id} value={estudiante.id}>
                    {estudiante.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Profesor</label>
              <select
                value={id_profesor}
                onChange={(e) => setIdProfesor(e.target.value)}
                className="form-control"
                required
              >
                <option value="">Seleccione un Profesor</option>
                {profesores.map((profesor) => (
                  <option key={profesor.id} value={profesor.id}>
                    {profesor.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="buttons">
              <button type="submit" className="btn-primary">
                <i className="bx bxs-save"></i>
                <span>Guardar</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(-1)}
              >
                <i className="bx bx-x-circle"></i>
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
