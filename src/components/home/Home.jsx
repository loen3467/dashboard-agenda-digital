import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../api/Firebase";

export function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUserName(user.displayName);
        } else {
          setUserName("");
        }
      }),
    []
  );
  const Salir = () => {
    auth.signOut();
    navigate("/");
  };
  return (
    <div>
      <h1>Home</h1>
      <div>
        <h3>
          {userName ? (
            "Bienvenido " + userName
          ) : (
            <div>
              <div>
                <Link to={"/login"}>Login</Link>
              </div>
            </div>
          )}
        </h3>
      </div>
      <button onClick={Salir}>Salir</button>
    </div>
  );
}
