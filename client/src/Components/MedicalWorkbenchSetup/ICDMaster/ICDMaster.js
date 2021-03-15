import React, { Component } from "react";
// import "./Allergies.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import {
//   AlagehFormGroup,
//   // AlgaehDataGrid,
//   //    AlgaehAutoComplete,
//   //   AlgaehLabel,
// } from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  changeTexts,
  // onchangegridcol,
  insertICDMaster,
  // updateICDS,
  handleDropDown,
  updateICDcode,
  deleteICDMaster,
  // deleteICDS
} from "./ICDMasterEvents";
import {
  AlgaehDataGrid,
  AlgaehFormGroup,
  // AlgaehDataGrid,
  AlgaehAutoComplete,
  AlgaehLabel,
} from "algaeh-react-components";
import Options from "../../../Options.json";
import moment from "moment";
// import { filter } from "lodash";

class ICDMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_icd_id: null,
      icd_code: null,
      icd_description: null,
      icd_type: "",
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    if (this.props.allIcds === undefined || this.props.allIcds.length === 0) {
      this.props.getICDMaster({
        uri: "/doctorsWorkBench/getICDMaster",
        method: "GET",
        cancelRequestId: "getICDMaster",
        redux: {
          type: "ALL_ICDS",
          mappingName: "allIcds",
        },
      });
    }
    if (
      this.props.userdrtails === undefined ||
      this.props.userdrtails.length === 0
    ) {
      this.props.getUserDetails({
        uri: "/algaehappuser/selectAppUsers",
        method: "GET",
        redux: {
          type: "USER_DETAILS_GET_DATA",
          mappingName: "userdrtails",
        },
      });
    }
  }

  dateFormater(date) {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  }
  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    // row.update();
  }

  render() {
    return (
      <div className="lab_section">
        <div className="row inner-top-search margin-bottom-15">
          <AlgaehFormGroup
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "ICD COde",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "icd_code",
              value: this.state.icd_code,
              //   events: {
              onChange: changeTexts.bind(this, this),
              //   },
            }}
          />

          <AlgaehFormGroup
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "ICD Description",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "icd_description",
              value: this.state.icd_description,
              //   events: {
              onChange: changeTexts.bind(this, this),
              //   },
            }}
          />

          <AlgaehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "ICD Type",
              isImp: true,
            }}
            selector={{
              name: "icd_type",
              className: "select-fld",
              value: this.state.icd_type,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.ICD_TYPES,
              },
              onChange: handleDropDown.bind(this, this),
            }}
          />

          <div className="col-lg-2 align-middle" style={{ paddingTop: 19 }}>
            <button
              onClick={insertICDMaster.bind(this, this)}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row" data-validate="analyteDiv">
              <div className="col" id="ICDMasterGrid_Cntr">
                <AlgaehDataGrid
                  datavalidate="data-validate='analyteDiv'"
                  id="ICDMasterGrid"
                  columns={[
                    {
                      fieldName: "icd_code",
                      label: <AlgaehLabel label={{ forceLabel: "ICD Code" }} />,
                      filterable: true,
                      sortable: true,
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "icd_code",
                              value: row.icd_code,
                              updateInternally: true,
                              onChange: (e) => {
                                row.icd_code = e.target.value;
                              },
                            }}
                          />
                        );
                      },
                    },
                    {
                      fieldName: "icd_description",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "ICD Description" }}
                        />
                      ),
                      filterable: true,
                      sortable: true,
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "icd_description",
                              value: row.icd_description,
                              updateInternally: true,
                              onChange: (e) => {
                                row.icd_description = e.target.value;
                              },
                            }}
                            events={{}}
                          />
                        );
                      },
                    },
                    {
                      fieldName: "icd_type",
                      label: <AlgaehLabel label={{ forceLabel: "ICD Type" }} />,
                      filterable: true,
                      sortable: true,
                      displayTemplate: (row) => {
                        let display = GlobalVariables.ICD_TYPES.filter(
                          (f) => f.value === row.icd_type
                        );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].name
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          <AlgaehAutoComplete
                            //   div={{}}
                            selector={{
                              name: "icd_type",
                              className: "select-fld",
                              value: row.icd_type,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.ICD_TYPES,
                              },
                              updateInternally: true,
                              onChange: (e, value) => {
                                row.icd_type = value;
                              },
                              others: {
                                errormessage: "ICD Type - Cannot be blank",
                                required: true,
                              },
                            }}
                          />
                        );
                      },
                    },
                    {
                      fieldName: "created_by",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_by" }} />
                      ),
                      displayTemplate: (row) => {
                        let display =
                          this.props.userdrtails === undefined
                            ? []
                            : this.props.userdrtails.filter(
                                (f) => f.algaeh_d_app_user_id === row.created_by
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].username
                              : ""}
                          </span>
                        );
                      },

                      editorTemplate: (row) => {
                        let display =
                          this.props.userdrtails === undefined
                            ? []
                            : this.props.userdrtails.filter(
                                (f) => f.algaeh_d_app_user_id === row.created_by
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].username
                              : ""}
                          </span>
                        );
                      },
                      others: { maxWidth: 150 },
                      filterable: true,
                      sortable: true,
                      // disabled: true
                    },
                    {
                      fieldName: "created_date",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_date" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      },
                      others: { maxWidth: 100 },
                      filterable: true,
                      sortable: true,
                    },
                  ]}
                  keyId="hims_d_icd_id"
                  // dataSource={{
                  data={
                    this.props.allIcds === undefined ? [] : this.props.allIcds
                  }
                  // }}
                  isEditable={true}
                  isFilterable={true}
                  // paging={{ page: 0, rowsPerPage: 10 }}
                  pagination={true}
                  events={{
                    onDelete: deleteICDMaster.bind(this, this),
                    onEdit: (row) => {},
                    onSave: updateICDcode.bind(this, this),
                    // onDone: updateICDcode.bind(this, this),
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
    allIcds: state.allIcds,
    userdrtails: state.userdrtails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getICDMaster: AlgaehActions,
      getUserDetails: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ICDMaster)
);
