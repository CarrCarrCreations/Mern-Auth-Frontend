import * as queryString from "query-string";
import React, { useEffect } from "react";
import Axios from "axios";

const GoogleAuth = () => {
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

        // Check if user has an account
        // If yes, get account info and redirect to Home
        // If no, register the user and redirect to Home
        console.log(userResponse.data);
      }
    };

    getGoogleUserData();
  }, []);

  return <div>Google Auth</div>;
};

export default GoogleAuth;
