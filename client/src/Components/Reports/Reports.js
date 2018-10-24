import React, { Component } from "react";
import "./reports.css";
import { AlagehFormGroup, AlgaehDateHandler } from "../Wrapper/algaehWrapper";
import moment from "moment";
class Reports extends Component {
  render() {
    return (
      <div className="reports">
        <div className="row inner-top-search">
          <form>
            <div className="row padding-10">
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Filter Report by Categories",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "",
                  value: "",
                  others: {
                    type: "number"
                  },
                  events: {}
                }}
              />

              <div className="col-lg-1">
                <button
                  style={{
                    cursor: "pointer",
                    fontSize: " 1.4rem",
                    margin: " 24px 0 0",
                    padding: 0,
                    background: "none",
                    border: "none"
                  }}
                  type="submit"
                  className="fas fa-search fa-2x"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="portlet portlet-bordered box-shadow-normal ">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Report List</h3>
            </div>
          </div>
          <div className="portlet-body">
            <ul className="reportList_Ul">
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
              <li>
                <i className="fas fa-file-medical-alt" />
                <span>Appointment Availability Report</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Reports;
