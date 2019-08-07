import React, { Component, createContext } from "react";
import "./OrgChart.css";
import { EmployeeView, DepartmentView } from ".";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";

import { AlgaehLabel } from "../Wrapper/algaehWrapper";
export default class OrgChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "DepartmentView",
      allBranches: [],
      reqDepts: []
    };
  }

  componentDidMount() {
    this.getBranchMaster();
  }

  getBranchMaster() {
    algaehApiCall({
      uri: "/branchMaster/getDepartmentsChart",
      method: "GET",
      module: "masterSettings",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            allBranches: response.data.records
          });
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getDeptForBranch(id) {
    algaehApiCall({
      uri: "/branchMaster/getBranchWiseDepartments",
      method: "GET",
      module: "masterSettings",
      data: {
        hospital_id: id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            reqDepts: res.data.records
          });
        } else {
          swalMessage({
            title: res.data.records.message,
            type: "warning"
          });
        }
      },
      onError: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

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
          this.clearState("deptData");
        }
      }
    );
  }

  clearState = name => {
    this.setState({
      [name]: []
    });
  };

  chartFuncs = () => ({
    clearState: this.clearState.bind(this),
    getDeptForBranch: this.getDeptForBranch.bind(this)
  });

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
              allBranches={this.state.allBranches}
              reqDepts={this.state.reqDepts}
              api={this.chartFuncs()}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
