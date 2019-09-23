import React, { Component } from "react";

import "./EmployeeView.scss";

export default function EmployeeView(props) {
  return (
    <div className="EmployeeOrgView">
      <div className="row">
        <div className="col-12">
          <ul className="eachShelf">
            <li className="eachChild">
              <span className="childCount">121</span>
              <span className="imgSection">
                <img src="" />
              </span>
              <span className="contentSection">
                <small>Employee Code</small>
                <h1>Employee Name</h1>
                <p>Designation</p>
                <p>Sub Department</p>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
