import React, { memo, useState } from "react";
import { useHistory } from "react-router-dom";
import { setItem } from "algaeh-react-components";
// import { MainContext } from "algaeh-react-components";
import { setCookie } from "../../../utils/algaehApiCall";

export default memo(function ({
  selectedMenu,
  userMenu,
  userLanguage,
  setSelectedMenuItem,
}) {
  if (selectedMenu === undefined) return null;
  const {
    module_name,
    screen_name,
    other_language,
    s_other_language,
  } = selectedMenu;

  const menuDetails = userMenu === null ? [] : userMenu;

  const selMenuDetails = menuDetails.find(
    (f) => f.module_code === selectedMenu.module_code
  );

  // const {
  //   module_name,
  //   screen_name,
  //   other_language,
  //   s_other_language,
  //   ScreenList
  // } = userMenu.find(f => f.module_code === selectedMenu.module_code);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState(0);
  const history = useHistory();
  function onShow(e) {
    setShow((value) => {
      return !value;
    });
    setPos(e.target.offsetLeft + 15);
  }
  function onClickScreen(item, display, others) {
    const screenName = display.replace(/ /g, "");
    const selMenu = { ...item, ...others };
    setItem("userSelectedMenu", selMenu);
    setSelectedMenuItem(selMenu);
    setCookie("ScreenName", screenName);
    const extraParam =
      item.redirect_url !== undefined &&
      item.redirect_url !== "" &&
      item.redirect_url !== null
        ? `/${item.redirect_url}`
        : "";
    history.push(`/${screenName}${extraParam}`);
  }
  return (
    <div className="breadCrumpMenu">
      <ul className="appMenuNavigation">
        <li>
          <span> {userLanguage === "en" ? module_name : other_language}</span>
        </li>
        <li onClick={onShow} onBlur={onShow}>
          <span> {userLanguage === "en" ? screen_name : s_other_language}</span>
          <i
            className="fas fa-sort-down"
            style={{
              fontSize: "1.3rem",
              marginTop: "5px",
            }}
          ></i>
        </li>
      </ul>

      {show === true && selMenuDetails !== undefined ? (
        <div className="dropDownList" style={{ left: `${pos}px` }}>
          <ul>
            {selMenuDetails.ScreenList.map((item, idx) => {
              if (screen_name === item.screen_name) return null;
              return (
                <li
                  key={idx}
                  onClick={() => {
                    onClickScreen(item, item.page_to_redirect, {
                      screen_name: item.screen_name,
                      s_other_language: item.s_other_language,
                    });
                  }}
                >
                  <span>
                    {userLanguage === "en"
                      ? item.screen_name
                      : item.s_other_language}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
});
