import React, { useContext, useEffect } from "react";
import { MainContext, getItem, tokenDecode } from "algaeh-react-components";

export default function ({ children }) {
  const { userLanguage, userToken, setUserMenu, setUserToken } = useContext(
    MainContext
  );
  useEffect(() => {
    if (Object.keys(userToken).length > 0) {
      getItem("menu").then((result) => {
        if (result !== undefined) {
          setUserMenu(result);
          getItem("token").then((result) => {
            const details = tokenDecode(result);
            setUserToken(details);
          });
        }
      });
    }
  }, []);
  return <>{children}</>;
}
