import React, { useState } from "react";
import "./bulkTimeSheet.html.css";
import { EmployeeFilter } from "../../../common/EmployeeFilter";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";

export default function BulkTimeSheet(props) {
  return (
    <div id="bulkManualTimeSheet">
      <EmployeeFilter
        loadFunc={result => {
          debugger;

          console.log("result", result);
        }}
      />

      <div className="portlet portlet-bordered margin-top-15">
        <div className="portlet-title">
          <div className="caption">
            <label className="label">Selected Employee</label>
          </div>
          <div className="actions" />
        </div>
        <div className="portlet-body bulkTimeSheetPreviewCntr">
          <table id="bulkTimeSheetPreview">
            <thead>
              <tr>
                <th>Emp Name & Code</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
                <th>Day 1</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <small>EMP0001</small>
                  <span>Aboobacker Sidhiqe</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>

                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
                <td>
                  <small>HO</small>
                  <span>9hr</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              //disabled={this.state.time_sheet.length === 0}
              type="button"
              className="btn btn-primary"
              //onClick={this.postTimeSheet.bind(this)}
            >
              <AlgaehLabel
                label={{ forceLabel: "Process", returnText: true }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
