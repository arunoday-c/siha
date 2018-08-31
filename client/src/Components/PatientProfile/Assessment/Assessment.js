import React, { Component } from "react";
import "./assessment.css";
import { AlgaehLabel, AlgaehDataGrid } from "../../Wrapper/algaehWrapper";
import Button from "@material-ui/core/Button";

const AllergyData = [
  { food: "grapes/citrus", active: "Yes" },
  { food: "Pollen", active: "Yes" },
  { food: "Iodine", active: "Yes" }
];

class Assessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "Orders",
      sidBarOpen: true
    };
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
      <div className="assessment">
        <div className="col-lg-12">
          <div className="row margin-top-15">
            <div className="col-lg-6">
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-30">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Initial Diagnosis</h3>
                  </div>
                  <div className="actions">
                    <Button style={{ backgroundColor: "#D5D5D5" }} size="small">
                      Add to Final Diagnosis
                    </Button>

                    <a
                      href="javascript:;"
                      className="btn btn-primary btn-circle active"
                    >
                      <i className="fas fa-plus" />
                    </a>
                  </div>
                </div>
                <div className="portlet-body">
                  <h4>
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
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-30">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Final Diagnosis</h3>
                  </div>
                  <div className="actions">
                    <a
                      href="javascript:;"
                      className="btn btn-primary btn-circle active"
                    >
                      <i className="fas fa-plus" />
                    </a>
                  </div>
                </div>
                <div className="portlet-body">
                  <h4>
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
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12 margin-top-15">
            <div className="tab-container toggle-section">
              <ul className="nav">
                <li
                  algaehtabs={"Orders"}
                  style={{ marginRight: 2 }}
                  className={"nav-item tab-button active"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Orders"
                      }}
                    />
                  }
                </li>
                <li
                  style={{ marginRight: 2 }}
                  algaehtabs={"Packages"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Packages"
                      }}
                    />
                  }
                </li>
                <li
                  style={{ marginRight: 2 }}
                  algaehtabs={"LabResults"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Lab Results"
                      }}
                    />
                  }
                </li>
                <li
                  style={{ marginRight: 2 }}
                  algaehtabs={"RisResults"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "RIS Results"
                      }}
                    />
                  }
                </li>
                <li
                  algaehtabs={"AssesmentsNotes"}
                  style={{ marginRight: 2 }}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Assesments Notes"
                      }}
                    />
                  }
                </li>
              </ul>
            </div>
            <div className="grid-section">
              {this.state.pageDisplay === "Orders"
                ? "Orders"
                : this.state.pageDisplay === "Packages"
                  ? "Packages"
                  : this.state.pageDisplay === "LabResults"
                    ? "Lab Results"
                    : this.state.pageDisplay === "RisResults"
                      ? "Ris Results"
                      : this.state.pageDisplay === "AssesmentsNotes"
                        ? "Assesments Notes"
                        : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Assessment;
