import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import Header from "./component/layout/Header";
import Home from "./component/pages/Home";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import GoogleAuth from "./component/auth/GoogleAuth";
import GoogleLogin from "./component/auth/GoogleLogin";
import GoogleRegister from "./component/auth/GoogleRegister";
import UserContext from "./context/UserContext";
import Cookies from "js-cookie";

import "./style.css";

function App() {
  const [userData, setUserData] = useState({
    refreshToken: undefined,
    accessToken: undefined,
    user: undefined,
  });

  // A function that runs when the app first starts
  // Effects cannot be async, so create an async arrow function and call it
  // within useEffect
  useEffect(() => {
    const checkLoggedIn = async () => {
      let refreshToken = Cookies.get("auth-token");
      let accessToken;

      if (refreshToken === undefined) {
        Cookies.remove("auth-token");
        refreshToken = undefined;
        accessToken = undefined;
      } else {
        // Returns true if refresh token is valid and user is logged in, otherwise false
        const tokenResponse = await Axios.post(
          "http://localhost:4000/tokenIsValid",
          null,
          {
            headers: {
              "x-auth-token": refreshToken,
            },
          }
        );

        // If refresh Token is valid, refresh the access token
        if (tokenResponse && accessToken === undefined) {
          const newAccessTokenResponse = await Axios.post(
            "http://localhost:4000/token",
            { token: refreshToken }
          );
          accessToken = newAccessTokenResponse.data;
        }

        // With the now valid access token, get the user's data from the User API
        const user = await Axios.post("http://localhost:5000/users/", null, {
          headers: {
            "x-auth-token": accessToken,
          },
        });

        setUserData({
          refreshToken,
          accessToken,
          user: user.data,
        });
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <>
      <UserContext.Provider value={{ userData, setUserData }}>
        <BrowserRouter>
          <Header />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/register" component={Register}></Route>
              <Route path="/google" component={GoogleAuth}></Route>
              <Route path="/google/login" component={GoogleLogin}></Route>
              <Route path="/google/register" component={GoogleRegister}></Route>
            </Switch>
          </div>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
