import React, { useReducer } from "react";
import { MainContext } from "algaeh-react-components";
import socket from "./sockets";

const intialState = {
  userMenu: [],
  userLanguage: "en",
  is_authenticated: false,
  userToken: {},
  selectElement: [],
  selectedMenu: {},
  userPreferences: [],
  socket,
};

const mainActionTypes = {
  SET_MENU: "SET_MENU",
  SET_LANGUAGE: "SET_LANGUAGE",
  SET_TOKEN: "SET_TOKEN",
  SET_ELEMENTS: "SET_ELEMENTS",
  SET_SELECTED_MENU: "SET_SELECTED_MENU",
  SET_USER_PREFERENCES: "SET_USER_PREFERENCES",
  CLEAR_STATE: "CLEAR_ALL",
};

const mainReducer = (state, { type = "", payload = {} }) => {
  switch (type) {
    case mainActionTypes.SET_MENU:
      return { ...state, userMenu: payload };
    case mainActionTypes.SET_LANGUAGE:
      return { ...state, userLanguage: payload };
    case mainActionTypes.SET_ELEMENTS:
      return { ...state, selectElement: payload };
    case mainActionTypes.SET_TOKEN:
      return { ...state, userToken: payload, is_authenticated: true };
    case mainActionTypes.SET_USER_PREFERENCES:
      return { ...state, userPreferences: payload };
    case mainActionTypes.SET_SELECTED_MENU:
      return { ...state, selectedMenu: payload };
    case mainActionTypes.CLEAR_STATE:
      return { ...intialState };

    default:
      return state;
  }
};

export default function MainProvider({ children }) {
  const [state, dispatch] = useReducer(mainReducer, intialState);

  const dispatches = {
    setUserMenu(data) {
      dispatch({ type: mainActionTypes.SET_MENU, payload: data });
    },
    setUserLanguage(lang) {
      dispatch({ type: mainActionTypes.SET_LANGUAGE, payload: lang });
    },
    setUserToken(tokn) {
      dispatch({ type: mainActionTypes.SET_TOKEN, payload: tokn });
    },
    setSelectedMenuItem(selected) {
      dispatch({ type: mainActionTypes.SET_SELECTED_MENU, payload: selected });
    },
    setElementsItems(data) {
      dispatch({ type: mainActionTypes.SET_ELEMENTS, payload: data });
    },
    setUserPreferencesData(data) {
      dispatch({ type: mainActionTypes.SET_USER_PREFERENCES, payload: data });
    },
    clearAll() {
      dispatch({ type: mainActionTypes.CLEAR_STATE });
    },
  };

  return (
    <MainContext.Provider
      value={{
        ...state,
        ...dispatches,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}
