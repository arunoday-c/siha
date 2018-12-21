import React, { Component } from "react";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import "./dashboard.css";

class Dashboard extends Component {
  scrollToPosition(e) {
    const selectedId = e.target.parentElement.id;
    const _element = this[selectedId];
    if (_element !== undefined) {
      const _scrollDiv = document.getElementById("hisapp");
      _scrollDiv.scrollIntoView({ behavior: "smooth" });
      _scrollDiv.scrollTop = _element.offsetTop;
    }
  }

  render() {
    return (
      <div className="dashboard">
        <div className="row">
          <div className="col-2">
            <ul
              className="selfServiceProfileMenu"
              onClick={this.scrollToPosition.bind(this)}
            >
              <li id="basicDetails">
                <span>Basic Details</span>
              </li>
              <li id="offcialDetails">
                <span>Offical Details</span>
              </li>
              <li id="familyDetails">
                <span>Family Details</span>
              </li>
              <li id="identificationDetails">
                <span>Identification Details</span>
              </li>
              <li id="workExperianceDetails">
                <span>Work Experience</span>
              </li>
              <li id="educationDetails">
                <span>Education Details</span>
              </li>
            </ul>
          </div>
          <div className="col-10">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div
                  className="caption"
                  ref={c => {
                    this.basicDetails = c;
                  }}
                >
                  <h3 className="caption-subject">Basic Details</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-other btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "First Name"
                      }}
                    />
                    <h6>Syed Adil</h6>
                  </div>
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Middle Name"
                      }}
                    />
                    <h6>Fawad</h6>
                  </div>
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Last/ Surname"
                      }}
                    />
                    <h6>Nizami</h6>
                  </div>
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Arabic Full Name"
                      }}
                    />
                    <h6>سيد عادل فواد نيزامى</h6>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Date of Birth"
                      }}
                    />
                    <h6>22/09/1985</h6>
                  </div>
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Gender"
                      }}
                    />
                    <h6>Male</h6>
                  </div>{" "}
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Mobile"
                      }}
                    />
                    <h6>+971 78345633</h6>
                  </div>{" "}
                  <div className="col-4">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Personal Email"
                      }}
                    />
                    <h6>fawadnizami898@gmail.com</h6>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-6">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Present Address"
                      }}
                    />
                    <h6>
                      Sheikh Mohammed Bin Rashed Boulevard Downtown Dubai, PO
                      Box 123234 Dubai, UAE
                    </h6>
                  </div>
                  <div className="col-6">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Permenet Address"
                      }}
                    />
                    <h6>
                      No.136/1, 8th Cross Rd, N Block, Govindapura, Nagawara,
                      Bengaluru, Karnataka 560045
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div
                  className="caption"
                  ref={c => {
                    this.offcialDetails = c;
                  }}
                >
                  <h3 className="caption-subject">Offical Details</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-other btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Employee Code"
                      }}
                    />
                    <h6>EMP0000123</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Designation"
                      }}
                    />
                    <h6>Specialist</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Department"
                      }}
                    />
                    <h6>General Medicine</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Reporting To"
                      }}
                    />
                    <h6>Abdulrahman Fahmy</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div
                className="portlet-title"
                ref={c => {
                  this.familyDetails = c;
                }}
              >
                <div className="caption">
                  <h3 className="caption-subject">Family Details</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-other btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div
                  className="caption"
                  ref={c => {
                    this.identificationDetails = c;
                  }}
                >
                  <h3 className="caption-subject">Identification Details</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-other btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div
                  className="caption"
                  data-position="workExperianceDetails"
                  ref={c => {
                    this.workExperianceDetails = c;
                  }}
                >
                  <h3 className="caption-subject">Work Experience</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-other btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div
                  className="caption"
                  data-position="educationDetails"
                  ref={c => {
                    this.educationDetails = c;
                  }}
                >
                  <h3 className="caption-subject">Education Details</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-other btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Relieving Date"
                      }}
                    />
                    <h6>DD/MM/YYYY</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
