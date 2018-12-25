import React, { Component } from "react";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import "./dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editContainer: false
    };
  }
  scrollToPosition(e) {
    const selectedId = e.target.parentElement.id;
    const _element = this[selectedId];
    if (_element !== undefined) {
      const _scrollDiv = document.getElementById("hisapp");
      _scrollDiv.scrollIntoView({ behavior: "smooth" });
      _scrollDiv.scrollTop = _element.offsetTop;
    }
  }
  showEditCntr(e) {
    debugger;
    this.setState({ editContainer: !this.state.editContainer });
    // e.target.parentElement.parentElement;
    // e.target.parentElement.parentElement.nextElementSibling.classList.contains("editFloatCntr")
  }

  render() {
    return (
      <div className="dashboard">
        <div className="row">
          <div className="col">
            <ul
              className="selfServiceProfileMenu box-shadow-normal"
              onClick={this.scrollToPosition.bind(this)}
            >
              <li id="offcialDetails">
                <span>Offical Details</span>
              </li>
              <li id="basicDetails">
                <span />
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
          <div className="col-6">
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
                <div className="actions" />
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
                  <a
                    className="btn btn-other btn-circle active"
                    onClick={this.showEditCntr.bind(this)}
                  >
                    <i
                      className={
                        this.state.editContainer ? "fas fa-times" : "fas fa-pen"
                      }
                    />
                  </a>
                </div>
              </div>
              {this.state.editContainer ? (
                <div
                  className={
                    "col-12 editFloatCntr animated  " +
                    (this.state.editContainer ? "slideInUp" : "slideInDown") +
                    " faster"
                  }
                >
                  <h5>Edit </h5>
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "First Name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        //decimal: { allowNegative: false },
                        name: "",
                        value: "",
                        events: {
                          //  onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          // type: "number"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Arabic Name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        //decimal: { allowNegative: false },
                        name: "",
                        value: "",
                        events: {
                          //  onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          // type: "number"
                        }
                      }}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col margin-bottom-15" }}
                      label={{
                        forceLabel: "Date of Birth",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "date_of_joining",
                        others: {
                          tabIndex: "6"
                        }
                      }}
                      maxDate={new Date()}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Gender",
                        isImp: true
                      }}
                      selector={{
                        name: "",
                        className: "select-fld",
                        value: "",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: ""
                        }
                        //  onChange: this.dropDownHandler.bind(this)
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Mobile No.",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        //decimal: { allowNegative: false },
                        name: "",
                        value: "",
                        events: {
                          //  onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          // type: "number"
                        }
                      }}
                    />
                  </div>

                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Email Address",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        //decimal: { allowNegative: false },
                        name: "",
                        value: "",
                        events: {
                          //  onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          // type: "number"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Present Address",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        //decimal: { allowNegative: false },
                        name: "",
                        value: "",
                        events: {
                          //  onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          // type: "number"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Permenet Address",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        //decimal: { allowNegative: false },
                        name: "",
                        value: "",
                        events: {
                          //  onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          // type: "number"
                        }
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <button type="button" className="btn btn-primary">
                        Update
                      </button>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={this.showEditCntr.bind(this)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="portlet-body">
                <div className="row">
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Name"
                      }}
                    />
                    <h6>Syed Adil</h6>
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
                  <div className="col-4 employeeEmail">
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
                  <a
                    className="btn btn-other btn-circle active"
                    onClick={this.showEditCntr.bind(this)}
                  >
                    <i
                      className={
                        this.state.editContainer
                          ? "fas fa-times"
                          : "fas fa-plus"
                      }
                    />
                  </a>
                </div>
              </div>

              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="selfService_FamilyTable_Cntr">
                    <AlgaehDataGrid
                      columns={[
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Memeber Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Relationship Type" }}
                            />
                          )
                        }
                      ]}
                      keyId="hims_d_employee_group_id"
                      dataSource={{
                        data: []
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: () => {},
                        onDone: () => {}
                      }}
                    />
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
                    <i className="fas fa-plus" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div
                    className="col-12"
                    id="selfService_IdentificationTable_Cntr"
                  >
                    <AlgaehDataGrid
                      columns={[
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "ID Type" }} />
                          )
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "ID No." }} />
                          )
                        }
                      ]}
                      keyId="hims_d_employee_group_id"
                      dataSource={{
                        data: []
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: () => {},
                        onDone: () => {}
                      }}
                    />
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
                    <i className="fas fa-plus" />
                  </a>
                </div>
              </div>

              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="selfService_WorkExpTable_Cntr">
                    <AlgaehDataGrid
                      columns={[
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Company Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Designation" }}
                            />
                          )
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Year of Exp." }}
                            />
                          )
                        }
                      ]}
                      keyId="hims_d_employee_group_id"
                      dataSource={{
                        data: []
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: () => {},
                        onDone: () => {}
                      }}
                    />
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
                    <i className="fas fa-plus" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="selfService_EducationTable_Cntr">
                    <AlgaehDataGrid
                      columns={[
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Instituation Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Education Type" }}
                            />
                          )
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Year of Passout" }}
                            />
                          )
                        }
                      ]}
                      keyId="hims_d_employee_group_id"
                      dataSource={{
                        data: []
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: () => {},
                        onDone: () => {}
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div
                  className="caption"
                  // ref={c => {
                  //   this.basicDetails = c;
                  // }}
                >
                  <h3 className="caption-subject">Attachments Details</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-other btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div>
              </div>
              <div className="portlet-body" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
