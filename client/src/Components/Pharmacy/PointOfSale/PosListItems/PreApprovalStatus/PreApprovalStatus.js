import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehAutoComplete,
  AlgaehModalPopUp,
  AlagehFormGroup,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import "./../../../../../styles/site.scss";
import "./PreApprovalStatus.scss";
import GlobalVariables from "../../../../../utils/GlobalVariables.json";
import Options from "../../../../../Options.json";
import moment from "moment";
import { swalMessage, algaehApiCall } from "../../../../../utils/algaehApiCall";
import { AlgaehActions } from "../../../../../actions/algaehActions";
import _ from "lodash";
import AlgaehLoader from "../../../../Wrapper/fullPageLoader";

class PreApprovalStatus extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      update_pre_approval_service: [],
      apprv_date: moment(new Date())._d
    };
  }

  componentDidMount() {
    this.props.getInsuranceProviders({
      uri: "/insurance/getListOfInsuranceProvider",
      module: "insurance",
      method: "GET",
      redux: {
        type: "INSURANCE_PROVIDER_GET_DATA",
        mappingName: "insurarProviders"
      }
    });
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  texthandle(ctrl, e) {
    e = e || ctrl;
    let name = e.name || e.target.name;
    let value = e.value === "" ? null : e.value || e.target.value;

    switch (name) {
      case "apprv_status":
        const amount_from = _.find(
          this.props.insurarProviders,
          f =>
            f.hims_d_insurance_provider_id === this.props.insurance_provider_id
        );
        let approved_amount = 0;
        let apprv_date = moment(new Date())._d;
        if (value === "AP") {
          approved_amount =
            amount_from.company_service_price_type === "G"
              ? this.state.gross_amt
              : this.state.net_amount;
        }
        this.setState({
          [name]: value,
          approved_amount: approved_amount,
          apprv_date: apprv_date
        });

        break;

      default:
        this.setState({
          [name]: value
        });
    }
  }
  componentWillReceiveProps(newProps) {

    if (
      newProps.selected_services !== undefined &&
      newProps.selected_services.length > 0
    ) {
      let data = newProps.selected_services[0];
      data.apprv_date = moment(new Date())._d;
      this.setState(newProps.selected_services[0]);
    }
  }

  saveApproval(e) {

    if (this.state.apprv_status === "AP") {
      if (parseFloat(this.state.approved_amount) === 0) {
        swalMessage({
          title: "Please enter Approval Amount",
          type: "warning"
        });
        return;
      } else if (this.state.approved_no === null) {
        swalMessage({
          title: "Please enter Approval Number",
          type: "warning"
        });
        return;
      }
    }
    let update_pre_approval_service = [this.state];
    let that = this;
    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/orderAndPreApproval/updateMedicinePreApproval",
      data: update_pre_approval_service,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          if (this.props.pos_customer_type === "OP") {

            let dataSend = [
              {
                hims_f_prescription_detail_id:
                  that.props.prescription_detail_id,
                apprv_status: that.state.apprv_status,
                approved_amount: that.state.approved_amount
              }
            ];

            algaehApiCall({
              uri: "/orderAndPreApproval/updatePrescriptionDetail",
              data: dataSend,
              method: "PUT",
              onSuccess: response => {
                if (response.data.success) {
                  swalMessage({
                    title: "Saved successfully . .",
                    type: "success"
                  });
                }
                that.props.onClose && that.props.onClose("refresh");
              },
              onFailure: error => {
                swalMessage({
                  title: error.message,
                  type: "error"
                });
              }
            });
          }
          if (this.props.pos_customer_type === "OT") {
            let inputobj = {
              hims_f_pharmacy_pos_detail_id:
                that.props.hims_f_pharmacy_pos_detail_id,

              pre_approval:
                that.state.apprv_status === "RJ" ||
                  that.state.apprv_status === "AP"
                  ? "N"
                  : "Y",
              insurance_yesno: that.state.apprv_status === "RJ" ? "N" : "Y"
            };
            algaehApiCall({
              uri: "/posEntry/updatePOSDetailForPreApproval",
              module: "pharmacy",
              data: inputobj,
              method: "PUT",
              onSuccess: response => {
                if (response.data.success) {
                  swalMessage({
                    title: "Saved successfully . .",
                    type: "success"
                  });
                }
                that.props.onClose && that.props.onClose("refresh");
              },
              onFailure: error => {
                swalMessage({
                  title: error.message,
                  type: "error"
                });
              }
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
  }
  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            class="posPreAppPopup"
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Details for Pre Approval"
            openPopup={this.props.open}
          >
            <div className="popupInner">
              <div className="popRightDiv">
                <div className="row">
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Requested Qty"
                      }}
                    />
                    <h6>
                      {this.state.requested_quantity
                        ? this.state.requested_quantity
                        : "--------"}
                    </h6>
                  </div>

                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Gross Amount"
                      }}
                    />
                    <h6>
                      {this.state.gross_amt ? this.state.gross_amt : "--------"}
                    </h6>
                  </div>
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Net Amount"
                      }}
                    />
                    <h6>
                      {this.state.net_amount
                        ? this.state.net_amount
                        : "--------"}
                    </h6>
                  </div>

                  <AlagehAutoComplete
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Approval Status"
                    }}
                    selector={{
                      name: "apprv_status",
                      className: "select-fld",
                      value: this.state.apprv_status,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.FORMAT_APPSTATUS
                      },
                      onChange: this.texthandle.bind(this)
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Approved Amt"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.approved_amount,
                      className: "txt-fld",
                      name: "approved_amount",
                      events: {
                        onChange: this.texthandle.bind(this)
                      },
                      others: {
                        disabled:
                          this.state.apprv_status === "AP" ? false : true
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Approval No."
                    }}
                    textBox={{
                      value: this.state.approved_no,
                      className: "txt-fld",
                      name: "approved_no",
                      events: {
                        onChange: this.texthandle.bind(this)
                      }
                    }}
                  />

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Approval/ Rejected Date"
                      }}
                    />
                    <h6>
                      {this.state.apprv_date
                        ? moment(this.state.apprv_date).format(
                          Options.dateFormat
                        )
                        : "--------"}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.saveApproval.bind(this)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={e => {
                        this.onClose(e);
                      }}
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
    insurarProviders: state.insurarProviders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInsuranceProviders: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PreApprovalStatus)
);
