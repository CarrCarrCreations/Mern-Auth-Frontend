import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import Cookies from "js-cookie";
import * as queryString from "query-string";
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";

const Register = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [displayName, setDisplayName] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const newUser = {
        email,
        password,
        passwordCheck,
        displayName,
      };

      await Axios.post("http://localhost:4000/register", newUser);

      const loginResponse = await Axios.post("http://localhost:4000/login", {
        email,
        password,
      });

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
    redirect_uri: "http://localhost:3000/google/register",
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
      <h2>Register</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form className="form" onSubmit={submit}>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Verify password"
          onChange={(e) => setPasswordCheck(e.target.value)}
        />

        <label htmlFor="display-name">Display name</label>
        <input
          id="display-name"
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <input type="submit" value="Register" />
      </form>
      <a href={googleLoginUrl}>Register with Google</a>
    </div>
  );
};

export default Register;
