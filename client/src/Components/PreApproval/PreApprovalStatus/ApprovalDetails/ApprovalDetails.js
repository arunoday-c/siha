import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";

import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";

import {
  texthandle,
  datehandle,
  updateServices,
  deleteServices
} from "./ApprovalDetailsEvents";

import GlobalVariables from "../../../../utils/GlobalVariables.json";
import "./../../../../styles/site.css";
import "./ApprovalDetails.css";
import MyContext from "../../../../utils/MyContext.js";
import Options from "../../../../Options.json";

class PatientDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      requestDeatils: []
    };
  }

  SubmitRequest(e) {
    this.props.onClose && this.props.onClose(e);
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  componentDidMount() {
    let InputOutput = this.props.selected_services;
    this.setState({ ...this.state, ...InputOutput });
  }

  changeDateFormat = date => {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div>
<h6 className="popSubHdg">Approval Details</h6>

               <div className="row">
<div className="col-lg-12">
                    <AlgaehDataGrid
                      id="approval_services_grd"
                      columns={[
                        {
                          fieldName: "service_code",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "service_code" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "insurance_service_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "service_name" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "requested_quantity",
                          label: (
                            <AlgaehLabel label={{ fieldName: "qty_appr" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.requested_quantity,
                                  className: "txt-fld",
                                  name: "requested_quantity",
                                  events: {
                                    onChange: texthandle.bind(this, this, row)
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "gross_amt",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "gross_amount" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "net_amount",
                          label: (
                            <AlgaehLabel label={{ fieldName: "net_amount" }} />
                          ),
                          disabled: true
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
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "apprv_status",
                                  className: "select-fld",
                                  value: row.apprv_status,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.FORMAT_APPSTATUS
                                  },
                                  onChange: texthandle.bind(this, this, row)
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "approved_amount",
                          label: (
                            <AlgaehLabel label={{ fieldName: "amount_app" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  decimal: { allowNegative: false },
                                  value: row.approved_amount,
                                  className: "txt-fld",
                                  name: "approved_amount",
                                  events: {
                                    onChange: texthandle.bind(this, this, row)
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "approved_no",
                          label: (
                            <AlgaehLabel label={{ fieldName: "auth_no" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.approved_no,
                                  className: "txt-fld",
                                  name: "approved_no",
                                  events: {
                                    onChange: texthandle.bind(this, this, row)
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "apprv_date",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "app_rej_date" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {this.changeDateFormat(row.apprv_date)}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <AlgaehDateHandler
                                div={{ className: "" }}
                                textBox={{
                                  className: "txt-fld hidden",
                                  name: "apprv_date"
                                }}
                                minDate={new Date()}
                                events={{
                                  onChange: datehandle.bind(this, this, row)
                                }}
                                value={row.apprv_date}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "valid_upto",
                          label: (
                            <AlgaehLabel label={{ fieldName: "valid_upto" }} />
                          )
                        },
                        {
                          fieldName: "apprv_remarks",
                          label: (
                            <AlgaehLabel label={{ fieldName: "remarks" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.apprv_remarks,
                                  className: "txt-fld",
                                  name: "apprv_remarks",
                                  events: {
                                    onChange: texthandle.bind(this, this, row)
                                  }
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      keyId="visit_code"
                      dataSource={{
                        data: this.state.services_details
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 5 }}
                      events={{
                        onDelete: deleteServices.bind(this, context),
                        onEdit: row => {},
                        onDone: updateServices.bind(this, this, context)
                      }}
                    />
                  </div>
                </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    deptanddoctors: state.deptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientDetails)
);
