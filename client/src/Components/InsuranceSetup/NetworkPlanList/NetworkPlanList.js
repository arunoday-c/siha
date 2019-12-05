import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import Options from "../../../Options.json";

import "./NetworkPlanList.scss";
import "./../../../styles/site.scss";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import {
  deleteNetWorkPlan,
  UpdateNetworkPlan,
  onchangegridcol,
  onchangegridnumber,
  gridDatehandle,
  dateValidate
} from "./NetworkPlanListEvent.js";
import { AlgaehActions } from "../../../actions/algaehActions";

class NetworkPlanList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      network_plan: [],
      selectedLang: this.props.selectedLang
    };
  }

  componentDidMount() {
    if (this.props.insurance_provider_id !== null) {
      if (
        this.props.subinsuranceprovider === undefined ||
        this.props.subinsuranceprovider.length === 0
      ) {
        this.props.getSubInsuranceDetails({
          uri: "/insurance/getSubInsurance",
          module: "insurance",
          method: "GET",
          printInput: true,
          data: {
            insurance_provider_id: this.props.insurance_provider_id
          },
          redux: {
            type: "SUB_INSURANCE_GET_DATA",
            mappingName: "subinsuranceprovider"
          }
        });
      }

      if (
        this.props.hospitaldetails === undefined ||
        this.props.hospitaldetails.length === 0
      ) {
        this.props.getHospitalDetails({
          uri: "/organization/getOrganization",
          method: "GET",
          redux: {
            type: "HOSPITAL_DETAILS_GET_DATA",
            mappingName: "hospitaldetails"
          }
        });
      }
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.insurance_provider_id !== undefined) {
      this.setState({
        network_plan: newProps.networkandplans,
        insurance_provider_id: newProps.insurance_provider_id
      });
    }
  }

  dateFormater(value) {
    return String(moment(value).format(Options.dateFormat));
  }

  render() {
    return (
      <div id="networkPlanListCntr">
        <AlgaehDataGrid
          id="pla_list_grid"
          columns={[
            {
              fieldName: "insurance_sub_id",
              label: <AlgaehLabel label={{ fieldName: "insurance_sub_id" }} />,
              displayTemplate: row => {
                let display =
                  this.props.subinsuranceprovider === undefined
                    ? []
                    : this.props.subinsuranceprovider.filter(
                        f => f.hims_d_insurance_sub_id === row.insurance_sub_id
                      );

                return (
                  <span>
                    {display !== null && display.length !== 0
                      ? this.state.selectedLang === "en"
                        ? display[0].insurance_sub_name
                        : display[0].arabic_sub_name
                      : ""}
                  </span>
                );
              },
              editorTemplate: row => {
                let display =
                  this.props.subinsuranceprovider === undefined
                    ? []
                    : this.props.subinsuranceprovider.filter(
                        f => f.hims_d_insurance_sub_id === row.insurance_sub_id
                      );

                return (
                  <span>
                    {display !== null && display.length !== 0
                      ? this.state.selectedLang === "en"
                        ? display[0].insurance_sub_name
                        : display[0].arabic_sub_name
                      : ""}
                  </span>
                );
              }
            },

            {
              fieldName: "hospital_id",
              label: <AlgaehLabel label={{ fieldName: "hospital_id" }} />,
              displayTemplate: row => {
                let display =
                  this.props.hospitaldetails === undefined
                    ? []
                    : this.props.hospitaldetails.filter(
                        f => f.hims_d_hospital_id === row.hospital_id
                      );

                return (
                  <span>
                    {display !== null && display.length !== 0
                      ? this.state.selectedLang === "en"
                        ? display[0].hospital_name
                        : display[0].arabic_hospital_name
                      : ""}
                  </span>
                );
              },
              editorTemplate: row => {
                let display =
                  this.props.hospitaldetails === undefined
                    ? []
                    : this.props.hospitaldetails.filter(
                        f => f.hims_d_hospital_id === row.hospital_id
                      );

                return (
                  <span>
                    {display !== null && display.length !== 0
                      ? this.state.selectedLang === "en"
                        ? display[0].hospital_name
                        : display[0].arabic_hospital_name
                      : ""}
                  </span>
                );
              }
            },
            {
              fieldName: "network_type",
              label: <AlgaehLabel label={{ fieldName: "network_type" }} />,
              disabled: true
            },
            {
              fieldName: "policy_number",
              label: <AlgaehLabel label={{ fieldName: "policy_number" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      value: row.policy_number,
                      className: "txt-fld",
                      name: "policy_number",
                      events: {
                        onChange: onchangegridcol.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            {
              fieldName: "employer",
              label: <AlgaehLabel label={{ fieldName: "employer" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      value: row.employer,
                      className: "txt-fld",
                      name: "employer",
                      events: {
                        onChange: onchangegridcol.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            {
              fieldName: "effective_start_date",
              label: (
                <AlgaehLabel label={{ fieldName: "effective_start_date" }} />
              ),
              displayTemplate: row => {
                return (
                  <span>{this.dateFormater(row.effective_start_date)}</span>
                );
              },
              editorTemplate: row => {
                return (
                  <AlgaehDateHandler
                    div={{}}
                    textBox={{
                      className: "txt-fld",
                      name: "effective_start_date"
                    }}
                    maxDate={new Date()}
                    events={{
                      onChange: gridDatehandle.bind(this, this, row),
                      onBlur: dateValidate.bind(this, this, row)
                    }}
                    value={row.effective_start_date}
                  />
                );
              },
              others: { minWidth: 130 }
            },
            {
              fieldName: "effective_end_date",
              label: (
                <AlgaehLabel label={{ fieldName: "effective_end_date" }} />
              ),
              displayTemplate: row => {
                return <span>{this.dateFormater(row.effective_end_date)}</span>;
              },
              editorTemplate: row => {
                return (
                  <AlgaehDateHandler
                    div={{}}
                    textBox={{
                      className: "txt-fld",
                      name: "effective_end_date"
                    }}
                    maxDate={new Date()}
                    events={{
                      onChange: gridDatehandle.bind(this, this, row),
                      onBlur: dateValidate.bind(this, this, row)
                    }}
                    value={row.effective_end_date}
                  />
                );
              },
              others: { minWidth: 130 }
            },
            {
              fieldName: "preapp_limit",
              label: <AlgaehLabel label={{ fieldName: "preapp_limit" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.preapp_limit,
                      className: "txt-fld",
                      name: "preapp_limit",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            {
              fieldName: "price_from",
              label: <AlgaehLabel label={{ fieldName: "price_from" }} />,
              displayTemplate: row => {
                return row.price_from === "S"
                  ? "Company Level Service Price"
                  : "Policy Level Service Price ";
              },
              editorTemplate: row => {
                return row.price_from === "S"
                  ? "Company Level Service Price"
                  : "Policy Level Service Price ";
              }
            },
            ///Changes
            {
              fieldName: "deductible",
              label: <AlgaehLabel label={{ fieldName: "deductible" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.deductible,
                      className: "txt-fld",
                      name: "deductible",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            {
              fieldName: "copay_consultation",
              label: (
                <AlgaehLabel label={{ fieldName: "copay_consultation" }} />
              ),
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.copay_consultation,
                      className: "txt-fld",
                      name: "copay_consultation",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            // {
            //   fieldName: "max_value",
            //   label: <AlgaehLabel label={{ fieldName: "con_max_limit" }} />,
            //   editorTemplate: row => {
            //     return (
            //       <AlagehFormGroup
            //         div={{}}
            //         textBox={{
            //           decimal: { allowNegative: false },
            //           value: row.max_value,
            //           className: "txt-fld",
            //           name: "max_value",
            //           events: {
            //             onChange: onchangegridnumber.bind(this, this, row)
            //           }
            //         }}
            //       />
            //     );
            //   }
            // },
            {
              fieldName: "deductible_lab",
              label: <AlgaehLabel label={{ fieldName: "deductible_lab" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.deductible_lab,
                      className: "txt-fld",
                      name: "deductible_lab",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            {
              fieldName: "copay_percent",
              label: <AlgaehLabel label={{ fieldName: "copay_percent" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.copay_percent,
                      className: "txt-fld",
                      name: "copay_percent",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },

            //
            // {
            //   fieldName: "lab_max",
            //   label: <AlgaehLabel label={{ fieldName: "lab_max" }} />,
            //   editorTemplate: row => {
            //     return (
            //       <AlagehFormGroup
            //         div={{}}
            //         textBox={{
            //           decimal: { allowNegative: false },
            //           value: row.lab_max,
            //           className: "txt-fld",
            //           name: "lab_max",
            //           events: {
            //             onChange: onchangegridnumber.bind(this, this, row)
            //           }
            //         }}
            //       />
            //     );
            //   }
            // },
            {
              fieldName: "deductible_rad",
              label: <AlgaehLabel label={{ fieldName: "deductible_rad" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.deductible_rad,
                      className: "txt-fld",
                      name: "deductible_rad",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },

            {
              fieldName: "copay_percent_rad",
              label: <AlgaehLabel label={{ fieldName: "copay_percent_rad" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.copay_percent_rad,
                      className: "txt-fld",
                      name: "copay_percent_rad",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            // {
            //   fieldName: "rad_max",
            //   label: <AlgaehLabel label={{ fieldName: "rad_max" }} />,
            //   editorTemplate: row => {
            //     return (
            //       <AlagehFormGroup
            //         div={{}}
            //         textBox={{
            //           decimal: { allowNegative: false },
            //           value: row.rad_max,
            //           className: "txt-fld",
            //           name: "rad_max",
            //           events: {
            //             onChange: onchangegridnumber.bind(this, this, row)
            //           }
            //         }}
            //       />
            //     );
            //   }
            // },
            {
              fieldName: "deductible_trt",
              label: <AlgaehLabel label={{ fieldName: "deductible_trt" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.deductible_trt,
                      className: "txt-fld",
                      name: "deductible_trt",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            {
              fieldName: "copay_percent_trt",
              label: <AlgaehLabel label={{ fieldName: "copay_percent_trt" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.copay_percent_trt,
                      className: "txt-fld",
                      name: "copay_percent_trt",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            {
              fieldName: "trt_max",
              label: <AlgaehLabel label={{ fieldName: "trt_max" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.trt_max,
                      className: "txt-fld",
                      name: "trt_max",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            {
              fieldName: "deductible_dental",
              label: <AlgaehLabel label={{ fieldName: "deductible_dental" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.deductible_dental,
                      className: "txt-fld",
                      name: "deductible_dental",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },

            {
              fieldName: "copay_percent_dental",
              label: (
                <AlgaehLabel label={{ fieldName: "copay_percent_dental" }} />
              ),
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.copay_percent_dental,
                      className: "txt-fld",
                      name: "copay_percent_dental",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            // {
            //   fieldName: "dental_max",
            //   label: <AlgaehLabel label={{ fieldName: "dental_max" }} />,
            //   editorTemplate: row => {
            //     return (
            //       <AlagehFormGroup
            //         div={{}}
            //         textBox={{
            //           decimal: { allowNegative: false },
            //           value: row.dental_max,
            //           className: "txt-fld",
            //           name: "dental_max",
            //           events: {
            //             onChange: onchangegridnumber.bind(this, this, row)
            //           }
            //         }}
            //       />
            //     );
            //   }
            // },
            {
              fieldName: "deductible_medicine",
              label: (
                <AlgaehLabel label={{ fieldName: "deductible_medicine" }} />
              ),
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.deductible_medicine,
                      className: "txt-fld",
                      name: "deductible_medicine",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            },
            {
              fieldName: "copay_medicine",
              label: <AlgaehLabel label={{ fieldName: "copay_medicine" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{}}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: row.copay_medicine,
                      className: "txt-fld",
                      name: "copay_medicine",
                      events: {
                        onChange: onchangegridnumber.bind(this, this, row)
                      }
                    }}
                  />
                );
              }
            }
            // {
            //   fieldName: "medicine_max",
            //   label: <AlgaehLabel label={{ fieldName: "medicine_max" }} />,
            //   editorTemplate: row => {
            //     return (
            //       <AlagehFormGroup
            //         div={{}}
            //         textBox={{
            //           decimal: { allowNegative: false },
            //           value: row.medicine_max,
            //           className: "txt-fld",
            //           name: "medicine_max",
            //           events: {
            //             onChange: onchangegridnumber.bind(this, this, row)
            //           }
            //         }}
            //       />
            //     );
            //   }
            //}
          ]}
          keyId="network_type"
          dataSource={{
            data: this.state.network_plan
          }}
          isEditable={true}
          paging={{ page: 0, rowsPerPage: 10 }}
          events={{
            onDelete: deleteNetWorkPlan.bind(this, this),
            onEdit: row => {},
            onDone: UpdateNetworkPlan.bind(this, this)
          }}
          filter={true}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    networkandplans: state.networkandplans,
    subinsuranceprovider: state.subinsuranceprovider,
    hospitaldetails: state.hospitaldetails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getNetworkPlans: AlgaehActions,
      getSubInsuranceDetails: AlgaehActions,
      getHospitalDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NetworkPlanList)
);
