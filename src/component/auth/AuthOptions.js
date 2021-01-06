import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Cookies from "js-cookie";
import Axios from "axios";

const AuthOptions = () => {
  const { userData, setUserData } = useContext(UserContext);

  // The history of the URL bar of the browser
  // We use this functionary to change the URL ourselves
  const history = useHistory();

  const register = () => history.push("/register");
  const login = () => history.push("/login");
  const logout = async () => {
    // call logout endpoint to delete refresh tokens from database
    await Axios.post("http://localhost:4000/logout", null, {
      headers: {
        "x-auth-token": userData.accessToken,
      },
    })
      .then(() => {
        setUserData({
          refreshToken: undefined,
          accessToken: undefined,
          user: undefined,
        });

        Cookies.remove("auth-token");
        history.push("/");
      })
      .catch((err) => {
        console.log(err.message);

        setUserData({
          refreshToken: undefined,
          accessToken: undefined,
          user: undefined,
        });

        Cookies.remove("auth-token");
        history.push("/");
      });
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
