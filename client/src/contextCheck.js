import React, { useContext, useEffect } from "react";
import { MainContext } from "algaeh-react-components/context";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
export default function({ children }) {
  const { userLanguage, userToken, setUserMenu, setUserToken } = useContext(
    MainContext
  );
  useEffect(() => {
    if (Object.keys(userToken).length > 0) {
      getItem("menu").then(result => {
        if (result !== undefined) {
          setUserMenu(result);
          getItem("token").then(result => {
            const details = tokenDecode(result);
            setUserToken(details);
          });
        }
      });
    }
  }, []);
  return <>{children}</>;
}
