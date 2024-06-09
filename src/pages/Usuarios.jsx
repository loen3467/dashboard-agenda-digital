import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuariosCollection = collection(db, 'usuarios'); // Cambia 'usuarios' por el nombre de tu colección
        const usuariosSnapshot = await getDocs(usuariosCollection);
        const usuariosList = usuariosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsuarios(usuariosList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching usuarios: ', error);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Usuarios</h2>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            <strong>{usuario.nombre}</strong> - {usuario.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
