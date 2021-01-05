import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Cookies from "js-cookie";

const AuthOptions = () => {
  const { userData, setUserData } = useContext(UserContext);

  // The history of the URL bar of the browser
  // We use this functionary to change the URL ourselves
  const history = useHistory();

  const register = () => history.push("/register");
  const login = () => history.push("/login");
  const logout = () => {
    setUserData({
      refreshToken: undefined,
      accessToken: undefined,
      user: undefined,
    });

    Cookies.remove("auth-token");
  };

  return (
    <nav className="auth-options">
      {userData.user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </>
      )}
    </nav>
  );
};

export default AuthOptions;
