import * as queryString from "query-string";
import React, { useEffect, useContext } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import UserContext from "../../../context/UserContext";

const GoogleRegister = () => {
  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    const getGoogleUserData = async () => {
      // Use google code to get userData
      const urlParams = queryString.parse(window.location.search);

      if (urlParams.error) {
        console.log(`An error occurred: ${urlParams.error}`);
      } else {
        const code = urlParams.code;

        const userResponse = await Axios.post("http://localhost:4000/google/", {
          code,
          redirectLocation: "register",
        });

        const userData = userResponse.data;
        console.log(userData);

        // Register User
        const newUser = {
          email: userResponse.data.email,
          displayName: userResponse.data.given_name,
        };

        await Axios.post("http://localhost:4000/google/register", newUser);
        // Log User in
        const loginResponse = await Axios.post(
          "http://localhost:4000/google/login",
          {
            email: userResponse.data.email,
          }
        );

        setUserData({
          refreshToken: loginResponse.data.refreshToken,
          accessToken: loginResponse.data.accessToken,
          user: loginResponse.data.user,
        });

        // Redirect to home screen
        Cookies.set("auth-token", loginResponse.data.refreshToken);
        history.push("/");
      }
    };

    getGoogleUserData();
  }, [history, setUserData]);

  return <div>Google Register</div>;
};

export default GoogleRegister;
