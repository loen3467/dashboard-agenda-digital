import { useEffect } from "react";
import logogoogle from "../../assets/logoogle.png";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
export function SignInGoogle() {
  const navigate = useNavigate();
  const { user, googleSignIn } = UserAuth();
  const iniciarSesion = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user != null) {
      navigate("/");
    }
  }, [user]);
  return (
    <button onClick={iniciarSesion} className="btn-google">
      <img src={logogoogle} />
      <div>Iniciar sesión con Google</div>
    </button>
  );
}
