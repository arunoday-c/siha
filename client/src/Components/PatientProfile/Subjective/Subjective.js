import React, { Component } from "react";
import "./subjective.css";
import Button from "@material-ui/core/Button";
import { AlgaehDataGrid, AlgaehLabel } from "../../Wrapper/algaehWrapper";

const AllergyData = [
  { food: "grapes/citrus", active: "Yes" },
  { food: "Pollen", active: "Yes" },
  { food: "Iodine", active: "Yes" }
];

class Subjective extends Component {
  render() {
    return (
      <div className="subjective row">
        <div className="card col-lg-8 box-shadow-normal left-pane">
          <div className="row">
            <div className="col-lg-11">Chief Complaints</div>

            <div className="col-lg-1 float-right">
              <Button mini variant="fab" color="primary">
                <i className="fas fa-plus" />
              </Button>
            </div>
          </div>

          <AlgaehDataGrid
            id="complaint-grid"
            columns={[
              {
                fieldName: "status",
                label: <AlgaehLabel label={{ fieldName: "status" }} />
              }
            ]}
            keyId="patient_id"
            dataSource={{
              data:
                this.props.mydaylist === undefined ? [] : this.props.mydaylist
            }}
            isEditable={true}
            paging={{ page: 0, rowsPerPage: 5 }}
            events={{
              onDelete: row => {},
              onEdit: row => {},
              onDone: row => {}
            }}
          />
        </div>

        <div className="card box-shadow-normal col-lg-4 right-pane">
          Allergies
          <AlgaehDataGrid
            id="patient_chart_grd"
            columns={[
              {
                fieldName: "food",
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
                fieldName: "active",
                label: "Active"
              }
            ]}
            keyId="code"
            dataSource={{
              data: AllergyData
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
      </div>
    );
  }
}

export default Subjective;
