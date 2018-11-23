import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import sideMenuEn from "./SideMenuList.json";
import sideMenuAr from "./SideMenuListAr.json";
import "./AlgaehmainPage.css";
import { setCookie, getCookie } from "../../../utils/algaehApiCall";
import directRoutes from "../../../Dynamicroutes";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Menu from "@material-ui/core/Menu";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
const drawerWidth = 230;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appFrame: {
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    boxShadow: "none",
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "0 7px",
    minHeight: "20px",
    background: "#292929"
  },
  backgroundflex: {
    background: "#292929"
  },
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,

    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  }
});

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
      searchModules: ""
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
      class: "slideOutLeft"
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
        toggleSubMenu: true
      });
    } else {
      this.setState({
        menuSelected: getMenuSelected,
        toggleSubMenu: false
      });
    }
  }

  TriggerPath(e) {
    const path = e.currentTarget.getAttribute("path");
    const name = e.currentTarget.getAttribute("name");
    let screenName = name.replace(/\s/g, "");
    setCookie("ScreenName", path, 30);
    AlgaehLoader({ show: true });
    this.setState({
      sideopen: false,
      toggleSubMenu: true,
      title: e.currentTarget.innerText,
      renderComponent: screenName,
      menuSelected: "",
      arlabl: e.currentTarget.getAttribute("arlabel"),
      enlabl: e.currentTarget.getAttribute("label")
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
    return LangSideMenu.filter(obj => {
      for (let i = 0, length = obj.subMenu.length; i < length; i++) {
        if (
          String(obj.subMenu[i].name)
            .toLowerCase()
            .indexOf(String(_menuSearch).toLowerCase()) > -1
        ) {
          return true;
        }
      }
      return false;
    });
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

    const { classes } = this.props;
    const { anchor, sideopen } = this.state;

    let LangSideMenu = this.CreateMenuListDropDownFilter();

    // if (this.state.Language === "en") {
    //   LangSideMenu = sideMenuEn;
    // } else if (this.state.Language === "ar") {
    //   LangSideMenu = sideMenuAr;
    // }
    var MenuListItems = LangSideMenu.map((data, idx) => {
      let icon = data.icon;
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
              {this.state.menuSelected === data.name &&
              this.state.toggleSubMenu === false ? (
                <i className="fas fa-angle-up" />
              ) : (
                <i className="fas fa-angle-down" />
              )}
            </div>
          </div>
          {this.state.menuSelected === data.name &&
          this.state.toggleSubMenu === false ? (
            <div className="row sub-menu-option">
              <ul className="tree-structure-menu">
                {data.subMenu.map((title, idx) => {
                  return (
                    <li
                      onClick={this.TriggerPath.bind(this)}
                      path={title.path}
                      name={title.name}
                      arlabel={title.arlabel}
                      label={title.label}
                      key={idx}
                    >
                      <i className="fas fa-check-circle fa-1x" />
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
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#bs-example-navbar-collapse-1"
                aria-expanded="false"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <a className="navbar-brand" href="#">
                Brand
              </a>
            </div>

            <div
              className="collapse navbar-collapse"
              id="bs-example-navbar-collapse-1"
            >
              <ul className="nav navbar-nav">
                <li className="active">
                  <a href="#">
                    Link <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li>
                  <a href="#">Link</a>
                </li>
                <li className="dropdown">
                  <a
                    href="#"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Dropdown <span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#">Action</a>
                    </li>
                    <li>
                      <a href="#">Another action</a>
                    </li>
                    <li>
                      <a href="#">Something else here</a>
                    </li>
                    <li role="separator" className="divider" />
                    <li>
                      <a href="#">Separated link</a>
                    </li>
                    <li role="separator" className="divider" />
                    <li>
                      <a href="#">One more separated link</a>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="#">Link</a>
                </li>
                <li className="dropdown">
                  <a
                    href="#"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Dropdown <span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#">Action</a>
                    </li>
                    <li>
                      <a href="#">Another action</a>
                    </li>
                    <li>
                      <a href="#">Something else here</a>
                    </li>
                    <li role="separator" className="divider" />
                    <li>
                      <a href="#">Separated link</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className={classes.root}>
          <div className={classNames(classes.appFrame, "sticky-top")}>
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
                      onChange={this.SearchModuleHandler.bind(this)}
                    />
                  </div>
                  <div className="sideMenu-header">{MenuListItems}</div>
                </div>
              </div>
            ) : null}
            <main className={classNames(classes.content)}>
              <div
                className={classes.drawerHeader}
                style={{ minHeight: "50px" }}
              />
              <div style={{ minWidth: "100%" }}>
                <div className="container-fluid" id="hisapp">
                  {directRoutes(
                    this.state.renderComponent,
                    this.state.selectedLang
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

PersistentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(PersistentDrawer);
