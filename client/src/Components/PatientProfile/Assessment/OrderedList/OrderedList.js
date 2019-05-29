import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import OrderingServices from "../OrderingServices/OrderingServices";
import OrderConsumables from "../OrderConsumables/OrderConsumables";
import "./OrderedList.css";
import "../../../../styles/site.css";
import { AlgaehActions } from "../../../../actions/algaehActions";
import {
  getCookie,
  algaehApiCall,
  swalMessage
} from "../../../../utils/algaehApiCall";
import Options from "../../../../Options.json";
import OrderProcedureItems from "../OrderProcedureItems/OrderProcedureItems";
import _ from "lodash";

class OrderedList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isOpenItems: false,
      procedure_name: null,
      inventory_location_id: null,
      isConsOpen: false
    };
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen
      },
      () => {
        this.props.getOrderList({
          uri: "/orderAndPreApproval/selectOrderServicesbyDoctor",
          method: "GET",
          data: {
            visit_id: Window.global["visit_id"]
          },
          redux: {
            type: "ORDER_SERVICES_GET_DATA",
            mappingName: "orderedList"
          }
        });
      }
    );
  }

  ShowConsumableModel() {
    this.setState({
      isConsOpen: !this.state.isConsOpen
    });
  }

  ShowProcedureModel(row, e) {
    algaehApiCall({
      uri: "/serviceType/getProcedures",
      method: "GET",
      module: "masterSettings",
      data: { service_id: row.services_id },
      onSuccess: response => {
        if (response.data.success === true) {
          let data = response.data.records;

          if (data.length > 0) {
            algaehApiCall({
              uri: "/department/get/subdepartment",

              method: "GET",
              module: "masterSettings",
              onSuccess: response => {
                if (response.data.success === true) {
                  const Departmant_Location = _.filter(
                    response.data.records,
                    f => {
                      return (
                        f.hims_d_sub_department_id ===
                        this.props.patient_profile[0].sub_department_id
                      );
                    }
                  );
                  this.setState({
                    ...this.state,
                    isOpenItems: !this.state.isOpenItems,
                    procedure_name: data[0].procedure_desc,
                    hims_d_procedure_id: data[0].hims_d_procedure_id,
                    inventory_location_id:
                      Departmant_Location[0].inventory_location_id
                  });
                }
              },
              onFailure: error => {
                swalMessage({
                  title: error.message,
                  type: "error"
                });
              }
            });
          } else {
            swalMessage({
              title: "Procedure Not defined in master. Please contact Admin",
              type: "warning"
            });
          }
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
    // row.services_id
  }

  CloseProcedureModel(e) {
    this.setState({
      ...this.state,
      isOpenItems: !this.state.isOpenItems
    });
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });

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
      this.props.serviceslist === undefined ||
      this.props.serviceslist.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "serviceslist"
        }
      });
    }

    this.props.getOrderList({
      uri: "/orderAndPreApproval/selectOrderServicesbyDoctor",
      method: "GET",
      data: {
        visit_id: Window.global["visit_id"]
      },
      redux: {
        type: "ORDER_SERVICES_GET_DATA",
        mappingName: "orderedList"
      },
      afterSuccess: data => {}
    });
  }

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  render() {
    let patient_date =
      this.props.patient_profile !== undefined
        ? this.props.patient_profile
        : [];
    return (
      <div className="hptl-phase1-ordering-services-form">
        <div
          className="col-lg-12"
          style={{
            textAlign: "right",
            paddingTop: 10
          }}
        >
          <button
            className="btn btn-primary"
            onClick={this.ShowModel.bind(this)}
          >
            Order Investigation
          </button>

          <button
            className="btn btn-primary"
            onClick={this.ShowConsumableModel.bind(this)}
          >
            Order Consumables
          </button>
        </div>
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-10 col-lg-12" id="doctorOrder">
              <AlgaehDataGrid
                id="Orderd_list"
                columns={[
                  {
                    fieldName: "actions",
                    label: <AlgaehLabel label={{ forceLabel: "Details" }} />,
                    displayTemplate: row => {
                      return (
                        <i
                          style={{
                            pointerEvents:
                              row.service_type_id === 2 ||
                              row.service_type_id === 14 ||
                              row.service_type_id === "2" ||
                              row.service_type_id === "14"
                                ? ""
                                : "none",
                            opacity:
                              row.service_type_id === 2 ||
                              row.service_type_id === 14 ||
                              row.service_type_id === "2" ||
                              row.service_type_id === "14"
                                ? ""
                                : "0.1"
                          }}
                          className="fas fa-eye"
                          onClick={this.ShowProcedureModel.bind(this, row)}
                        />
                      );
                    },
                    others: {
                      fixed: "left"
                    }
                  },
                  {
                    fieldName: "created_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "created_date" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    }
                  },
                  // {
                  //   fieldName: "test_type",
                  //   label: <AlgaehLabel label={{ fieldName: "test_type" }} />,
                  //   displayTemplate: row => {
                  //     return row.test_type === "S" ? "Stat" : "Routine";
                  //   },

                  //   disabled: true
                  // },
                  {
                    fieldName: "service_type_id",
                    label: (
                      <AlgaehLabel label={{ fieldName: "service_type_id" }} />
                    ),
                    displayTemplate: row => {
                      let display =
                        this.props.servicetype === undefined
                          ? []
                          : this.props.servicetype.filter(
                              f =>
                                f.hims_d_service_type_id === row.service_type_id
                            );

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? display[0].service_type
                            : ""}
                        </span>
                      );
                    },
                    others: {
                      minWidth: 100,
                      maxWidth: 500
                    },

                    disabled: true
                  },
                  {
                    fieldName: "services_id",
                    label: <AlgaehLabel label={{ fieldName: "services_id" }} />,
                    displayTemplate: row => {
                      let display =
                        this.props.serviceslist === undefined
                          ? []
                          : this.props.serviceslist.filter(
                              f => f.hims_d_services_id === row.services_id
                            );

                      return (
                        <span>
                          {display !== null && display.length !== 0
                            ? display[0].service_name
                            : ""}
                        </span>
                      );
                    },
                    others: {
                      minWidth: 200,
                      maxWidth: 400
                    },
                    disabled: true
                  },
                  {
                    fieldName: "insurance_yesno",
                    label: <AlgaehLabel label={{ fieldName: "insurance" }} />,
                    displayTemplate: row => {
                      return row.insurance_yesno === "Y"
                        ? "Covered"
                        : "Not Covered";
                    },
                    disabled: true
                  },
                  {
                    fieldName: "pre_approval",
                    label: (
                      <AlgaehLabel label={{ fieldName: "pre_approval" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.pre_approval === "Y"
                            ? "Required"
                            : "Not Required"}
                        </span>
                      );
                    },
                    disabled: true
                  },
                  {
                    fieldName: "patient_payable",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_payable" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "company_payble",
                    label: (
                      <AlgaehLabel label={{ fieldName: "company_payble" }} />
                    ),
                    disabled: true
                  }
                ]}
                keyId="list_type_id"
                dataSource={{
                  data:
                    this.props.orderedList === undefined
                      ? []
                      : this.props.orderedList
                }}
                paging={{ page: 0, rowsPerPage: 10 }}
              />
            </div>
          </div>
        </div>
        <OrderingServices
          open={this.state.isOpen}
          onClose={this.CloseModel.bind(this)}
          vat_applicable={this.props.vat_applicable}
          addNew={true}
        />

        <OrderConsumables
          open={this.state.isConsOpen}
          onClose={this.ShowConsumableModel.bind(this)}
          vat_applicable={this.props.vat_applicable}
          inventory_location_id={this.state.inventory_location_id}
          addNew={true}
        />

        <OrderProcedureItems
          show={this.state.isOpenItems}
          onClose={this.CloseProcedureModel.bind(this)}
          inputsparameters={{
            patient_code:
              patient_date.length > 0 ? patient_date[0].patient_code : null,
            full_name:
              patient_date.length > 0 ? patient_date[0].full_name : null,
            inventory_location_id: this.state.inventory_location_id,
            procedure_name: this.state.procedure_name,
            procedure_id: this.state.hims_d_procedure_id
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    serviceslist: state.serviceslist,
    orderedList: state.orderedList,
    patient_profile: state.patient_profile
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      getOrderList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderedList)
);
