import "./App.css";
import { MyRoutes } from "./routes/routes";
import { AuthContextProvider } from "./context/AuthContext";
import { TareasProvider } from "./context/TareasContext";

function App() {
  return (
    <>
      <TareasProvider>
        <AuthContextProvider>
          <MyRoutes />
        </AuthContextProvider>
      </TareasProvider>
    </>
  );
}

export default App;
