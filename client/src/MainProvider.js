import React, { useReducer } from "react";
import { MainContext } from "algaeh-react-components";
import socket from "./sockets";

const intialState = {
  userMenu: [],
  flattenMenu: [],
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
  SET_TITLE: "SET_TITLE",
  SET_NATIONALITY: "SET_NATIONALITY",
  SET_RELIGION: "SET_RELIGION",
  SET_COUNTRY: "SET_COUNTRY",
  CLEAR_STATE: "CLEAR_ALL",
  SET_DEFAULT_VISIT: "SET_DEFAULT_VISIT",
};

const mainReducer = (state, { type = "", payload = {} }) => {
  switch (type) {
    case mainActionTypes.SET_MENU:
      return {
        ...state,
        userMenu: payload,
        flattenMenu: payload.map((item) => item?.ScreenList)?.flat(),
      };
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
    case mainActionTypes.SET_COUNTRY:
      return { ...state, countries: payload };
    case mainActionTypes.SET_NATIONALITY:
      return { ...state, nationalities: payload };
    case mainActionTypes.SET_RELIGION:
      return { ...state, religions: payload };
    case mainActionTypes.SET_TITLE:
      return { ...state, titles: payload };
    case mainActionTypes.SET_DEFAULT_VISIT:
      return { ...state, default_visit_type: payload };
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
    setTitles(data) {
      dispatch({ type: mainActionTypes.SET_TITLE, payload: data });
    },
    setCountries(data) {
      dispatch({ type: mainActionTypes.SET_COUNTRY, payload: data });
    },
    setReligions(data) {
      dispatch({ type: mainActionTypes.SET_RELIGION, payload: data });
    },
    setNationality(data) {
      dispatch({ type: mainActionTypes.SET_NATIONALITY, payload: data });
    },
    setVisitType(data) {
      dispatch({ type: mainActionTypes.SET_DEFAULT_VISIT, payload: data });
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
