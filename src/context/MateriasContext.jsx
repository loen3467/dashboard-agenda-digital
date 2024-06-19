import { createContext, useContext, useState, useEffect } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const MateriasContext = createContext();

export const useMaterias = () => useContext(MateriasContext);

export const MateriasProvider = ({ children }) => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);

  useEffect(() => {
    getMaterias();
  }, []);

  const getMaterias = async () => {
    setLoading(true);
    const materiasCollection = collection(db, "materias");
    const data = await getDocs(materiasCollection);

    const materiasList = await Promise.all(
      data.docs.map(async (doc) => {
        const materia = doc.data();

        // Obtener el nombre del curso
        const cursoRef = materia.id_curso;
        const cursoDoc = await getDoc(cursoRef);
        const cursoNombre = cursoDoc.exists()
          ? cursoDoc.data().nombre
          : "Curso no encontrado";

        // Obtener el nombre del profesor
        const profesorRef = materia.id_profesor;
        const profesorDoc = await getDoc(profesorRef);
        const profesorNombre = profesorDoc.exists()
          ? profesorDoc.data().nombre
          : "Profesor no encontrado";

        return {
          id: doc.id,
          ...materia,
          cursoNombre,
          profesorNombre,
        };
      })
    );

    setMaterias(materiasList);
    setLoading(false);
  };

  const getCursosAndProfesores = async () => {
    const cursosData = await getDocs(collection(db, "cursos"));
    const profesoresData = await getDocs(collection(db, "profesores"));

    setCursos(cursosData.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setProfesores(
      profesoresData.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const createMateria = async (materiaData) => {
    const materiasRef = collection(db, "materias");
    const newMateriaRef = await addDoc(materiasRef, materiaData);
    await getMaterias();
    return newMateriaRef.id;
  };

  const toggleMateriaStatus = async (id, status) => {
    const materiaRef = doc(db, "materias", id);
    await updateDoc(materiaRef, { activa: status });
    await getMaterias();
  };

  const value = {
    materias,
    loading,
    setLoading,
    cursos,
    profesores,
    getCursosAndProfesores,
    createMateria,
    getMaterias,
    toggleMateriaStatus,
  };

  return (
    <MateriasContext.Provider value={value}>
      {children}
    </MateriasContext.Provider>
  );
};
