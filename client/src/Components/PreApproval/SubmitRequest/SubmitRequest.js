import React, { PureComponent } from "react";
import Typography from "@material-ui/core/Typography";

import "./SubmitRequest.css";
import "../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup,
  Modal
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

  componentWillReceiveProps(nextProps) {
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

                <div className="row form-details">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "submission_type"
                      }}
                    />
                  </div>
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
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
                                  <label
                                    htmlFor={row.hims_f_service_approval_id}
                                  >
                                    &nbsp;
                                  </label>
                                </div>
                              );
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

                <div className="row" position="fixed">
                  <div className="col-lg-12">
                    <span className="float-left">
                      <button
                        className="htpl1-phase1-btn-others"
                        onClick={e => {
                          this.onClose(e);
                        }}
                      >
                        <AlgaehLabel label={{ fieldName: "btnclose" }} />
                      </button>
                    </span>

                    <span className="float-right">
                      <button
                        style={{ marginRight: "15px" }}
                        className="htpl1-phase1-btn-primary"
                        onClick={SubmitRequestUpdate.bind(this, this)}
                      >
                        <AlgaehLabel
                          label={{ fieldName: "btnsubmitrequest" }}
                        />
                      </button>
                    </span>
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
