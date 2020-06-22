import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import moment from "moment";

import "./SubInsurance.scss";
import "./../../../styles/site.scss";

import {
  AlgaehLabel,
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import {
  texthandle,
  saveSubInsurance,
  // addNewSubinsurance,
  datehandle,
  deleteSubInsurance,
  updateSubInsurance,
  onchangegridcol,
  getSubInsuranceDetails,
  dateValidate,
  loadAccounts,
  getFinanceProviders,
} from "./SubInsuranceHandaler";
import MyContext from "../../../utils/MyContext";
import Options from "../../../Options.json";

class SubInsurance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      insurance_sub_code: null,
      insurance_sub_name: null,
      arabic_sub_name: null,
      insurance_provider_id: null,
      transaction_number: null,
      card_format: null,
      effective_start_date: null,
      effective_end_date: null,
      maxDate_end_date: null,
      accounts: [],
      finance_providers: [],
      // sub_insurance: []
      // created_by: getCookie("UserID")
    };
    this.baseState = this.state;
    this.getFinanceProviders = getFinanceProviders.bind(this);
  }

  loadAccounts() {
    loadAccounts({ finance_account_head_id: "1" }).then((result) => {
      if (result.length > 0) {
        this.setState({ accounts: result[0].children });
      } else {
        this.setState({ accounts: [] });
      }
    });
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.InsuranceSetup;
    InputOutput.maxDate_end_date = InputOutput.effective_end_date;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    // this.loadAccounts();
    if (this.state.insurance_provider_id !== null) {
      getSubInsuranceDetails(this, this);
      this.getFinanceProviders();
    }
  }
  handleClose = () => {
    this.setState({ snackeropen: false });
  };

  changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {(context) => (
            <div
              className="hptl-phase1-add-sub-insurance-form"
              data-validate="InsuranceProvider"
            >
              <div className="popRightDiv">
                {/* Services Details */}
                <div className="row">
                  <div className="col-lg-12">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Insurar Name",
                      }}
                    />
                    <h6>
                      {this.state.insurance_provider_name
                        ? this.state.insurance_provider_name
                        : "Insurar Name"}
                    </h6>
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "insurance_sub_code",
                      isImp: true,
                    }}
                    textBox={{
                      value: this.state.insurance_sub_code,
                      className: "txt-fld",
                      name: "insurance_sub_code",
                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        "data-subdata": true,
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "insurance_sub_name",
                      isImp: true,
                    }}
                    textBox={{
                      value: this.state.insurance_sub_name,
                      className: "txt-fld",
                      name: "insurance_sub_name",

                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        "data-subdata": true,
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "arabic_provider_name",
                      isImp: true,
                    }}
                    textBox={{
                      value: this.state.arabic_sub_name,
                      className: "txt-fld arabicInput",
                      name: "arabic_sub_name",

                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "transaction_number",
                      isImp: false,
                    }}
                    textBox={{
                      value: this.state.transaction_number,
                      className: "txt-fld",
                      name: "transaction_number",

                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        "data-subdata": true,
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "card_format",
                      isImp: false,
                    }}
                    textBox={{
                      value: this.state.card_format,
                      className: "txt-fld",
                      name: "card_format",

                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        "data-subdata": true,
                      },
                    }}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "effective_start_date",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld hidden",
                      name: "effective_start_date",
                    }}
                    maxDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this),
                      onBlur: dateValidate.bind(this, this),
                    }}
                    value={
                      this.state.effective_start_date !== null
                        ? this.state.effective_start_date
                        : null
                    }
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ fieldName: "effective_end_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "effective_end_date",
                    }}
                    minDate={new Date()}
                    maxDate={this.state.maxDate_end_date}
                    events={{
                      onChange: datehandle.bind(this, this),
                      onBlur: dateValidate.bind(this, this),
                    }}
                    value={
                      this.state.effective_end_date !== null
                        ? this.state.effective_end_date
                        : null
                    }
                  />

                  <div className="col-lg-3">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 19 }}
                      onClick={saveSubInsurance.bind(this, this, context)}
                    >
                      Add
                    </button>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      value: this.state.effective_start_date,
                      className: "txt-fld d-none",
                      name: "effective_start_date",

                      events: {
                        onChange: datehandle.bind(this, this),
                      },
                      others: {
                        "data-subdata": true,
                      },
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      value: this.state.effective_end_date,
                      className: "txt-fld d-none",
                      name: "effective_end_date",

                      events: {
                        onChange: datehandle.bind(this, this),
                      },
                      others: {
                        "data-subdata": true,
                      },
                    }}
                  />
                </div>

                <div className="row">
                  <div className="col-12" id="subInsuranceGridCntr">
                    <AlgaehDataGrid
                      id="sub_insurance_grid"
                      columns={[
                        {
                          fieldName: "insurance_sub_code",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "insurance_sub_code" }}
                            />
                          ),
                          disabled: true,
                          others: {
                            maxWidth: 200,
                            style: {
                              textAlign: "center",
                            },
                          },
                        },
                        {
                          fieldName: "insurance_sub_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "insurance_sub_name" }}
                            />
                          ),
                          editorTemplate: (row, rowId) => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.insurance_sub_name,
                                  className: "txt-fld",
                                  name: "insurance_sub_name",
                                  events: {
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      row
                                    ),
                                  },
                                }}
                              />
                            );
                          },
                          others: {
                            maxWidth: 200,
                            style: {
                              textAlign: "center",
                            },
                          },
                        },
                        {
                          fieldName: "arabic_sub_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "arabic_provider_name" }}
                            />
                          ),
                          editorTemplate: (row) => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.arabic_sub_name,
                                  className: "txt-fld arabicInput",
                                  name: "arabic_sub_name",
                                  events: {
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      row
                                    ),
                                  },
                                }}
                              />
                            );
                          },
                          others: {
                            maxWidth: 200,
                            style: {
                              textAlign: "center",
                            },
                          },
                        },
                        {
                          fieldName: "transaction_number",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "transaction_number" }}
                            />
                          ),
                          editorTemplate: (row) => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.transaction_number,
                                  className: "txt-fld",
                                  name: "transaction_number",
                                  events: {
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      row
                                    ),
                                  },
                                }}
                              />
                            );
                          },
                          others: {
                            maxWidth: 200,
                            style: {
                              textAlign: "center",
                            },
                          },
                        },
                        {
                          fieldName: "card_format",
                          label: (
                            <AlgaehLabel label={{ fieldName: "card_format" }} />
                          ),
                          editorTemplate: (row) => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.card_format,
                                  className: "txt-fld",
                                  name: "card_format",
                                  events: {
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      row
                                    ),
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "effective_start_date",
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {this.changeDateFormat(
                                  row.effective_start_date
                                )}
                              </span>
                            );
                          },
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "effective_start_date" }}
                            />
                          ),
                          disabled: true,
                        },
                        {
                          fieldName: "effective_end_date",
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {this.changeDateFormat(row.effective_end_date)}
                              </span>
                            );
                          },
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "effective_end_date" }}
                            />
                          ),
                          disabled: true,
                        },
                        {
                          fieldName: "finance_account_child_id",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "G/L Account" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            const [
                              current,
                            ] = this.state.finance_providers.filter(
                              (item) =>
                                item.finance_account_child_id ===
                                row.finance_account_child_id &&
                                item.head_id === row.head_id
                            );
                            return current ? current.child_name : "";
                          },
                          editorTemplate: (row, rowId) => {
                            if (row.finance_account_child_id) {
                              return (
                                <AlagehAutoComplete
                                  selector={{
                                    dataSource: {
                                      data: this.state.finance_providers,
                                      valueField: "finance_account_child_id",
                                      textField: "child_name",
                                    },
                                    value: row.finance_account_child_id,
                                    onChange: ({ selected }) => {
                                      row.child_id =
                                        selected.finance_account_child_id;
                                      row.head_id = selected.head_id;
                                      row.update();
                                    },
                                  }}
                                />
                              );
                            } else {
                              return null;
                            }
                          },
                          others: {
                            maxWidth: 200,
                            style: {
                              textAlign: "center",
                            },
                          },
                        },
                      ]}
                      keyId="insurance_sub_code"
                      dataSource={{
                        data:
                          this.state.sub_insurance === undefined
                            ? []
                            : this.state.sub_insurance,
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: deleteSubInsurance.bind(this, this),
                        onEdit: (row) => { },
                        onDone: updateSubInsurance.bind(this, this),
                      }}
                    />
                  </div>
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
    subinsuranceprovider: state.subinsuranceprovider,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSubInsuranceDetails: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubInsurance)
);
