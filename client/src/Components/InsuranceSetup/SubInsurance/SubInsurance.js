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

import { MainContext } from "algaeh-react-components";
import { AlgaehTreeSearch } from "algaeh-react-components";
import MyContext from "../../../utils/MyContext";
import Options from "../../../Options.json";

class SubInsurance extends PureComponent {
  constructor(props) {
    super(props);
    this.isFinance = false;
    this.state = {
      insurance_sub_code: null,
      insurance_sub_name: null,
      arabic_sub_name: null,
      insurance_provider_id: null,
      transaction_number: null,
      card_format: null,
      ins_template_name: null,
      effective_start_date: null,
      effective_end_date: null,
      maxDate_end_date: null,
      accounts: [],
      finance_providers: [],
      portal_exists: "N",
      creidt_limit: 0,
      creidt_limit_req: "N",
      // sub_insurance: []
      // created_by: getCookie("UserID")
    };
    this.baseState = this.state;
    this.getFinanceProviders = getFinanceProviders.bind(this);
  }

  static contextType = MainContext;

  componentDidMount() {
    this.isFinance =
      this.context.userToken.product_type === "HIMS_ERP" ||
      this.context.userToken.product_type === "FINANCE_ERP";
    if (this.isFinance) {
      this.loadAccounts();
    }
    if (this.state.insurance_provider_id !== null) {
      getSubInsuranceDetails(this, this);
      this.getFinanceProviders();
    }
    this.setState({
      portal_exists: this.context.userToken.portal_exists,
    });
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
                  <div className="col-12">
                    <div className="row">
                      <div className="col-2 form-group">
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
                        div={{ className: "col-2 mandatory form-group" }}
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
                        div={{ className: "col-4 mandatory form-group" }}
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
                        div={{ className: "col-4 mandatory form-group" }}
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
                    </div>
                    <div className="row">
                      <AlgaehDateHandler
                        div={{ className: "col mandatory form-group" }}
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
                        div={{ className: "col mandatory form-group" }}
                        label={{
                          fieldName: "effective_end_date",
                          isImp: true,
                        }}
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

                      <AlagehFormGroup
                        div={{ className: "col form-group" }}
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
                        div={{ className: "col form-group" }}
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

                      <AlagehFormGroup
                        div={{ className: "col form-group" }}
                        label={{
                          forceLabel: "Template Name",
                          isImp: false,
                        }}
                        textBox={{
                          value: this.state.ins_template_name,
                          className: "txt-fld",
                          name: "ins_template_name",

                          events: {
                            onChange: texthandle.bind(this, this),
                          },
                          others: {
                            "data-subdata": true,
                          },
                        }}
                      />

                      {/*<AlagehFormGroup
                        div={{ className: "col   form-group" }}
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
                      /> */}
                    </div>
                    <div className="row">
                      {this.state.insurance_type === "C" &&
                      this.state.portal_exists === "Y" ? (
                        <AlagehFormGroup
                          div={{ className: "col mandatory form-group" }}
                          label={{
                            forceLabel: "User Name For Portal",
                            isImp:
                              this.state.portal_exists === "Y" ? true : false,
                          }}
                          textBox={{
                            value: this.state.user_id,
                            className: "txt-fld",
                            name: "user_id",

                            events: {
                              onChange: texthandle.bind(this, this),
                            },
                            others: {
                              "data-subdata": true,
                            },
                          }}
                        />
                      ) : null}
                      {this.state.insurance_type === "C" ? (
                        <>
                          <div className="col">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Creidt Limit Req.",
                              }}
                            />
                            <div
                              className="customRadio"
                              style={{ borderBottom: 0 }}
                            >
                              <label className="radio inline">
                                <input
                                  type="radio"
                                  value="Y"
                                  name="creidt_limit_req"
                                  checked={
                                    this.state.creidt_limit_req === "Y"
                                      ? true
                                      : false
                                  }
                                  onChange={texthandle.bind(this, this)}
                                />
                                <span>
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Yes",
                                    }}
                                  />
                                </span>
                              </label>
                              <label className="radio inline">
                                <input
                                  type="radio"
                                  value="N"
                                  name="creidt_limit_req"
                                  checked={
                                    this.state.creidt_limit_req === "N"
                                      ? true
                                      : false
                                  }
                                  onChange={texthandle.bind(this, this)}
                                />
                                <span>
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "No",
                                    }}
                                  />
                                </span>
                              </label>
                            </div>
                          </div>
                          {this.state.creidt_limit_req === "Y" ? (
                            <AlagehFormGroup
                              div={{ className: "col-3 form-group" }}
                              label={{
                                forceLabel: "Creidt Limit",
                                isImp:
                                  this.state.creidt_limit_req === "Y"
                                    ? true
                                    : false,
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.creidt_limit,
                                className: "txt-fld",
                                name: "creidt_limit",

                                events: {
                                  onChange: texthandle.bind(this, this),
                                },
                              }}
                            />
                          ) : null}
                        </>
                      ) : null}

                      <div className="col" style={{ marginTop: 20 }}>
                        <button
                          className="btn btn-primary"
                          onClick={saveSubInsurance.bind(this, this, context)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
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
                          fieldName: "ins_template_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Template Name" }}
                            />
                          ),
                          editorTemplate: (row) => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.ins_template_name,
                                  className: "txt-fld",
                                  name: "ins_template_name",
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
                              return (
                                <AlgaehTreeSearch
                                  div={{
                                    className: "form-group customTreeSearch",
                                  }}
                                  tree={{
                                    treeDefaultExpandAll: true,
                                    onChange: (val) => {
                                      const [head_id, child_id] = val.split(
                                        "-"
                                      );
                                      row.child_id = child_id;
                                      row.head_id = head_id;
                                      row.update();
                                    },
                                    name: "finance_account_child_id",
                                    data: this.state.accounts,
                                    textField: "label",
                                    valueField: (node) => {
                                      if (node["leafnode"] === "Y") {
                                        return (
                                          node["head_id"] +
                                          "-" +
                                          node["finance_account_child_id"]
                                        );
                                      } else {
                                        return node["finance_account_head_id"];
                                      }
                                    },
                                    defaultValue: row.head_id
                                      ? `${row.head_id}-${row.finance_account_child_id}`
                                      : undefined,
                                  }}
                                />
                              );
                            }
                          },
                          others: {
                            show: this.isFinance,
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
                        onEdit: (row) => {},
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
