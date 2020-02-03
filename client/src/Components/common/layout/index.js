import React, { useContext, useEffect, useState } from "react";
import "../AlgaehmainPage/AlgaehmainPage.scss";
import Menu from "../Menu";
import { MainContext } from "algaeh-react-components/context";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
export default function Layout({ children }) {
  const {
    userLanguage
    //  userToken, setUserMenu, setUserToken
  } = useContext(MainContext);
  // const [pageLoading, setPageLoading] = useState(false);
  // const [text, setText] = useState("Please wait configure is in process");
  // useEffect(() => {
  //   let interval = undefined;
  //   clearInterval(interval);
  //   let counter = 0;
  //   interval = setInterval(() => {
  //     if (counter === 5) {
  //       setPageLoading(true);
  //       setText("There is problem in authentication please go to login page");
  //       clearInterval(interval);
  //       return;
  //     }
  //     counter = counter + 1;
  //     if (Object.keys(userToken).length > 0) {
  //       setPageLoading(true);
  //       clearInterval(interval);
  //     } else {
  //       getItem("menu").then(result => {
  //         setUserMenu(result);
  //         getItem("token").then(result => {
  //           const details = tokenDecode(result);
  //           setUserToken(details);
  //           setPageLoading(true);
  //           clearInterval(interval);
  //         });
  //       });

  //     }
  //   }, 1000);

  // }, [])
  // return (
  //   <> {pageLoading === true ? (<> <Menu />
  //     <main
  //       className={`mainPageArea container-fluid ${
  //         userLanguage === "en"
  //           ? "english_component"
  //           : userLanguage + "_component"
  //         }`}
  //       id="hisapp"
  //     >
  //       {children}
  //     </main> </>) : (<center>{text}</center>)}

  //   </>
  // );
  return (
    <>
      <Menu />
      <main
        className={`mainPageArea container-fluid ${
          userLanguage === "en"
            ? "english_component"
            : userLanguage + "_component"
        }`}
        id="hisapp"
      >
        {children}
      </main>
    </>
  );
}
