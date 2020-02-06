import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import moment from "moment";
import "./AdvanceRefundListModal.scss";
import "./../../styles/site.scss";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehModalPopUp,
  AlgaehDataGrid
} from "../Wrapper/algaehWrapper";

import { getLabelFromLanguage } from "../../utils/GlobalFunctions";

import {
  texthandle,
  datehandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle,
  checkcashhandaler,
  checkcardhandaler,
  checkcheckhandaler,
  Validations,
  // countertexthandle,
  getCashiersAndShiftMAP
} from "./AdvanceRefundListModalHandaler";

import AdvRefunIOputs from "../../Models/AdvanceRefund";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import { getAmountFormart } from "../../utils/GlobalFunctions";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../utils/algaehApiCall.js";
import { AlgaehActions } from "../../actions/algaehActions";
import MyContext from "../../utils/MyContext";

export default class AdvanceRefundListModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  UNSAFE_componentWillMount() {
    let IOputs = AdvRefunIOputs.inputParam();
    this.setState(IOputs);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.PackageAdvance === undefined) {
      let lang_sets = "en_comp";
      if (Window.global.selectedLang === "ar") {
        lang_sets = "ar_comp";
      }
      this.setState({
        selectedLang: Window.global.selectedLang,
        lang_sets: lang_sets
      });
    }
  }

  componentDidMount() {}

  onClose = e => {
    let IOputs = AdvRefunIOputs.inputParam();
    this.setState(IOputs, () => {
      this.props.onClose && this.props.onClose(e);
    });
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
              </div>
              <hr style={{ margin: "0rem" }} />
              <div className="row">
                <div className="col-12">
                  <AlgaehDataGrid
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
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
                        fieldName: "",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Receipt Type" }} />
                        )
                      },
                      {
                        fieldName: "",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Receipt NO." }} />
                        )
                      },
                      {
                        fieldName: "",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Receipt Date" }} />
                        ),
                        others: {
                          filterable: false
                        }
                      },
                      {
                        fieldName: "",
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
                        fieldName: "",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Cashier Name" }} />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{}}
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
