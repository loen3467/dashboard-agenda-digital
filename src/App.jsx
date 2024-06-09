import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/header/Navbar";
import { MyRoutes } from "./routes/routes";
import { Sidebar } from "./components/header/Sidebar";
function App() {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const toogleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  return (
    <>
      <BrowserRouter>
        <Sidebar isSidebarHidden={isSidebarHidden} />
        <section id="content">
          <Navbar toogleSidebar={toogleSidebar} />
          <MyRoutes />
        </section>
      </BrowserRouter>
    </>
  );
}

export default App;
