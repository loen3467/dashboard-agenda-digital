import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";

const materiasCollection = collection(db, "materias");
// Obtener todas las materias
export const getMaterias = async () => {
  const data = await getDocs(materiasCollection);
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

// Obtener una tarea por su ID
export const getTareaById = async (id) => {
  const tareaDoc = await getDoc(doc(db, "tareas", id));
  if (tareaDoc.exists()) {
    return tareaDoc.data();
  } else {
    console.log("La tarea no existe");
    return null;
  }
};

// Actualizar una tarea
export const updateTarea = async (id, data) => {
  const tareaRef = doc(db, "tareas", id);
  await updateDoc(tareaRef, data);
};

// const collectionName = "websites";

// export const saveWebsite = (newLink) =>
//   addDoc(collection(db, collectionName), newLink);

// export const updateWebsite = (id, updatedFields) =>
//   updateDoc(doc(db, collectionName, id), updatedFields);

// export const onGetLinks = (callback) => {
//   const unsub = onSnapshot(collection(db, collectionName), callback);
//   return unsub;
// };

// export const getWebsites = () => getDocs(collection(db, collectionName));

// export const deleteWebsite = (id) => deleteDoc(doc(db, collectionName, id));

// export const getWebsite = (id) => getDoc(doc(db, collectionName, id));
