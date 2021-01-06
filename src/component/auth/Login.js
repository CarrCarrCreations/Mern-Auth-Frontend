import React, { useState, useContext } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import * as queryString from "query-string";
import UserContext from "../../context/UserContext";
import { useHistory } from "react-router-dom";
import ErrorNotice from "../misc/ErrorNotice";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const loginUser = {
        email,
        password,
      };

      const loginResponse = await Axios.post(
        "http://localhost:4000/login",
        loginUser
      );

      setUserData({
        refreshToken: loginResponse.data.refreshToken,
        accessToken: loginResponse.data.accessToken,
        user: loginResponse.data.user,
      });

      Cookies.set("auth-token", loginResponse.data.refreshToken);
      history.push("/");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  // This creates the params needed to query Google for Social Media Login
  const stringifiedParams = queryString.stringify({
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    redirect_uri: "http://localhost:3000/google/login",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "), // space seperated string
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

  return (
    <div className="page">
      <h2>Login</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form className="form" onSubmit={submit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type="submit" value="Login" />
      </form>

      <a href={googleLoginUrl}>Login with Google</a>
    </div>
  );
};

export default Login;
