import React, { useContext } from "react";
import { MainContext } from "algaeh-react-components";
import "./defaultlandingPage.scss";
export default function () {
  const { userToken, userLanguage } = useContext(MainContext);
  return (
    <div className="noLandingPage">
      <span className="menuBarHere">Click Burger Menu for Side</span>
      <span className="userPreferenceHere">
        Click Arrow for User Preference
      </span>
      <center>
        <h1>
          Hello,{" "}
          {userLanguage === "en" ? userToken.full_name : userToken.arabic_name}
        </h1>
        <p>You have not created any landing page</p>
        <p>
          Select desired landing page under <b>User Preference</b> or Change to
          other screens from <b>Left Menu Bar</b>
        </p>
      </center>
    </div>
  );
}
