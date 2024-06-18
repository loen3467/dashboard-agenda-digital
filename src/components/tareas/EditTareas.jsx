import "../styles/createEdit.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDoc,
  updateDoc,
  doc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useTareas } from "../../context/TareasContext"; // Importamos el contexto
import { Loader } from "../../utils/Loader";

export default function EditTareas() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [materias, setMaterias] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const { editTarea, loading, setLoading, getTareas } = useTareas(); // Usamos el contexto para actualizar la tarea

  useEffect(() => {
    const getMaterias = async () => {
      const materiasCollection = collection(db, "materias");
      const data = await getDocs(materiasCollection);
      setMaterias(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const getTareaById = async (id) => {
      const tareaDoc = await getDoc(doc(db, "tareas", id));
      if (tareaDoc.exists()) {
        const tarea = tareaDoc.data();
        setTitulo(tarea.titulo);
        setDescripcion(tarea.descripcion);
        setFechaEntrega(tarea.fecha_entrega);
        setMateriaId(tarea.idmateria.id);
      } else {
        console.log("La tarea no existe");
      }
    };
    getMaterias();
    getTareaById(id);
  }, []);

  const update = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tareaRef = doc(db, "tareas", id);
      const materiaRef = doc(db, "materias", materiaId);
      const updatedTarea = {
        titulo,
        descripcion,
        fecha_entrega: fechaEntrega,
        idmateria: materiaRef,
      };
      console.log(updatedTarea);

      await updateDoc(tareaRef, updatedTarea);

      // Actualizamos el contexto con la tarea editada
      editTarea({ ...updatedTarea, id });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      navigate(-1);
      setLoading(false);
    }
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="edit-container">
      <div className="row">
        <div className="col">
          <form onSubmit={update}>
            <div className="formGroup">
              <label className="formLabel">Título</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                type="text"
                className="formControl"
                required
              />
            </div>
            <div className="formGroup">
              <label className="formLabel">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                type="text"
                className="formControl"
                required
              />
            </div>
            <div className="formGroup">
              <label className="formLabel">Fecha de Entrega</label>
              <input
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                type="date"
                className="formControl"
                required
              />
            </div>
            <div className="formGroup">
              <label className="formLabel">Materia</label>
              <select
                value={materiaId}
                onChange={(e) => setMateriaId(e.target.value)}
                className="formControl"
                required
              >
                <option value="">Seleccione una materia</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="buttons">
              <button type="submit" className="btnPrimary">
                <i className="bx bx-upload"></i>
                <span>Actualizar</span>
              </button>
              <button
                onClick={() => navigate("/tareas")}
                type="button"
                className="btnSecondary"
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
