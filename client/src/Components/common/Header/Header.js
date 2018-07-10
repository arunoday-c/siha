import React, { Component, PureComponent } from "react";
import "./../SideMenuBar/SideMenuBar.js";
import "./header.css";
import MenuIcon from "@material-ui/icons/Menu";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Close,
  SwipeableDrawer,
  Button,
  List,
  Divider,
  Paper,
  ChevronLeftIcon,
  Menu,
  MenuItem,
  Radio
} from "material-ui";

import { setCookie, getCookie } from "../../../utils/algaehApiCall.js";
// var noScroll = require('no-scroll');
// noScroll.off();

const appColor = {
  background: "#292929"
};

const paper_style = {
  height: 1350,
  width: 200,
  position: "absolute",
  top: 0,
  display: "inline-block",
  zIndex: 10000
};

const titleStyles = {
  title: {
    color: "#fff",
    paddingLeft: 100
  },
  organisation: {
    color: "#d3d3d3"
  }
};

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      selectedLang: "lang_en",
      anchorEl: null,
      languageName: "English"
    };
  }

  toggleDrawer() {
    this.setState(
      {
        open: !this.state.open
      },
      () => {
        if (this.state.open === true) {
          this.props.SideMenuBarOpen(true);
        } else {
          this.props.SideMenuBarOpen(false);
        }
      }
    );
  }
  componentWillMount() {
    let lang = getCookie("Language");
    if (lang != null) {
      this.setState({ languageName: lang == "ar" ? "عربي" : "English" });
    }
  }
  Languaue(secLang, e) {
    let prevLang = getCookie("Language");
    setCookie("Language", secLang, 30);
    setCookie("prevLanguage", prevLang, 30);
    if (secLang === "en") {
      this.setState({ languageName: "English" });
    } else if (secLang === "ar") {
      //this.props.SelectLanguage("lang_ar");
      this.setState({ languageName: "عربي" });
    }
    this.props.SelectLanguage(secLang);
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
  render() {
    return (
      <div className="row hptl-phase1-header sticky-top">
        <AppBar
          className="app_bar"
          position="static"
          style={{ color: "primary" }}
        >
          <Toolbar>
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <IconButton
                className="focus"
                onClick={this.toggleDrawer.bind(this)}
                color="inherit"
                aria-label="Menu"
                // style = {{outline: "none"}}
              >
                <MenuIcon />
              </IconButton>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              {/* <Typography
                className="Typography"
                variant="title"
                color="inherit"
              > */}
              <h5>{this.props.title}</h5>
              {/* </Typography> */}
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
            {/* <div className="col-lg-1">
              <i className="fas fa-flag" onClick={this.Languaue.bind(this, "En")}></i>
            </div>
            <div className="col-lg-1">
              <i className="fas fa-flag" onClick={this.Languaue.bind(this, "Ar")}></i>
            </div> */}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
