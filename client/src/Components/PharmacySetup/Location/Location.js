import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./Location.css";
import Button from "@material-ui/core/Button";

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
  getLocation
} from "./LocationEvents";
import Options from "../../../Options.json";
import moment from "moment";

class Location extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_pharmacy_location_id: "",
      location_description: "",

      description_error: false,
      description_error_txt: ""
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
    // getLocation(this, this);
  }

  dateFormater({ date }) {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <div className="lab_section">
        <LinearProgress id="myProg" style={{ display: "none" }} />
        <Paper className="container-fluid">
          <form>
            <div
              className="row"
              style={{
                padding: 20,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
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
                  error: this.state.description_error,
                  helperText: this.state.description_error_txt,
                  events: {
                    onChange: changeTexts.bind(this, this)
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
                  onChange: changeTexts.bind(this, this)
                }}
              />

              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  onClick={insertLocation.bind(this, this)}
                  variant="raised"
                  color="primary"
                >
                  <AlgaehLabel label={{ fieldName: "Addbutton" }} />
                </Button>
              </div>
            </div>
          </form>

          <div className="row form-details">
            <div className="col">
              <AlgaehDataGrid
                id="pharmacy_location"
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
                      return row.location_type === "MN"
                        ? "Mian Store"
                        : row.location_type === "SS"
                          ? "Sub Store"
                          : null;
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "location_type",
                            className: "select-fld",
                            value: row.location_type,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_PHARMACY_STORE
                            },
                            onChange: onchangegridcol.bind(this, this, row)
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "created_by",
                    label: <AlgaehLabel label={{ fieldName: "created_by" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "created_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "created_date" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    },
                    disabled: true
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
                            onChange: onchangegridcol.bind(this, this, row)
                          }}
                        />
                      );
                    }
                  }
                ]}
                keyId="hims_d_pharmacy_location_id"
                dataSource={{
                  data:
                    this.props.location === undefined ? [] : this.props.location
                }}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 5 }}
                events={{
                  onDelete: deleteLocation.bind(this, this),
                  onEdit: row => {},

                  onDone: updateLocation.bind(this, this)
                }}
              />
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    location: state.location
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions
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
