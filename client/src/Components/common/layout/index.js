import React, { useContext } from "react";
import "../AlgaehmainPage/AlgaehmainPage.scss";
import Menu from "../Menu";
import { MainContext } from "algaeh-react-components";
export default function Layout({ path, noSecurityCheck, children }) {
  const {
    // userMenu,
    userLanguage,
    // setUserMenu,
    // setUserToken,
    // setElementsItems,
    // setSelectedMenuItem,
    // setUserPreferencesData,
  } = useContext(MainContext);
  // const [pageLoading, setPageLoading] = useState(false);
  // const [text] = useState("Please wait configure is in process");

  // useEffect(() => {
  //   if (userMenu.length) {
  //     setPageLoading(true);
  //   } else {
  //     getItem("menu").then((result) => {
  //       setUserMenu(result);
  //       getItem("elements").then((result) => {
  //         setElementsItems(result);
  //       });
  //       getItem("token").then((result) => {
  //         const details = tokenDecode(result);
  //         setUserToken(details);
  //         setPageLoading(true);
  //       });
  //       getItem("userSelectedMenu").then((result) => {
  //         setSelectedMenuItem(result);
  //       });
  //       getItem("userPreferences").then((result) => {
  //         setUserPreferencesData(result);
  //       });
  //     });
  //   }
  // }, []); // eslint-disable-line

  // function checkHasAccessToPage() {
  //   if (noSecurityCheck === true) return true;
  //   if (selectedMenu === null) return false;
  //   if (Object.keys(selectedMenu).length === 0) {
  //     return false;
  //   } else {
  //     if (
  //       String(path).toLowerCase() ===
  //       "/" +
  //         String(selectedMenu["page_to_redirect"])
  //           .toLowerCase()
  //           .replace(/ /g, "")
  //     ) {
  //       return true;
  //     } else {
  //       const hasPage = selectedMenu["child_pages"].find(
  //         f => String(f).toLowerCase() === String(path).toLowerCase()
  //       );
  //       if (hasPage !== undefined) return true;
  //       else return false;
  //     }
  //   }
  // }

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
        {/* {pageLoading ? <>{children}</> : <center>{text}</center>} */}
        <>{children}</>
      </main>
    </>
  );
}

/* {checkHasAccessToPage() ? (
  <>{children}</>
 ) : (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
      />
    )} */
