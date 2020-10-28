import React, { Component } from "react";

import "./ProcedureSetup.scss";
import "../../styles/site.scss";
import { AlgaehLabel, AlgaehDataGrid } from "../Wrapper/algaehWrapper";
import ProcedureSetupEvent from "./ProcedureSetupEvent";
import Procedures from "./Procedures/Procedures";

export default class ProcedureSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,

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
                // href="javascript"
                className="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
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
                      others: {
                        maxWidth: 65,
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "procedure_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Procedure Code" }} />
                      ),
                      others: {
                        maxWidth: 120,
                      },
                    },
                    {
                      fieldName: "procedure_desc",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Procedure Desc" }} />
                      ),
                      others: { style: { textAlign: "left" } },
                    },
                    {
                      fieldName: "procedure_desc_arabic",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Description Arabic" }}
                        />
                      ),
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

                      others: {
                        maxWidth: 120,
                      },
                    },
                    {
                      fieldName: "procedure_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Procedure Amt." }} />
                      ),
                      others: {
                        maxWidth: 120,
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
                      others: {
                        maxWidth: 110,
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
                      others: {
                        maxWidth: 100,
                      },
                    },
                  ]}
                  keyId="procedure_code"
                  dataSource={{
                    data: this.state.all_procedures,
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 20 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
