import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./SubInsurance.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehDataGrid,
  Button
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import {
  texthandle,
  saveSubInsurance,
  addNewSubinsurance,
  datehandle
} from "./SubInsuranceHandaler";
import MyContext from "../../../utils/MyContext";

class SubInsurance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      insurance_sub_code: null,
      insurance_sub_name: null,
      insurance_provider_id: null,
      transaction_number: null,
      card_format: null,
      effective_start_date: null,
      effective_end_date: null
    };
  }

  componentWillMount() {
    debugger;
    let InputOutput = this.props.InsuranceSetup;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {}

  render() {
    console.log("Name", this.state.insurance_provider_id);
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-sub-insurance-form">
              <div className="container-fluid">
                {/* Services Details */}
                <div className="row insurance-details">
                  <div className="col-lg-12">
                    <AlgaehLabel label={{ forceLabel: "INSURSR: " }} />
                    <AlgaehLabel
                      label={{ forceLabel: this.state.insurance_provider_name }}
                    />

                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      style={{ float: "right" }}
                      onClick={addNewSubinsurance.bind(this, this)}
                    >
                      Add New
                    </Button>
                  </div>
                </div>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "insurance_sub_code"
                    }}
                    textBox={{
                      value: this.state.insurance_sub_code,
                      className: "txt-fld",
                      name: "insurance_sub_code",
                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        "data-subdata": true
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "insurance_sub_name"
                    }}
                    textBox={{
                      value: this.state.insurance_sub_name,
                      className: "txt-fld",
                      name: "insurance_sub_name",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        "data-subdata": true
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "transaction_number"
                    }}
                    textBox={{
                      value: this.state.transaction_number,
                      className: "txt-fld",
                      name: "transaction_number",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        "data-subdata": true
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "card_format"
                    }}
                    textBox={{
                      value: this.state.card_format,
                      className: "txt-fld",
                      name: "card_format",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        "data-subdata": true
                      }
                    }}
                  />
                </div>

                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ fieldName: "effective_start_date" }}
                    textBox={{
                      className: "txt-fld",
                      name: "effective_start_date",
                      others: {
                        "data-subdata": true
                      }
                    }}
                    events={{
                      onChange: datehandle.bind(this, this, context)
                    }}
                    value={
                      this.state.effective_start_date != null
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
                      others: {
                        "data-subdata": true
                      }
                    }}
                    events={{
                      onChange: datehandle.bind(this, this, context)
                    }}
                    value={
                      this.state.effective_end_date != null
                        ? this.state.effective_end_date
                        : null
                    }
                  />
                </div>

                <div className="row form-details">
                  <div className="col-lg-12">
                    <AlgaehDataGrid
                      id="sub_insurance_grid"
                      columns={[
                        {
                          fieldName: "insurance_sub_code",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "insurance_sub_code" }}
                            />
                          )
                        },
                        {
                          fieldName: "insurance_sub_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "insurance_sub_name" }}
                            />
                          )
                        },
                        {
                          fieldName: "transaction_number",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "transaction_number" }}
                            />
                          )
                        },
                        {
                          fieldName: "card_format",
                          label: (
                            <AlgaehLabel label={{ fieldName: "card_format" }} />
                          )
                        },
                        {
                          fieldName: "effective_start_date",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "effective_start_date" }}
                            />
                          )
                        },
                        {
                          fieldName: "effective_end_date",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "effective_end_date" }}
                            />
                          )
                        }
                      ]}
                      keyId="identity_document_code"
                      dataSource={{
                        data:
                          this.state.sub_insurance === undefined
                            ? []
                            : this.state.sub_insurance
                      }}
                      // isEditable={true}
                      paging={{ page: 0, rowsPerPage: 5 }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      style={{ float: "right" }}
                      onClick={saveSubInsurance.bind(this, this, context)}
                    >
                      Save
                    </Button>
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
    servicetype: state.servicetype,
    services: state.services
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubInsurance)
);
