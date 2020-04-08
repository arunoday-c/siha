import React, { useState, useContext, memo } from "react";
import { useHistory } from "react-router-dom";
import { MainContext } from "algaeh-react-components/context";
import { setItem } from "algaeh-react-components/storage";
import { setCookie } from "../../../utils/algaehApiCall";
import { Drawer } from "algaeh-react-components";
function MenuItems({ showMenu, onVisibityChange, openModule, openScreen }) {

  const { userMenu, userLanguage, setSelectedMenuItem } = useContext(
    MainContext
  );
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [modules, setModules] = useState([]);
  const [activeModule, setActiveModule] = useState("");
  const [activeScreen, setActiveScreen] = useState("");

  //Abu comment this
  // if (showMenu === false) {
  //   return null;
  //}
  //till here
  function activateModule(module_id) {
    setActiveModule((moduleId) => {
      if (moduleId === module_id) {
        return "";
      }
      return module_id;
    });
  }
  function redirectToScreen(item, display, others) {
    const screenName = display.replace(/ /g, "");
    const selMenu = { ...item, ...others };
    setItem("userSelectedMenu", selMenu);
    setSelectedMenuItem(selMenu);
    setActiveScreen(item.screen_name);
    setCookie("ScreenName", screenName);
    const extraParam =
      item.redirect_url !== undefined &&
        item.redirect_url !== "" &&
        item.redirect_url !== null
        ? `/${item.redirect_url}`
        : "";
    history.push(`/${screenName}${extraParam}`);
  }
  function searchModuleText(e) {
    const value = e.target.value;
    if (value !== "") {
      let result = [];
      userMenu.filter((f) => {
        let screens = [];
        const filScren = f.ScreenList.filter((s) => {
          const { screen_name, s_other_language } = s;
          if (
            screen_name.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
            (s_other_language !== null &&
              s_other_language.toLowerCase().indexOf(value.toLowerCase()) > -1)
          ) {
            screens.push(s);
            return true;
          } else return false;
        });
        if (filScren.length > 0) result.push({ ...f, ScreenList: screens });
      });
      setModules(() => {
        return result;
      });
    }
    setSearchText(value);
  }

  const moduleSelect = activeModule === "" ? openModule : activeModule;
  const screenSelected = activeScreen === "" ? openScreen : activeScreen;

  const list =
    searchText === "" ? (userMenu === null ? [] : userMenu) : modules;

  return (
    <Drawer
      placement="left"
      closable={false}
      onClose={onVisibityChange}
      visible={showMenu}
      className="leftDrawer"
    >
      <div className={`leftNavCntr`}>
        <div className="hptl-phase1-sideMenuBar">
          <div className="menuBar-title">
            <i
              onClick={onVisibityChange}
              className="fas fa-chevron-circle-left sideBarClose"
            />
            <input
              type="text"
              autoComplete="off"
              name="searchModules"
              className="subMenuSearchFld"
              placeholder="Search Modules"
              // value={searchModule}
              autoFocus={true}
              onChange={searchModuleText}
            />
          </div>
          <div className="sideMenu-header">
            <div className="menuBarLoader d-none">
              <i className="fas fa-spinner fa-spin" />
            </div>
            {list.map((item, index) => (
              <div key={index} className="container-fluid">
                <div
                  className="row clearfix side-menu-title"
                  onClick={() => {
                    activateModule(item.module_name);
                  }}
                >
                  <div className="col-2" style={{ marginTop: "2px" }}>
                    <i className={item.icons} />
                  </div>
                  <div className="col-8 ">
                    {userLanguage === "en"
                      ? item.module_name
                      : item.other_language}
                  </div>
                  <div className="col-2" style={{ marginTop: "2px" }}>
                    {moduleSelect === item.module_name || searchText !== "" ? (
                      <i className="fas fa-angle-up" />
                    ) : (
                        <i className="fas fa-angle-down" />
                      )}
                  </div>
                </div>
                {moduleSelect === item.module_name || searchText !== "" ? (
                  <div className="row sub-menu-option">
                    <ul className="tree-structure-menu">
                      {item.ScreenList.map((screen, idx) => {
                        return (
                          <li
                            key={idx}
                            className={
                              screenSelected === screen.screen_name
                                ? "active"
                                : ""
                            }
                            onClick={() => {

                              const { screen_name, s_other_language } = screen;
                              redirectToScreen(
                                screen,
                                screen.page_to_redirect,
                                {
                                  screen_name,
                                  s_other_language,
                                }
                              );
                            }}
                          >
                            <i className="fas fa-arrow-circle-right fa-1x " />
                            <span>
                              {userLanguage === "en"
                                ? screen.screen_name
                                : screen.other_language}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
export default memo(MenuItems);
