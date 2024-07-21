import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";

const AuthVerify = (props) => {
  let location = useLocation();

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');

    if (userToken) {
      const decodedJwt = jwtDecode(userToken);

      if (decodedJwt.exp * 1000 < Date.now()) {
        props.logOut()
        toast.error("Ihre Sizung ist abgelaufen. Bitte melden sie sich erneut an");
      }
    }
  }, [location, props]);

  return;
};

export default AuthVerify;