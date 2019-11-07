import React, { Component } from "react";
import "./LocationPermission.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import {
  changeTexts,
  onchangegridcol,
  insertLocationPermission,
  updateLocationPermission,
  deleteLocationPermission,
  getLocationPermission,
  allowHandle
} from "./LocationPermissionEvent";

import GlobalVariables from "../../../utils/GlobalVariables";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall.js";
import Options from "../../../Options.json";
import moment from "moment";

class LocationPermission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_m_location_permission_id: null,
      user_id: null,
      location_id: null,
      allow: "Y",
      allowLocation: true
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });

    if (
      this.props.locationpermission === undefined ||
      this.props.locationpermission.length === 0
    ) {
      getLocationPermission(this, this);
    }
    if (this.props.location === undefined || this.props.location.length === 0) {
      this.props.getLocation({
        uri: "/pharmacy/getPharmacyLocation",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ANALYTES_GET_DATA",
          mappingName: "location"
        }
      });
    }
  }

  dateFormater(date) {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <div className="">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Select User",
              isImp: true
            }}
            selector={{
              name: "user_id",
              className: "select-fld",
              value: this.state.user_id,
              dataSource: {
                textField: "username",
                valueField: "algaeh_d_app_user_id",
                data: this.props.userdrtails
              },
              onChange: changeTexts.bind(this, this)
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              fieldName: "from_location",
              isImp: true
            }}
            selector={{
              name: "location_id",
              className: "select-fld",
              value: this.state.location_id,
              dataSource: {
                textField: "location_description",
                valueField: "hims_d_pharmacy_location_id",
                data: this.props.location
              },
              onChange: changeTexts.bind(this, this)
            }}
          />

          <div className="col-2">
            <label>Allow Permission</label>
            <div className="customCheckbox">
              <label className="checkbox inline">
                <input
                  type="checkbox"
                  value="yes"
                  name="Allow POS"
                  checked={this.state.allowLocation}
                  onChange={allowHandle.bind(this, this)}
                />
                <span>Yes</span>
              </label>
            </div>
          </div>

          {/* <div
            className="customCheckbox col-lg-3"
            style={{ border: "none", marginTop: "28px" }}
          >
            <label className="checkbox" style={{ color: "#212529" }}>
              <input
                type="checkbox"
                name="Allow"
                checked={this.state.allowLocation}
                onChange={allowHandle.bind(this, this)}
              />
              <span style={{ fontSize: "0.8rem" }}>Allow</span>
            </label>
          </div> */}
          {/* <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "to_location",
                isImp: true
              }}
              selector={{
                name: "to_location",
                className: "select-fld",
                value: this.state.to_location,
                dataSource: {
                  textField: "location_description",
                  valueField: "hims_d_pharmacy_location_id",
                  data: this.props.locationpermi
                },
                onChange: changeTexts.bind(this, this)
              }}
            /> */}
          <div className="col" style={{ paddingTop: 19 }}>
            <button
              onClick={insertLocationPermission.bind(this, this)}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered marginBottom-15">
              <div className="portlet-body" data-validate="labSpecimenDiv">
                <AlgaehDataGrid
                  datavalidate="data-validate='labSpecimenDiv'"
                  id="visa_grd"
                  columns={[
                    {
                      fieldName: "user_id",
                      label: <AlgaehLabel label={{ fieldName: "user_id" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.userdrtails === undefined
                            ? []
                            : this.props.userdrtails.filter(
                                f => f.algaeh_d_app_user_id === row.user_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].username
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            selector={{
                              name: "user_id",
                              className: "select-fld",
                              value: row.user_id,
                              dataSource: {
                                textField: "username",
                                valueField: "algaeh_d_app_user_id",
                                data: this.props.userdrtails
                              },
                              onChange: onchangegridcol.bind(this, this, row),
                              others: {
                                errormessage: "User - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "location_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "from_location" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.location === undefined
                            ? []
                            : this.props.location.filter(
                                f =>
                                  f.hims_d_pharmacy_location_id ===
                                  row.location_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].location_description
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            selector={{
                              name: "location_id",
                              className: "select-fld",
                              value: row.location_id,
                              dataSource: {
                                textField: "location_description",
                                valueField: "hims_d_pharmacy_location_id",
                                data: this.props.location
                              },
                              onChange: onchangegridcol.bind(this, this, row),
                              others: {
                                errormessage: "Location - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "allow",
                      label: <AlgaehLabel label={{ forceLabel: "allow" }} />,
                      displayTemplate: row => {
                        return row.allow === "N" ? "No" : "Yes";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "allow",
                              className: "select-fld",
                              value: row.allow,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_YESNO
                              },
                              onChange: onchangegridcol.bind(this, this, row),
                              others: {
                                errormessage: "Allow - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      }
                    },

                    {
                      fieldName: "created_by",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_by" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.userdrtails === undefined
                            ? []
                            : this.props.userdrtails.filter(
                                f => f.algaeh_d_app_user_id === row.created_by
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].username
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        let display =
                          this.props.userdrtails === undefined
                            ? []
                            : this.props.userdrtails.filter(
                                f => f.algaeh_d_app_user_id === row.created_by
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].username
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "created_date",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_date" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      }
                      //disabled: true
                    }
                  ]}
                  keyId="hims_d_location_permission_id"
                  dataSource={{
                    data:
                      this.props.locationpermission === undefined
                        ? []
                        : this.props.locationpermission
                  }}
                  filter={true}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: deleteLocationPermission.bind(this, this),
                    onEdit: row => {},
                    onDone: updateLocationPermission.bind(this, this)
                  }}
                  filter={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locationpermission: state.locationpermission,
    userdrtails: state.userdrtails,
    location: state.location
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocationPermission: AlgaehActions,
      getLocation: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LocationPermission)
);
