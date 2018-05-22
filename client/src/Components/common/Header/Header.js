import React, { Component, PureComponent } from "react";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SwipeableDrawer from "material-ui/SwipeableDrawer";
import Button from "material-ui/Button";
import List from "material-ui/List";
import Divider from "material-ui/Divider";
import SideMenuBar from "./../SideMenuBar/SideMenuBar.js";
import style from "./header.css";
import Paper from "material-ui/Paper";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Close from "@material-ui/icons/Close";

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
      open: false
    };
  }

  toggleDrawer() {
    debugger;
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

  render() {
    return (
      <div className="row hptl-phase1-header sticky-top">
        <AppBar
          className="app_bar"
          position="static"
          style={{ color: "primary" }}
        >
          <Toolbar>
            <IconButton
              onClick={this.toggleDrawer.bind(this)}
              color="inherit"
              aria-label="Menu"
            >
              {/* <i className="fas fa-bars"></i> */}
              <MenuIcon />
            </IconButton>

            <Typography className="Typography" variant="title" color="inherit">
              {this.props.title}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
