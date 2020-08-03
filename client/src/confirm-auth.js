import React, { useEffect, useContext, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import {
  MainContext,
  tokenDecode,
  getItem,
  AlgaehMessagePop,
} from "algaeh-react-components";
import AlgaehLoader from "./Components/Wrapper/fullPageLoader";

export const ConfirmAuth = () => {
  const location = useLocation();

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    userToken,
    setUserMenu,
    setUserToken,
    setElementsItems,
    setSelectedMenuItem,
    setUserPreferencesData,
  } = useContext(MainContext);

  useEffect(() => {
    async function checkToken() {
      try {
        const result = await Promise.all([
          getItem("token"),
          getItem("menu"),
          getItem("elements"),
          getItem("userSelectedMenu"),
          getItem("userPreferences"),
        ]);

        if (result[0]) {
          const details = tokenDecode(result[0]);
          setUserToken(details);
          setUserMenu(result[1]);
          setElementsItems(result[2]);
          setSelectedMenuItem(result[3]);
          setUserPreferencesData([4]);
          setVerified(true);
          setLoading(false);
        } else {
          setVerified(false);
        }
      } catch (e) {
        setVerified(false);
        setLoading(false);
        AlgaehMessagePop({ display: e.message, type: "error" });
        console.warn(e, "message");
      }
    }
    AlgaehLoader({ show: true });
    checkToken().then(() => {
      AlgaehLoader({ show: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //     if(is_authenticated){
  //         setVerified(true)
  //     }

  // }, [is_authenticated])

  if (loading) {
    return null;
  } else {
    if (verified) {
      return (
        <Redirect
          to={
            location?.state?.from?.pathname
              ? location.state.from.pathname
              : userToken?.page_to_redirect
              ? userToken?.page_to_redirect.replace(/\s/g, "")
              : "/NoDashboard"
          }
        />
      );
    }

    if (!verified) {
      return <Redirect to={"/"} />;
    }
    return null;
  }
};
