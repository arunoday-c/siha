import React from "react";
import sideMenuEn from "./SideMenuList.json";
import sideMenuAr from "./SideMenuListAr.json";
import "./AlgaehmainPage.css";
import { setCookie, getCookie } from "../../../utils/algaehApiCall";
import directRoutes from "../../../Dynamicroutes";
import Enumerable from "linq";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

class PersistentDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sideopen: false,
      class: "",
      anchor: "left",
      toggleSubMenu: false,
      menuSelected: "",
      renderComponent: "Dashboard",
      title: "Dashboard",
      selectedLang: "lang_en",
      anchorEl: null,
      languageName: "English",
      Language: "en",
      arlabl: "",
      enlabl: "",
      searchModules: "",
      activeNode: null,
      isSelectedByForce: false
    };
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
  };

  handleDrawerClose = () => {
    this.setState({
      class: "slideOutLeft",
      searchModules: "",
      isSelectedByForce: false
      //sideopen: false
    });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value
    });
  };

  openSubMenuSelection(data) {
    let getMenuSelected = data.name;
    if (this.state.menuSelected === getMenuSelected) {
      this.setState({
        menuSelected: "",
        toggleSubMenu: true,
        isSelectedByForce: true
      });
    } else {
      this.setState({
        menuSelected: getMenuSelected,
        toggleSubMenu: false,
        isSelectedByForce: true
      });
    }
  }

  TriggerPath(e) {
    const path = e.currentTarget.getAttribute("path");
    const name = e.currentTarget.getAttribute("name");
    const _controlDId = e.currentTarget.getAttribute("controlid");
    const _rootId = e.currentTarget.getAttribute("rootid");
    const _menuselected = e.currentTarget.getAttribute("menuselected");
    const _submenuselected = e.currentTarget.getAttribute("submenuselected");
    let screenName = name.replace(/\s/g, "");
    setCookie("ScreenName", path, 30);
    AlgaehLoader({ show: true });
    this.setState({
      sideopen: false,
      searchModules: "",
      title: e.currentTarget.innerText,
      renderComponent: screenName,
      menuSelected: "",
      arlabl: e.currentTarget.getAttribute("arlabel"),
      enlabl: e.currentTarget.getAttribute("label"),
      activeNode: {
        controlid: _controlDId,
        rootid: _rootId,
        class: "active",
        menuselected: _menuselected,
        subMenuItem: _submenuselected
      },
      isSelectedByForce: false
    });
  }

  logoutLink(e) {
    window.location.href = window.location.origin + "/#";
  }

  SearchModuleHandler(e) {
    this.setState({ searchModules: e.target.value });
  }

  CreateMenuListDropDownFilter() {
    let LangSideMenu = [];
    const _menuSearch = this.state.searchModules;
    if (this.state.Language === "en") {
      LangSideMenu = sideMenuEn;
    } else if (this.state.Language === "ar") {
      LangSideMenu = sideMenuAr;
    }
    if (createMenu === "") {
      return LangSideMenu;
    }
    let createMenu = [];

    LangSideMenu.filter(obj => {
      let submenu = [];
      obj.subMenu.filter(item => {
        if (
          item.name
            .toString()
            .toLowerCase()
            .indexOf(_menuSearch.toString().toLowerCase()) > -1
        ) {
          submenu.push(item);
        }
      });
      if (submenu.length > 0) {
        createMenu.push({
          icon: obj.icon,
          label: obj.label,
          name: obj.name,
          subMenu: submenu
        });
      }
    });

    return createMenu;
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

    const { anchor, activeNode, isSelectedByForce } = this.state;
    let LangSideMenu = this.CreateMenuListDropDownFilter();

    var MenuListItems = LangSideMenu.map((data, idx) => {
      let icon = data.icon;
      const _toggle = this.state.searchModules !== "" ? true : false;
      const _menuSelected = !isSelectedByForce
        ? activeNode !== undefined && activeNode !== null
          ? activeNode.menuselected
          : this.state.menuSelected
        : this.state.menuSelected;
      const _toggleSubMenu = !isSelectedByForce
        ? activeNode !== undefined && activeNode !== null
          ? activeNode.menuselected === data.name
            ? false
            : this.state.toggleSubMenu
          : this.state.toggleSubMenu
        : this.state.toggleSubMenu;
      return (
        <div key={"side_menu_index" + idx} className="container-fluid">
          <div
            className="row clearfix side-menu-title"
            onClick={this.openSubMenuSelection.bind(this, data)}
          >
            <div className="col-2" style={{ marginTop: "2px" }}>
              <i className={icon} />
            </div>
            <div className="col-8 ">{data.label}</div>

            <div className="col-2" style={{ marginTop: "2px" }}>
              {(_menuSelected === data.name && _toggleSubMenu === false) ||
              _toggle ? (
                <i className="fas fa-angle-up" />
              ) : (
                <i className="fas fa-angle-down" />
              )}
            </div>
          </div>
          {(_menuSelected === data.name && _toggleSubMenu === false) ||
          _toggle ? (
            <div className="row sub-menu-option">
              <ul className="tree-structure-menu">
                {data.subMenu.map((title, Didx) => {
                  return (
                    <li
                      onClick={this.TriggerPath.bind(this)}
                      path={title.path}
                      name={title.name}
                      arlabel={title.arlabel}
                      label={title.label}
                      controlid={Didx}
                      rootid={idx}
                      menuselected={data.name}
                      submenuselected={title.label}
                      key={Didx}
                      className={
                        activeNode !== undefined && activeNode !== null
                          ? activeNode.subMenuItem === title.label
                            ? activeNode.class
                            : ""
                          : ""
                      }
                    >
                      <i className="fas fa-check-circle fa-1x " />
                      <span>{title.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      );
    });

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
              <div className="sideMenu-header">{MenuListItems}</div>
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
