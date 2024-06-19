import "../styles/createEdit.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useMaterias } from "../../context/MateriasContext";
import { Loader } from "../../utils/Loader";

export default function CreateMateria() {
  const [nombre, setNombre] = useState("");
  const [selectedCurso, setSelectedCurso] = useState("");
  const [selectedProfesor, setSelectedProfesor] = useState("");
  const {
    createMateria,
    getCursosAndProfesores,
    cursos,
    profesores,
    loading,
    setLoading,
  } = useMaterias();
  const navigate = useNavigate();

  useEffect(() => {
    getCursosAndProfesores();
  }, []);

  const handleCreate = async (e) => {
    setLoading(true);
    e.preventDefault();
    const materiaData = {
      nombre,
      id_curso: doc(db, "cursos", selectedCurso),
      id_profesor: doc(db, "profesores", selectedProfesor),
    };
    await createMateria(materiaData);
    setLoading(false);
    navigate("/materias");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="create-container">
      <div className="row">
        <div className="col">
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                type="text"
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="curso">Curso</label>
              <select
                id="curso"
                value={selectedCurso}
                onChange={(e) => setSelectedCurso(e.target.value)}
                className="form-control"
                required
              >
                <option value="">Selecciona un curso</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="profesor">Profesor</label>
              <select
                id="profesor"
                value={selectedProfesor}
                onChange={(e) => setSelectedProfesor(e.target.value)}
                className="form-control"
                required
              >
                <option value="">Selecciona un profesor</option>
                {profesores.map((profesor) => (
                  <option key={profesor.id} value={profesor.id}>
                    {profesor.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="buttons">
              <button type="submit" className="btn-primary">
                Guardar
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
