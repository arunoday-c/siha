import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./PharmacySetup.css";
import "../../index.css";
import ItemCategory from "./ItemCategory/ItemCategory";
import ItemGeneric from "./ItemGeneric/ItemGeneric";
import ItemGroup from "./ItemGroup/ItemGroup";
import ItemUOM from "./ItemUOM/ItemUOM";
import Location from "./Location/Location";
import ItemForm from "./ItemForm/ItemForm";
import ItemStorage from "./ItemStorage/ItemStorage";
import LocationPermission from "./LocationPermission/LocationPermission";

import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

class PharmacySetup extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "ItemCategory", sidBarOpen: true };
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
    this.props.getUserDetails({
      uri: "/algaehappuser/selectAppUsers",
      method: "GET",
      redux: {
        type: "USER_DETAILS_GET_DATA",
        mappingName: "userdrtails"
      }
    });
  }

  render() {
    return (
      <div className="hims_pharmacy_setup">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "Pharmacy_setup", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "Pharmacy_settings",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ fieldName: "Pharmacy_setup", align: "ltr" }}
                />
              )
            }
          ]}
          //screenName="Master Setup"
          //   HideHalfbread={false}
        />
        <div className="tab-container toggle-section spacing-push">
          <ul className="nav">
            <li
              algaehtabs={"ItemCategory"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button active"}
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
              style={{ marginRight: 2 }}
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
              style={{ marginRight: 2 }}
              algaehtabs={"ItemGeneric"}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "item_generic"
                  }}
                />
              }
            </li>

            <li
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              algaehtabs={"ItemUOM"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "item_uom"
                  }}
                />
              }
            </li>
            <li
              style={{ marginRight: 2 }}
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
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              algaehtabs={"Form"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "item_form"
                  }}
                />
              }
            </li>

            <li
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              algaehtabs={"Storage"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "item_storage"
                  }}
                />
              }
            </li>

            <li
              style={{ marginRight: 2 }}
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
          </ul>
        </div>

        <div className="common-section">
          {/*  {<this.state.pageDisplay />} */}

          {this.state.pageDisplay === "ItemCategory" ? (
            <ItemCategory />
          ) : this.state.pageDisplay === "ItemGroup" ? (
            <ItemGroup />
          ) : this.state.pageDisplay === "ItemGeneric" ? (
            <ItemGeneric />
          ) : this.state.pageDisplay === "ItemUOM" ? (
            <ItemUOM />
          ) : this.state.pageDisplay === "Location" ? (
            <Location />
          ) : this.state.pageDisplay === "Form" ? (
            <ItemForm />
          ) : this.state.pageDisplay === "Storage" ? (
            <ItemStorage />
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
  )(PharmacySetup)
);
