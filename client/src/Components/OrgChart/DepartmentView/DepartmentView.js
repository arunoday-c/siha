import React, { Component } from "react";

import "./DepartmentView.css";
export default class EmployeeView extends Component {
  render() {
    return (
      <div className="DepartmentOrgView">
        <div className="row">
          <div className="col-12">
            <ul className="eachShelf">
              <li className="eachChild">
                <span className="childCount">121</span>
                <span className="imgSection">
                  <i>12</i>
                </span>
                <span className="contentSection">
                  <h1>Employee Name</h1>
                </span>
              </li>
            </ul>{" "}
            <ul className="eachShelf">
              <li className="eachChild">
                <span className="childCount">121</span>
                <span className="imgSection">
                  <i>12</i>
                </span>
                <span className="contentSection">
                  <h1>Department Name</h1>
                </span>
              </li>
            </ul>{" "}
            <ul className="eachShelf">
              <li className="eachChild">
                <span className="childCount">121</span>
                <span className="imgSection">
                  <i>12</i>
                </span>
                <span className="contentSection">
                  <h1>Employee Name</h1>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
