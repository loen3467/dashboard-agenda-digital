import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useMaterias } from "../../context/MateriasContext";
import styles from "../cursos/styles/create.module.css";
import { Loader } from "../../utils/Loader";

export default function EditMateria() {
  const [nombre, setNombre] = useState("");
  const [selectedCurso, setSelectedCurso] = useState("");
  const [selectedProfesor, setSelectedProfesor] = useState("");
  const {
    getCursosAndProfesores,
    cursos,
    profesores,
    getMaterias,
    loading,
    setLoading,
  } = useMaterias();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchData(id);
    getCursosAndProfesores();
  }, [id]);

  const fetchData = async (id) => {
    const docSnap = await getDoc(doc(db, "materias", id));
    if (docSnap.exists()) {
      const materia = docSnap.data();
      setNombre(materia.nombre);
      setSelectedCurso(materia.id_curso.id);
      setSelectedProfesor(materia.id_profesor.id);
    }
  };

  const handleUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    await updateDoc(doc(db, "materias", id), {
      nombre,
      id_curso: doc(db, "cursos", selectedCurso),
      id_profesor: doc(db, "profesores", selectedProfesor),
    });
    await getMaterias();
    setLoading(false);
    navigate("/materias");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleUpdate}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          required
        />
        <select
          value={selectedCurso}
          onChange={(e) => setSelectedCurso(e.target.value)}
          required
        >
          <option value="">Selecciona un curso</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.nombre}
            </option>
          ))}
        </select>
        <select
          value={selectedProfesor}
          onChange={(e) => setSelectedProfesor(e.target.value)}
          required
        >
          <option value="">Selecciona un profesor</option>
          {profesores.map((profesor) => (
            <option key={profesor.id} value={profesor.id}>
              {profesor.nombre}
            </option>
          ))}
        </select>
        <div className="buttons">
          <button type="submit" className={styles.btn - primary}>
            Actualizar
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
