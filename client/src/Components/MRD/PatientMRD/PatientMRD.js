import React, { Component } from "react";
import "./patient_mrd.css";
import { AlgaehDataGrid } from "../../Wrapper/algaehWrapper";
class PatientMRD extends Component {
  render() {
    return (
      <div className="patient-mrd">
        {/* Patient Info Top Band Start */}

        <div className="patientInfo-Top box-shadow-normal">
          <div className="patientImg box-shadow">
            <img src="https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg" />
          </div>
          <div className="patientName">
            <h6>
              {this.props.patient_profile !== undefined
                ? this.props.patient_profile[0].full_name
                : "Sebastian Tassard"}
            </h6>
            <p>
              {this.props.patient_profile !== undefined
                ? this.props.patient_profile[0].gender
                : ""}
              ,{" "}
              {this.props.patient_profile !== undefined
                ? this.props.patient_profile[0].age_in_years
                : 0}
              Y{" "}
              {this.props.patient_profile !== undefined
                ? this.props.patient_profile[0].age_in_months
                : 0}
              M{" "}
              {this.props.patient_profile !== undefined
                ? this.props.patient_profile[0].age_in_days
                : 0}
              D
            </p>
          </div>
          <div className="patientDemographic">
            <span>
              DOB:
              <b>
                {/* {moment(
                  this.props.patient_profile !== undefined
                    ? this.props.patient_profile[0].date_of_birth
                    : ""
                ).format("DD-MM-YYYY")} */}
                DD-MM-YYYY
              </b>
            </span>
            <span>
              Mobile:{" "}
              <b>
                {this.props.patient_profile !== undefined
                  ? this.props.patient_profile[0].contact_number
                  : "9098909878"}
              </b>
            </span>
            <span>
              Nationality:{" "}
              <b>
                {this.props.patient_profile !== undefined
                  ? this.props.patient_profile[0].nationality
                  : "Indian"}
              </b>
            </span>
          </div>
          <div className="patientHospitalDetail">
            <span>
              MRN:{" "}
              <b>
                {this.props.patient_profile !== undefined
                  ? this.props.patient_profile[0].patient_code
                  : "000000"}
              </b>
            </span>
            <span>
              Encounter:{" "}
              <b>
                {/* {moment(
                  this.props.patient_profile !== undefined
                    ? this.props.patient_profile[0].Encounter_Date
                    : ""
                ).format("DD-MM-YYYY HH:MM:SS A")} */}
                DD-MM-YYYY HH:MM:SS A
              </b>
            </span>
            <span>
              Payment:{" "}
              <b>
                {this.props.patient_profile !== undefined
                  ? this.props.patient_profile[0].payment_type === "I"
                    ? "Insurance"
                    : "Self"
                  : ""}
              </b>
            </span>
          </div>

          <div className="moreAction">
            <button type="button" className="btn btn-outline-secondary btn-sm">
              <img src={require("../../common/BreadCrumb/images/print.png")} />
            </button>
          </div>
        </div>
        {/* Patient Info Top Band End */}

        <div className="row margin-top-15">
          <div className="col-lg-4 portlet portlet-bordered box-shadow-normal">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">OP Encounter List</h3>
              </div>
            </div>
            <div className="portlet-body">
              <AlgaehDataGrid
                id="index"
                columns={[
                  {
                    fieldName: "index",
                    label: "Sl. No."
                  },
                  {
                    fieldName: "c_d_t",
                    label: "Consult Date & Time"
                  },
                  {
                    fieldName: "doc_name",
                    label: "Doctor Name"
                  }
                ]}
                keyId="index"
                dataSource={{
                  data: [
                    {
                      c_d_t: "May 22 13:00:00",
                      doc_name: "Norman John",
                      index: "1"
                    },
                    {
                      c_d_t: "May 23 13:00:00",
                      doc_name: "John Morgan",
                      index: "2"
                    }
                  ]
                }}
                isEditable={false}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onDelete: row => {},
                  onEdit: row => {},
                  onDone: row => {}
                }}
              />
            </div>
          </div>
          <div className="col-lg-8 portlet portlet-bordered box-shadow-normal">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">OP Encounter Details</h3>
              </div>
            </div>
            <div className="portlet-body">Encounter Detail grid comes here</div>
          </div>
        </div>
      </div>
    );
  }
}

export default PatientMRD;
