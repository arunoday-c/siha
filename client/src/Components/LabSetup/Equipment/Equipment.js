import React, { Component } from "react";

import "./Equipment.scss";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehDataGrid,
  AlgaehLabel,
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import EquipmentPop from "./EquipmentPop"
import { getCookie } from "../../../utils/algaehApiCall.js";
import { getMachineAnalyte } from "./EquipmentEvent";

class Equipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      machine_ana_data: [],
      selected_Machine_analyte: {}
    };
  }


  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });

    if (
      this.props.labanalytes === undefined ||
      this.props.labanalytes.length === 0
    ) {
      this.props.getLabAnalytes({
        uri: "/labmasters/selectAnalytes",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "ANALYTES_GET_DATA",
          mappingName: "labanalytes"
        }
      });
    }
    this.props.getLisMachineConfiguration({
      uri: "/algaehMasters/getLisMachineConfiguration",
      method: "GET",
      redux: {
        type: "MACHINE_GET_DATA",
        mappingName: "machinedata"
      }
    });
    getMachineAnalyte(this, this)
  }

  ShowModel(data) {

    this.setState({
      isOpen: !this.state.isOpen,
      selected_Machine_analyte: data
    });
  }

  CloseModel(e) {
    this.setState(
      {
        isOpen: !this.state.isOpen,
        selected_Machine_analyte: {}
      },
      () => {
        getMachineAnalyte(this, this);
      }
    );
  }

  render() {
    return (
      <div className="LisConfig">
        <div className="row">
          <div className="col-12" style={{ marginTop: 15 }}>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Lists of Machine</h3>
                </div>
                <div className="actions">
                  <button
                    className="btn btn-primary active"
                    style={{ lineHeight: "22px" }}
                    onClick={this.ShowModel.bind(this, {})}
                  >
                    Machine Analyte Mapping
                  </button>
                </div>
              </div>

              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="lis_configurationGrid_Cntr">
                    <AlgaehDataGrid
                      id="machine_analyte_map"
                      columns={[
                        {
                          fieldName: "action",

                          label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                          displayTemplate: row => {
                            return (
                              <span>
                                <i
                                  className="fas fa-pen"
                                  onClick={this.ShowModel.bind(this, row)}
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
                          fieldName: "machine_name",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Machine Name" }} />
                          )
                        },
                        {
                          fieldName: "hospital_name",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Branch Name" }} />
                          )
                        },
                        {
                          fieldName: "created_by",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "created by" }} />
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
                          }
                        }
                      ]}
                      keyId="hims_d_lis_configuration_id"
                      dataSource={{ data: this.state.machine_ana_data }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: "",
                        onDelete: "",
                        onDone: ""
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <EquipmentPop
          HeaderCaption={
            <AlgaehLabel
              label={{
                fieldName: "Machine Analyte Mapping",
                align: "ltr"
              }}
            />
          }
          open={this.state.isOpen}
          onClose={this.CloseModel.bind(this)}
          selected_Machine_analyte={this.state.selected_Machine_analyte}
          machine_ana_data={this.state.machine_ana_data}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    labanalytes: state.labanalytes,
    machinedata: state.machinedata,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabAnalytes: AlgaehActions,
      getLisMachineConfiguration: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Equipment)
);
