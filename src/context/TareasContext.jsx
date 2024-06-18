import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { createContext, useContext, useState } from "react";
import { db } from "../firebase/config";

const TareasContext = createContext();

export function TareasProvider({ children }) {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  const createTarea = (newTarea) => {
    setTareas((prevTareas) => [...prevTareas, newTarea]);
    getTareas();
  };

  const editTarea = (updatedTarea) => {
    setTareas((prevTareas) =>
      prevTareas.map((tarea) =>
        tarea.id === updatedTarea.id ? updatedTarea : tarea
      )
    );
    getTareas();
  };

  const getTareas = async () => {
    setLoading(true); // Iniciar loader
    try {
      const data = await getDocs(collection(db, "tareas"));
      const tareasWithMaterias = await Promise.all(
        data.docs.map(async (docSnapshot) => {
          const tareaData = docSnapshot.data();
          const tareaRef = tareaData.idmateria;
          let materiaData = null;

          if (tareaRef) {
            const materiaDoc = await getDoc(tareaRef);
            if (materiaDoc.exists()) {
              materiaData = materiaDoc.data();
            }
          }

          return { ...tareaData, id: docSnapshot.id, idmateria: materiaData };
        })
      );
      setTareas(tareasWithMaterias);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false); // Finalizar loader
    }
  };
  const toggleTarea = async (id, estado) => {
    const tareaDoc = doc(db, "tareas", id);
    await updateDoc(tareaDoc, {
      estado: !estado,
    });
    getTareas();
  };

  return (
    <TareasContext.Provider
      value={{
        tareas,
        setTareas,
        loading,
        setLoading,
        createTarea,
        editTarea,
        getTareas,
        toggleTarea,
      }}
    >
      {children}
    </TareasContext.Provider>
  );
}

export function useTareas() {
  return useContext(TareasContext);
}
