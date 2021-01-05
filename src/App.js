import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import Header from "./component/layout/Header";
import Home from "./component/pages/Home";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import UserContext from "./context/UserContext";

import "./style.css";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  // A function that runs when the app first starts
  // Effects cannot be async, so create an async arrow function and call it
  // within useEffect
  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");

      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      // Returns true if token is valid and user is logged in, otherwise false
      const tokenResponse = await Axios.post(
        "http://localhost:5000/users/tokenIsValid",
        null,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (tokenResponse.data) {
        const userResponse = await Axios.get("http://localhost:5000/users/", {
          headers: {
            "x-auth-token": token,
          },
        }).catch((error) => console.log(error));

        setUserData({
          token,
          user: userResponse.data,
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
            </Switch>
          </div>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
