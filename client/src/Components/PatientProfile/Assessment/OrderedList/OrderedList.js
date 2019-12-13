import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import OrderingServices from "../OrderingServices/OrderingServices";
import OrderingPackages from "../OrderingPackages/OrderingPackages";
import OrderConsumables from "../OrderConsumables/OrderConsumables";
import "./OrderedList.scss";
import "../../../../styles/site.scss";
import { AlgaehActions } from "../../../../actions/algaehActions";
import {
  getCookie,
  algaehApiCall,
  swalMessage
} from "../../../../utils/algaehApiCall";
import Options from "../../../../Options.json";
import OrderProcedureItems from "../OrderProcedureItems/OrderProcedureItems";
import PackageUtilize from "../../PackageUtilize/PackageUtilize";
import swal from "sweetalert2";
import _ from "lodash";

class OrderedList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isOpenItems: false,
      procedure_name: null,
      inventory_location_id: null,
      isConsOpen: false,
      isPackOpen: false,
      isPackUtOpen: false,
      package_detail: null
    };
  }

  ShowModel(e) {
    if (this.props.chief_complaint === true) {
      swalMessage({
        type: "warning",
        title: "Enter Chief Complaint. Atlest 4 letter"
      });
      return;
    }
    if (this.props.significant_signs === true) {
      swalMessage({
        type: "warning",
        title: "Enter Significant Signs. Atlest 4 letter"
      });
      return;
    }



    algaehApiCall({
      uri: "/patientRegistration/getVisitServiceAmount",
      module: "frontDesk",
      method: "GET",
      data: { hims_f_patient_visit_id: Window.global["visit_id"] },
      onSuccess: response => {

        if (response.data.success) {
          let orderedList = this.props.orderedList
          let preserviceInput = []
          if (orderedList.length > 0) {
            for (let k = 0; k < orderedList.length; k++) {
              preserviceInput.push({
                insured: orderedList[k].insurance_yesno,
                vat_applicable: this.props.vat_applicable,
                hims_d_services_id: orderedList[k].hims_d_services_id,
                service_type_id: orderedList[k].service_type_id,
                primary_insurance_provider_id: orderedList[k].insurance_provider_id,
                primary_network_office_id:
                  orderedList[k].insurance_network_office_id,
                primary_network_id: orderedList[k].network_id,
                approval_amt: orderedList[k].approval_amt,
                approval_limit_yesno: orderedList[k].approval_limit_yesno,
                hims_f_ordered_services_id: orderedList[k].hims_f_ordered_services_id,
                billed: orderedList[k].billed
              })
            }
          }
          this.setState({
            approval_amt: response.data.records[0].ins_services_amount,
            approval_limit_yesno: response.data.records[0].approval_limit_yesno,
            preserviceInput: preserviceInput,
            isOpen: !this.state.isOpen
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
  }

  ClosePackage(e) {
    this.setState(
      {
        isPackOpen: !this.state.isPackOpen
      },
      () => {
        this.props.getPakageList({
          uri: "/orderAndPreApproval/getPatientPackage",
          method: "GET",
          data: {
            patient_id: Window.global["current_patient"]
          },
          redux: {
            type: "ORDER_SERVICES_GET_DATA",
            mappingName: "pakageList"
          }
        });
      }
    );
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
    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      module: "masterSettings",
      onSuccess: response => {

        if (response.data.success === true) {
          let Depat_data = response.data.records
          algaehApiCall({
            uri: "/patientRegistration/getVisitServiceAmount",
            module: "frontDesk",
            method: "GET",
            data: { hims_f_patient_visit_id: Window.global["visit_id"] },
            onSuccess: response => {

              if (response.data.success) {
                const Departmant_Location = _.filter(Depat_data, f => {
                  return (
                    f.hims_d_sub_department_id ===
                    this.props.patient_profile[0].sub_department_id
                  );
                });

                this.setState({
                  isConsOpen: !this.state.isConsOpen,
                  inventory_location_id: Departmant_Location[0].inventory_location_id,
                  approval_amt: response.data.records[0].ins_services_amount,
                  approval_limit_yesno: response.data.records[0].approval_limit_yesno,
                  // preserviceInput: preserviceInput
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

        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  ShowPackageModel() {
    this.setState({
      isPackOpen: !this.state.isPackOpen
    });
  }

  CloseConsumableModel(e) {
    this.setState(
      {
        isConsOpen: !this.state.isConsOpen
      },
      () => {
        this.props.getConsumableOrderList({
          uri: "/orderAndPreApproval/getVisitConsumable",
          method: "GET",
          data: {
            visit_id: Window.global["visit_id"]
          },
          redux: {
            type: "ORDER_SERVICES_GET_DATA",
            mappingName: "consumableorderedList"
          }
        });
      }
    );
  }

  ShowPackageUtilize(row) {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      module: "masterSettings",
      onSuccess: response => {
        if (response.data.success === true) {
          const Departmant_Location = _.filter(response.data.records, f => {
            return (
              f.hims_d_sub_department_id ===
              this.props.patient_profile[0].sub_department_id
            );
          });
          this.setState({
            isPackUtOpen: !this.state.isPackUtOpen,
            package_detail: row,
            inventory_location_id: Departmant_Location[0].inventory_location_id
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
  }
  ClosePackageUtilize() {
    this.setState(
      {
        isPackUtOpen: !this.state.isPackUtOpen
      },
      () => {
        this.props.getPakageList({
          uri: "/orderAndPreApproval/getPatientPackage",
          method: "GET",
          data: {
            patient_id: Window.global["current_patient"]
          },
          redux: {
            type: "ORDER_SERVICES_GET_DATA",
            mappingName: "pakageList"
          }
        });
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
        this.props.getConsumableOrderList({
          uri: "/orderAndPreApproval/getVisitConsumable",
          method: "GET",
          data: {
            visit_id: Window.global["visit_id"]
          },
          redux: {
            type: "ORDER_SERVICES_GET_DATA",
            mappingName: "consumableorderedList"
          }
        });
      }
    );
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

    this.props.getServices({
      uri: "/serviceType/getService",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "serviceslist"
      }
    });

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

    this.props.getConsumableOrderList({
      uri: "/orderAndPreApproval/getVisitConsumable",
      method: "GET",
      data: {
        visit_id: Window.global["visit_id"]
      },
      redux: {
        type: "ORDER_SERVICES_GET_DATA",
        mappingName: "consumableorderedList"
      }
    });

    this.props.getPakageList({
      uri: "/orderAndPreApproval/getPatientPackage",
      method: "GET",
      data: {
        patient_id: Window.global["current_patient"]
      },
      redux: {
        type: "PAIENT_PACKAGE_GET_DATA",
        mappingName: "pakageList"
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.openData !== undefined) {
      this.setState({ openData: nextProps.openData });
    }
  }

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  DeleteOrderService(row) {
    swal({
      title: "Are you sure you want to delete this Order?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        let service_type =
          row.service_type_id === 5
            ? "LAB"
            : row.service_type_id === 11
              ? "RAD"
              : row.service_type_id === 2
                ? "PRO"
                : null;
        algaehApiCall({
          uri: "/orderAndPreApproval/deleteOrderService",
          method: "delete",
          data: {
            hims_f_ordered_services_id: row.hims_f_ordered_services_id,
            service_type: service_type,
            trans_package_detail_id: row.trans_package_detail_id,
            quantity: row.quantity,
            pre_approval: row.pre_approval
          },
          onSuccess: response => {
            if (response.data.success === true) {
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

              this.props.getPakageList({
                uri: "/orderAndPreApproval/getPatientPackage",
                method: "GET",
                data: {
                  patient_id: Window.global["current_patient"]
                },
                redux: {
                  type: "PAIENT_PACKAGE_GET_DATA",
                  mappingName: "pakageList"
                }
              });

              swalMessage({
                title: "Deleted Succesfully",
                type: "success"
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
      }
    });
  }

  DeleteInvOrderItems(row) {
    swal({
      title: "Are you sure you want to delete this Item?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {

      if (willDelete.value) {

        algaehApiCall({
          uri: "/orderAndPreApproval/deleteInvOrderedItems",
          method: "delete",
          data: {
            hims_f_ordered_inventory_id: row.hims_f_ordered_inventory_id
          },
          onSuccess: response => {
            if (response.data.success === true) {
              this.props.getConsumableOrderList({
                uri: "/orderAndPreApproval/getVisitConsumable",
                method: "GET",
                data: {
                  visit_id: Window.global["visit_id"]
                },
                redux: {
                  type: "ORDER_SERVICES_GET_DATA",
                  mappingName: "consumableorderedList"
                }
              });

              swalMessage({
                title: "Deleted Succesfully",
                type: "success"
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
      }
    });
  }

  DeleteOrderedPackage(row) {
    swal({
      title: "Are you sure you want to delete this Package?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {

      if (willDelete.value) {

        algaehApiCall({
          uri: "/orderAndPreApproval/deleteOrderedPackage",
          method: "delete",
          data: {
            hims_f_package_header_id: row.hims_f_package_header_id
          },
          onSuccess: response => {

            if (response.data.success === true) {
              this.props.getPakageList({
                uri: "/orderAndPreApproval/getPatientPackage",
                method: "GET",
                data: {
                  patient_id: Window.global["current_patient"]
                },
                redux: {
                  type: "ORDER_SERVICES_GET_DATA",
                  mappingName: "pakageList"
                }
              });

              swalMessage({
                title: "Deleted Succesfully",
                type: "success"
              });
            } else {
              swalMessage({
                title: response.data.records.message,
                type: "error"
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
      }
    });
  }
  render() {
    let patient_date =
      this.props.patient_profile !== undefined
        ? this.props.patient_profile
        : [];
    return (
      <div className="hptl-phase1-ordering-services-form">
        {this.state.openData === "Investigation" ? (
          <div>
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

              <div className="row">
                <div className="col-md-10 col-lg-12" id="doctorOrder">
                  <AlgaehDataGrid
                    id="Orderd_list"
                    columns={[
                      {
                        fieldName: "actions",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Details" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
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
                                onClick={this.ShowProcedureModel.bind(
                                  this,
                                  row
                                )}
                              />
                              <i
                                style={{
                                  pointerEvents:
                                    row.billed === "N" && row.trans_package_detail_id > 0 ? "" : "none",
                                  opacity: row.billed === "N" && row.trans_package_detail_id > 0 ? "" : "0.1"
                                }}
                                className="fas fa-trash-alt"
                                onClick={this.DeleteOrderService.bind(
                                  this,
                                  row
                                )}
                              />
                            </span>
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
                          return (
                            <span>{this.dateFormater(row.created_date)}</span>
                          );
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
                        },
                        others: {
                          minWidth: 100,
                          maxWidth: 500
                        },

                        disabled: true
                      },
                      {
                        fieldName: "services_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "services_id" }} />
                        ),
                        displayTemplate: row => {
                          let package_service =
                            row.trans_package_detail_id > 0
                              ? "(Package Service)"
                              : "";
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

                              <span className="packageAvail">
                                {package_service}
                              </span>
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
                        label: (
                          <AlgaehLabel label={{ fieldName: "insurance" }} />
                        ),
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
                          <AlgaehLabel
                            label={{ fieldName: "patient_payable" }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "company_payble",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "company_payble" }}
                          />
                        ),
                        disabled: true
                      }
                    ]}
                    keyId="Inv_type_id"
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
          </div>
        ) : this.state.openData === "Consumable" ? (
          <div>
            <div
              className="col-lg-12"
              style={{
                textAlign: "right",
                paddingTop: 10
              }}
            >
              <button
                className="btn btn-primary"
                onClick={this.ShowConsumableModel.bind(this)}
              >
                Order Consumables
              </button>

              <div className="row">
                <div className="col-md-10 col-lg-12" id="doctorOrder">
                  <AlgaehDataGrid
                    id="Orderd_Consumable"
                    columns={[
                      {
                        fieldName: "actions",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Details" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                // style={{
                                //   pointerEvents:
                                //     row.billed && row.trans_package_detail_id > 0 === "N" ? "" : "none",
                                //   opacity: row.billed && row.trans_package_detail_id > 0 === "N" ? "" : "0.1"
                                // }}
                                className="fas fa-trash-alt"
                                onClick={this.DeleteInvOrderItems.bind(
                                  this,
                                  row
                                )}
                              />
                            </span>
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
                          return (
                            <span>{this.dateFormater(row.created_date)}</span>
                          );
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
                        },
                        others: {
                          minWidth: 100,
                          maxWidth: 500
                        },

                        disabled: true
                      },
                      {
                        fieldName: "services_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "services_id" }} />
                        ),
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
                        fieldName: "item_notchargable",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Chargable" }} />
                        ),
                        displayTemplate: row => {
                          return row.item_notchargable === "Y" ? "Yes" : "No";
                        },
                        disabled: true
                      },
                      {
                        fieldName: "insurance_yesno",
                        label: (
                          <AlgaehLabel label={{ fieldName: "insurance" }} />
                        ),
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
                          <AlgaehLabel
                            label={{ fieldName: "patient_payable" }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "company_payble",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "company_payble" }}
                          />
                        ),
                        disabled: true
                      }
                    ]}
                    keyId="Cons_type_id"
                    dataSource={{
                      data:
                        this.props.consumableorderedList === undefined
                          ? []
                          : this.props.consumableorderedList
                    }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
              <div>
                <div
                  className="col-lg-12"
                  style={{
                    textAlign: "right",
                    paddingTop: 10
                  }}
                >
                  <button
                    className="btn btn-primary"
                    onClick={this.ShowPackageModel.bind(this)}
                  >
                    Order Package
              </button>
                </div>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-md-10 col-lg-12" id="doctorOrder">
                      <AlgaehDataGrid
                        id="Package_list"
                        columns={[
                          {
                            fieldName: "actions",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Details" }} />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  <i
                                    className="fas fa-eye"
                                    onClick={this.ShowPackageUtilize.bind(this, row)}
                                  />

                                  <i
                                    onClick={this.DeleteOrderedPackage.bind(this, row)}
                                    className="fas fa-trash-alt"
                                  />
                                </span>
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
                              return (
                                <span>{this.dateFormater(row.created_date)}</span>
                              );
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
                            },
                            others: {
                              minWidth: 100,
                              maxWidth: 500
                            },

                            disabled: true
                          },
                          {
                            fieldName: "services_id",
                            label: (
                              <AlgaehLabel label={{ fieldName: "services_id" }} />
                            ),
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
                            label: (
                              <AlgaehLabel label={{ fieldName: "insurance" }} />
                            ),
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
                              <AlgaehLabel
                                label={{ fieldName: "patient_payable" }}
                              />
                            ),
                            disabled: true
                          },
                          {
                            fieldName: "company_payble",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "company_payble" }}
                              />
                            ),
                            disabled: true
                          }
                        ]}
                        keyId="list_type_id"
                        dataSource={{
                          data:
                            this.props.pakageList === undefined
                              ? []
                              : this.props.pakageList
                        }}
                        paging={{ page: 0, rowsPerPage: 10 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

        <OrderingServices
          open={this.state.isOpen}
          onClose={this.CloseModel.bind(this)}
          vat_applicable={this.props.vat_applicable}
          approval_amt={this.state.approval_amt}
          approval_limit_yesno={this.state.approval_limit_yesno}
          preserviceInput={this.state.preserviceInput}
          addNew={true}
          date_of_birth={this.props.date_of_birth}
          gender={this.props.gender}
        />

        <OrderingPackages
          open={this.state.isPackOpen}
          onClose={this.ClosePackage.bind(this)}
          vat_applicable={this.props.vat_applicable}
          patient_id={Window.global["current_patient"]}
          visit_id={Window.global["visit_id"]}
          provider_id={Window.global["provider_id"]}
          addNew={true}
        />

        <OrderConsumables
          open={this.state.isConsOpen}
          onClose={this.CloseConsumableModel.bind(this)}
          vat_applicable={this.props.vat_applicable}
          inventory_location_id={this.state.inventory_location_id}
          approval_amt={this.state.approval_amt}
          approval_limit_yesno={this.state.approval_limit_yesno}
          // preserviceInput={this.state.preserviceInput}
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

        <PackageUtilize
          open={this.state.isPackUtOpen}
          onClose={this.ClosePackageUtilize.bind(this)}
          package_detail={this.state.package_detail}
          patient_id={Window.global["current_patient"]}
          visit_id={Window.global["visit_id"]}
          doctor_id={Window.global["provider_id"]}
          inventory_location_id={this.state.inventory_location_id}
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
    patient_profile: state.patient_profile,
    consumableorderedList: state.consumableorderedList,
    pakageList: state.pakageList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      getOrderList: AlgaehActions,
      getConsumableOrderList: AlgaehActions,
      getPakageList: AlgaehActions
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
