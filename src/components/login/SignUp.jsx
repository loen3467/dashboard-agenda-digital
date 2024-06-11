import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Captcha from "./Captcha";
import "./styles/signInUp.scss";

export function SignUp() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
    confPass: "",
  });
  const [errMsg, setErrMsg] = useState(null);
  const navigate = useNavigate();
  const captchaRef = useRef(null);
  const [visible, setVisible] = useState({ pass: false, confPass: false });

  const tooglePassVisible = () => {
    setVisible((prev) => ({ ...prev, pass: !prev.pass }));
  };
  const toogleConfPassVisible = () => {
    setVisible((prev) => ({ ...prev, confPass: !prev.confPass }));
  };

  const Register = (e) => {
    e.preventDefault();
    if (!values.name || !values.email || !values.pass || !values.confPass) {
      setErrMsg("Llene todos los campos vacíos.");
      return;
    }
    if (values.pass !== values.confPass) {
      setErrMsg("Las contraseñas no coinciden.");
      return;
    }
    if (!captchaRef.current.getValue()) {
      setErrMsg("Por favor acepta el captcha.");
      return;
    }
    setErrMsg("");

    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        const user = res.user;
        await updateProfile(user, { displayName: values.name });
        navigate("/");
      })
      .catch((error) => {
        setErrMsg(error.message);
      });
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={Register}>
        <h1>Crea tu Cuenta</h1>
        <input
          type="text"
          placeholder="Nombre"
          autoComplete="given-name"
          required
          onChange={(event) =>
            setValues((prev) => ({ ...prev, name: event.target.value }))
          }
        />
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
        />
        <div className="password-container">
          <input
            type={visible.pass ? "text" : "password"}
            placeholder="Contraseña"
            autoComplete="current-password"
            required
            onChange={(event) =>
              setValues((prev) => ({ ...prev, pass: event.target.value }))
            }
          />
          <button type="button" onClick={tooglePassVisible}>
            {visible.pass ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="password-container">
          <input
            type={visible.confPass ? "text" : "password"}
            placeholder="Confirme su contraseña"
            autoComplete="current-password"
            required
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                confPass: event.target.value,
              }))
            }
          />
          <button type="button" onClick={toogleConfPassVisible}>
            {visible.confPass ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <Captcha ref={captchaRef} />
        <div className={`error-message ${errMsg ? "block" : "hidden"}`}>
          {errMsg}
        </div>
        <button className="btn-login" type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
}
