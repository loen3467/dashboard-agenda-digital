import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { useState } from "react";
import "./styles/loginContainer.scss";
export function LoginContainer() {
  const [loginPanel, setLoginPanel] = useState(false);
  const handleLoginPanel = () => {
    setLoginPanel(!loginPanel);
  };
  return (
    <section className="login-container" id="login-container">
      <div
        className={`login ${loginPanel ? "right-panel-active" : ""}`}
        id="container"
      >
        <SignUp />
        <SignIn />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>¡Bienvenido de Nuevo!</h1>
              <p>
                Para mantenerse conectado con nosotros, inicie sesión con su
                información personal
              </p>
              <button
                className="btn-login ghost"
                id="signIn"
                onClick={handleLoginPanel}
              >
                Iniciar Sesión
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>¡Hola, Amigo!</h1>
              <p>
                Introduce tus datos personales y comienza tu viaje con nosotros.
              </p>
              <button
                className="btn-login ghost"
                id="signUp"
                onClick={handleLoginPanel}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
