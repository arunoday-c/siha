import React, { Component } from "react";
import "./plan.css";
import { AlgaehLabel, AlgaehDataGrid } from "../../Wrapper/algaehWrapper";

const AllergyData = [
  { food: "grapes/citrus", active: "Yes" },
  { food: "Pollen", active: "Yes" },
  { food: "Iodine", active: "Yes" }
];

class Plan extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "OrderMedication", sidBarOpen: true };
  }

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
    this.setState({
      pageDisplay: specified
    });
  }

  render() {
    return (
      <div className="plan">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-8">
              <div className="tab-container toggle-section">
                <ul className="nav">
                  <li
                    algaehtabs={"OrderMedication"}
                    style={{ marginRight: 2 }}
                    className={"nav-item tab-button active"}
                    onClick={this.openTab.bind(this)}
                  >
                    {
                      <AlgaehLabel
                        label={{
                          forceLabel: "Order Medication"
                        }}
                      />
                    }
                  </li>
                  <li
                    style={{ marginRight: 2 }}
                    algaehtabs={"ActiveMedication"}
                    className={"nav-item tab-button"}
                    onClick={this.openTab.bind(this)}
                  >
                    {
                      <AlgaehLabel
                        label={{
                          forceLabel: "Active Medication"
                        }}
                      />
                    }
                  </li>
                  <li
                    style={{ marginRight: 2 }}
                    algaehtabs={"MedicationHistory"}
                    className={"nav-item tab-button"}
                    onClick={this.openTab.bind(this)}
                  >
                    {
                      <AlgaehLabel
                        label={{
                          forceLabel: "Medication History"
                        }}
                      />
                    }
                  </li>
                  <li
                    algaehtabs={"OwnMedication"}
                    style={{ marginRight: 2 }}
                    className={"nav-item tab-button"}
                    onClick={this.openTab.bind(this)}
                  >
                    {
                      <AlgaehLabel
                        label={{
                          forceLabel: "Own Medication"
                        }}
                      />
                    }
                  </li>
                </ul>
              </div>
              <div className="grid-section">
                {/*  {<this.state.pageDisplay />} */}

                {this.state.pageDisplay === "OrderMedication" ? (
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
                ) : this.state.pageDisplay === "ActiveMedication" ? (
                  "Active Medication"
                ) : this.state.pageDisplay === "MedicationHistory" ? (
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
                ) : this.state.pageDisplay === "OwnMedication" ? (
                  "Own Medication"
                ) : null}
              </div>
            </div>
            <div className="col-lg-4">Follow Up</div>
          </div>

          <div className="row">
            <div className="col-lg-4">Diet Advice</div>
            <div className="col-lg-4"> Refer To</div>
            <div className="col-lg-4">Patient Alert</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Plan;
