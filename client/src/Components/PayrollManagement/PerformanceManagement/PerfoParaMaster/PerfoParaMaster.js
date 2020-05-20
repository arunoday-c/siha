import React, { Component } from "react";

import "./PerfoParaMaster.scss";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
export default class PerfoParaMaster extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-4">
          <div className="portlet portlet-bordered margin-top-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Questionnaire Group</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col form-group mandatory" }}
                  label={{
                    forceLabel: "Group Name",
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
                      type: "text",
                    },
                  }}
                />
                <div className="col-2 align-middle" style={{ paddingTop: 19 }}>
                  <button className="btn btn-primary">Add</button>
                </div>
              </div>
              <div className="row">
                <div className="col-12" id="ParamGroupGrid_Cntr">
                  <AlgaehDataGrid
                    id="ParamGroupGrid"
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
                        fieldName: "paramGroupName",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Group Name" }} />
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
                <h3 className="caption-subject">Questionnaire Master</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlagehAutoComplete
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
                />
                <AlagehFormGroup
                  div={{ className: "col form-group mandatory" }}
                  label={{
                    forceLabel: "Enter Questionnaire",
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
                      type: "text",
                    },
                  }}
                />
                <div className="col-1 align-middle" style={{ paddingTop: 19 }}>
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
                        fieldName: "paramGroupNameFld",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Group Name" }} />
                        ),
                      },
                      {
                        fieldName: "QuestionnaireName",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Questionnaire" }}
                          />
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
      </div>
    );
  }
}
