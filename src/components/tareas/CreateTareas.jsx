import "../styles/createEdit.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useTareas } from "../../context/TareasContext";
import { Loader } from "../../utils/Loader";

export default function CreateTareas() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [materias, setMaterias] = useState([]);
  const [estado, setEstado] = useState(true);
  const navigate = useNavigate();
  const { createTarea, loading, setLoading } = useTareas();

  const tareasCollection = collection(db, "tareas");

  useEffect(() => {
    const getMaterias = async () => {
      const materiasCollection = collection(db, "materias");
      const data = await getDocs(materiasCollection);
      setMaterias(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getMaterias();
  }, []);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}/${month}/${day}`;
    return formattedDate;
  };

  const create = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const materiaRef = doc(db, "materias", materiaId);
      const newTarea = {
        titulo: titulo,
        descripcion: descripcion,
        fecha_entrega: fechaEntrega,
        fecha_creacion: getCurrentDate(),
        idmateria: materiaRef,
        estado: estado,
      };

      const docRef = await addDoc(tareasCollection, newTarea);
      const createdTarea = { ...newTarea, id: docRef.id };

      // Actualizamos el contexto con la nueva tarea
      createTarea(createdTarea);
      navigate("/tareas");
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

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
              <label className="form-label">Fecha de Entrega</label>
              <input
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                type="date"
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Materia</label>
              <select
                value={materiaId}
                onChange={(e) => setMateriaId(e.target.value)}
                className="form-control"
                required
              >
                <option>Seleccione una Materia</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
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
                onClick={() => navigate("/tareas")}
                type="button"
                className="btn-secondary"
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
