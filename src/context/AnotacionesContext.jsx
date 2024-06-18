import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/config";

const AnotacionesContext = createContext();

export function AnotacionesProvider({ children }) {
  const [anotaciones, setAnotaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const createAnotacion = async (newAnotacion) => {
    await addDoc(collection(db, "anotaciones"), newAnotacion);
    getAnotaciones();
  };

  const editAnotacion = async (id, updatedAnotacion) => {
    const anotacionRef = doc(db, "anotaciones", id);
    await updateDoc(anotacionRef, updatedAnotacion);
    getAnotaciones();
  };

  const getAnotaciones = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const toggleAnotacion = async (id, estado) => {
    const anotacionRef = doc(db, "anotaciones", id);
    await updateDoc(anotacionRef, {
      estado: !estado,
    });
    getAnotaciones();
  };

  useEffect(() => {
    getAnotaciones();
  }, []);

  return (
    <AnotacionesContext.Provider
      value={{
        anotaciones,
        loading,
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
