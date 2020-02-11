import React, { useState } from "react";
import { MainContext } from "algaeh-react-components/context";
export default function(props) {
  const { children } = props;
  const [menu, setMenu] = useState([]);
  const [language, setLanguage] = useState("en");
  const [token, setToken] = useState({});
  const [elements, setElements] = useState([]);
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
  function setElementsItems(data) {
    setElements(data);
  }
  function clearAll() {
    setLanguage("en");
    setToken("");
    setMenu([]);
    setElements([]);
    setSelectedMenu({});
  }

  return (
    <MainContext.Provider
      value={{
        userLanguage: language,
        userMenu: menu,
        userToken: token,
        selectedMenu: selectedMenu,
        selectElement: elements,
        setSelectedMenuItem,
        setUserMenu,
        setUserLanguage,
        setUserToken,
        setElementsItems,
        clearAll
      }}
    >
      {children}
    </MainContext.Provider>
  );
}
