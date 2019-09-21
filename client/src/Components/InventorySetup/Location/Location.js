import React, { Component } from "react";
import "./Location.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";

import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall";
import {
  changeTexts,
  onchangegridcol,
  insertLocation,
  updateLocation,
  deleteLocation,
  getLocation,
  allowPos
} from "./LocationEvents";
import Options from "../../../Options.json";
import moment from "moment";
import { AlgaehOpenContainer } from "../../../utils/GlobalFunctions";

class Location extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_inventory_location_id: "",
      location_description: "",
      location_type: null,
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      allow_pos: "N"
    };
    this.baseState = this.state;
    // console.log("Currency Detail:",JSON.parse(
    //   AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
    // ))
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });

    if (
      this.props.inventorylocation === undefined ||
      this.props.inventorylocation.length === 0
    ) {
      getLocation(this, this);
    }
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganization",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations"
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
      <div className="portlet portlet-bordered">
        <div className="portlet-body">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "hospital_id",
                isImp: true
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.props.organizations
                },
                onChange: changeTexts.bind(this, this),
                onClear: () => {
                  this.setState({
                    hospital_id: null
                  });
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "location_type",
                isImp: true
              }}
              selector={{
                name: "location_type",
                className: "select-fld",
                value: this.state.location_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.FORMAT_PHARMACY_STORE
                },
                onChange: changeTexts.bind(this, this),
                onClear: () => {
                  this.setState({
                    location_type: null
                  });
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "type_desc",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "location_description",
                value: this.state.location_description,

                events: {
                  onChange: changeTexts.bind(this, this)
                }
              }}
            />

            <div
              className="customCheckbox col-lg-2"
              style={{ border: "none", marginTop: "19px" }}
            >
              <label className="checkbox" style={{ color: "#212529" }}>
                <input
                  type="checkbox"
                  name="Allow POS"
                  checked={this.state.allowpos}
                  onChange={allowPos.bind(this, this)}
                />
                <span style={{ fontSize: "0.8rem" }}>Allow POS</span>
              </label>
            </div>

            <div className="col-lg-2 align-middle" style={{ paddingTop: 21 }}>
              <button
                onClick={insertLocation.bind(this, this)}
                className="btn btn-primary"
              >
                <AlgaehLabel label={{ fieldName: "Addbutton" }} />
              </button>
            </div>
          </div>
          <div className="row">
            <div
              className="col-12"
              id="inventory_locationGrid_Cntr"
              data-validate="pharLocDiv"
            >
              <AlgaehDataGrid
                datavalidate="data-validate='pharLocDiv'"
                id="inventory_locationGrid"
                columns={[
                  {
                    fieldName: "location_description",
                    label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.location_description,
                            className: "txt-fld",
                            name: "location_description",
                            events: {
                              onChange: onchangegridcol.bind(this, this, row)
                            },
                            others: {
                              errormessage: "Description - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "location_type",
                    label: (
                      <AlgaehLabel label={{ fieldName: "location_type" }} />
                    ),
                    displayTemplate: row => {
                      return row.location_type === "WH"
                        ? "Warehouse"
                        : row.location_type === "MS"
                        ? "Main Store"
                        : row.location_type === "SS"
                        ? "Sub Store"
                        : null;
                    },
                    editorTemplate: row => {
                      return row.location_type === "WH"
                        ? "Warehouse"
                        : row.location_type === "MS"
                        ? "Main Store"
                        : row.location_type === "SS"
                        ? "Sub Store"
                        : null;
                    }
                  },
                  {
                    fieldName: "allow_pos",
                    label: <AlgaehLabel label={{ fieldName: "allow_pos" }} />,
                    displayTemplate: row => {
                      return row.allow_pos === "N"
                        ? "No"
                        : row.allow_pos === "Y"
                        ? "Yes"
                        : null;
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "allow_pos",
                            className: "select-fld",
                            value: row.allow_pos,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_YESNO
                            },
                            onChange: onchangegridcol.bind(this, this, row),
                            others: {
                              errormessage: "Allow POS - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "hospital_id",
                    label: <AlgaehLabel label={{ fieldName: "hospital_id" }} />,
                    displayTemplate: row => {
                      let display =
                        this.props.organizations === undefined
                          ? []
                          : this.props.organizations.filter(
                              f => f.hims_d_hospital_id === row.hospital_id
                            );

                      return (
                        <span>
                          {display !== null && display.length !== 0
                            ? display[0].hospital_name
                            : ""}
                        </span>
                      );
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "hospital_id",
                            className: "select-fld",
                            value: row.hospital_id,
                            dataSource: {
                              textField: "hospital_name",
                              valueField: "hims_d_hospital_id",
                              data: this.props.organizations
                            },
                            onChange: onchangegridcol.bind(this, this, row),
                            others: {
                              errormessage: "Division/Branch - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "created_by",
                    label: <AlgaehLabel label={{ fieldName: "created_by" }} />,
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
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    },

                    editorTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    }
                  },
                  {
                    fieldName: "location_status",
                    label: <AlgaehLabel label={{ fieldName: "inv_status" }} />,
                    displayTemplate: row => {
                      return row.location_status === "A"
                        ? "Active"
                        : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "location_status",
                            className: "select-fld",
                            value: row.location_status,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_STATUS
                            },
                            onChange: onchangegridcol.bind(this, this, row),
                            others: {
                              errormessage: "Status - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  }
                ]}
                keyId="hims_d_inventory_location_id"
                dataSource={{
                  data:
                    this.props.inventorylocation === undefined
                      ? []
                      : this.props.inventorylocation
                }}
                filter={true}
                isEditable={true}
                filter={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onDelete: deleteLocation.bind(this, this),
                  onEdit: row => {},

                  onDone: updateLocation.bind(this, this)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    inventorylocation: state.inventorylocation,
    userdrtails: state.userdrtails,
    organizations: state.organizations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
      getOrganizations: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Location)
);
