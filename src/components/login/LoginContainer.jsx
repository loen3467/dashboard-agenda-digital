import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { useState } from "react";
import "./styles/loginContainer.scss";
import logoAgenda from "../../assets/images/logo_ad.png";

export function LoginContainer() {
  const [rightPanel, setRightPanel] = useState(false);
  const handleRightPanel = () => {
    setRightPanel(!rightPanel);
  };
  return (
    <section className="login-container" id="login-container">
      <div
        className={`login ${rightPanel ? "right-panel-active" : ""}`}
        id="container"
      >
        <SignUp />
        <SignIn />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <div className={`${rightPanel ? "slide-in-right" : ""}`}>
                <img src={logoAgenda} alt="logo de la agenda" height={180} />
              </div>
              <h1 className={`${rightPanel ? "bounce" : ""}`}>
                ¡Bienvenido de Nuevo!
              </h1>
              <p className={`${rightPanel ? "slide-in-left" : ""}`}>
                Para mantenerse conectado con nosotros, inicie sesión con su
                información personal
              </p>
              <button
                className="btn-login ghost"
                id="signIn"
                onClick={handleRightPanel}
              >
                Iniciar Sesión
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <div className={`${rightPanel ? "" : "slide-in-left"}`}>
                <img src={logoAgenda} alt="logo de la agenda" height={180} />
              </div>
              <h1 className={`${rightPanel ? "" : "bounce"}`}>¡Hola, Amigo!</h1>
              <p className={`${rightPanel ? "" : "slide-in-right"}`}>
                Introduce tus datos personales y comienza tu viaje con nosotros.
              </p>
              <button
                className="btn-login ghost"
                id="signUp"
                onClick={handleRightPanel}
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
