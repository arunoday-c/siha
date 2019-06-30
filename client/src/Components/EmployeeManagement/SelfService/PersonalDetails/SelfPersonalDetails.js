import React, { Component } from "react";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import AlgaehFile from "../../../Wrapper/algaehFileUpload";
import "./PersonalDetails.css";
import {
  algaehApiCall,
  swalMessage,
  dateFomater
} from "../../../../utils/algaehApiCall";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import swal from "sweetalert2";
import moment from "moment";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";

class SelfPersonalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editContainer: false,
      idTypes: [],
      employee_expc: [],
      employee_edu: [],
      family_details: []
    };

    this.getFamilyDetails();
    this.getIdDetails();
    this.getIdTypes();
    this.getEmployeeWorkExp();
    this.getEmployeeEducation();
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

  dateDiff(startdate, enddate) {
    var startdateMoment = moment(startdate);
    var enddateMoment = moment(enddate);

    if (
      startdateMoment.isValid() === true &&
      enddateMoment.isValid() === true
    ) {
      var years = enddateMoment.diff(startdateMoment, "years");
      var months = enddateMoment.diff(startdateMoment, "months") - years * 12;
      startdateMoment.add(years, "years").add(months, "months");

      this.setState({
        experience_years: years,
        experience_months: months
      });
    }
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  componentDidMount() {
    let data = this.props.empData !== null ? this.props.empData : {};
    this.setState(data);
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandle(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  showEditCntr(type, empData, e) {
    switch (type) {
      case "basicDetails":
        this.setState({ editBasic: !this.state.editBasic, ...empData });
        break;

      case "familyDetails":
        this.setState({ addFamily: !this.state.addFamily, ...empData });
        break;

      case "IdDetails":
        this.setState({ addIdDetails: !this.state.addIdDetails, ...empData });
        break;

      case "addWorkExp":
        this.setState({ addWorkExp: !this.state.addWorkExp, ...empData });
        break;

      case "addEdu":
        this.setState({ addEdu: !this.state.addEdu, ...empData });
        break;

      case "addAttach":
        this.setState({ addAttach: !this.state.addAttach, ...empData });
        break;

      default:
        break;
    }
  }

  changeGridDate(row, selDate, name) {
    row[name] = moment(selDate).format("YYYY-MM-DD");
    row.update();
  }

  addEmployeeEducation(type) {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='edu-grid'",
      onSuccess: () => {
        algaehApiCall({
          uri: "/employee/addEmployeeEducation",
          module: "hrManagement",
          data: {
            employee_id: this.state.hims_d_employee_id,
            qualification: this.state.qualification,
            qualitfication_type: this.state.qualitfication_type,
            year: this.state.pass_out_year,
            university: this.state.university
          },
          method: "POST",
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Added Successfully",
                type: "success"
              });

              if (type === "SC") {
                this.setState({
                  addEdu: false,
                  qualification: null,
                  qualitfication_type: null,
                  pass_out_year: null,
                  university: null
                });
              } else if (type === "S") {
                this.setState({
                  qualification: null,
                  qualitfication_type: null,
                  pass_out_year: null,
                  university: null
                });
              }

              this.getEmployeeEducation();
            }
          },
          onFailure: err => {}
        });
      }
    });
  }

  updateEmployeeEdu(data) {
    algaehApiCall({
      uri: "/employee/updateEmployeeEducation",
      module: "hrManagement",
      method: "PUT",
      data: {
        employee_id: data.employee_id,
        qualification: data.qualification,
        qualitfication_type: data.qualitfication_type,
        year: data.year,
        university: data.university,
        hims_d_employee_education_id: data.hims_d_employee_education_id
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });
          this.getEmployeeEducation();
        }
      },
      onFailure: err => {}
    });
  }
  updateEmployeeWorkExperience(data) {
    algaehApiCall({
      uri: "/employee/updateEmployeeWorkExperience",
      module: "hrManagement",
      method: "PUT",
      data: {
        employee_id: data.employee_id,
        previous_company_name: data.previous_company_name,
        from_date: data.from_date,
        to_date: data.to_date,
        designation: data.designation,
        experience_years: data.experience_years,
        experience_months: data.experience_months,
        hims_d_employee_experience_id: data.hims_d_employee_experience_id
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });
          this.getEmployeeWorkExp();
        }
      },
      onFailure: err => {}
    });
  }

  deleteEmployeeEdu(data) {
    swal({
      title:
        "Are you sure you want to remove " +
        data.qualification +
        " from the education ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/employee/deleteEmployeeEducation",
          module: "hrManagement",
          data: {
            hims_d_employee_education_id: data.hims_d_employee_education_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });
              this.getEmployeeEducation();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.message,
                type: "error"
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }
  deleteEmpWrkExp(data) {
    swal({
      title:
        "Are you sure you want to remove " +
        data.previous_company_name +
        " from the experience ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/employee/deleteEmployeeWorkExperience",
          module: "hrManagement",
          data: {
            hims_d_employee_experience_id: data.hims_d_employee_experience_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });
              this.getEmployeeWorkExp();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.message,
                type: "error"
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  getEmployeeEducation() {
    algaehApiCall({
      uri: "/employee/getEmployeeEducation",
      module: "hrManagement",
      data: {
        employee_id: this.state.hims_d_employee_id
      },
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employee_edu: res.data.records
          });
        }
      },
      onFailure: err => {}
    });
  }

  getEmployeeWorkExp() {
    algaehApiCall({
      uri: "/employee/getEmployeeWorkExperience",
      module: "hrManagement",
      data: {
        employee_id: this.state.hims_d_employee_id
      },
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employee_expc: res.data.records
          });
        }
      },
      onFailure: err => {}
    });
  }

  addEmployeeWorkExperience(type) {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='wrk-exp-grid'",
      onSuccess: () => {
        algaehApiCall({
          uri: "/employee/addEmployeeWorkExperience",
          module: "hrManagement",
          data: {
            employee_id: this.state.hims_d_employee_id,
            previous_company_name: this.state.previous_company_name,
            from_date: this.state.from_date,
            to_date: this.state.to_date,
            designation: this.state.prev_designation,
            experience_years: this.state.experience_years,
            experience_months: this.state.experience_months
          },
          method: "POST",

          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Added Successfully",
                type: "success"
              });

              if (type === "SC") {
                this.setState({
                  addWorkExp: false,
                  from_date: null,
                  previous_company_name: null,
                  to_date: null,
                  prev_designation: null,
                  experience_years: null,
                  experience_months: null
                });
              } else if (type === "S") {
                this.setState({
                  previous_company_name: null,
                  from_date: null,
                  to_date: null,
                  prev_designation: null,
                  experience_years: null,
                  experience_months: null
                });
              }

              this.getEmployeeWorkExp();
            }
          },
          onFailure: err => {}
        });
      }
    });
  }

  addEmployeeIdentification(type) {
    //emp-idnfn-div

    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='emp-idnfn-div'",
      onSuccess: () => {
        algaehApiCall({
          uri: "/selfService/addEmployeeIdentification",
          method: "POST",
          module: "hrManagement",
          data: {
            employee_id: this.state.hims_d_employee_id,
            identity_documents_id: this.state.identity_documents_id,
            identity_number: this.state.identity_number,
            valid_upto: this.state.valid_upto,
            issue_date: this.state.issue_date,
            alert_required: this.state.alert_required,
            alert_date: this.state.alert_date
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Records Added Successfully",
                type: "success"
              });
              if (type === "SC") {
                this.setState({
                  addIdDetails: false,
                  identity_documents_id: null,
                  identity_number: null,
                  valid_upto: null,
                  issue_date: null
                });
              } else if (type === "S") {
                this.setState({
                  identity_documents_id: null,
                  identity_number: null,
                  valid_upto: null,
                  issue_date: null
                });
              }
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
    });
  }

  addEmployeeDependents(type) {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='emp-dep-div'",
      onSuccess: () => {
        algaehApiCall({
          uri: "/selfService/addEmployeeDependentDetails",
          method: "POST",
          module: "hrManagement",
          data: {
            employee_id: this.state.hims_d_employee_id,
            dependent_type: this.state.dependent_type,
            dependent_name: this.state.dependent_name,
            dependent_identity_type: this.state.dependent_identity_type,
            dependent_identity_no: this.state.dependent_identity_no
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Records Added Successfully",
                type: "success"
              });
              if (type === "SC") {
                this.setState({
                  addFamily: false,
                  dependent_type: null,
                  dependent_name: null,
                  dependent_identity_type: null,
                  dependent_identity_no: null
                });
              } else if (type === "S") {
                this.setState({
                  dependent_type: null,
                  dependent_name: null,
                  dependent_identity_type: null,
                  dependent_identity_no: null
                });
              }
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
    });
  }

  deleteEmployeeDependentDetails(data) {
    swal({
      title:
        "Are you sure you want to remove " +
        data.dependent_name +
        " from the dependents ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/selfService/deleteEmployeeDependentDetails",
          data: {
            hims_d_employee_dependents_id: data.hims_d_employee_dependents_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });
              this.getFamilyDetails();
            } else if (!response.data.records.success) {
              swalMessage({
                title: response.data.records.message,
                type: "error"
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }
  deleteIdDetails(data) {
    swal({
      title:
        "Are you sure you want to delete " + data.identity_document_name + " ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/employee/deleteEmployeeIdentification",
          data: {
            hims_d_employee_identification_id:
              data.hims_d_employee_identification_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });
              this.getIdDetails();
            } else if (!response.data.records.success) {
              swalMessage({
                title: response.data.records.message,
                type: "error"
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  updateEmployeeBasicDetails() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='emp-basic-div'",
      onSuccess: () => {
        algaehApiCall({
          uri: "/selfService/updateEmployeeBasicDetails",
          method: "PUT",
          module: "hrManagement",
          data: {
            full_name: this.state.full_name,
            arabic_name: this.state.arabic_name,
            date_of_birth: this.state.date_of_birth,
            sex: this.state.sex,
            present_address: this.state.present_address,
            permanent_address: this.state.permanent_address,
            primary_contact_no: this.state.primary_contact_no,
            email: this.state.email,
            hims_d_employee_id: this.state.hims_d_employee_id
          },
          onSuccess: res => {
            if (res.data.success) {
              document.getElementById("ep-dl").click();
              this.setState({
                editBasic: false
              });
              swalMessage({
                title: "Record updated successfully",
                type: "success"
              });
            }
          },
          onFailure: err => {}
        });
      }
    });
  }

  getFamilyDetails() {
    algaehApiCall({
      uri: "/selfService/getEmployeeDependentDetails",
      method: "GET",
      module: "hrManagement",
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
      module: "hrManagement",
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
      module: "masterSettings",
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
      module: "hrManagement",
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
      module: "hrManagement",
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
      <div className="SelfPersonalDetails">
        <div className="row">
          <div className="col-7">
            <div className="portlet portlet-bordered margin-bottom-15">
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
            <div className="portlet portlet-bordered margin-bottom-15">
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
                    onClick={this.showEditCntr.bind(
                      this,
                      "basicDetails",
                      empDetails
                    )}
                  >
                    <i
                      className={
                        this.state.editBasic ? "fas fa-times" : "fas fa-pen"
                      }
                    />
                  </a>
                </div>
              </div>
              {this.state.editBasic ? (
                <div
                  className={
                    "col-12 editFloatCntr animated  " +
                    (this.state.editBasic ? "slideInUp" : "slideOutDown") +
                    " faster"
                  }
                  data-validate="emp-basic-div"
                >
                  <h5>Edit Basic Details</h5>
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Full Name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "full_name",
                        value: this.state.full_name,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "1"
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
                        name: "arabic_name",
                        value: this.state.arabic_name,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "2"
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
                        name: "date_of_birth",
                        others: {
                          tabIndex: "3"
                        }
                      }}
                      events={{
                        onChange: selDate => {
                          this.setState({
                            date_of_birth: selDate
                          });
                        }
                      }}
                      value={this.state.date_of_birth}
                      maxDate={new Date()}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Gender",
                        isImp: true
                      }}
                      selector={{
                        name: "sex",
                        className: "select-fld",
                        value: this.state.sex,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.EMP_FORMAT_GENDER
                        },
                        onChange: this.dropDownHandle.bind(this)
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
                        name: "primary_contact_no",
                        value: this.state.primary_contact_no,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          type: "number"
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
                        name: "email",
                        value: this.state.email,
                        events: {
                          onChange: this.changeTexts.bind(this)
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
                        name: "present_address",
                        value: this.state.present_address,
                        events: {
                          onChange: this.changeTexts.bind(this)
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
                        name: "permanent_address",
                        value: this.state.permanent_address,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <button
                        onClick={this.updateEmployeeBasicDetails.bind(this)}
                        type="button"
                        className="btn btn-primary"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={this.showEditCntr.bind(this, "basicDetails")}
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
            <div className="portlet portlet-bordered margin-bottom-15">
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
                    onClick={this.showEditCntr.bind(
                      this,
                      "familyDetails",
                      empDetails
                    )}
                  >
                    <i
                      className={
                        this.state.addFamily ? "fas fa-times" : "fas fa-plus"
                      }
                    />
                  </a>
                </div>
              </div>
              {this.state.addFamily ? (
                <div
                  className={
                    "col-12 editFloatCntr animated  " +
                    (this.state.addFamily ? "slideInUp" : "slideOutDown") +
                    " faster"
                  }
                  data-validate="emp-dep-div"
                >
                  <h5>Add Family Details</h5>
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Dependent Type",
                        isImp: true
                      }}
                      selector={{
                        name: "dependent_type",
                        className: "select-fld",
                        value: this.state.dependent_type,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.DEPENDENT_TYPE
                        },
                        onChange: this.dropDownHandle.bind(this),
                        others: {
                          // tabIndex: "10"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Dependent Name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "dependent_name",
                        value: this.state.dependent_name,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          //tabIndex: "1"
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Id Type",
                        isImp: true
                      }}
                      selector={{
                        name: "dependent_identity_type",
                        className: "select-fld",
                        value: this.state.dependent_identity_type,
                        dataSource: {
                          textField: "identity_document_name",
                          valueField: "hims_d_identity_document_id",
                          data: this.state.idTypes
                        },
                        onChange: this.dropDownHandle.bind(this),
                        others: {
                          //tabIndex: "1"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Id Number",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.dependent_identity_no,
                        className: "txt-fld",
                        name: "dependent_identity_no",

                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          //   tabIndex: "7"
                        }
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <button
                        onClick={this.addEmployeeDependents.bind(this, "S")}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        onClick={this.addEmployeeDependents.bind(this, "SC")}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save and Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={this.showEditCntr.bind(this, "familyDetails")}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="selfService_FamilyTable_Cntr">
                    <AlgaehDataGrid
                      id="selfServiceFamilyTable"
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
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                textBox={{
                                  className: "txt-fld",
                                  name: "dependent_name",
                                  value: row.dependent_name,
                                  others: {
                                    tabIndex: "3"
                                  },
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  }
                                }}
                              />
                            );
                          }
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
                        onDelete: this.deleteEmployeeDependentDetails.bind(
                          this
                        ),
                        onDone: this.editDependentDetails.bind(this)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered margin-bottom-15">
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
                  <a
                    className="btn btn-other btn-circle active"
                    onClick={this.showEditCntr.bind(
                      this,
                      "IdDetails",
                      empDetails
                    )}
                  >
                    <i
                      className={
                        this.state.addIdDetails ? "fas fa-times" : "fas fa-plus"
                      }
                    />
                  </a>
                </div>
              </div>

              {this.state.addIdDetails ? (
                <div
                  className={
                    "col-12 editFloatCntr animated  " +
                    (this.state.addIdDetails ? "slideInUp" : "slideOutDown") +
                    " faster"
                  }
                  data-validate="emp-idnfn-div"
                >
                  <h5>Add ID Details</h5>
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Id Type",
                        isImp: true
                      }}
                      selector={{
                        name: "identity_documents_id",
                        className: "select-fld",
                        value: this.state.identity_documents_id,
                        dataSource: {
                          textField: "identity_document_name",
                          valueField: "hims_d_identity_document_id",
                          data: this.state.idTypes
                        },
                        onChange: this.dropDownHandle.bind(this),
                        others: {
                          tabIndex: "1"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Id Number",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.identity_number,
                        className: "txt-fld",
                        name: "identity_number",

                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "2",
                          placeholder: "",
                          type: "number"
                        }
                      }}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-3" }}
                      label={{
                        forceLabel: "Issue Date",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "issue_date",
                        others: {
                          tabIndex: "3"
                        }
                      }}
                      events={{
                        onChange: selDate => {
                          this.setState({
                            issue_date: moment(selDate).format("YYYY-MM-DD")
                          });
                        }
                      }}
                      value={this.state.issue_date}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-3" }}
                      label={{
                        forceLabel: "Expiry Date",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "valid_upto",
                        others: {
                          tabIndex: "4"
                        }
                      }}
                      events={{
                        onChange: selDate => {
                          this.setState({
                            valid_upto: moment(selDate).format("YYYY-MM-DD")
                          });
                        }
                      }}
                      value={this.state.valid_upto}
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <button
                        onClick={this.addEmployeeIdentification.bind(this, "S")}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        onClick={this.addEmployeeIdentification.bind(
                          this,
                          "SC"
                        )}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save and Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={this.showEditCntr.bind(this, "IdDetails")}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

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
                          editorTemplate: row => {
                            return (
                              <AlgaehDateHandler
                                textBox={{
                                  className: "txt-fld hidden",
                                  name: "issue_date"
                                }}
                                events={{
                                  onChange: selDate => {
                                    row["valid_upto"] = dateFomater(selDate);
                                    row.update();
                                  }
                                }}
                                value={row.valid_upto}
                              />
                            );
                          },
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
                        onDelete: this.deleteIdDetails.bind(this),
                        onDone: this.updateIdDetails.bind(this)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered margin-bottom-15">
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
                  <a
                    onClick={this.showEditCntr.bind(
                      this,
                      "addWorkExp",
                      empDetails
                    )}
                    className="btn btn-other btn-circle active"
                  >
                    <i
                      className={
                        this.state.addWorkExp ? "fas fa-times" : "fas fa-plus"
                      }
                    />
                  </a>
                </div>
              </div>
              {this.state.addWorkExp ? (
                <div
                  className={
                    "col-12 editFloatCntr animated  " +
                    (this.state.addWorkExp ? "slideInUp" : "slideOutDown") +
                    " faster"
                  }
                  data-validate="wrk-exp-grid"
                >
                  <h5>Add Work Experience</h5>
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Previous Company Name",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.previous_company_name,
                        className: "txt-fld",
                        name: "previous_company_name",

                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "1"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Designation",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.prev_designation,
                        className: "txt-fld",
                        name: "prev_designation",

                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "2"
                        }
                      }}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-3" }}
                      label={{
                        forceLabel: "From Date",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "from_date",
                        others: {
                          tabIndex: "3"
                        }
                      }}
                      events={{
                        onChange: selDate => {
                          this.setState(
                            {
                              from_date: moment(selDate).format("YYYY-MM-DD")
                            },
                            () => {
                              if (this.state.to_date !== undefined) {
                                this.dateDiff(
                                  this.state.from_date,
                                  this.state.to_date
                                );
                              }
                            }
                          );
                        }
                      }}
                      value={this.state.from_date}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-3" }}
                      label={{
                        forceLabel: "To Date",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "to_date",
                        others: {
                          tabIndex: "4"
                        }
                      }}
                      events={{
                        onChange: selDate => {
                          this.setState(
                            {
                              to_date: moment(selDate).format("YYYY-MM-DD")
                            },
                            () => {
                              if (this.state.from_date !== undefined) {
                                this.dateDiff(
                                  this.state.from_date,
                                  this.state.to_date
                                );
                              }
                            }
                          );
                        }
                      }}
                      value={this.state.to_date}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Experience in Years",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.experience_years,
                        className: "txt-fld",
                        name: "experience_years",

                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "5",
                          type: "number"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Experience in Months",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.experience_months,
                        className: "txt-fld",
                        name: "experience_months",

                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "6"
                        }
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <button
                        onClick={this.addEmployeeWorkExperience.bind(this, "S")}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        onClick={this.addEmployeeWorkExperience.bind(
                          this,
                          "SC"
                        )}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save and Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={this.showEditCntr.bind(
                          this,
                          "addWorkExp",
                          empDetails
                        )}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="portlet-body">
                <div className="row">
                  <div
                    className="col-12"
                    id="selfService_WorkExpTable_Cntr"
                    data-validate="WrkExpGrd"
                  >
                    <AlgaehDataGrid
                      id="WrkExpGrd"
                      datavalidate="data-validate='WrkExpGrd'"
                      columns={[
                        {
                          fieldName: "previous_company_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Company Name" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "previous_company_name",
                                  value: row.previous_company_name,
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage: "Name - cannot be blank",
                                    required: true
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "designation",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Designation" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "designation",
                                  value: row.designation,
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage:
                                      "Designation - cannot be blank",
                                    required: true
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "from_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "From Date" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlgaehDateHandler
                                textBox={{
                                  className: "txt-fld",
                                  name: "from_date"
                                }}
                                events={{
                                  onChange: this.changeGridDate.bind(this, row)
                                }}
                                value={row.from_date}
                                maxDate={new Date()}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "to_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "To Date" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlgaehDateHandler
                                textBox={{
                                  className: "txt-fld",
                                  name: "to_date"
                                }}
                                events={{
                                  onChange: this.changeGridDate.bind(this, row)
                                }}
                                value={row.to_date}
                                maxDate={new Date()}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "experience_years",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Year of Exp." }}
                            />
                          )
                        },
                        {
                          fieldName: "experience_months",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Months of Exp." }}
                            />
                          )
                        }
                      ]}
                      keyId="hims_d_employee_experience_id"
                      dataSource={{
                        data: this.state.employee_expc
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: this.deleteEmpWrkExp.bind(this),
                        onDone: this.updateEmployeeWorkExperience.bind(this)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered margin-bottom-15">
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
                  <a
                    onClick={this.showEditCntr.bind(this, "addEdu", empDetails)}
                    className="btn btn-other btn-circle active"
                  >
                    <i
                      className={
                        this.state.addEdu ? "fas fa-times" : "fas fa-plus"
                      }
                    />
                  </a>
                </div>
              </div>
              {this.state.addEdu ? (
                <div
                  className={
                    "col-12 editFloatCntr animated  " +
                    (this.state.addEdu ? "slideInUp" : "slideOutDown") +
                    " faster"
                  }
                  data-validate="edu-grid"
                >
                  <h5>Add Education</h5>
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Qualification",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.qualification,
                        className: "txt-fld",
                        name: "qualification",
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "1"
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Qualification Type",
                        isImp: true
                      }}
                      selector={{
                        name: "qualitfication_type",
                        className: "select-fld",
                        value: this.state.qualitfication_type,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.QULFN_TYP
                        },
                        onChange: this.dropDownHandle.bind(this),
                        others: {
                          tabIndex: "2"
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Passout Year",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.pass_out_year,
                        className: "txt-fld",
                        name: "pass_out_year",

                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "3",
                          type: "number"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "University",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.university,
                        className: "txt-fld",
                        name: "university",

                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "4"
                        }
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <button
                        onClick={this.addEmployeeEducation.bind(this, "S")}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        onClick={this.addEmployeeEducation.bind(this, "SC")}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save and Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={this.showEditCntr.bind(
                          this,
                          "addEdu",
                          empDetails
                        )}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="portlet-body">
                <div className="row">
                  <div
                    className="col-12"
                    id="selfService_EducationTable_Cntr"
                    data-validate="qual-grid"
                  >
                    <AlgaehDataGrid
                      is="qualificationGrid"
                      columns={[
                        {
                          fieldName: "qualification",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Qualification" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "qualification",
                                  value: row.qualification,
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
                          fieldName: "qualitfication_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Qualitfication Type" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.qualitfication_type === "FT"
                                  ? "Full Time"
                                  : row.qualitfication_type === "PT"
                                  ? "Part Time"
                                  : null}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{ className: "col" }}
                                selector={{
                                  name: "qualitfication_type",
                                  className: "select-fld",
                                  value: row.qualitfication_type,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.QULFN_TYP
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
                          fieldName: "year",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Year of Passout" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "year",
                                  value: row.year,
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage: "Field cannot be blank",
                                    required: true,
                                    type: "number"
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "university",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "University" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "university",
                                  value: row.university,
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
                      keyId="hims_d_employee_education_id"
                      dataSource={{
                        data: this.state.employee_edu
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: this.deleteEmployeeEdu.bind(this),
                        onDone: this.updateEmployeeEdu.bind(this)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-5">
            <div className="EmployeeImgEdit">
              <AlgaehFile
                name="attach_photo"
                accept="image/*"
                textAltMessage={empDetails.full_name}
                showActions={true}
                serviceParameters={{
                  uniqueID: empDetails.employee_code,
                  destinationName: empDetails.employee_code,
                  fileType: "Employees"
                }}
              />
            </div>

            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Attachments Details</h3>
                </div>
                <div className="actions">
                  <a
                    onClick={this.showEditCntr.bind(
                      this,
                      "addAttach",
                      empDetails
                    )}
                    className="btn btn-other btn-circle active"
                  >
                    <i
                      className={
                        this.state.addAttach ? "fas fa-times" : "fas fa-plus"
                      }
                    />
                  </a>
                </div>
              </div>

              {this.state.addAttach ? (
                <div
                  className={
                    "col-12 editFloatCntr animated  " +
                    (this.state.addAttach ? "slideInUp" : "slideOutDown") +
                    " faster"
                  }
                  data-validate="attach-grid"
                >
                  <h5>Upload Attachment</h5>
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Attachment Name",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.qualification,
                        className: "txt-fld",
                        name: "AttachmentName",
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "1"
                        }
                      }}
                    />{" "}
                    <AlagehFormGroup
                      div={{ className: "col-4" }}
                      label={{
                        forceLabel: "Attachment File",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.attachment,
                        className: "txt-fld",
                        name: "AttachmentFile",
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          tabIndex: "2",
                          type: "file"
                        }
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <button
                        // onClick={this.addEmployeeEducation.bind(this, "S")}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        //   onClick={this.addEmployeeEducation.bind(this, "SC")}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save and Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={this.showEditCntr.bind(
                          this,
                          "addAttach",
                          empDetails
                        )}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="selfService_AttachmentTable_Cntr">
                    <AlgaehDataGrid
                      id="documentGrid"
                      columns={[
                        {
                          fieldName: "documentName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Document Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "download_open_file",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Open Attachment" }}
                            />
                          )
                        }
                      ]}
                      //  keyId="hims_d_employee_attachment_id"
                      dataSource={
                        {
                          //    data: this.state.employee_attach
                        }
                      }
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={
                        {
                          //onEdit: () => {},
                          // onDelete: this.deleteEmployeeAttach.bind(this),
                          // onDone: this.updateEmployeeAttach.bind(this)
                        }
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Change Password</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Enter Old Password",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "password"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "New Password",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "password"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Confirm New Password",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "password"
                      }
                    }}
                  />
                  <div className="col-12">
                    <button
                      className="btn btn-primary"
                      style={{ float: "right", marginLeft: 15 }}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-default"
                      style={{ float: "right", marginLeft: 15 }}
                    >
                      Clear
                    </button>
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

export default SelfPersonalDetails;
