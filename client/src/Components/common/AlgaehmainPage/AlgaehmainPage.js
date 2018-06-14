import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import Drawer from "material-ui/Drawer";
import { MenuItem } from "material-ui/Menu";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import sideMenuEn from "./SideMenuList.json";
import sideMenuAr from "./SideMenuListAr.json";
import "./AlgaehmainPage.css";
import { setCookie, getCookie } from "../../../utils/algaehApiCall";
import directRoutes from "../../../Dynamicroutes";
import CancelIcon from "@material-ui/icons/Close";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Paper,
  Menu
} from "material-ui";

const drawerWidth = 240;

const paper_style = {
  height: "100%",
  position: "fixed",
  display: "inline-block",
  zIndex: 10000,
  background: "#292929"
};

const titleStyles = {
  title: {
    color: "#fff",
    padding: "5px"
  },
  organisation: {
    color: "#4CAF50",
    padding: "5px"
  }
};

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
    }),
    boxShadow: "none"
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },

  menuButton: {
    marginLeft: 12,
    marginRight: 20
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
    background: "#292929",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    // padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  "content-left": {
    marginLeft: -drawerWidth
  },
  "content-right": {
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  },
  "contentShift-right": {
    marginRight: 0
  }
});

class PersistentDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
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
      enlabl: ""
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
    if (secLang === "en") {
      this.setState({
        languageName: "English",
        Language: "en",
        title: this.state.enlabl
      });
    } else if (secLang === "ar") {
      this.setState({
        languageName: "عربي",
        Language: "ar",
        title: this.state.arlabl
      });
    }

    let renderComp = this.state.renderComponent;
    this.setState(
      {
        renderComponent: ""
      },
      () => {
        this.setState({
          renderComponent: renderComp
        });
      }
    );
  }

  handleOpenClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (seLang, e) => {
    this.setState({ anchorEl: null });
    if (seLang != null) this.Languaue(seLang, e);
  };

  renderCheck = () => {
    return <span> &#10004;</span>;
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value
    });
  };

  openSubMenuSelection(data) {
    let getMenuSelected = data.name;
    if (this.state.menuSelected) {
      this.setState({
        menuSelected: "",
        toggleSubMenu: true
      });
    } else if (this.state.menuSelected === "") {
      this.setState({
        menuSelected: getMenuSelected,
        toggleSubMenu: false
      });
    }
  }

  TriggerPath(e) {
    const path = e.currentTarget.getAttribute("path");
    const name = e.currentTarget.getAttribute("name");
    // const name = e.currentTarget.getAttribute("name");
    let screenName = name.replace(/\s/g, "");
    setCookie("ScreenName", path, 30);

    this.setState({
      toggleSubMenu: true,
      title: e.currentTarget.innerText,
      renderComponent: screenName,
      menuSelected: "",
      arlabl: e.currentTarget.getAttribute("arlabel"),
      enlabl: e.currentTarget.getAttribute("label")
    });
  }
  render() {
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;

    let LangSideMenu = [];

    if (this.state.Language === "en") {
      LangSideMenu = sideMenuEn;
    } else if (this.state.Language === "ar") {
      LangSideMenu = sideMenuAr;
    }
    var MenuListItems = LangSideMenu.map((data, idx) => {
      return (
        <div key={"side_menu_index" + idx}>
          <div className="container-fluid">
            <div className="row clearfix">
              <div className="col-xs-3 col-sm-3 col-md-3 text-right">
                <span className="fas fa-th-large side-menu-title" />
              </div>
              <div
                className="col-xs-5 col-sm-5 col-md-5 side-menu-title"
                onClick={this.openSubMenuSelection.bind(this, data)}
              >
                {data.label}
              </div>

              <div className="col-xs-4 col-sm-4 col-md-4 side-menu-arrow text-right">
                {this.state.menuSelected === data.name &&
                this.state.toggleSubMenu === false ? (
                  <span
                    className="side-menu-downIcon"
                    onClick={this.openSubMenuSelection.bind(this, data)}
                  >
                    <IconButton
                      onClick={this.openSubMenuSelection.bind(this, data)}
                    >
                      <div className="close-menu">
                        <ExpandMore />
                      </div>
                    </IconButton>
                  </span>
                ) : (
                  <IconButton
                    onClick={this.openSubMenuSelection.bind(this, data)}
                  >
                    <div className="close-menu">
                      <ChevronLeftIcon />
                    </div>
                  </IconButton>
                )}
              </div>
            </div>
            {this.state.menuSelected === data.name &&
            this.state.toggleSubMenu === false ? (
              <div
                className="row sub-menu-option"
                style={{ paddingTop: "10px" }}
              >
                <div className="tree-structure-menu">
                  {data.subMenu.map((title, idx) => {
                    return (
                      <div key={"sub_title" + idx}>
                        <ul style={{ marginBottom: "0px" }}>
                          <li
                            onClick={this.TriggerPath.bind(this)}
                            path={title.path}
                            name={title.name}
                            arlabel={title.arlabel}
                            label={title.label}
                          >
                            {title.label}{" "}
                          </li>
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    });
    const drawer = (
      <Drawer
        variant="persistent"
        anchor={anchor}
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <div className="hptl-phase1-sideMenuBar">
            <div className="menuBar-title">
              <span style={titleStyles.title}>ALGAEH</span>
              <span style={titleStyles.organisation}>ERP</span>
              <IconButton
                onClick={this.handleDrawerClose}
                style={{ color: "#fff" }}
              >
                <CancelIcon />
              </IconButton>
            </div>

            <Paper style={paper_style} className="paper" elevation={4}>
              <div className="sideMenu-header">{MenuListItems}</div>
            </Paper>
          </div>
        </div>
      </Drawer>
    );

    return (
      <div className="sticky-top">
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <AppBar
              className={classNames(classes.appBar, {
                [classes.appBarShift]: open,
                [classes[`appBarShift-${anchor}`]]: open
              })}
            >
              <Toolbar disableGutters={!open}>
                <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.handleDrawerOpen}
                    className={classNames(
                      classes.menuButton,
                      open && classes.hide
                    )}
                  >
                    <MenuIcon />
                  </IconButton>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                  <Typography variant="title" color="inherit" noWrap>
                    {this.state.title}
                  </Typography>
                </div>

                <div className="col-lg-5">
                  <Button
                    style={{ color: "#fff" }}
                    aria-haspopup="true"
                    className="float-right"
                    onClick={this.handleOpenClick}
                  >
                    {this.state.languageName}
                    &nbsp;&nbsp;{" "}
                    <i
                      className="fa fa-language"
                      aria-hidden="true"
                      style={{ fontSize: 18 }}
                    />
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                  >
                    <MenuItem onClick={this.handleClose.bind(this, "en")}>
                      {this.state.languageName == "English"
                        ? this.renderCheck()
                        : null}&nbsp; English
                    </MenuItem>
                    <MenuItem onClick={this.handleClose.bind(this, "ar")}>
                      {this.state.languageName == "عربي"
                        ? this.renderCheck()
                        : null}&nbsp; عربي
                    </MenuItem>
                  </Menu>
                </div>
              </Toolbar>
            </AppBar>
            {drawer}
            <main
              className={classNames(
                classes.content,
                classes[`content-${anchor}`],
                {
                  [classes.contentShift]: open,
                  [classes[`contentShift-${anchor}`]]: open
                }
              )}
            >
              <div className={classes.drawerHeader} />
              <div className="container" style={{ minWidth: "100%" }}>
                <Typography>
                  <div className="row" id="hisapp">
                    <div className="col-lg-12">
                      {directRoutes(
                        this.state.renderComponent,
                        this.state.selectedLang
                      )}
                    </div>
                  </div>
                </Typography>
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
