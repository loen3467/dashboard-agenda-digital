import { forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Captcha = forwardRef((props, ref) => {
  const onChange = () => {
    if (ref.current.getValue()) {
      console.log("El usuario NO es un robot");
    }
  };
  return (
    <ReCAPTCHA
      ref={ref}
      sitekey="6Lfp3-gpAAAAAB7YEQ-eV4ASVQV69ls8kYbNU4gu"
      onChange={onChange}
    />
  );
});

export default Captcha;
