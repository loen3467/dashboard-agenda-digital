import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import styles from "./styles/show.module.css";

const MySwal = withReactContent(Swal);
export default function Show() {
  // const formatDate = (timestamp) => {
  //   const date = timestamp.toDate(); // Convertir a un objeto Date
  //   return date.toLocaleDateString(); // Puedes usar toLocaleString o cualquier método de formateo que prefieras
  // };

  //1 - configuramos los hooks
  const [tareas, setTareas] = useState([]);

  //2 - referenciamos a la DB firestore
  const tareasCollection = collection(db, "tareas");

  //3 - Funcion para mostrar TODOS los docs
  const getTareas = async () => {
    const data = await getDocs(tareasCollection);
    //console.log(data.docs)
    setTareas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //console.log(tareas)
  };
  //4 - Funcion para eliminar un doc
  const deleteTarea = async (id) => {
    const tareaDoc = doc(db, "tareas", id);
    await deleteDoc(tareaDoc);
    getTareas();
  };
  //5 - Funcion de confirmacion para Sweet Alert 2
  const confirmDelete = (id) => {
    MySwal.fire({
      title: "¿Elimina el producto?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        //llamamos a la fcion para eliminar
        deleteTarea(id);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  //6 - usamos useEffect
  useEffect(() => {
    getTareas();
    // eslint-disable-next-line
  }, []);
  //7 - devolvemos vista de nuestro componente

  return (
    <>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={`${styles.dGrid} ${styles.gap2}`}>
              <Link
                to="/tareas/create"
                className={`${styles.btn} ${styles.btnSecondary} ${styles.mt2} ${styles.mb2}`}
              >
                Create
              </Link>
            </div>
            <table
              className={`${styles.table} ${styles.tableDark} ${styles.tableHover}`}
            >
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Fecha de entrega</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareas.map((tarea) => (
                  <tr key={tarea.id}>
                    <td>{tarea.titulo}</td>
                    <td>{tarea.descripcion}</td>
                    <td>{tarea.fecha_entrega}</td>
                    <td>
                      <Link
                        to={`/tareas/edit/${tarea.id}`}
                        className={`${styles.btn} ${styles.btnLight}`}
                      >
                        <i className="bx bx-edit"></i>
                      </Link>
                      <button
                        onClick={() => {
                          confirmDelete(tarea.id);
                        }}
                        className={`${styles.btn} ${styles.btnDanger}`}
                      >
                        <i className="bx bx-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
