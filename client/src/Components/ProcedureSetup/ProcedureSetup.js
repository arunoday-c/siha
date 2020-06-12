import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ProcedureSetup.scss";
import "../../styles/site.scss";
import { AlgaehLabel, AlgaehDataGrid } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

import ProcedureSetupEvent from "./ProcedureSetupEvent";

import Procedures from "./Procedures/Procedures";

class ProcedureSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,

      ProceduresPop: {},
      all_procedures: []
    };
    ProcedureSetupEvent().getProcedure(this);
  }

  componentDidMount() {
    if (
      this.props.procedureservices === undefined ||
      this.props.procedureservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        data: { service_type_id: "2" },
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "procedureservices"
        }
      });
    }
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      ProceduresPop: {}
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen,
        ProceduresPop: {}
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
                      displayTemplate: row => {
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
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "procedure_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Procedure Code" }} />
                      )
                    },
                    {
                      fieldName: "procedure_desc",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Procedure Desc" }} />
                      )
                    },

                    {
                      fieldName: "service_id",
                      label: <AlgaehLabel label={{ forceLabel: "Service" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.procedureservices === undefined
                            ? []
                            : this.props.procedureservices.filter(
                              f => f.hims_d_services_id === row.service_id
                            );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].service_name
                              : ""}
                          </span>
                        );
                      }
                    }
                  ]}
                  keyId="procedure_code"
                  dataSource={{
                    data: this.state.all_procedures
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

function mapStateToProps(state) {
  return {
    procedureservices: state.procedureservices
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServices: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProcedureSetup)
);
