import React, { Component } from "react";
import "./patient_chart.css";
import Warning from "@material-ui/icons/Warning";
import { AlgaehDataGrid, Button } from "../../Wrapper/algaehWrapper";

class PatientChart extends Component {
  render() {
    return (
      <div className="patient_chart">
        <div className="patient_demographics">
          <div className="row">
            <div className="col">
              <span>Patient ID </span> : PAT-A-0000273
            </div>
            <div className="col">
              <span>Patient Name </span> : Peter
            </div>
            <div className="col">
              <span>Gender </span> : Male
            </div>
            <div className="col">
              <span>Marital Status </span>: Divorced
            </div>

            <div className="col">
              <span>D.O.B </span> : 20-06-1990
            </div>
            <div className="col">
              <span>Age </span>: 28
            </div>
            <div className="col">
              <span>Mob. no. </span>: 2147483647
            </div>
          </div>

          <div className="row">
            <div className="col">
              <span>BP </span> : 120/90
            </div>
            <div className="col">
              <span>Ht </span> : 170cm
            </div>
            <div className="col">
              <span>Wt </span> : 70 Kg
            </div>
            <div className="col">
              <span>Oral Temp </span>: 37 C
            </div>
            <div className="col">
              <span>Visit Date </span> : 21-07-2018
            </div>
            <div className="col">
              <span>Encounter </span>: 21-07-2018 10:00
            </div>

            <div className="col">
              <span>Nationality </span> : Andorran
            </div>
            <div className="col">
              <Warning style={{ color: "red" }} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col card">
            <label>Chief Complaint : Abnormal Breathing; Anorexia </label>
          </div>
          <div className="col card">
            <label> Allergies :grapes/ citrus; Pollen; iodine;</label>
          </div>
          <div className="col card">
            <label>
              Diagnosis :A00.0 : Cholera due to Vibrio cholerae 01, biovar
              eltor; A01.03 : Typhoid pneumonia;{" "}
            </label>
          </div>
          <div className="col card">
            <label>Diet : </label>
          </div>
        </div>
        <div>
          <AlgaehDataGrid
            id="patient_chart_grd"
            columns={[
              {
                fieldName: "status",
                label: "Chief Complaint",
                disabled: true
              },
              {
                fieldName: "date",
                label: "On Set Date"
              },
              {
                fieldName: "first_name",
                label: "Duration"
              },
              {
                fieldName: "patient_id",
                label: "Interval"
              },
              {
                fieldName: "time",
                label: "Sevirity"
              },
              {
                fieldName: "patient_type",
                label: "Pain"
              },
              {
                fieldName: "patient_id",
                label: "Chronic"
              },
              {
                fieldName: "time",
                label: "ROV Code"
              },
              {
                fieldName: "patient_type",
                label: "ROV Description"
              },
              {
                fieldName: "time",
                label: "Comment"
              },
              {
                fieldName: "patient_type",
                label: "Inactive"
              }
            ]}
            keyId="code"
            dataSource={{
              data:
                this.props.visatypes === undefined ? [] : this.props.visatypes
            }}
            isEditable={false}
            paging={{ page: 0, rowsPerPage: 3 }}
            events={
              {
                // onDelete: this.deleteVisaType.bind(this),
                // onEdit: row => {},
                // onDone: row => {
                //   alert(JSON.stringify(row));
                // }
                // onDone: this.updateVisaTypes.bind(this)
              }
            }
          />
        </div>
        <div className="card-deck" style={{ marginTop: "10px" }}>
          <div className="card">
            <label> History of Present Illness</label>
          </div>
          <div className="card">
            <div>
              <label> Allergies</label>{" "}
            </div>
            <AlgaehDataGrid
              id="patient_chart_grd"
              columns={[
                {
                  fieldName: "status",
                  label: "Food",
                  disabled: true
                },
                {
                  fieldName: "date",
                  label: "On Set Date"
                },
                {
                  fieldName: "first_name",
                  label: "Comment"
                },
                {
                  fieldName: "patient_id",
                  label: "Active"
                }
              ]}
              keyId="code"
              dataSource={{
                data:
                  this.props.visatypes === undefined ? [] : this.props.visatypes
              }}
              isEditable={false}
              paging={{ page: 0, rowsPerPage: 3 }}
              events={
                {
                  // onDelete: this.deleteVisaType.bind(this),
                  // onEdit: row => {},
                  // onDone: row => {
                  //   alert(JSON.stringify(row));
                  // }
                  // onDone: this.updateVisaTypes.bind(this)
                }
              }
            />
          </div>
          <div className="card">
            {" "}
            <label> Review of Systems</label>{" "}
          </div>
        </div>
      </div>
    );
  }
}

export default PatientChart;
