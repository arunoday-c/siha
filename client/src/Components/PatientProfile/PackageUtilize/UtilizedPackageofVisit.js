import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  algaehApiCall,
  swalMessage
} from "../../../utils/algaehApiCall";
import Options from "../../../Options.json";
import swal from "sweetalert2";

class UtilizedPackageofVisit extends PureComponent {
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

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  DeleteOrderService(row, e) {
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
            quantity: row.quantity
          },
          onSuccess: response => {
            if (response.data.success === true) {
              this.props.onClose && this.props.onClose(true);
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

  onClose(e) {
    this.props.onClose && this.props.onClose(e);
  }

  render() {
    return (
      <React.Fragment>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Utilized Services"
          openPopup={this.props.show}
          class={this.state.lang_sets + "advanceRefundModal"}
        >
          <div className="col-lg-12 popupInner">
            <div className="row">
              <h6> Only unbilled package services can Unutilize.</h6>
            </div>
            <div className="row">
              <div
                className="col-lg-12"
                style={{
                  textAlign: "right",
                  paddingTop: 10
                }}
              >
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
                                      row.billed === "N" ? "" : "none",
                                    opacity: row.billed === "N" ? "" : "0.1"
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
                            <AlgaehLabel
                              label={{ fieldName: "created_date" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>{this.dateFormater(row.created_date)}</span>
                            );
                          }
                        },

                        {
                          fieldName: "service_type",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "service_type_id" }}
                            />
                          ),
                          others: {
                            minWidth: 100,
                            maxWidth: 500
                          },

                          disabled: true
                        },
                        {
                          fieldName: "service_name",
                          label: (
                            <AlgaehLabel label={{ fieldName: "services_id" }} />
                          ),
                          displayTemplate: row => {
                            let package_service =
                              row.trans_package_detail_id > 0
                                ? "(Package Service)"
                                : "";
                            return (
                              <span>
                                {row.service_name}
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
                            <AlgaehLabel
                              label={{ fieldName: "pre_approval" }}
                            />
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
          </div>
        </AlgaehModalPopUp>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    orderedList: state.orderedList,
    pakageList: state.pakageList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrderList: AlgaehActions,
      getPakageList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UtilizedPackageofVisit)
);
