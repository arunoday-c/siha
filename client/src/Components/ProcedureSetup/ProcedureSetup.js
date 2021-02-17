import React, { Component } from "react";

import "./ProcedureSetup.scss";
import "../../styles/site.scss";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import ProcedureSetupEvent from "./ProcedureSetupEvent";
import Procedures from "./Procedures/Procedures";
import ItemAssignPercedure from "./Procedures/ItemAssignPercedure";
import { AlgaehDataGrid } from "algaeh-react-components";

export default class ProcedureSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isOpenItem: false,
      ProceduresPop: {},
      all_procedures: [],
    };
    ProcedureSetupEvent().getProcedure(this);
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      ProceduresPop: {},
    });
  }

  ShowItemModel() {
    this.setState({
      ...this.state,
      isOpenItem: !this.state.isOpenItem,
    });
  }
  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen,
        ProceduresPop: {},
      },
      () => {
        if (e === true) {
          ProcedureSetupEvent().getProcedure(this);
        }
      }
    );
  }

  CloseItemModel(e) {
    this.setState(
      {
        ...this.state,
        isOpenItem: !this.state.isOpenItem,
      },
      () => {
        if (e === true) {
          ProcedureSetupEvent().getProcedure(this);
        }
      }
    );
  }

  EditProcedureMaster(row) {
    ProcedureSetupEvent().OpenProcedureMaster(this, row);
  }

  render() {
    return (
      <div className="hims_proceduresetup">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Procedure Lists</h3>
            </div>
            <div className="actions">
              <button
                onClick={this.ShowItemModel.bind(this)}
                type="button"
                className="btn btn-default"
              >
                <AlgaehLabel label={{ forceLabel: "Item Assign" }} />
              </button>
              <button
                // href="javascript"
                className="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
                style={{ marginLeft: 5 }}
              >
                <i className="fas fa-plus" />
              </button>
              <Procedures
                HeaderCaption="Procedure Details"
                show={this.state.isOpen}
                onClose={this.CloseModel.bind(this)}
                ProceduresPop={this.state.ProceduresPop}
                all_procedures={this.state.all_procedures}
              />
              <ItemAssignPercedure
                HeaderCaption="Item Assign"
                show={this.state.isOpenItem}
                onClose={this.CloseItemModel.bind(this)}
                all_procedures={this.state.all_procedures}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="proceduresGridCntr">
                <AlgaehDataGrid
                  id="proceduresGrid"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            <i
                              className="fas fa-pen"
                              onClick={this.EditProcedureMaster.bind(this, row)}
                            />
                          </span>
                        );
                      },
                      filterable: false,
                      others: {
                        maxWidth: 65,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "procedure_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Procedure Code" }} />
                      ),
                      filterable: true,
                      others: {
                        Width: 150,
                      },
                    },
                    {
                      fieldName: "procedure_desc",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Procedure Desc" }} />
                      ),
                      filterable: true,
                      others: { style: { textAlign: "left" } },
                    },
                    {
                      fieldName: "procedure_desc_arabic",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Description Arabic" }}
                        />
                      ),
                      filterable: true,
                      others: { style: { textAlign: "right" } },
                    },

                    {
                      fieldName: "procedure_type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Procedure Type" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.procedure_type === "DN" ? "Dental" : "General"}
                          </span>
                        );
                      },
                      filterable: true,
                      filterType: "choices",
                      choices: [
                        {
                          name: "Dental",
                          value: "DN",
                        },
                        {
                          name: "General",
                          value: "GN",
                        },
                      ],
                      others: {
                        Width: 140,
                      },
                    },
                    {
                      fieldName: "procedure_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Procedure Amt." }} />
                      ),
                      filterable: true,
                      others: {
                        Width: 140,
                        style: { textAlign: "right" },
                      },
                    },
                    {
                      fieldName: "vat_applicable",
                      label: (
                        <AlgaehLabel label={{ fieldName: "vat_applicable" }} />
                      ),
                      displayTemplate: (row) => {
                        return row.vat_applicable === "Y" ? "Yes" : "No";
                      },
                      filterable: true,
                      others: {
                        Width: 130,
                      },
                    },
                    {
                      fieldName: "vat_percent",
                      label: (
                        <AlgaehLabel label={{ fieldName: "vat_percent" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>{parseFloat(row.vat_percent).toFixed(0)}%</span>
                        );
                      },
                      filterable: true,
                      others: {
                        Width: 120,
                        style: { textAlign: "right" },
                      },
                    },
                  ]}
                  keyId="procedure_code"
                  data={this.state.all_procedures}
                  pagination={true}
                  isFilterable={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
