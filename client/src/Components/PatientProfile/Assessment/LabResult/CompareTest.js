import React, { PureComponent } from "react";

import "./LabResult.css";
import "./../../../../styles/site.css";

import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class CompareTest extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      test_analytes: []
    };
  }

  onClose = e => {
    this.setState(
      {
        test_analytes: []
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  selectTest(e) {
    debugger;
    algaehApiCall({
      uri: "/laboratory/getComparedLabResult",
      module: "laboratory",
      method: "GET",
      data: {
        pre_order_id: e.selected.hims_f_lab_order_id,
        cur_order_id: this.props.inputsparameters.order_id
      },
      onSuccess: response => {
        debugger;
        if (response.data.success) {
          this.setState({
            test_analytes: response.data.records
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

  componentWillReceiveProps(newProps) {
    // if (
    //   newProps.test_analytes === undefined ||
    //   newProps.test_analytes.length === 0
    // ) {
    //   this.setState({ test_analytes: newProps.inputsparameters.test_analytes });
    // }
  }
  render() {
    return (
      <div>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.show}
          class={this.state.lang_sets + " compareResultPopup"}
        >
          {/* <div className="algaeh-modal"> */}
          {/* <div className="popupHeader">{this.props.HeaderCaption} </div> */}
          <div className="col-lg-12 popupInner">
            <div className="row" style={{ paddingTop: 10 }}>
              <div className="col-2">
                <AlgaehLabel
                  label={{
                    forceLabel: "Patient Code"
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
                    forceLabel: "Patient Name"
                  }}
                />
                <h6>
                  {this.props.inputsparameters.full_name
                    ? this.props.inputsparameters.full_name
                    : "Patient Name"}
                </h6>
              </div>
              <div className="col-2">
                <AlgaehLabel
                  label={{
                    forceLabel: "Service Code"
                  }}
                />
                <h6>
                  {this.props.inputsparameters.service_code
                    ? this.props.inputsparameters.service_code
                    : "Service Code"}
                </h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Service Name"
                  }}
                />
                <h6>
                  {this.props.inputsparameters.service_name
                    ? this.props.inputsparameters.service_name
                    : "Service Name"}
                </h6>
              </div>

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Select To Compare",
                  isImp: true
                }}
                selector={{
                  name: "visit_id",
                  className: "select-fld",
                  autoComplete: "off",
                  value: this.state.visit_id,
                  dataSource: {
                    textField: "visit_code",
                    valueField: "hims_f_lab_order_id",
                    data: this.props.inputsparameters.list_of_tests
                  },
                  onChange: this.selectTest.bind(this),
                  template: item => (
                    <div className="multiInfoList">
                      <h5>
                        {item.visit_date
                          ? moment(item.visit_date).format(
                              "DD/MM/YYYY, hh:mm A"
                            )
                          : "DD/MM/YYYY"}
                      </h5>
                      <h6>{item.visit_code}</h6>
                    </div>
                  )
                }}
              />
            </div>

            <div className="row grid-details">
              <div className="col-12" id="LabResultGridCntr">
                <AlgaehDataGrid
                  id="Lab_Result_Compare_grid"
                  columns={[
                    {
                      fieldName: "analyte",
                      label: <AlgaehLabel label={{ forceLabel: "Analyte" }} />,

                      others: {
                        minWidth: 250,
                        resizable: false,
                        style: { textAlign: "left" }
                      }
                    },
                    {
                      fieldName: "cur_result",
                      label: (
                        <AlgaehLabel
                          label={{
                            forceLabel: "Current Result"
                          }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span data-value={row.cur_critical_type}>
                            {row.cur_result}
                            <sup>{row.cur_critical_type}</sup>
                          </span>
                        );
                      },
                      others: {
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "pre_result",
                      label: (
                        <AlgaehLabel
                          label={{
                            forceLabel: "Previous Result"
                          }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span data-value={row.pre_critical_type}>
                            {row.pre_result}
                            <sup>{row.pre_critical_type}</sup>
                          </span>
                        );
                      },
                      others: {
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },

                    {
                      fieldName: "result_unit",
                      label: <AlgaehLabel label={{ forceLabel: "Units" }} />,
                      others: {
                        maxWidth: 70,
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "valur_flucuate",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            {row.valur_flucuate === "D" ? (
                              <i className="fas fa-hand-point-up"></i>
                            ) : row.valur_flucuate === "U" ? (
                              <i className="fas fa-hand-point-down"></i>
                            ) : null}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 70,
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    }
                  ]}
                  keyId="patient_code"
                  filter={true}
                  dataSource={{
                    data: this.state.test_analytes
                  }}
                  paging={{ page: 0, rowsPerPage: 30 }}
                />

                {/* keyId="patient_code"

                  dataSource={{
                  data: this.props.inputsparameters.test_analytes
                }}
                paging={{ page: 0, rowsPerPage: 20 }} */}
              </div>
            </div>
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
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </AlgaehModalPopUp>
      </div>
    );
  }
}
