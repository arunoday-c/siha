import React, { PureComponent } from "react";

import "./SubmitRequest.scss";
import "../../../styles/site.scss";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";

import { texthandle, SubmitRequestUpdate } from "./SubmitRequestEvent";
import variableJson from "../../../utils/GlobalVariables.json";

export default class SubmitRequest extends PureComponent {
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
    this.props.onClose && this.props.onClose(e);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
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
            <div className="col-lg-12 popupInner" style={{ height: "50vh" }}>
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

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    fieldName: "submission_type"
                  }}
                  selector={{
                    name: "submission_type",
                    className: "select-fld",
                    value: this.state.submission_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: variableJson.FORMAT_SUMISSION
                    },
                    onChange: texthandle.bind(this, this)
                  }}
                />
              </div>
              <div className="row grid-details">
                <div className="col-lg-12">
                  <div className="">
                    <AlgaehDataGrid
                      id="preapproval_services_grid"
                      columns={[
                        {
                          fieldName: "checkselect",
                          displayTemplate: row => {
                            return (
                              <div className="md-checkbox">
                                <input
                                  id={row.hims_f_service_approval_id}
                                  type="checkBox"
                                  defaultChecked={
                                    row.checkselect === 1 ? true : false
                                  }
                                  onClick={this.checkHandle.bind(this, row)}
                                />
                                <label htmlFor={row.hims_f_service_approval_id}>
                                  &nbsp;
                                </label>
                              </div>
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
                        }
                      ]}
                      keyId="pre_approval_code"
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
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      className="btn btn-primary"
                      onClick={SubmitRequestUpdate.bind(this, this)}
                    >
                      Submit
                    </button>
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
