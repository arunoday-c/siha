import React, { useState } from "react";
import { MainContext } from "algaeh-react-components/context";
export default function(props) {
  const { children } = props;
  const [menu, setMenu] = useState([]);
  const [language, setLanguage] = useState("en");
  const [token, setToken] = useState({});

  function setUserMenu(data) {
    setMenu(data);
  }
  function setUserLanguage(lang) {
    setLanguage(() => {
      return lang;
    });
  }
  function setUserToken(tokn) {
    setToken(() => {
      return tokn;
    });
  }

  function clearAll() {
    setLanguage("en");
    setToken("");
    setMenu([]);
  }

  return (
    <MainContext.Provider
      value={{
        userLanguage: language,
        userMenu: menu,
        userToken: token,
        setUserMenu,
        setUserLanguage,
        setUserToken,
        clearAll
      }}
    >
      {children}
    </MainContext.Provider>
  );
}
