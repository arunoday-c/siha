import React, { memo, useState, useContext, useEffect } from "react";
import { Switch, AlgaehAutoComplete, Input } from "algaeh-react-components";
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
        <table>
          <tbody>
            <tr>
              <td> Remeber search dropdown </td>
              <td>
                <Switch
                  name="searchBarDropDown"
                  checkedChildren={<i className="fa fa-check"></i>}
                  unCheckedChildren={<i className="fa fa-times"></i>}
                  checked={searchBarDropDown}
                  onChange={onChnageSwitch}
                ></Switch>
              </td>
            </tr>
            <tr>
              <td> Notification sound </td>
              <td>
                <Switch
                  name="notificationSound"
                  checkedChildren={<i className="fa fa-check"></i>}
                  unCheckedChildren={<i className="fa fa-times"></i>}
                  checked={notificationSound}
                  onChange={onChnageSwitch}
                ></Switch>
              </td>
            </tr>
            <tr>
              <td>Default Landing Page</td>
              <td>
                <AlgaehAutoComplete
                  div={{ className: "col" }}
                  label={{}}
                  selector={{
                    dataSource: {
                      data: screens,
                      valueField: "algaeh_app_screens_id",
                      textField: "screen_name",
                    },
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Screen TimeOut</td>
              <td>
                <Input defaultValue="20" />
              </td>
            </tr>
            <tr>
              <td>Default language</td>
              <td>
                <AlgaehAutoComplete
                  div={{ className: "col" }}
                  label={{}}
                  selector={{
                    dataSource: {
                      data: language,
                      valueField: "lang_short",
                      textField: "lang",
                    },
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});
