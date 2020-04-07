import React, { PureComponent } from "react";
import "./AdvanceRefundListModal.scss";
import "./../../styles/site.scss";
import {
  AlgaehLabel,  
  AlgaehModalPopUp,
  AlgaehDataGrid
} from "../Wrapper/algaehWrapper";

import {
  getAdvanceRefundList,
  generateAdvanceRefundReceipt
} from "./AdvanceRefundListModalHandaler";

import AdvRefunIOputs from "../../Models/AdvanceRefund";

export default class AdvanceRefundListModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refund_amount: 0,
      advance_amount: 0
    };
  }

  componentDidMount() {
    let IOputs = AdvRefunIOputs.inputParam();
    this.setState(IOputs);
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && !this.state.advaceRefundList) {
      getAdvanceRefundList(this);
    }
  }

  onClose = e => {
    let IOputs = AdvRefunIOputs.inputParam();
    this.props.onClose && this.props.onClose(e);
    this.setState({ ...IOputs, advaceRefundList: undefined });
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title={this.props.HeaderCaption}
            openPopup={this.props.show}
            class={this.state.lang_sets + " advanceRefundModal"}
          >
            <div className="col-12 popupInner margin-top-15">
              <div className="row">
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      fieldName: "patient_code"
                    }}
                  />
                  <h6>
                    {this.props.inputsparameters.patient_code
                      ? this.props.inputsparameters.patient_code
                      : "Patient Code"}
                  </h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "full_name"
                    }}
                  />
                  <h6>
                    {this.props.inputsparameters.full_name
                      ? this.props.inputsparameters.full_name
                      : "Patient Name"}
                  </h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Advance"
                    }}
                  />
                  <h6>{this.state.advance_amount}</h6>
                </div>{" "}
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Refund"
                    }}
                  />
                  <h6>{this.state.refund_amount}</h6>
                </div>
              </div>
              <hr style={{ margin: "0rem" }} />
              <div className="row">
                <div className="col-12">
                  <AlgaehDataGrid
                    columns={[
                      {
                        fieldName: "Actions",
                        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                        displayTemplate: row => {
                          return (
                            <span
                              onClick={() =>
                                generateAdvanceRefundReceipt(row, this)
                              }
                            >
                              <i className="fas fa-eye" aria-hidden="true" />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 100,
                          filterable: false
                        }
                      },
                      {
                        fieldName: "transaction_type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Receipt Type" }} />
                        )
                      },
                      {
                        fieldName: "receipt_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Receipt NO." }} />
                        )
                      },
                      {
                        fieldName: "receipt_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Receipt Date" }} />
                        ),
                        others: {
                          filterable: false
                        }
                      },
                      {
                        fieldName: "advance_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Receipt Amount" }}
                          />
                        ),
                        others: {
                          filterable: false
                        }
                      },
                      {
                        fieldName: "cashier",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Cashier Name" }} />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: this.state.advaceRefundList }}
                    isEditable={false}
                    filter={true}
                    actions={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    loading={this.state.loading}
                    events={
                      {
                        //onEdit: () => { },
                        // onDone: this.adjustLoan.bind(this)
                        //onDelete: () => { }
                      }
                    }
                    others={{}}
                  />
                </div>
              </div>

              <hr />
            </div>
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
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
            {/* </div> */}
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}
