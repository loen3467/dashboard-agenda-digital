import "../styles/createEdit.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAnotaciones } from "../../context/AnotacionesContext";

export default function EditAnot() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [id_est, setIdEst] = useState("");
  const [id_profesor, setIdProfesor] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const { editAnotacion } = useAnotaciones();

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

    const getAnotacionById = async (id) => {
      const anotacionDoc = await getDoc(doc(db, "anotaciones", id));
      if (anotacionDoc.exists()) {
        const anotacion = anotacionDoc.data();
        setTitulo(anotacion.titulo);
        setDescripcion(anotacion.descripcion);
        setIdEst(anotacion.id_est.id);
        setIdProfesor(anotacion.id_profesor.id);
      } else {
        console.log("La anotación no existe");
      }
    };

    getEstudiantes();
    getProfesores();
    getAnotacionById(id);
  }, [id]);

  const update = async (e) => {
    e.preventDefault();
    const estudianteRef = doc(db, "estudiantes", id_est);
    const profesorRef = doc(db, "profesores", id_profesor);
    await editAnotacion(id, {
      titulo,
      descripcion,
      id_est: estudianteRef,
      id_profesor: profesorRef,
    });
    navigate("/anotaciones");
  };

  return (
    <div className="edit-container">
      <div className="row">
        <div className="col">
          <form onSubmit={update}>
            <div className="form-group">
              <label className="form-label">Título</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estudiante</label>
              <select
                value={id_est}
                onChange={(e) => setIdEst(e.target.value)}
                className="form-control"
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
                <i className="bx bx-upload"></i>
                <span>Actualizar</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/anotaciones")}
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
