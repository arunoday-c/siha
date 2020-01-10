import React, { memo, useState } from "react";
import { useHistory } from "react-router-dom";
import { setItem } from "algaeh-react-components/storage";
import { setCookie } from "../../../utils/algaehApiCall";
export default memo(function({ selectedMenu, userLanguage }) {
  if (selectedMenu === undefined) return null;
  const {
    module_name,
    screen_name,
    other_language,
    s_other_language,
    ScreenList
  } = selectedMenu;
  const [show, setShow] = useState(false);
  const history = useHistory();
  function onShow() {
    setShow(value => {
      return !value;
    });
  }
  function onClickScreen(item, display, others) {
    const screenName = display.replace(/ /g, "");
    setItem("userSelectedMenu", { ...item, ...others });
    setCookie("ScreenName", screenName);
    history.push(`/${screenName}`);
  }
  return (
    <div className="breadCrumpMenu">
      <span className="showParentModule" onClick={onShow}>
        {userLanguage === "en" ? module_name : other_language}
      </span>
      <span className="childActiveModule">
        {userLanguage === "en" ? screen_name : s_other_language}
      </span>
      {show === true ? (
        <div className="dropDownList">
          <ul>
            {ScreenList.map((item, idx) => {
              if (screen_name === item.screen_name) return null;
              return (
                <li
                  key={idx}
                  onClick={() => {
                    onClickScreen(selectedMenu, item.page_to_redirect, {
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
