import React, { useEffect, useState, useContext } from "react";
import "./menu.scss";
import { useHistory, useLocation } from "react-router-dom";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
import { MainContext } from "algaeh-react-components/context";
import PasswordChange from "../passwordChange";
import { Notifications } from "../Notifications";
import Items from "./item";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import BreadCrum from "./breadcrum";

function NavBars(props) {
  const {
    userLanguage,
    userToken,
    setUserLanguage,
    setUserMenu,
    setUserToken,
    setSelectedMenuItem,
    userMenu
  } = useContext(MainContext);
  const history = useHistory();
  const location = useLocation();
  // const [title, setTitle] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(undefined);

  useEffect(() => {
    if (Object.keys(userToken).length === 0) {
      getItem("menu").then(result => {
        setUserMenu(result);
      });
      getItem("token").then(result => {
        if (result === null) {
          history.push("/");
          return;
        }
        const details = tokenDecode(result);
        setUserToken(details);
      });
    }
    getItem("userSelectedMenu").then(item => {
      if (item === null) return;
      setSelectedMenuItem(item);
      setSelectedMenu(() => {
        return item;
      });
    });
  }, []);
  function showMenuClick() {
    setShowMenu(true);
  }
  function showNotification() {
    setOpenNotif(true);
  }
  function languageChange(e) {
    const { lang } = e.target;
    if (userLanguage !== lang) {
      setUserLanguage(lang);
    }
  }
  function onPasswordChange() {
    setShowPasswordChange(true);
  }
  function onLogoutClick() {
    algaehApiCall({
      uri: "/apiAuth/logout",
      method: "GET",
      onSuccess: () => {
        history.push("/");
      }
    });
  }
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark mainTheme">
        {location.state ? (
          <div
            className="sideBackButton"
            onClick={() => {
              location.state = null;
              history.goBack();
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
          <p className="appLogoHIMSOnly" />
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
            <span>{userToken.user_display_name}</span>
            <span>{userToken.hospital_name}</span>
          </div>
        </div>
        <a
          style={{
            marginRight: 0
          }}
          className="dropdown navTopbar-dropdown"
          // disabled={this.state.openPanel}
          onClick={showNotification}
        >
          <i className="fas fa-bell fa-lg" />
        </a>
        <div className="dropdown navTopbar-dropdown">
          <i className="fas fa-angle-down fa-lg" />
          <div
            className="dropdown-menu animated fadeIn faster"
            aria-labelledby="dropdownMenuButton"
          >
            <a className="dropdown-item" onClick={languageChange} lang="en">
              {userLanguage === "en" ? <span> &#10004;</span> : null}
              &nbsp; English
            </a>
            {userToken.other_lang_short !== undefined ? (
              <a
                className="dropdown-item"
                onClick={languageChange}
                lang={userToken.other_lang_short}
              >
                {userLanguage === userToken.other_lang_short ? (
                  <span> &#10004;</span>
                ) : null}
                &nbsp; {userToken.other_lang}
              </a>
            ) : null}
            <div className="dropdown-divider" />
            <a className="dropdown-item" onClick={onPasswordChange}>
              <i className="fas fa-key" /> Change Password
            </a>
            <div className="dropdown-divider" />
            <a className="dropdown-item" onClick={onLogoutClick}>
              <i className="fas fa-sign-out-alt" /> Logout
            </a>
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
        open={openNotif}
        handlePanel={() => {
          setOpenNotif(false);
        }}
      />
    </>
  );
}

export default NavBars;
