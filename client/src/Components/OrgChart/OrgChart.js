import React, { Component } from "react";
import "./OrgChart.css";
import EmployeeView from "./EmployeeView/EmployeeView";
import DepartmentView from "./DepartmentView/DepartmentView";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";

import { AlgaehLabel } from "../Wrapper/algaehWrapper";
export default class OrgChart extends Component {
  constructor(props) {
    super(props);
    this.state = { pageDisplay: "DepartmentView" };
  }

  // componentDidMount() {
  //   this.getAllDepartments();
  // }

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
    this.setState(
      {
        pageDisplay: specified
      },
      () => {
        if (this.state.pageDisplay !== "Department View") {
          this.clearState("allDepartments");
        }
      }
    );
  }

  getAllDepartments() {
    algaehApiCall({
      uri: "/department/get",
      method: "GET",
      module: "masterSettings",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ allDepartments: response.data.records });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getSubForDept(id) {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      module: "masterSettings",
      // data: {
      //   department_id: id
      // },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({ subDept: res.data.records });
        }
      },
      onFailure: res => {
        swalMessage({
          title: res.message,
          type: "error"
        });
      }
    });
  }

  clearState = name => {
    this.setState({
      [name]: []
    });
  };

  render() {
    return (
      <div className="orgChartUI">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"DepartmentView"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Department View"
                    }}
                  />
                }
              </li>{" "}
              <li
                algaehtabs={"EmployeeView"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Employee View"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="orgChart-section">
          {this.state.pageDisplay === "EmployeeView" ? (
            <EmployeeView />
          ) : this.state.pageDisplay === "DepartmentView" ? (
            <DepartmentView
              dept={this.state.allDepartments}
              subDept={this.state.subDept}
              clearState={this.clearState}
              getSubDept={this.getSubForDept.bind(this)}
              getDept={this.getAllDepartments.bind(this)}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
