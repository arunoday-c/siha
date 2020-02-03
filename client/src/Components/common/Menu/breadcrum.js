import React, { memo, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { setItem } from "algaeh-react-components/storage";
import { setCookie } from "../../../utils/algaehApiCall";

export default memo(function({
  selectedMenu,
  userLanguage,
  setSelectedMenuItem
}) {
  if (selectedMenu === undefined) return null;
  const {
    module_name,
    screen_name,
    other_language,
    s_other_language,
    ScreenList
  } = selectedMenu;
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState(0);
  const history = useHistory();
  function onShow(e) {
    setShow(value => {
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
    history.push(`/${screenName}`);
  }
  return (
    <div className="breadCrumpMenu">
      {" "}
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
              marginTop: "5px"
            }}
          ></i>
        </li>
      </ul>
      {show === true ? (
        <div className="dropDownList" style={{ left: `${pos}px` }}>
          <ul>
            {ScreenList.map((item, idx) => {
              if (screen_name === item.screen_name) return null;
              return (
                <li
                  key={idx}
                  onClick={() => {
                    onClickScreen(item, item.page_to_redirect, {
                      screen_name: item.screen_name,
                      s_other_language: item.s_other_language
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
