import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./NewPackage.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  Modal
} from "../../Wrapper/algaehWrapper";
import NewPackageEvent from "./NewPackageEvent";
import { AlgaehActions } from "../../../actions/algaehActions";

import { getAmountFormart } from "../../../utils/GlobalFunctions";

class NewPackage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hims_d_package_header_id: null,
      package_code: null,
      package_name: null,
      package_amount: 0,
      total_service_amount: 0,
      profit_loss: null,
      pl_amount: 0,

      open: false,
      PakageDetail: [],
      deletePackage: [],
      insertPackage: [],
      s_service_amount: null,
      s_service_type: null,
      s_service: null
    };
  }

  componentDidMount() {
    if (
      this.props.servicetype === undefined ||
      this.props.servicetype.length === 0
    ) {
      this.props.getServiceTypes({
        uri: "/serviceType",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVIES_TYPES_GET_DATA",
          mappingName: "servicetype"
        }
      });
    }
    if (
      this.props.displayservices === undefined ||
      this.props.displayservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "displayservices"
        }
      });
    }
  }

  componentWillReceiveProps(newProps) {
    debugger;
    if (newProps.PackagesPop.hims_d_package_header_id !== undefined) {
      let IOputs = newProps.PackagesPop;
      this.setState({ ...this.state, ...IOputs });
    }
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(false);
  };

  eventHandaler(e) {
    NewPackageEvent().texthandle(this, e);
  }
  serviceHandeler(e) {
    NewPackageEvent().serviceHandeler(this, e);
  }

  pakageamtHandaler(e) {
    NewPackageEvent().pakageamtHandaler(this, e);
  }
  AddToList() {
    NewPackageEvent().AddToList(this);
  }

  DeleteService(row) {
    NewPackageEvent().DeleteService(this, row);
  }

  InsertPackages(e) {
    NewPackageEvent().AddPackages(this, e);
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-investigation-form">
          <Modal open={this.props.open}>
            <div className="algaeh-modal">
              <div className="popupHeader">
                <div className="row">
                  <div className="col-lg-8">
                    <h4>{this.props.HeaderCaption}</h4>
                  </div>
                  <div className="col-lg-4">
                    <button
                      type="button"
                      className=""
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      <i className="fas fa-times-circle" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="popupInner">
                <div className="col-12 popRightDiv">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      label={{
                        fieldName: "package_code",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "package_code",
                        value: this.state.package_code,
                        events: {
                          onChange: this.eventHandaler.bind(this)
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      label={{
                        fieldName: "package_name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "package_name",
                        value: this.state.package_name,
                        events: {
                          onChange: this.eventHandaler.bind(this)
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-3" }}
                      label={{
                        fieldName: "package_amount"
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        value: this.state.package_amount,
                        className: "txt-fld",
                        name: "package_amount",
                        events: {
                          onChange: this.pakageamtHandaler.bind(this)
                        },
                        others: {
                          placeholder: "0.00"
                        }
                      }}
                    />
                    <AlgaehLabel
                      label={{
                        fieldName: "total_service_amount"
                      }}
                    />
                    <h6>{getAmountFormart(this.state.total_service_amount)}</h6>

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "profit_loss"
                        }}
                      />
                      <h6>
                        {this.state.profit_loss === null
                          ? "------"
                          : this.state.profit_loss === "P"
                          ? "Profit"
                          : "Loss"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "pl_amount"
                        }}
                      />
                      <h6>{getAmountFormart(this.state.pl_amount)}</h6>
                    </div>
                  </div>
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      label={{
                        fieldName: "select_service_type",
                        isImp: true
                      }}
                      selector={{
                        name: "s_service_type",
                        className: "select-fld",
                        value: this.state.s_service_type,
                        dataSource: {
                          textField: "service_type",
                          valueField: "hims_d_service_type_id",
                          data: this.props.servicetype
                        },
                        onChange: NewPackageEvent().serviceTypeHandeler.bind(
                          this,
                          this
                        ),
                        onClear: () => {
                          this.setState({
                            s_service_type: null
                          });
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      label={{
                        fieldName: "select_service",
                        isImp: true
                      }}
                      selector={{
                        name: "s_service",
                        className: "select-fld",
                        value: this.state.s_service,
                        dataSource: {
                          textField: "service_name",
                          valueField: "hims_d_services_id",
                          data: this.props.services
                        },
                        onChange: this.serviceHandeler.bind(this),
                        onClear: () => {
                          this.setState({
                            s_service: null
                          });
                        }
                      }}
                    />
                    <div className="col-lg-4">
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: "24px" }}
                        onClick={this.AddToList.bind(this)}
                      >
                        Add To List
                      </button>
                    </div>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-lg-12" id="packagesGridCntr">
                      <AlgaehDataGrid
                        id="packages_detail_grid"
                        columns={[
                          {
                            fieldName: "action",
                            label: (
                              <AlgaehLabel label={{ fieldName: "action" }} />
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
                            fieldName: "service_type_id",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "service_type_id" }}
                              />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.servicetype === undefined
                                  ? []
                                  : this.props.servicetype.filter(
                                      f =>
                                        f.hims_d_service_type_id ===
                                        row.service_type_id
                                    );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].service_type
                                    : ""}
                                </span>
                              );
                            }
                          },
                          {
                            fieldName: "service_id",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "service_id" }}
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
                            fieldName: "service_amount",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "service_amount" }}
                              />
                            )
                          }
                        ]}
                        keyId="packages_detail_grid"
                        dataSource={{
                          data: this.state.PakageDetail
                        }}
                        // isEditable={true}
                        filter={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                      />
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
                        onClick={this.InsertPackages.bind(this)}
                        type="button"
                        className="btn btn-primary"
                      >
                        {this.state.hims_d_package_header_id === null ? (
                          <AlgaehLabel label={{ fieldName: "btnSave" }} />
                        ) : (
                          <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
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
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    services: state.services,
    displayservices: state.displayservices
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NewPackage)
);
