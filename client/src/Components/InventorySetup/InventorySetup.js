import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./InventorySetup.scss";
import "../../index.scss";
import ItemCategory from "./ItemCategory/ItemCategory";
import ItemGroup from "./ItemGroup/ItemGroup";
import ItemUOM from "./ItemUOM/ItemUOM";
import Location from "./Location/Location";

import LocationPermission from "./LocationPermission/LocationPermission";

// import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import InventoryOptions from "./InventoryOptions/InventoryOptions";

import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

class InventorySetup extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "InventoryOptions", sidBarOpen: true };
  }

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
    this.setState({
      pageDisplay: specified
    });
  }

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  componentDidMount() {
    if (
      this.props.userdrtails === undefined ||
      this.props.userdrtails.length === 0
    ) {
      this.props.getUserDetails({
        uri: "/algaehappuser/selectAppUsers",
        method: "GET",
        redux: {
          type: "USER_DETAILS_GET_DATA",
          mappingName: "userdrtails"
        }
      });
    }
  }

  render() {
    return (
      <div className="hims_Inventory_setup">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"InventoryOptions"}
                className={"nav-item tab-button active "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Inventory Settings"
                    }}
                  />
                }
              </li>
              <li
                className={"nav-item tab-button "}
                algaehtabs={"Location"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "location"
                    }}
                  />
                }
              </li>
              <li
                className={"nav-item tab-button "}
                algaehtabs={"LocationPermission"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "location_permission"
                    }}
                  />
                }
              </li>

              <li
                algaehtabs={"ItemCategory"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "item_category"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ItemGroup"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "item_group"
                    }}
                  />
                }
              </li>
              <li
                className={"nav-item tab-button "}
                algaehtabs={"ItemUOM"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "UOM Master"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>

        <div className="common-section">
          {this.state.pageDisplay === "InventoryOptions" ? (
            <InventoryOptions />
          ) : this.state.pageDisplay === "ItemCategory" ? (
            <ItemCategory />
          ) : this.state.pageDisplay === "ItemGroup" ? (
            <ItemGroup />
          ) : this.state.pageDisplay === "ItemUOM" ? (
            <ItemUOM />
          ) : this.state.pageDisplay === "Location" ? (
            <Location />
          ) : this.state.pageDisplay === "LocationPermission" ? (
            <LocationPermission />
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InventorySetup)
);
