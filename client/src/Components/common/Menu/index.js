import React, { useEffect, useState, useContext } from "react";
import "./menu.scss";
import { useHistory, useLocation } from "react-router-dom";
import { MainContext, getItem } from "algaeh-react-components";
import PasswordChange from "../passwordChange";
import { Notifications } from "../Notifications";
import Items from "./item";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import BreadCrum from "./breadcrum";
import localSrc from "./algaehlogo.png";
import { i18next } from "algaeh-react-components";
import { Badge } from "antd";
import { HelpCenter } from "../HelpCenter";
// import { newAlgaehApi } from "../../../hooks";

function NavBars(props) {
  const {
    userLanguage,
    userToken,
    setUserLanguage,

    setSelectedMenuItem,
    userMenu,
    socket,
  } = useContext(MainContext);
  const history = useHistory();
  const location = useLocation();
  // const [title, setTitle] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(undefined);
  const [count, setCount] = useState(null);
  // const [show, setshow] = useState();

  //   function checkFollowUP(data){
  //     newAlgaehApi({

  //     }).then((response) =>{
  // if(response.data.success){
  //   if(response.data.result.length > 0){
  //     location.state = null;
  //                 history.goBack();
  //   }else{

  //   }
  // }
  //     })
  //   }
  useEffect(() => {
    // if (is_authenticated) {
    //   getItem("menu").then((result) => {
    //     setUserMenu(result);
    //   });
    //   getItem("token").then((result) => {
    //     if (result === null) {
    //       history.push("/");
    //       return;
    //     }
    //     const details = tokenDecode(result);

    //     setUserToken(details);
    //   });
    // }
    getItem("userSelectedMenu").then((item) => {
      if (item === null) return;
      setSelectedMenuItem(item);
      setSelectedMenu(() => {
        return item;
      });
    });

    if (socket.connected) {
      socket.on("count", (res) => {
        setCount(res);
      });
    }
  }, []); //eslint-disable-line

  function showMenuClick() {
    setShowMenu((result) => !result);
  }

  function showNotification() {
    if (socket.connected && !openNotif) {
      // socket.emit("seen");
      //Todo:Here added Comment
      // setCount(null);
    }
    setOpenNotif((state) => !state);
  }

  function languageChange(e) {
    const { lang } = e.target;
    if (userLanguage !== lang) {
      setUserLanguage(lang);
      location.state = { language: lang };
      i18next.changeLanguage(lang);
    }
  }

  function onPasswordChange() {
    setShowPasswordChange(true);
  }
  function onPreferenceClick() {
    history.push("/preferences");
  }
  function onLogoutClick() {
    algaehApiCall({
      uri: "/apiAuth/logout",
      method: "GET",
      onSuccess: () => {
        if (socket.connected) {
          socket.emit("user_logout");
        }
        history.push("/");
        window.location.reload();
      },
    });
  }
  function addDefaultSrc(e) {
    e.target.src = localSrc;
  }
  const { product_name, followup_alert_required } = userToken;
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark mainTheme">
        {location.state ? (
          <div
            className="sideBackButton"
            onClick={() => {
              if (location.state["EHR-STD"] === "PatientProfile") {
                if (
                  Window.global.followUpRequired &&
                  followup_alert_required === "Y"
                ) {
                  Window.global.openFollowUp();

                  // console.log(Window.global);
                  return;
                } else {
                  location.state = null;
                  history.goBack();
                }
              } else {
                location.state = null;
                history.goBack();
              }
            }}
          >
            <i className="fas fa-angle-double-left  fa-lg" />
          </div>
        ) : (
          <div className="sideMenuBars" onClick={showMenuClick}>
            <i className="fas fa-bars fa-lg" />
          </div>
        )}

        <div className="navbar-brand appLogoCntr">
          <span className="appCustomLogo">
            <img
              src={`${window.location.protocol}//${window.location.hostname}${
                window.location.port ? ":3006" : "/docServer"
              }/api/v1/Document/getLogo?image_id=${
                userToken.organization_id
              }&logo_type=APP`}
              alt="client logo"
              onError={addDefaultSrc}
            />
            {/* load client logo here  */}
          </span>
          <span>
            <i className="appName">
              {product_name !== null ? product_name : "Algaeh ERP"}
            </i>
          </span>
        </div>
        <h5 className="topNavbar-title mr-auto">
          <BreadCrum
            selectedMenu={selectedMenu}
            userMenu={userMenu}
            userLanguage={userLanguage}
            setSelectedMenuItem={setSelectedMenuItem}
          />
        </h5>
        <div className="navTopBarRight">
          <div className="loginProfileInfo">
            <span>{userToken.full_name}</span>
            <span>{userToken.hospital_name}</span>
          </div>
        </div>
        <button
          style={{
            marginRight: 0,
          }}
          className="dropdown navTopbar-dropdown notiIconCntr"
          // disabled={openNotif}
          onClick={showNotification}
        >
          {count ? <Badge count={count} /> : null}
          <i className="fas fa-bell fa-lg" />
        </button>
        <button
          style={{
            marginRight: 0,
          }}
          className="dropdown navTopbar-dropdown"
          // disabled={open}
          onClick={() => setOpenHelp(true)}
        >
          <i className="fas fa-question-circle fa-lg" />
        </button>
        <div className="dropdown navTopbar-dropdown">
          <i className="fas fa-angle-down fa-lg" />
          <div
            className="dropdown-menu animated fadeIn faster"
            aria-labelledby="dropdownMenuButton"
          >
            <button
              className="dropdown-item"
              onClick={languageChange}
              lang="en"
            >
              {userLanguage === "en" ? <span> &#10004;</span> : null}
              &nbsp; English
            </button>
            {userToken.other_lang_short !== undefined ? (
              <button
                className="dropdown-item"
                onClick={languageChange}
                lang={userToken.other_lang_short}
              >
                {userLanguage === userToken.other_lang_short ? (
                  <span> &#10004;</span>
                ) : null}
                &nbsp; {userToken.other_lang}
              </button>
            ) : null}
            <div className="dropdown-divider" />
            <button className="dropdown-item" onClick={onPasswordChange}>
              <i className="fas fa-key" /> Change Password
            </button>
            <div className="dropdown-divider" />
            <button className="dropdown-item" onClick={onPreferenceClick}>
              <i className="fas fa-cubes" /> User Preference
            </button>
            <div className="dropdown-divider" />
            <button className="dropdown-item">
              <i className="fas fa-question-circle" /> Help
            </button>
            <div className="dropdown-divider" />
            <button className="dropdown-item" onClick={onLogoutClick}>
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </div>
        </div>
      </nav>
      <PasswordChange
        showPasswordChange={showPasswordChange}
        onVisibityChange={() => {
          setShowPasswordChange(false);
        }}
      />
      <Items
        openModule={selectedMenu !== undefined ? selectedMenu.module_code : ""}
        openScreen={selectedMenu !== undefined ? selectedMenu.screen_name : ""}
        showMenu={showMenu}
        onVisibityChange={() => {
          setShowMenu(false);
        }}
      />
      <Notifications
        count={count}
        open={openNotif}
        handlePanel={() => {
          setOpenNotif(false);
        }}
      />
      <HelpCenter
        visible={openHelp}
        onClose={() => {
          setOpenHelp(false);
        }}
      />
    </>
  );
}

export default NavBars;
