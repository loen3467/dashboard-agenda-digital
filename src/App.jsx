import "./App.css";
import { MyRoutes } from "./routes/routes";
import { AuthContextProvider } from "./context/AuthContext";
import { TareasProvider } from "./context/TareasContext";
import { AnotacionesProvider } from "./context/AnotacionesContext";
import { CursosProvider } from "./context/CursosContext";
import { MateriasProvider } from "./context/MateriasContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <AnotacionesProvider>
          <TareasProvider>
            <CursosProvider>
              <MateriasProvider>
                <MyRoutes />
              </MateriasProvider>
            </CursosProvider>
          </TareasProvider>
        </AnotacionesProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
