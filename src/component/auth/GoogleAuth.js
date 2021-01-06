import * as queryString from "query-string";
import React, { useEffect, useContext } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";

const GoogleAuth = () => {
  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    const getGoogleUserData = async () => {
      const urlParams = queryString.parse(window.location.search);

      if (urlParams.error) {
        console.log(`An error occurred: ${urlParams.error}`);
      } else {
        const code = urlParams.code;

        const userResponse = await Axios.post("http://localhost:4000/google/", {
          code,
        });

        const userData = userResponse.data;
        // Check if the user has an account in the User DB
        // If yes, login the user, create JWT tokens and redirect to home page
        const loginResponse = await Axios.post(
          "http://localhost:4000/google/login",
          {
            email: userData.email,
          }
        );

        setUserData({
          refreshToken: loginResponse.data.refreshToken,
          accessToken: loginResponse.data.accessToken,
          user: loginResponse.data.user,
        });

        Cookies.set("auth-token", loginResponse.data.refreshToken);
        history.push("/");

        // If no, redirect to register page
      }
    };

    getGoogleUserData();
  });

  return <div>Google Auth</div>;
};

export default GoogleAuth;
