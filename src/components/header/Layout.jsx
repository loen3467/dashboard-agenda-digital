import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { auth } from "../../firebase/config";

export function Layout() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUserName(user.displayName);
          console.log(user.displayName);
        } else {
          setUserName("");
          navigate("/login");
        }
      }),
    []
  );
  const logOut = () => {
    auth.signOut();
    navigate("/login");
  };

  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const toogleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };
  return (
    <>
      <Sidebar isSidebarHidden={isSidebarHidden} logOut={logOut} />
      <section id="content">
        <Navbar toogleSidebar={toogleSidebar} />
        <Outlet />
      </section>
    </>
  );
}
