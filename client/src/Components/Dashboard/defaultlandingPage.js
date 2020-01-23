import React, { useContext } from "react";
import { MainContext } from "algaeh-react-components/context";
import "./defaultlandingPage.scss";
export default function() {
  const { userToken, userLanguage } = useContext(MainContext);
  return (
    <center>
      <h1>
        Welcome,{" "}
        {userLanguage === "en" ? userToken.full_name : userToken.arabic_name}
      </h1>
      <p>More Details How to use application will define here.</p>
    </center>
  );
}
