import React, { Component } from "react";
import "./subjective.css";
import Button from "@material-ui/core/Button";
import { AlgaehDataGrid, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import Modal from "@material-ui/core/Modal";

const AllergyData = [
  { food: "grapes/citrus", active: "Yes" },
  { food: "Pollen", active: "Yes" },
  { food: "Iodine", active: "Yes" }
];

class Subjective extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openComplain: false
    };

    this.addChiefComplain = this.addChiefComplain.bind(this);
    this.addAllergies = this.addAllergies.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  addChiefComplain() {
    this.setState({ openComplain: true });
  }
  addAllergies() {
    alert("Add Allergies");
  }

  handleClose() {
    this.setState({ openComplain: false });
  }

  render() {
    return (
      <div className="subjective row">
        {/* Chief Complain Modal Start */}
        <Modal
          style={{
            margin: "auto"
          }}
          open={this.state.openComplain}
          // onClose={this.handleClose.bind(this)}
        >
          <div className="algaeh-modal">
            <div className="row popupHeader">
              <h4>Add Chief Complaint</h4>
            </div>
            <div className="col-lg-12 popupInner"> </div>

            <div className="row popupFooter">
              <div className="col-lg-12">
                <Button
                  variant="raised"
                  color="secondary"
                  style={{ backgroundColor: "#24B256" }}
                  // onClick={this.addScanDetails.bind(this)}
                  size="small"
                >
                  Save
                </Button>
                <Button
                  variant="raised"
                  onClick={this.handleClose}
                  style={{ backgroundColor: "#D5D5D5" }}
                  size="small"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Chief Complain Modal End */}

        <div className="card col-lg-8 box-shadow-normal left-pane">
          <div className="row">
            <div className="col-lg-11">Chief Complaints</div>

            <div className="col-lg-1 float-right">
              <Button
                mini
                variant="fab"
                color="primary"
                onClick={this.addChiefComplain}
              >
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
          <div className="row">
            <div className="col-lg-11">Allergies</div>

            <div className="col-lg-1 float-right">
              <Button
                mini
                variant="fab"
                color="primary"
                onClick={this.addAllergies}
              >
                <i className="fas fa-plus" />
              </Button>
            </div>
          </div>

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
