import React, { Component } from "react";
import "./sideMenu.css";
import sideMenu from "./SideMenuList.json";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Paper from "@material-ui/core/Paper";
import { setCookie } from "../../../utils/algaehApiCall";

const paper_style = {
  height: "100%",
  width: 200,
  position: "fixed",
  top: 0,
  display: "inline-block",
  zIndex: 10000,
  background: "#292929"
};

class SideMenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      sideMenuDetails: sideMenu,
      toggleSubMenu: false,
      menuSelected: ""
    };
  }

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
    let screenName = e.currentTarget.innerText.replace(/\s/g, "");
    setCookie("ScreenName", screenName, 30);
    this.setState(
      {
        toggleSubMenu: true
      },
      () => {
        window.location.hash = path;
      }
    );
  }

  render() {
    var displayMenu = [];
    if (this.state.sideMenuDetails) {
      displayMenu = this.state.sideMenuDetails.map((data, idx) => {
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
    }
    return (
      <div className="hptl-phase1-sideMenuBar">
        <Paper style={paper_style} className="paper" elevation={4}>
          <div className="sideMenu-header">{displayMenu}</div>
        </Paper>
      </div>
    );
  }
}

export default SideMenuBar;
