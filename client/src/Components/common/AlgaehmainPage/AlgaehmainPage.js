import React from "react";
import "./AlgaehmainPage.css";
import {
  swalMessage,
  algaehApiCall,
  setCookie,
  getCookie
} from "../../../utils/algaehApiCall";
import directRoutes from "../../../Dynamicroutes";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import { AlgaehCloseContainer } from "../../../utils/GlobalFunctions";
class PersistentDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sideopen: false,
      class: "",
      anchor: "left",

      onlyToggeleMenu: "",
      renderComponent: "Dashboard",
      title: "Dashboard",
      selectedLang: "lang_en",
      anchorEl: null,
      languageName: "English",
      Language: "en",
      arlabl: "",
      enlabl: "",
      searchModules: "",
      activeNode: {
        class: "active",
        menuselected: "GEN",
        subMenuItem: "GN0001"
      },
      isSelectedByForce: false,
      menuList: [],
      scrollPosition: 0
    };
    const _userName = getCookie("userName");
    const _keyResources = getCookie("keyResources");
    if (_userName === null || _userName === "") {
      window.location.hash = "";
    }
    if (_keyResources === null || _keyResources === "") {
      window.location.hash = "";
    }

    const that = this;
    algaehApiCall({
      uri: "/algaehMasters/getRoleBaseActiveModules",
      method: "GET",
      onSuccess: dataResponse => {
        if (dataResponse.data.success) {
          algaehApiCall({
            uri: "/algaehMasters/getRoleBaseInActiveComponents",
            method: "GET",
            onSuccess: internalComponents => {
              if (internalComponents.data.success) {
                sessionStorage.removeItem("AlgaehScreener");
                sessionStorage.setItem(
                  "AlgaehScreener",
                  AlgaehCloseContainer(
                    JSON.stringify(internalComponents.data.records)
                  )
                );
              }
            }
          });
          that.setState({
            menuList: dataResponse.data.records
          });
        }
      },
      onFailure: error => {
        swalMessage({
          text: error.response.data.message,
          type: "error"
        });
      }
    });
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    if (prevLang !== "en") {
      this.setState({
        languageName: "عربي",
        Language: "ar",
        title: "لوحة القيادة",
        arlabl: "لوحة القيادة",
        enlabl: "Dashboard"
      });
    }
  }

  Languaue(secLang, e) {
    let prevLang = getCookie("Language");
    setCookie("Language", secLang, 30);
    setCookie("prevLanguage", prevLang, 30);

    let renderComp = this.state.renderComponent;
    var last2 = renderComp.slice(-2);
    if (last2 === "Ar") {
      renderComp = renderComp.substring(0, renderComp.length - 2);
    }
    if (secLang === "en") {
      setCookie("ScreenName", renderComp, 30);
      this.setState(
        {
          languageName: "English",
          Language: "en",
          title: this.state.enlabl,
          renderComponent: ""
        },
        () => {
          this.setState({
            renderComponent: renderComp
          });
        }
      );
    } else if (secLang === "ar") {
      if (renderComp === "FrontDesk" || renderComp === "OPBilling") {
        renderComp = renderComp + "Ar";
      }
      setCookie("ScreenName", renderComp, 30);
      this.setState(
        {
          languageName: "عربي",
          Language: "ar",
          title: this.state.arlabl,
          renderComponent: ""
        },
        () => {
          this.setState({
            renderComponent: renderComp
          });
        }
      );
    }
  }

  handleOpenClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (seLang, e) => {
    this.setState({ anchorEl: null });

    if (typeof e === "object") this.Languaue(seLang, e);
  };

  renderCheck = () => {
    return <span> &#10004;</span>;
  };

  handleDrawerOpen = () => {
    this.setState({
      class: "slideInLeft",
      sideopen: true
    });
    // const _offSet =
    //   document.querySelector("[menuselected]") === null
    //     ? 0
    //     : document.querySelector("[menuselected]").offsetTop;
    // if (this.scrollLeftPanel !== undefined && this.scrollLeftPanel !== null)
    //   this.scrollLeftPanel.scrollTop = _offSet;
  };

  handleDrawerClose = () => {
    const _activeNodes =
      this.state.activeNode.menuselected === "" &&
      this.state.activeNode.lastSelected !== ""
        ? {
            activeNode: {
              ...this.state.activeNode,
              ...{
                menuselected: this.state.activeNode.lastSelected,
                lastSelected: ""
              }
            }
          }
        : {};

    this.setState({
      class: "slideOutLeft",
      onlyToggeleMenu: "",
      ..._activeNodes
    });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value
    });
  };

  openSubMenuSelection(data) {
    let _putData =
      data.module_code === this.state.onlyToggeleMenu ? "" : data.module_code;
    const isModfySelect =
      this.state.activeNode.menuselected === data.module_code
        ? {
            activeNode: {
              ...this.state.activeNode,
              ...{ menuselected: "", lastSelected: data.module_code }
            }
          }
        : {};
    _putData = isModfySelect.activeNode !== undefined ? "" : _putData;
    this.setState({ onlyToggeleMenu: _putData, ...isModfySelect });
  }

  componentDidUpdate(prevProps) {
    const _offSet =
      document.querySelector("[menuselected]") === null
        ? 0
        : document.querySelector("[menuselected]").getBoundingClientRect().top;

    if (this.scrollLeftPanel !== undefined && this.scrollLeftPanel !== null)
      this.scrollLeftPanel.scrollTop = _offSet;
  }

  TriggerPath(submenu, e) {
    debugger;
    const name = submenu.page_to_redirect.replace(/\s/g, ""); // e.currentTarget.getAttribute("name");
    let screenName =
      submenu.page_to_redirect.replace(/\s/g, "") +
      (this.state.Language !== "en" &&
      (submenu.screen_name === "Front Desk" ||
        submenu.screen_name === "Op Billing")
        ? this.state.Language.charAt(0).toUpperCase() +
          this.state.Language.slice(1)
        : "");
    const _menuselected = e.currentTarget.getAttribute("menuselected");
    const _submenuselected = submenu.screen_code; //e.currentTarget.getAttribute("submenuselected");
    setCookie("ScreenName", name, 30);
    AlgaehLoader({ show: true });

    this.setState({
      sideopen: false,
      searchModules: "",
      title: e.currentTarget.innerText,
      renderComponent: screenName,
      arlabl: submenu.other_language,
      enlabl: submenu.screen_name,
      onlyToggeleMenu: "",
      activeNode: {
        class: "active",
        menuselected: _menuselected,
        subMenuItem: _submenuselected
      }
    });
  }

  logoutLink(e) {
    window.location.href = window.location.origin + "/#";
  }

  SearchModuleHandler(e) {
    this.setState({ searchModules: e.target.value });
  }

  createSideMenuItemList() {
    const { onlyToggeleMenu, activeNode, searchModules, menuList } = this.state;

    const _isEnglish = this.state.Language !== "en" ? false : true;
    let menuArray = [];
    const _toggle = searchModules !== "" ? true : false;
    let menuList_condition = menuList;
    if (_toggle) {
      menuList_condition = [];
      menuList.filter(obj => {
        let submenu = [];
        obj.ScreenList.filter(item => {
          if (
            item.screen_name
              .toLowerCase()
              .indexOf(searchModules.toLowerCase()) > -1
          ) {
            submenu.push(item);
          }
        });
        menuList_condition;
        if (submenu.length > 0) {
          menuList_condition.push({
            algaeh_d_module_id: obj.algaeh_d_module_id,
            icons: obj.icons,
            module_code: obj.module_code,
            module_name: obj.module_name,
            other_language: obj.other_language,
            ScreenList: submenu
          });
        }
      });
    }
    menuList_condition.map((menu, index) => {
      const _menuSelected =
        onlyToggeleMenu !== "" && onlyToggeleMenu === menu.module_code
          ? onlyToggeleMenu
          : activeNode.menuselected;

      menuArray.push(
        <div key={"side_menu_index" + index} className="container-fluid">
          <div
            className="row clearfix side-menu-title"
            onClick={this.openSubMenuSelection.bind(this, menu)}
          >
            <div className="col-2" style={{ marginTop: "2px" }}>
              <i className={menu.icons} />
            </div>
            <div className="col-8 ">
              {_isEnglish ? menu.module_name : menu.other_language}
            </div>
            <div className="col-2" style={{ marginTop: "2px" }}>
              {_menuSelected === menu.module_code || _toggle ? (
                <i className="fas fa-angle-up" />
              ) : (
                <i className="fas fa-angle-down" />
              )}
            </div>
          </div>
          {_menuSelected === menu.module_code || _toggle ? (
            <div className="row sub-menu-option">
              <ul className="tree-structure-menu">
                {menu.ScreenList.map((submenu, indexSub) => (
                  <li
                    onClick={this.TriggerPath.bind(this, submenu)}
                    menuselected={menu.module_code}
                    key={indexSub}
                    className={
                      activeNode !== undefined && activeNode !== null
                        ? activeNode.subMenuItem === submenu.screen_code
                          ? activeNode.class
                          : ""
                        : ""
                    }
                  >
                    <i className="fas fa-arrow-circle-right fa-1x " />
                    <span>
                      {_isEnglish
                        ? submenu.screen_name
                        : submenu.other_language}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      );
    });
    return menuArray;
  }

  render() {
    const authToken = getCookie("authToken");
    // const keyResources = getCookie("keyResources");
    if (authToken === "" || authToken === undefined) {
      return (
        <b>
          No access, please re-login
          <button onClick={this.logoutLink.bind(this)}>
            Redirect to login
          </button>
        </b>
      );
    }

    const { anchor } = this.state;

    return (
      <div className="">
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark mainTheme">
          <div className="sideMenuBars" onClick={this.handleDrawerOpen}>
            <i className="fas fa-bars fa-lg" />
          </div>
          <div className="navbar-brand appLogoCntr">
            <p className="appLogoOnly" />
          </div>

          <h5 className="topNavbar-title mr-auto">{this.state.title}</h5>
          <div className="navTopBarRight">
            <div className="loginProfileInfo">
              <span>{getCookie("userName")},</span>
              <span>
                {getCookie("HospitalName") !== undefined
                  ? getCookie("HospitalName")
                  : ""}
              </span>
            </div>
          </div>
          <div className="dropdown navTopbar-dropdown">
            <i className="fas fa-angle-down fa-lg" />
            <div
              className="dropdown-menu animated fadeIn faster"
              aria-labelledby="dropdownMenuButton"
            >
              <a className="dropdown-item">
                <i className="fas fa-user" /> User Profile
              </a>
              <a className="dropdown-item">
                <i className="fas fa-cog" /> Preference{" "}
              </a>
              <div className="dropdown-divider" />
              <a
                className="dropdown-item"
                onClick={this.handleClose.bind(this, "en")}
              >
                {/* <i className="fas fa-globe-asia" /> */}
                {this.state.languageName === "English"
                  ? this.renderCheck()
                  : null}
                &nbsp; English
              </a>
              <a
                className="dropdown-item"
                onClick={this.handleClose.bind(this, "ar")}
              >
                {/* <i className="fas fa-globe-asia" /> */}
                {this.state.languageName === "عربي" ? this.renderCheck() : null}
                &nbsp; عربي
              </a>
              <div className="dropdown-divider" />
              <a className="dropdown-item" onClick={this.logoutLink.bind(this)}>
                <i className="fas fa-sign-out-alt" /> Logout
              </a>
            </div>
          </div>
        </nav>

        {/* Side Bar Functionality */}
        {this.state.sideopen === true ? (
          <div
            anchor={anchor}
            className={"animated leftNavCntr " + this.state.class}
            ref={scrollLeftPanel => (this.scrollLeftPanel = scrollLeftPanel)}
          >
            <div className="hptl-phase1-sideMenuBar">
              <div className="menuBar-title">
                {/* <div className="appLogoOnly" />*/}

                <i
                  onClick={this.handleDrawerClose}
                  className="fas fa-chevron-circle-left sideBarClose"
                />
                <input
                  type="text"
                  name="searchModules"
                  className="subMenuSearchFld"
                  placeholder="Search Modules"
                  value={this.state.searchModules}
                  autoFocus={true}
                  ref={c => (this.searchModules = c)}
                  onChange={this.SearchModuleHandler.bind(this)}
                />
              </div>
              <div className="sideMenu-header">
                {this.createSideMenuItemList()}
              </div>
            </div>
          </div>
        ) : null}
        <main className="mainPageArea container-fluid" id="hisapp">
          {directRoutes(this.state.renderComponent, this.state.selectedLang)}
        </main>
      </div>
    );
  }
}

export default PersistentDrawer;
