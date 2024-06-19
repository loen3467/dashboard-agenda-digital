// src/context/CursosContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const CursosContext = createContext();

export function CursosProvider({ children }) {
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  const createCurso = async (cursoData, estudiantesIds) => {
    const cursoRef = collection(db, "cursos");
    const newCursoRef = await addDoc(cursoRef, cursoData);
    const cursoId = newCursoRef.id;

    await Promise.all(
      estudiantesIds.map(async (estudianteId) => {
        const estudianteRef = doc(db, "estudiantes", estudianteId);
        await updateDoc(estudianteRef, {
          id_curso: doc(db, "cursos", cursoId),
        });
      })
    );
    await fetchData();
    return cursoId;
  };

  const updateCurso = async (cursoId, cursoData, estudiantesIds) => {
    const cursoRef = doc(db, "cursos", cursoId);
    await setDoc(cursoRef, cursoData, { merge: true });

    await Promise.all(
      estudiantesIds.map(async (estudianteId) => {
        const estudianteRef = doc(db, "estudiantes", estudianteId);
        await updateDoc(estudianteRef, { id_curso: cursoRef });
      })
    );
    await fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    const cursosCollection = collection(db, "cursos");
    const cursosData = await getDocs(cursosCollection);

    const cursosList = await Promise.all(
      cursosData.docs.map(async (docSnap) => {
        const cursoData = docSnap.data();
        const estudiantesRefs = cursoData.estudiantes ?? [];
        const materiasRefs = cursoData.id_materias ?? [];

        const estudiantesData = await Promise.all(
          estudiantesRefs.map(async (estudianteRef) => {
            const estudianteDoc = await getDoc(estudianteRef);
            return estudianteDoc.exists() ? estudianteDoc.data() : null;
          })
        );

        const materiasData = await Promise.all(
          materiasRefs.map(async (materiaRef) => {
            const materiaDoc = await getDoc(materiaRef);
            return materiaDoc.exists() ? materiaDoc.data() : null;
          })
        );

        return {
          id: docSnap.id,
          ...cursoData,
          estudiantes: estudiantesData.filter(
            (estudiante) => estudiante !== null
          ),
          materias: materiasData.filter((materia) => materia !== null),
        };
      })
    );

    setCursos(cursosList);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getEstudiantes = async () => {
      const estudiantesCollection = collection(db, "estudiantes");
      const data = await getDocs(estudiantesCollection);
      const estudiantesList = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEstudiantes(estudiantesList);
    };

    const getMaterias = async () => {
      const materiasCollection = collection(db, "materias");
      const data = await getDocs(materiasCollection);
      const materiasList = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterias(materiasList);
    };

    getEstudiantes();
    getMaterias();
  }, []);

  return (
    <CursosContext.Provider
      value={{
        cursos,
        loading,
        createCurso,
        updateCurso,
        estudiantes,
        materias,
      }}
    >
      {children}
    </CursosContext.Provider>
  );
}

export function useCursos() {
  return useContext(CursosContext);
}
