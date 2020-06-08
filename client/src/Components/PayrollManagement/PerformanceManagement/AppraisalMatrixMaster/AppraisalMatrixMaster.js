import React, { Component } from "react";
import "./AppraisalMatrixMaster.scss";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class AppraisalMatrixMaster extends Component {
  render() {
    return (
      <div className="row AppraisalMatrixMaster">
        <div className="col-4">
          <div className="portlet portlet-bordered margin-top-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">KPI Master</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                {/* <AlagehAutoComplete
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{ forceLabel: "Select Group", isImp: true }}
                  selector={{
                    name: "",
                    value: "",
                    className: "select-fld",
                    dataSource: {
                      textField: "",
                      valueField: "",
                      // data: "",
                    },
                    //onChange: this.dropDownHandler.bind(this),
                  }}
                /> */}
                <AlagehFormGroup
                  div={{ className: "col form-group mandatory" }}
                  label={{
                    forceLabel: "KPI Name",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "kpi_name_fld",
                    value: "",
                    events: {
                      // onChange: this.textHandler.bind(this),
                    },
                    others: {
                      type: "text",
                    },
                  }}
                />
                <div className="col-2 align-middle" style={{ paddingTop: 19 }}>
                  <button className="btn btn-primary">Add</button>
                </div>
              </div>
              <div className="row">
                <div className="col-12" id="QuestionnaireMasterGrid_Cntr">
                  <AlgaehDataGrid
                    id="QuestionnaireMasterGrid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                        displayTemplate: (row) => {
                          return <i className="fas fa-trash-alt" />;
                        },
                        others: { maxWidth: 70 },
                      },
                      {
                        fieldName: "kpiNameFld",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "KPI Name" }} />
                        ),
                      },
                    ]}
                    keyId=""
                    dataSource={{}}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="portlet portlet-bordered margin-top-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Appraisal Matrix Range</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-2 form-group mandatory" }}
                  label={{
                    forceLabel: "From Range",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "matrix_from_range_fld",
                    value: "",
                    events: {
                      // onChange: this.textHandler.bind(this)
                    },
                    others: {
                      type: "number",
                      // disabled: true,
                    },
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-2 form-group mandatory" }}
                  label={{
                    forceLabel: "To Range",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "matrix_to_range_fld",
                    value: "",
                    events: {
                      // onChange: this.textHandler.bind(this),
                    },
                    others: {
                      type: "number",
                    },
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-2 form-group mandatory" }}
                  label={{
                    forceLabel: "Results",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "matrix_result_level_fld",
                    value: "",
                    events: {
                      // onChange: this.textHandler.bind(this),
                    },
                    others: {
                      type: "text",
                    },
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-2 form-group mandatory" }}
                  label={{
                    forceLabel: "Increment %",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "matrix_ince_percentage_fld",
                    value: "",
                    events: {
                      // onChange: this.textHandler.bind(this),
                    },
                    others: {
                      type: "number",
                    },
                  }}
                />
                <div className="col-1 align-middle" style={{ paddingTop: 19 }}>
                  <button className="btn btn-primary">Add to List</button>
                </div>
              </div>
              <div className="row">
                <div className="col-12" id="AppraisalMatrixMasterGrid_Cntr">
                  <AlgaehDataGrid
                    id="AppraisalMatrixMasterGrid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                        displayTemplate: (row) => {
                          return <i className="fas fa-trash-alt" />;
                        },
                        others: { maxWidth: 70 },
                      },
                      {
                        fieldName: "matrix_from_range",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "From Range" }} />
                        ),
                        others: { maxWidth: 150 },
                      },
                      {
                        fieldName: "matrix_to_range",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "To Range" }} />
                        ),
                        others: { maxWidth: 150 },
                      },
                      {
                        fieldName: "matrix_result_level",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Results" }} />
                        ),
                      },
                      {
                        fieldName: "matrix_ince_percentage",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Increment %" }} />
                        ),
                        others: {
                          maxWidth: 250,
                          visibled: true, //this.state.org_country_id ===178?false:true
                        },
                      },
                    ]}
                    keyId=""
                    dataSource={{}}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
