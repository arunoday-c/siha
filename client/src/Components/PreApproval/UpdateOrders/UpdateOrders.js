import React, { PureComponent } from "react";

import "./UpdateOrders.css";
import "../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";

import { UpdateOrders } from "./UpdateOrdersEvents";

export default class VerifyOrders extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submission_type: null
    };
  }

  // checkHandle(row, e) {
  //   if (row.checkselect === 0) {
  //     row.checkselect = 1;
  //   } else {
  //     row.checkselect = 0;
  //   }
  // }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_services !== null) {
      let InputOutput = nextProps.selected_services;
      // for (let i = 0; i < InputOutput.services_details.length; i++) {
      //   InputOutput.services_details[i].checkselect = 1;
      // }
      this.setState({ ...this.state, ...InputOutput });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title={this.props.HeaderCaption}
            openPopup={this.props.open}
          >
            <div className="col-lg-12 popupInner" style={{ height: "60vh" }}>
              <div className="row" style={{ marginTop: 10, marginBottom: 10 }}>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "patient_code"
                    }}
                  />
                  <h6>
                    {this.state.patient_code
                      ? this.state.patient_code
                      : "Patient Code"}
                  </h6>
                </div>

                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "patient_name"
                    }}
                  />
                  <h6>
                    {this.state.full_name
                      ? this.state.full_name
                      : "Patient Name"}
                  </h6>
                </div>
              </div>

              <div className="row grid-details">
                <div className="col-lg-12">
                  <div className="">
                    <AlgaehDataGrid
                      id="update_order_grid"
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
                                  style={{
                                    pointerEvents:
                                      row.billing_updated === "Y" ? "none" : "",
                                    opacity:
                                      row.billing_updated === "Y" ? "0.1" : ""
                                  }}
                                  className="fas fa-clipboard-check"
                                  onClick={UpdateOrders.bind(this, this, row)}
                                />
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "service_code",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "service_code" }}
                            />
                          )
                        },
                        {
                          fieldName: "insurance_service_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "service_name" }}
                            />
                          )
                        },
                        {
                          fieldName: "apprv_status",
                          label: (
                            <AlgaehLabel label={{ fieldName: "dis_status" }} />
                          ),
                          displayTemplate: row => {
                            return row.apprv_status === "NR"
                              ? "Not Requested"
                              : row.apprv_status === "AW"
                              ? "Awaiting Approval"
                              : row.apprv_status === "AP"
                              ? "Approved"
                              : "Rejected";
                          }
                        }
                      ]}
                      keyId="service_code"
                      dataSource={{
                        data: this.state.services_details
                      }}
                      // isEditable={true}
                      paging={{ page: 0, rowsPerPage: 5 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      className="btn btn-default"
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      Close
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
