import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

export function Layout() {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const toogleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };
  return (
    <>
      <Sidebar isSidebarHidden={isSidebarHidden} />
      <section id="content">
        <Navbar toogleSidebar={toogleSidebar} />
        <Outlet />
      </section>
    </>
  );
}
