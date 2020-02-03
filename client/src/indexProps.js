import React, { useState } from "react";
import { MainContext } from "algaeh-react-components/context";
export default function(props) {
  const { children } = props;
  const [menu, setMenu] = useState([]);
  const [language, setLanguage] = useState("en");
  const [token, setToken] = useState({});
  const [selectedMenu, setSelectedMenu] = useState({});

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
  function setSelectedMenuItem(selected) {
    setSelectedMenu(selected);
  }
  function clearAll() {
    setLanguage("en");
    setToken("");
    setMenu([]);
    setSelectedMenu({});
  }

  return (
    <MainContext.Provider
      value={{
        userLanguage: language,
        userMenu: menu,
        userToken: token,
        selectedMenu: selectedMenu,
        setSelectedMenuItem,
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
