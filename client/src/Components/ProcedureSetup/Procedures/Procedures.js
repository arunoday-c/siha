import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./procedures.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import ProceduresEvent from "./ProceduresEvent";
import { AlgaehActions } from "../../../actions/algaehActions";

// import { getAmountFormart } from "../../../utils/GlobalFunctions";

import GlobalVariables from "../../../utils/GlobalVariables";

class Procedures extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hims_d_procedure_id: null,
      procedure_code: null,
      procedure_desc: null,
      procedure_status: "A",
      service_id: null,
      procedure_amount: 0,

      open: false,
      ProcedureDetail: [],
      deleteProcedure: [],
      insertProcedure: [],

      s_service_type: null,
      s_service: null,
      qty: 1
    };
  }

  componentDidMount() {
    if (
      this.props.displayservices === undefined ||
      this.props.displayservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        data: { service_type_id: "4" },
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "displayservices"
        }
      });
    }

    if (
      this.props.inventoryitemlist === undefined ||
      this.props.inventoryitemlist.length === 0
    ) {
      this.props.getItems({
        uri: "/inventory/getItemMaster",
        data: { item_status: "A" },
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "inventoryitemlist"
        }
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.ProceduresPop.hims_d_procedure_id !== undefined) {
      let IOputs = newProps.ProceduresPop;
      this.setState({ ...this.state, ...IOputs });
    }
  }

  onClose = e => {
    this.setState(
      {
        hims_d_procedure_id: null,
        procedure_code: null,
        procedure_desc: null,
        procedure_amount: 0,
        total_service_amount: 0,
        profit_loss: null,
        pl_amount: 0,

        open: false,
        ProcedureDetail: [],
        deletePackage: [],
        insertProcedure: [],
        s_service_amount: null,
        s_service_type: null,
        s_service: null
      },
      () => {
        this.props.onClose && this.props.onClose(false);
      }
    );
  };

  itemchangeText(e) {
    ProceduresEvent().itemchangeText(this, e);
  }
  eventHandaler(e) {
    ProceduresEvent().texthandle(this, e);
  }
  serviceHandeler(e) {
    ProceduresEvent().serviceHandeler(this, e);
  }

  AddToList() {
    ProceduresEvent().AddToList(this);
  }

  DeleteService(row) {
    ProceduresEvent().DeleteService(this, row);
  }

  InsertProcedures(e) {
    ProceduresEvent().AddProcedure(this, e);
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-investigation-form">
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title={this.props.HeaderCaption}
            openPopup={this.props.show}
          >
            <div className="col-lg-12 popupInner">
              <div className="col-12 popRightDiv" style={{ maxHeight: "76vh" }}>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Procedure Code",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "procedure_code",
                      value: this.state.procedure_code,
                      events: {
                        onChange: this.eventHandaler.bind(this)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Description",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "procedure_desc",
                      value: this.state.procedure_desc,
                      events: {
                        onChange: this.eventHandaler.bind(this)
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Service"
                    }}
                    selector={{
                      name: "service_id",
                      className: "select-fld",
                      value: this.state.service_id,
                      dataSource: {
                        textField: "service_name",
                        valueField: "hims_d_services_id",
                        data: this.props.procedureservices
                      },
                      onChange: this.eventHandaler.bind(this)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Procedure Type"
                    }}
                    selector={{
                      name: "procedure_type",
                      className: "select-fld",
                      value: this.state.procedure_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.PROCEDURE_TYPE
                      },
                      onChange: this.eventHandaler.bind(this)
                    }}
                  />

                  {this.state.hims_d_procedure_id === null ? (
                    <AlagehFormGroup
                      div={{ className: "col form-group" }}
                      label={{
                        forceLabel: "procedure amount"
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        value: this.state.procedure_amount,
                        className: "txt-fld",
                        name: "procedure_amount",
                        events: {
                          onChange: this.eventHandaler.bind(this)
                        },
                        others: {
                          placeholder: "0.00"
                        }
                      }}
                    />
                  ) : null}
                </div>

                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-5" }}
                    label={{ forceLabel: "Item Name", isImp: true }}
                    selector={{
                      name: "item_id",
                      className: "select-fld",
                      value: this.state.item_id,
                      dataSource: {
                        textField: "item_description",
                        valueField: "hims_d_inventory_item_master_id",
                        data: this.props.inventoryitemlist
                      },
                      onChange: this.itemchangeText.bind(this),
                      onClear: () => {
                        this.setState({
                          item_id: null
                        });
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-2" }}
                    label={{
                      forceLabel: "Quantity",
                      isImp: true
                    }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ","
                      },
                      className: "txt-fld",
                      name: "qty",
                      value: this.state.qty,
                      events: {
                        onChange: this.eventHandaler.bind(this)
                      },
                      others: {
                        step: "1"
                      }
                    }}
                  />
                  <div className="col-2 form-group">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 19 }}
                      onClick={this.AddToList.bind(this)}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-lg-12" id="procedureGrid_Cntr">
                      <AlgaehDataGrid
                        id="packages_detail_grid"
                        columns={[
                          {
                            fieldName: "action",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Action" }} />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  <i
                                    className="fas fa-trash-alt"
                                    onClick={this.DeleteService.bind(this, row)}
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
                            fieldName: "item_id",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Item Name" }}
                              />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.inventoryitemlist === undefined
                                  ? []
                                  : this.props.inventoryitemlist.filter(
                                      f =>
                                        f.hims_d_inventory_item_master_id ===
                                        row.item_id
                                    );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].item_description
                                    : ""}
                                </span>
                              );
                            }
                          },
                          {
                            fieldName: "service_id",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Service Name" }}
                              />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.displayservices === undefined
                                  ? []
                                  : this.props.displayservices.filter(
                                      f =>
                                        f.hims_d_services_id === row.service_id
                                    );

                              return (
                                <span>
                                  {display !== null && display.length !== 0
                                    ? display[0].service_name
                                    : ""}
                                </span>
                              );
                            }
                          },
                          {
                            fieldName: "qty",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                            )
                          }
                        ]}
                        keyId="packages_detail_grid"
                        dataSource={{
                          data: this.state.ProcedureDetail
                        }}
                        // isEditable={true}
                        filter={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>

                  <div className="col-lg-8">
                    <button
                      onClick={this.InsertProcedures.bind(this)}
                      type="button"
                      className="btn btn-primary"
                    >
                      {this.state.hims_d_procedure_id === null ? (
                        <AlgaehLabel label={{ forceLabel: "Save" }} />
                      ) : (
                        <AlgaehLabel label={{ forceLabel: "Update" }} />
                      )}
                    </button>
                    <button
                      onClick={e => {
                        this.onClose(e);
                      }}
                      type="button"
                      className="btn btn-default"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    procedureservices: state.procedureservices,
    displayservices: state.displayservices,
    inventoryitemlist: state.inventoryitemlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      getItems: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Procedures)
);
