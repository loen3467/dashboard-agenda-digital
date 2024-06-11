import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { SignInGoogle } from "./SignInGoogle";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Captcha from "./Captcha";
import "./styles/signInUp.scss";

export function SignIn() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", pass: "" });
  const [errMsg, setErrMsg] = useState(null);
  const [visible, setVisible] = useState(false);
  const captchaRef = useRef(null);

  const tooglePassVisible = () => {
    setVisible(!visible);
  };

  const Ingresar = (e) => {
    e.preventDefault();

    if (!values.email || !values.pass) {
      setErrMsg("Llenar todos los campos.");
      return;
    }
    if (!captchaRef.current.getValue()) {
      setErrMsg("Por favor acepta el captcha.");
      return;
    }
    setErrMsg("");

    signInWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        const user = res.user;
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        setErrMsg(error.message);
        console.log(error);
        console.log(error.code);
        let message = "";
        switch (error.code) {
          case "auth/invalid-credential":
            message = "Email y contraseña incorrectas.";
            break;
          default:
            message =
              "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
            break;
        }
        setErrMsg(message);
      });
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={Ingresar}>
        <h1>Iniciar Sesión</h1>
        <div className="social-container">
          <SignInGoogle />
        </div>
        <span>o utiliza tu cuenta</span>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              email: event.target.value,
            }))
          }
        />
        <div className="password-container">
          <input
            type={visible ? "text" : "password"}
            placeholder="Contraseña"
            autoComplete="current-password"
            required
            onChange={(event) =>
              setValues((prev) => ({ ...prev, pass: event.target.value }))
            }
          />
          <button type="button" onClick={tooglePassVisible}>
            {visible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <Captcha ref={captchaRef} />
        <a href="#">Olvidaste tu contraseña</a>
        <div className={`error-message ${errMsg ? "block" : "hidden"}`}>
          {errMsg}
        </div>
        <button className="btn-login" type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}
