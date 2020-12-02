import React, { memo, useState } from "react";
import { useCurrentPath, useLangFieldName } from "../../../hooks";
import { useHistory } from "react-router-dom";
import { setItem } from "algaeh-react-components";
// import { MainContext } from "algaeh-react-components";
import { setCookie } from "../../../utils/algaehApiCall";

export default memo(function ({ userMenu, setSelectedMenuItem }) {
  const current = useCurrentPath();
  const { fieldNameFn } = useLangFieldName();

  const selMenuDetails = userMenu?.find(
    (f) => f.module_code === current?.module_code
  );

  const [show, setShow] = useState(false);
  const [pos, setPos] = useState(0);
  const history = useHistory();
  function onShow(e) {
    setShow((value) => {
      return !value;
    });
    setPos(e.target.offsetLeft + 15);
  }
  async function onClickScreen(item, display, others) {
    const screenName = display.replace(/ /g, "");
    const selMenu = { ...item, ...others };
    await setItem("userSelectedMenu", selMenu);
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
          <span>
            {fieldNameFn(current?.module_name, current?.other_language)}
          </span>
        </li>
        <li onClick={onShow} onBlur={onShow}>
          <span>
            {fieldNameFn(current?.screen_name, current?.s_other_language)}
          </span>
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
              if (current?.screen_name === item?.screen_name) return null;
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
                    {fieldNameFn(item?.screen_name, item?.s_other_language)}
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
