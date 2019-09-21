import React, { Component } from "react";
import "./LabSpecimen.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import {
  changeTexts,
  onchangegridcol,
  insertLabSpecimen,
  updateLabSpecimen,
  deleteLabSpecimen,
  UrineSpecimen
} from "./LabSpecimenEvents";

import GlobalVariables from "../../../utils/GlobalVariables";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall.js";
import Options from "../../../Options.json";
import moment from "moment";

class LabSpecimen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_lab_specimen_id: "",
      description: "",
      storage_type: null,
      urine_specimen: "N",
      urineSpecimen: false
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
    if (
      this.props.labspecimen === undefined ||
      this.props.labspecimen.length === 0
    ) {
      this.props.getLabSpecimen({
        uri: "/labmasters/selectSpecimen",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "SPECIMEN_GET_DATA",
          mappingName: "labspecimen"
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
      <div className="lab_section">
        <div className="row inner-top-search margin-bottom-15">
          <AlagehFormGroup
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Specimen Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "description",
              value: this.state.description,
              events: {
                onChange: changeTexts.bind(this, this)
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Select Storage Type",
              isImp: true
            }}
            selector={{
              name: "storage_type",
              className: "select-fld",
              value: this.state.storage_type,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.FORMAT_STORAGE_TYPE
              },
              onChange: changeTexts.bind(this, this)
            }}
          />
          <div className="col-3" style={{ marginTop: 20 }}>
            <div className="customCheckbox" style={{ borderBottom: 0 }}>
              <label className="checkbox" style={{ color: "#212529" }}>
                <input
                  type="checkbox"
                  name="urine_specimen"
                  checked={this.state.urine_specimen === "Y" ? true : false}
                  onChange={UrineSpecimen.bind(this, this)}
                />
                <span>Urine Specimen</span>
              </label>
            </div>
          </div>
          <div className="col-lg-2 align-middle" style={{ paddingTop: 19 }}>
            <button
              onClick={insertLabSpecimen.bind(this, this)}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            {" "}
            <div className="row" data-validate="labSpecimenDiv">
              <div className="col" id="labSpecimenGrid_Cntr">
                <AlgaehDataGrid
                  datavalidate="data-validate='labSpecimenDiv'"
                  id="labSpecimenGrid"
                  columns={[
                    {
                      fieldName: "SpeDescription",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Specimen Name" }} />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.SpeDescription,
                              className: "txt-fld",
                              name: "SpeDescription",
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
                      fieldName: "storage_type",
                      label: (
                        <AlgaehLabel label={{ fieldName: "storage_type" }} />
                      ),
                      displayTemplate: row => {
                        return row.storage_type === "N"
                          ? "Normal"
                          : row.storage_type === "F"
                          ? "Frozen"
                          : "Refrigerate";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            selector={{
                              name: "storage_type",
                              className: "select-fld",
                              value: row.storage_type,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_STORAGE_TYPE
                              },
                              onChange: onchangegridcol.bind(this, this, row),
                              others: {
                                errormessage: "Storage Type - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      },
                      others: { maxWidth: 200 }
                    },
                    {
                      fieldName: "urine_specimen",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Urine Specimen" }} />
                      ),
                      displayTemplate: row => {
                        return row.urine_specimen === "N" ? "No" : "Yes";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "urine_specimen",
                              className: "select-fld",
                              value: row.urine_specimen,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_YESNO
                              },
                              onChange: onchangegridcol.bind(this, this, row),
                              others: {
                                errormessage:
                                  "Urine Specimen - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      },
                      others: { maxWidth: 100 }
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
                      },
                      others: { maxWidth: 150 }
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
                      },
                      others: { maxWidth: 100 }
                      //disabled: true
                    },
                    {
                      fieldName: "specimen_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "inv_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.specimen_status === "A"
                          ? "Active"
                          : "Inactive";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "specimen_status",
                              className: "select-fld",
                              value: row.specimen_status,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_STATUS
                              },
                              onChange: onchangegridcol.bind(this, this, row),
                              others: {
                                errormessage:
                                  "Specimen Status - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      },
                      others: { maxWidth: 100 }
                    }
                  ]}
                  keyId="hims_d_lab_section_id"
                  dataSource={{
                    data:
                      this.props.labspecimen === undefined
                        ? []
                        : this.props.labspecimen
                  }}
                  isEditable={true}
                  actions={{
                    allowDelete: false
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    //onDelete: deleteLabSpecimen.bind(this, this),
                    onEdit: row => {},
                    onDone: updateLabSpecimen.bind(this, this)
                  }}
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
    labspecimen: state.labspecimen,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabSpecimen: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LabSpecimen)
);
