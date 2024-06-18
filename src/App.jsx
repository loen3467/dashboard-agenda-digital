import "./App.css";
import { MyRoutes } from "./routes/routes";
import { AuthContextProvider } from "./context/AuthContext";
import { TareasProvider } from "./context/TareasContext";
import { AnotacionesProvider } from "./context/AnotacionesContext";

function App() {
  return (
    <>
      <AnotacionesProvider>
        <TareasProvider>
          <AuthContextProvider>
            <MyRoutes />
          </AuthContextProvider>
        </TareasProvider>
      </AnotacionesProvider>
    </>
  );
}

export default App;
