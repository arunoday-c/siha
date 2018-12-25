import React, { Component } from "react";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import "./dashboard.css";
import {
  algaehApiCall,
  swalMessage,
  dateFomater
} from "../../../../utils/algaehApiCall";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import moment from "moment";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editContainer: false,
      idTypes: []
    };

    this.getFamilyDetails();
    this.getIdDetails();
    this.getIdTypes();
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

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  showEditCntr(e) {
    this.setState({ editContainer: !this.state.editContainer });
  }

  getFamilyDetails() {
    algaehApiCall({
      uri: "/selfService/getEmployeeDependentDetails",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            family_details: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }
  getIdDetails() {
    algaehApiCall({
      uri: "/selfService/getEmployeeIdentificationDetails",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            id_details: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  getIdTypes() {
    algaehApiCall({
      uri: "/identity/get",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            idTypes: res.data.records
          });
        }
      },
      onFailure: err => {}
    });
  }

  editDependentDetails(data) {
    algaehApiCall({
      uri: "/selfService/updateEmployeeDependentDetails",
      data: {
        dependent_type: data.dependent_type,
        dependent_name: data.dependent_name,
        dependent_identity_type: data.dependent_identity_type,
        dependent_identity_no: data.dependent_identity_no,
        hims_d_employee_dependents_id: data.hims_d_employee_dependents_id
      },
      method: "PUT",
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record updated Successfully",
            type: "success"
          });
          this.getFamilyDetails();
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  updateIdDetails(data) {
    debugger;
    algaehApiCall({
      uri: "/selfService/updateEmployeeIdentificationDetails",
      data: {
        identity_documents_id: data.identity_documents_id,
        identity_number: data.identity_number,
        valid_upto: data.valid_upto,
        issue_date: data.issue_date,
        alert_required: data.alert_required,
        alert_date: data.alert_date,
        hims_d_employee_identification_id:
          data.hims_d_employee_identification_id
      },
      method: "PUT",
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record updated Successfully",
            type: "success"
          });
          this.getIdDetails();
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  render() {
    let empDetails = this.props.empData ? this.props.empData : {};

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
                <span>Basic Details</span>
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
                    <h6>{empDetails.employee_code}</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Designation"
                      }}
                    />
                    <h6>{empDetails.designation}</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Department"
                      }}
                    />
                    <h6>{empDetails.sub_department_name}</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Reporting To"
                      }}
                    />
                    <h6>
                      {empDetails.reporting_to_name !== null
                        ? empDetails.reporting_to_name
                        : "----------"}
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
                  <h5>Edit Basic Details</h5>
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
                        forceLabel: "Permanent Address",
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
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Name"
                      }}
                    />
                    <h6>{empDetails.full_name}</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Arabic Full Name"
                      }}
                    />
                    <h6>{empDetails.arabic_name}</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Date of Birth"
                      }}
                    />
                    <h6>{empDetails.date_of_birth}</h6>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Gender"
                      }}
                    />
                    <h6>{empDetails.sex}</h6>
                  </div>{" "}
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Mobile"
                      }}
                    />
                    <h6>{empDetails.primary_contact_no}</h6>
                  </div>{" "}
                  <div className="col employeeEmail">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Personal Email"
                      }}
                    />
                    <h6>{empDetails.email}</h6>
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
                    <h6>{empDetails.present_address}</h6>
                  </div>
                  <div className="col-6">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Permenet Address"
                      }}
                    />
                    <h6>{empDetails.permanent_address}</h6>
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
                    // onClick={this.showEditCntr.bind(this)}
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
                          fieldName: "dependent_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Dependent Type" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.dependent_type === "SP"
                                  ? "Spouse"
                                  : row.dependent_type === "FT"
                                  ? "Father"
                                  : row.dependent_type === "MT"
                                  ? "Mother"
                                  : row.dependent_type === "GU"
                                  ? "Guardian"
                                  : row.dependent_type === "SO"
                                  ? "Son"
                                  : row.dependent_type === "DG"
                                  ? "Daughter"
                                  : "------"}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{ className: "col" }}
                                selector={{
                                  name: "dependent_type",
                                  className: "select-fld",
                                  value: row.dependent_type,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.DEPENDENT_TYPE
                                  },
                                  others: {
                                    errormessage: "Field cannot be blank",
                                    required: true
                                  },
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "dependent_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Dependent Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "identity_document_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "ID Card Type" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                selector={{
                                  name: "dependent_identity_type",
                                  className: "select-fld",
                                  value: row.dependent_identity_type,
                                  dataSource: {
                                    textField: "identity_document_name",
                                    valueField: "hims_d_identity_document_id",
                                    data: this.state.idTypes
                                  },
                                  others: {
                                    errormessage: "Field cannot be blank",
                                    required: true
                                  },
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "dependent_identity_no",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "ID Number" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "dependent_identity_no",
                                  value: row.dependent_identity_no,
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage: "Field cannot be blank",
                                    required: true
                                  }
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      keyId="hims_d_employee_dependents_id"
                      dataSource={{
                        data: this.state.family_details
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: () => {},
                        onDone: this.editDependentDetails.bind(this)
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
                      id="identification_grid"
                      columns={[
                        {
                          fieldName: "identity_document_name",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "ID Type" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                selector={{
                                  name: "identity_documents_id",
                                  className: "select-fld",
                                  value: row.identity_documents_id,
                                  dataSource: {
                                    textField: "identity_document_name",
                                    valueField: "hims_d_identity_document_id",
                                    data: this.state.idTypes
                                  },
                                  others: {
                                    errormessage: "Field cannot be blank",
                                    required: true
                                  },
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "identity_number",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "ID No." }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "identity_number",
                                  value: row.identity_number,
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage: "Field cannot be blank",
                                    required: true
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "issue_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Issue Date" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlgaehDateHandler
                                textBox={{
                                  className: "txt-fld hidden",
                                  name: "issue_date"
                                }}
                                events={{
                                  onChange: selDate => {
                                    row["issue_date"] = dateFomater(selDate);
                                    row.update();
                                  }
                                }}
                                value={row.issue_date}
                              />
                            );
                          },
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.issue_date !== null
                                  ? row.issue_date
                                  : "------"}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "valid_upto",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Valid Upto" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.valid_upto !== null
                                  ? row.valid_upto
                                  : "------"}
                              </span>
                            );
                          }
                        }
                      ]}
                      keyId="hims_d_employee_identification_id"
                      dataSource={{
                        data: this.state.id_details
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: () => {},
                        onDone: this.updateIdDetails.bind(this)
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
                              label={{ forceLabel: "Institution Name" }}
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
