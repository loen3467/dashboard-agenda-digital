import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { createContext, useContext, useState } from "react";
import { db } from "../firebase/config";

const AnotacionesContext = createContext();

export function AnotacionesProvider({ children }) {
  const [anotaciones, setAnotaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const createAnotacion = (newAnotacion) => {
    setAnotaciones((prevAnotaciones) => [...prevAnotaciones, newAnotacion]);
    getAnotaciones();
  };

  const editAnotacion = (updatedAnotacion) => {
    setAnotaciones((prevAnotaciones) =>
      prevAnotaciones.map((anotacion) =>
        anotacion.id === updatedAnotacion.id ? updatedAnotacion : anotacion
      )
    );
    getAnotaciones();
  };

  const getAnotaciones = async () => {
    setLoading(true); // Iniciar loader
    try {
      const data = await getDocs(collection(db, "anotaciones"));
      const anotacionesWithEstudiantesProfesores = await Promise.all(
        data.docs.map(async (docSnapshot) => {
          const anotacionData = docSnapshot.data();
          const estudianteRef = anotacionData.id_est;
          const profesorRef = anotacionData.id_profesor;
          let estudianteData = null;
          let profesorData = null;

          if (estudianteRef) {
            const estudianteDoc = await getDoc(estudianteRef);
            if (estudianteDoc.exists()) {
              estudianteData = estudianteDoc.data();
            }
          }

          if (profesorRef) {
            const profesorDoc = await getDoc(profesorRef);
            if (profesorDoc.exists()) {
              profesorData = profesorDoc.data();
            }
          }

          return {
            ...anotacionData,
            id: docSnapshot.id,
            estudiante: estudianteData,
            profesor: profesorData,
          };
        })
      );
      setAnotaciones(anotacionesWithEstudiantesProfesores);
    } catch (error) {
      console.error("Error fetching annotations:", error);
    } finally {
      setLoading(false); // Finalizar loader
    }
  };

  const toggleAnotacion = async (id, estado) => {
    const anotacionDoc = doc(db, "anotaciones", id);
    await updateDoc(anotacionDoc, {
      estado: !estado,
    });
    getAnotaciones();
  };

  return (
    <AnotacionesContext.Provider
      value={{
        anotaciones,
        setAnotaciones,
        loading,
        setLoading,
        createAnotacion,
        editAnotacion,
        getAnotaciones,
        toggleAnotacion,
      }}
    >
      {children}
    </AnotacionesContext.Provider>
  );
}

export function useAnotaciones() {
  return useContext(AnotacionesContext);
}
