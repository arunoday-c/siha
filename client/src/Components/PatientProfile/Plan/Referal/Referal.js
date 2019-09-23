import React, { PureComponent } from "react";

import {
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import "./Referal.scss";
import "../../../../styles/site.scss";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import _ from "lodash";
import { texthandle, addReferal, radioChange } from "./ReferalEvents";

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
      external_doc_name: ""
    };
  }
  doctorDepartmentChangeHandler(item) {
    this.setState({
      sub_department_id: item.hims_d_sub_department_id,
      doctor_id: item.hims_d_employee_id,
      hospital_name: item.hospital_name
    });
  }
  doctorDepartmentClearHandler() {
    this.setState({
      sub_department_id: undefined,
      doctor_id: undefined
    });
  }
  render() {
    return (
      <div className="hptl-referal-doctor-form">
        <div className="col-lg-12">
          <div className="row">
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
        </div>
        <div className="row" style={{ paddingBottom: "10px" }}>
          {this.state.radio ? (
            <AlgaehAutoSearch
              div={{ className: "col-lg-10" }}
              label={{ forceLabel: "Physician / Department" }}
              title="Search by physician / department"
              name="doctor_department"
              searchName="DepartmentAndDoctors"
              columns={[
                { fieldName: "full_name" },
                { fieldName: "sub_department_name" },
                { fieldName: "hospital_name" }
              ]}
              displayField="doctor_department"
              template={row => {
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
                      <strong> ,Hospital :</strong>{" "}
                      {_.startCase(_.toLower(row.hospital_name))}{" "}
                    </small>
                    <span
                      className={
                        row.hosital_status === "Active" ? "green_A" : "red_I"
                      }
                    >
                      {row.hosital_status}
                    </span>
                  </div>
                );
              }}
              onClick={this.doctorDepartmentChangeHandler.bind(this)}
              onClear={this.doctorDepartmentClearHandler.bind(this)}
            />
          ) : (
            <AlagehFormGroup
              div={{ className: "col-lg-10" }}
              label={{
                forceLabel: "Physician Details"
              }}
              textBox={{
                className: "txt-fld",
                name: "external_doc_name",
                value: this.state.external_doc_name,
                events: {
                  onChange: texthandle.bind(this, this)
                }
              }}
            />
          )}

          <div className="actions" style={{ paddingTop: "3.5vh" }}>
            <a
              // href="javascript"
              className="btn btn-primary btn-circle active"
              onClick={addReferal.bind(this, this)}
            >
              <i className="fas fa-plus" />
            </a>
          </div>
        </div>

        <div className="row">
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Hospital Name"
            }}
            textBox={{
              className: "txt-fld",
              name: "hospital_name",
              value: this.state.hospital_name,
              events: {
                onChange: texthandle.bind(this, this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Reason"
            }}
            textBox={{
              className: "txt-fld",
              name: "reason",
              value: this.state.reason,
              events: {
                onChange: texthandle.bind(this, this)
              }
            }}
          />
        </div>
      </div>
    );
  }
}
export default Referal;
