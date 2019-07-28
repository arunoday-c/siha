import React, { Component } from "react";

import "./DepartmentView.css";
export default class DepartmentView extends Component {
  render() {
    return (
      <div className="DepartmentOrgView">
        <div className="row">
          <div className="col-12">
            <ul className="ulSuperParent">
              <li className="liSuperChild">
                <small>Employee Code</small>
                <h1>Employee Name</h1>
                <p>Designation</p>
                <p>Department</p>
                <p>Sub Department</p>
                <ul className="ulParent">
                  <li className="liChild">
                    <small>Employee Code</small>
                    <h1>Employee Name</h1>
                    <p>Designation</p>
                    <p>Department</p>
                    <p>Sub Department</p>
                  </li>{" "}
                  <li className="liChild">
                    <small>Employee Code</small>
                    <h1>Employee Name</h1>
                    <p>Designation</p>
                    <p>Department</p>
                    <p>Sub Department</p>
                  </li>{" "}
                  <li className="liChild">
                    <small>Employee Code</small>
                    <h1>Employee Name</h1>
                    <p>Designation</p>
                    <p>Department</p>
                    <p>Sub Department</p>
                  </li>{" "}
                  <li className="liChild">
                    <small>Employee Code</small>
                    <h1>Employee Name</h1>
                    <p>Designation</p>
                    <p>Department</p>
                    <p>Sub Department</p>
                  </li>{" "}
                  <li className="liChild">
                    <small>Employee Code</small>
                    <h1>Employee Name</h1>
                    <p>Designation</p>
                    <p>Department</p>
                    <p>Sub Department</p>
                  </li>{" "}
                  <li className="liChild">
                    <small>Employee Code</small>
                    <h1>Employee Name</h1>
                    <p>Designation</p>
                    <p>Department</p>
                    <p>Sub Department</p>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
