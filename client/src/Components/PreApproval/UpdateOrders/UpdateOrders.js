import React, { PureComponent } from "react";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Update from "@material-ui/icons/Update";

import "./UpdateOrders.css";
import "../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup,
  Modal
} from "../../Wrapper/algaehWrapper";

import { UpdateOrders } from "./UpdateOrdersEvents";

export default class VerifyOrders extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submission_type: null
    };
  }

  checkHandle(row, e) {
    if (row.checkselect === 0) {
      row.checkselect = 1;
    } else {
      row.checkselect = 0;
    }
  }

  onClose = e => {
    debugger;
    this.props.onClose && this.props.onClose(e);
  };

  componentWillReceiveProps(nextProps) {
    debugger;

    if (nextProps.selected_services !== null) {
      let InputOutput = nextProps.selected_services;
      for (let i = 0; i < InputOutput.services_details.length; i++) {
        InputOutput.services_details[i].checkselect = 1;
      }
      this.setState({ ...this.state, ...InputOutput });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <Modal
            style={{
              margin: "0 auto",
              width: "100vh"
              // height: "80vh"
            }}
            open={this.props.open}
          >
            <div className="hptl-submit_pre-approval-details">
              <div className="colorPrimary">
                <Typography variant="title">
                  {this.props.HeaderCaption}
                </Typography>
              </div>
              <div className="container-fluid">
                <div className="row form-details">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "patient_code"
                      }}
                    />
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      value: this.state.patient_code,
                      className: "txt-fld",
                      name: "patient_code",
                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      className: "txt-fld",
                      name: "patient_name",
                      value: this.state.full_name,
                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                </div>

                <div className="row grid-details">
                  <div className="col-lg-12">
                    <div className="">
                      <AlgaehDataGrid
                        id="update_order_grid"
                        columns={[
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
                              <AlgaehLabel
                                label={{ fieldName: "dis_status" }}
                              />
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
                          },
                          {
                            fieldName: "action",
                            label: (
                              <AlgaehLabel label={{ fieldName: "action" }} />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  <IconButton
                                    color="primary"
                                    title="Process To Bill"
                                  >
                                    <Update
                                      onClick={UpdateOrders.bind(
                                        this,
                                        this,
                                        row
                                      )}
                                    />
                                  </IconButton>
                                </span>
                              );
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
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}
