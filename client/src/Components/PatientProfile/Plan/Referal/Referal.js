import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { AlagehFormGroup } from "../../../Wrapper/algaehWrapper";
import "./Referal.scss";
import "../../../../styles/site.scss";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import _ from "lodash";
import {
  texthandle,
  addReferal,
  radioChange,
  printReferral,
} from "./ReferalEvents";
import { AlgaehLabel, AlgaehDataGrid } from "algaeh-react-components";
import { successfulMessage } from "../../../../utils/GlobalFunctions";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
import Options from "../../../../Options.json";
import moment from "moment";
class Referal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sub_department_id: undefined,
      doctor_id: undefined,
      referral_type: "I",
      hospital_name: "",
      reason: "",
      radio: true,
      external_doc_name: "",
      referralData: [],
    };
  }
  componentDidMount() {
    this.getPatientReferralDoc();
  }
  doctorDepartmentChangeHandler(item) {
    this.setState({
      sub_department_id: item.hims_d_sub_department_id,
      doctor_id: item.hims_d_employee_id,
      hospital_name: item.hospital_name,
      doctor_department: item.sub_department_name,
    });
  }
  doctorDepartmentClearHandler() {
    this.setState({
      sub_department_id: undefined,
      doctor_id: undefined,
    });
  }
  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }
  getPatientReferralDoc() {
    const { current_patient } = Window.global;
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientReferralDoc",
      data: { patient_id: current_patient },
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            referralData: response.data.records,
          });
          return;
        }
      },
      onFailure: (error) => {
        successfulMessage({
          message: error.message,
          title: "Error",
          icon: "error",
        });
      },
    });
  }
  render() {
    return (
      <div className="hptl-referal-doctor-form" data-validate="referalValidate">
        <div className="row">
          <div className="col-12">
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  name="referral_type"
                  value="I"
                  checked={this.state.radio}
                  onChange={radioChange.bind(this, this)}
                />
                <span>Internal</span>
              </label>
              <label className="radio inline">
                <input
                  type="radio"
                  name="referral_type"
                  value="E"
                  checked={!this.state.radio}
                  onChange={radioChange.bind(this, this)}
                />
                <span>External</span>
              </label>
            </div>
          </div>
          {this.state.radio ? (
            <AlgaehAutoSearch
              div={{ className: "col-6 mandatory" }}
              label={{ forceLabel: "Physician / Department", isImp: true }}
              title="Search by physician / department"
              name="doctor_department"
              searchName="DepartmentAndDoctors"
              columns={[
                { fieldName: "full_name" },
                { fieldName: "sub_department_name" },
                { fieldName: "hospital_name" },
              ]}
              displayField="doctor_department"
              value={this.state.doctor_department}
              template={(row) => {
                return (
                  <div className="col-12 padd-10">
                    <h6>
                      {_.startCase(_.toLower(row.doctor_name))} &rArr;{" "}
                      <small>
                        {_.startCase(_.toLower(row.sub_department_name))}
                      </small>
                    </h6>
                    <small>
                      <strong>Gender :</strong>{" "}
                      {_.startCase(_.toLower(row.sex))}
                    </small>
                    <small>
                      <strong> ,BRANCH :</strong>{" "}
                      {_.startCase(_.toLower(row.hospital_name))}{" "}
                    </small>
                    {/* <span
                      className={
                        row.hosital_status === "Active" ? "green_A" : "red_I"
                      }
                    >
                      {row.hosital_status}
                    </span> */}
                  </div>
                );
              }}
              onClick={this.doctorDepartmentChangeHandler.bind(this)}
              onClear={() => {
                this.state({
                  sub_department_id: null,
                  doctor_id: null,
                  hospital_name: null,
                  doctor_department: null,
                });
              }}
            />
          ) : (
            <AlagehFormGroup
              div={{ className: "col-6 mandatory" }}
              label={{
                forceLabel: "Physician Details",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "external_doc_name",
                value: this.state.external_doc_name,
                events: {
                  onChange: texthandle.bind(this, this),
                },
              }}
            />
          )}

          <AlagehFormGroup
            div={{ className: "col-6 mandatory" }}
            label={{
              forceLabel: "Hospital Name",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "hospital_name",
              value: this.state.hospital_name,
              events: {
                onChange: texthandle.bind(this, this),
              },
              others: {
                disabled: this.state.radio,
              },
            }}
          />
        </div>

        <div className="row">
          <AlagehFormGroup
            div={{ className: "col-9 mandatory" }}
            label={{
              forceLabel: "Reason",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "reason",
              value: this.state.reason,
              events: {
                onChange: texthandle.bind(this, this),
              },
            }}
          />{" "}
          <div className="col" style={{ paddingTop: 21 }}>
            <button
              // href="javascript"
              className="btn btn-primary btn-sm"
              onClick={addReferal.bind(this, this)}
            >
              Add to List
            </button>
          </div>
        </div>
        <div className="portlet-body ReferalTable">
          <AlgaehDataGrid
            columns={[
              {
                fieldName: "actions",
                label: <AlgaehLabel label={{ fieldName: "Action" }} />,
                displayTemplate: (row) => {
                  return (
                    <i
                      className="fas fa-print"
                      onClick={printReferral.bind(this, this, row)}
                    ></i>
                  );
                },
                others: {
                  width: 50,
                  style: { textAlign: "center" },
                },
                sortable: false,
              },
              {
                fieldName: "referral_type_text",
                label: <AlgaehLabel label={{ fieldName: "Referral Type" }} />,
                others: {
                  width: 50,
                  style: { textAlign: "center" },
                },
                sortable: false,
              },
              {
                fieldName: "doctor_name",
                label: <AlgaehLabel label={{ fieldName: "Doctor Name" }} />,
                others: {
                  Width: 150,
                  style: { textAlign: "center" },
                },
                sortable: false,
              },
              {
                fieldName: "hospital_name",
                label: <AlgaehLabel label={{ fieldName: "Hospital Name" }} />,
                others: {
                  width: 50,
                  style: { textAlign: "center" },
                },
                sortable: false,
              },
              {
                fieldName: "reason",
                label: <AlgaehLabel label={{ fieldName: "Reason" }} />,
                others: {
                  style: { textAlign: "center" },
                },
                sortable: false,
              },
              {
                fieldName: "created_date",
                label: <AlgaehLabel label={{ fieldName: "Referred Date" }} />,
                others: {
                  width: 50,
                  style: { textAlign: "center" },
                },
                displayTemplate: (row) => {
                  return <span>{this.dateFormater(row.created_date)}</span>;
                },
                sortable: false,
              },
            ]}
            // loading={false}
            data={this.state.referralData}
            rowUnique=""
            pagination={true}
            isFilterable={true}
          />
        </div>
      </div>
    );
  }
}
export default withRouter(Referal);
