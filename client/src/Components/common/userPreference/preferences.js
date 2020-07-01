import React, { memo, useState, useContext, useEffect } from "react";
import {
  Switch,
  AlgaehAutoComplete,
  Input,
  AlgaehFormGroup,
} from "algaeh-react-components";
import { MainContext } from "algaeh-react-components/context";

export default memo(function () {
  const [searchBarDropDown, setSearchBarDropDown] = useState(true);
  const [notificationSound, setNotificationSound] = useState(true);
  const [screens, setScreens] = useState([]);
  const [language, setLanguage] = useState([]);
  const { userMenu, userToken } = useContext(MainContext);
  useEffect(() => {
    let scrns = [];
    for (let i = 0; i < userMenu.length; i++) {
      for (let j = 0; j < userMenu[i]["ScreenList"].length; j++) {
        const {
          screen_name,
          s_other_language,
          algaeh_app_screens_id,
        } = userMenu[i]["ScreenList"][j];
        scrns.push({ screen_name, s_other_language, algaeh_app_screens_id });
      }
    }
    const { other_lang, other_lang_short } = userToken;
    setLanguage([
      { lang_short: "en", lang: "English" },
      { lang_short: other_lang_short, lang: other_lang },
    ]);
    setScreens(scrns);
  }, []);

  function onChnageSwitch(checked, e) {
    const { name } = e.currentTarget;
    switch (name) {
      case "searchBarDropDown":
        setSearchBarDropDown(checked);
        break;
      case "notificationSound":
        setNotificationSound(checked);
        break;
    }
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">User Preferences</h3>
            </div>
            <div className="actions"></div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col">
                <label>Remeber search dropdown</label>{" "}
                <Switch
                  className="ant-switch-block"
                  name="searchBarDropDown"
                  checkedChildren={<i className="fa fa-check"></i>}
                  unCheckedChildren={<i className="fa fa-times"></i>}
                  checked={searchBarDropDown}
                  onChange={onChnageSwitch}
                ></Switch>
              </div>
              <div className="col">
                <label>Notification Sound</label>{" "}
                <Switch
                  className="ant-switch-block"
                  name="notificationSound"
                  checkedChildren={<i className="fa fa-check"></i>}
                  unCheckedChildren={<i className="fa fa-times"></i>}
                  checked={notificationSound}
                  onChange={onChnageSwitch}
                ></Switch>
              </div>
              <AlgaehAutoComplete
                div={{ className: "col" }}
                label={{ forceLabel: "Default Landing Page" }}
                selector={{
                  dataSource: {
                    data: screens,
                    valueField: "algaeh_app_screens_id",
                    textField: "screen_name",
                  },
                }}
              />
              <AlgaehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Screen TimeOut	",
                  isImp: false,
                }}
                textBox={{
                  type: "number",
                  value: "",
                  className: "form-control",
                  placeholder: "0",
                  autoComplete: false,
                }}
              />

              <AlgaehAutoComplete
                div={{ className: "col" }}
                label={{ forceLabel: "Default language" }}
                selector={{
                  dataSource: {
                    data: language,
                    valueField: "lang_short",
                    textField: "lang",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
