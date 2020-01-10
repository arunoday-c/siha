import React, { useContext, Suspense } from "react";
import "../AlgaehmainPage/AlgaehmainPage.scss";
import Menu from "../Menu";
import { MainContext } from "algaeh-react-components/context";
export default function Layout({ children }) {
  const { userLanguage } = useContext(MainContext);

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
