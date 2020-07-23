import React, { Component } from "react";
import "./physical_examination.scss";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
class PhysicalExamination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // pe_type: "A",
      examination_type: "",
      sub_department_id: null,
      examinationType: [],

      description: "",
      // nameError: false,
      // nameErrorText: "",
      physical_examination_header_id: "",

      EDname: "",
      // EDnameError: false,
      // EDnameErrorText: "",
      examDescription: [],
      physical_examination_details_id: "",

      ECname: "",
      // ECnameError: false,
      // ECnameErrorText: "",
      examCategory: [],
    };
  }
  componentDidMount() {
    this.getExaminationTypes();
    this.getExaminationDesc();
    this.getExaminationCategory();
  }
  // changeStatus(row, status) {
  //   this.setState({ pe_type: status.value });
  // }
  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }
  // add(e) {
  //   e.preventDefault();

  //   if (this.state.code.length === 0) {
  //     this.setState({ codeError: true, codeErrorText: "Code cannot be empty" });
  //   } else if (this.state.name.length === 0) {
  //     this.setState({ nameError: true, nameErrorText: "Code cannot be empty" });
  //   } else {
  //     // console.log("Added");
  //     //Do the Api Call here
  //   }
  // }
  radioChange = (e) => {
    let examination_type = "G";
    if (e.target.value === "S") {
      examination_type = "S";
    }
    this.setState({
      radio: examination_type,
    });
  };
  dropDownHandle = (e) => {
    this.setState({
      physical_examination_header_id:
        e.selected.hims_d_physical_examination_header_id,
    });
  };
  dropDownHandleForCategory = (e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({ [name]: value });
  };
  descriptionTextHandle(e) {
    this.setState({
      EDname: e.target.value,
    });
  }
  texthandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  getExaminationTypes = () => {
    algaehApiCall({
      uri: "/workBenchSetup/getExaminationType",
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            examinationType: response.data.records,
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  resetSaveState = () => {
    this.setState({
      description: "",
      physical_examination_header_id: "",
      EDname: "",
      physical_examination_details_id: "",
      examination_type: "G",
      ECname: "",
    });
  };
  getExaminationDesc = () => {
    algaehApiCall({
      uri: "/workBenchSetup/getExaminationDescription",
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            examDescription: response.data.records,
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  getExaminationCategory = () => {
    algaehApiCall({
      uri: "/workBenchSetup/getExaminationCategory",
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            examCategory: response.data.records,
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  addExamDesc = (e) => {
    e.preventDefault();

    if (!this.state.EDname) {
      swalMessage({
        type: "warning",
        title: "Name Cannot be Empty",
      });
      return;
    }
    if (!this.state.physical_examination_header_id) {
      swalMessage({
        type: "warning",
        title: "Please Select PhysicalExamination",
      });
      return;
    }
    algaehApiCall({
      uri: "/workBenchSetup/addExaminationDescription",
      method: "POST",
      data: {
        physical_examination_header_id: this.state
          .physical_examination_header_id,
        description: this.state.EDname,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success",
          });
          this.resetSaveState();
          this.getExaminationDesc();
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  updateExamDesc = (data) => {
    algaehApiCall({
      uri: "/workBenchSetup/updateExaminationDescription",
      method: "PUT",
      data: {
        physical_examination_header_id: data.physical_examination_header_id,
        description: data.descr,
        hims_d_physical_examination_details_id:
          data.hims_d_physical_examination_details_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });
          this.getExaminationDesc();
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };

  addExaminationCategory = (e) => {
    e.preventDefault();
    if (!this.state.ECname) {
      swalMessage({
        type: "warning",
        title: "Please Select the Category",
      });
      return;
    }
    if (!this.state.physical_examination_details_id) {
      swalMessage({
        type: "warning",
        title: "Please Select Examination Description",
      });
      return;
    }

    algaehApiCall({
      uri: "/workBenchSetup/addExaminationCategory",
      method: "POST",
      data: {
        physical_examination_details_id: this.state
          .physical_examination_details_id,
        description: this.state.ECname,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success",
          });
          this.resetSaveState();
          this.getExaminationCategory();
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  updateExamCategory = (data) => {
    algaehApiCall({
      uri: "/workBenchSetup/updateExaminationCategory",
      method: "PUT",
      data: {
        physical_examination_details_id: data.physical_examination_details_id,
        description: data.ecDescr,
        hims_d_physical_examination_subdetails_id:
          data.hims_d_physical_examination_subdetails_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });
          this.getExaminationCategory();
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  addExaminationType = (e) => {
    e.preventDefault();

    if (!this.state.description) {
      swalMessage({
        type: "warning",
        title: "Description Cannot be Empty",
      });
      return;
    }
    if (!this.state.examination_type) {
      swalMessage({
        type: "warning",
        title: "Please Select General or Specific ",
      });
      return;
    }
    algaehApiCall({
      uri: "/workBenchSetup/addExaminationType",
      method: "POST",
      data: {
        examination_type: this.state.examination_type,
        description: this.state.description,
        sub_department_id: this.state.sub_department_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success",
          });
          this.resetSaveState();
          this.getExaminationTypes();
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  editExaminationType(data) {
    algaehApiCall({
      uri: "/workBenchSetup/updateExaminationType",
      method: "PUT",
      data: {
        examination_type: data.examination_type,
        description: data.description,
        sub_department_id: data.sub_department_id,
        hims_d_physical_examination_header_id:
          data.hims_d_physical_examination_header_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });
          this.getExaminationTypes();
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  render() {
    return (
      <div className="physical_examination">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 row-card">
              <h6>Examination Type</h6>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row">
                    {/* <AlagehFormGroup
                      div={{ className: "col-4" }}
                      label={{
                        fieldName: "code",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "code",
                        value: this.state.code,
                        events: {
                          onChange: this.texthandle.bind(this),
                        },
                        error: this.state.codeError,
                        helperText: this.state.codeErrorText,
                      }}
                    /> */}

                    <AlagehFormGroup
                      div={{ className: "col-8" }}
                      label={{
                        fieldName: "description",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "description",
                        value: this.state.description,
                        events: {
                          onChange: this.texthandle.bind(this),
                        },
                        error: this.state.nameError,
                        helperText: this.state.nameErrorText,
                      }}
                    />
                    <div
                      className="col-9 customRadio"
                      style={{ paddingTop: 22 }}
                    >
                      <label className="radio inline">
                        <input
                          type="radio"
                          // name=""
                          value="G"
                          checked={this.state.radio === "G" ? true : false}
                          onChange={this.radioChange}
                        />
                        <span>General</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          name="insured"
                          value="S"
                          checked={this.state.radio === "S" ? true : false}
                          onChange={this.radioChange}
                        />
                        <span>Specific</span>
                      </label>
                    </div>

                    <div className="col">
                      <button
                        className="btn btn-primary"
                        onClick={this.addExaminationType}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12" id="examinationTypeGridCntr">
                  <AlgaehDataGrid
                    id="examinationTypeGrid"
                    columns={[
                      // {
                      //   fieldName: "code",
                      //   label: "Code",
                      //   disabled: true,
                      //   others: {
                      //     maxWidth: 120,
                      //   },
                      // },
                      {
                        fieldName: "description",
                        label: "Description",
                        displayTemplate: (row) => {
                          return row.description;
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col-8" }}
                              textBox={{
                                className: "txt-fld",
                                name: "description",
                                value: row.description,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                error: this.state.nameError,
                                helperText: this.state.nameErrorText,
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "examination_type",
                        label: "Type",
                        displayTemplate: (row) => {
                          return row.examination_type === "G"
                            ? "General"
                            : "Specific";
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "examination_type",
                                className: "select-fld",
                                value: row.examination_type,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: [
                                    { name: "General", value: "G" },
                                    { name: "Specific", value: "S" },
                                  ],
                                },
                                others: {
                                  errormessage: " Method cannot be blank",
                                  required: true,
                                },
                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                    ]}
                    // keyId="code"
                    dataSource={{
                      data: this.state.examinationType,
                    }}
                    isEditable={true}
                    filter={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      // onDelete: this.deleteVisaType.bind(this),
                      // onEdit: this.editExaminationType,
                      // onDone: row => {
                      //   alert(JSON.stringify(row));
                      // }
                      onDone: this.editExaminationType.bind(this),
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4 row-card">
              <h6>Examination Description</h6>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row">
                    {/* <AlagehFormGroup
                      div={{ className: "col-4" }}
                      label={{
                        fieldName: "code",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "code",
                        value: this.state.EDcode,
                        events: {
                          onChange: this.texthandle.bind(this),
                        },
                        error: this.state.EDcodeError,
                        helperText: this.state.EDcodeErrorText,
                      }}
                    /> */}

                    <AlagehFormGroup
                      div={{ className: "col-8" }}
                      label={{
                        fieldName: "Name",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "Edname",
                        value: this.state.EDname,
                        events: {
                          onChange: this.descriptionTextHandle.bind(this),
                        },
                        error: this.state.EDnameError,
                        helperText: this.state.EDnameErrorText,
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-9" }}
                      label={{
                        fieldName: "Select Examination Type",
                        isImp: true,
                      }}
                      selector={{
                        name: "description",
                        className: "select-fld",
                        value: this.state.physical_examination_header_id,
                        dataSource: {
                          textField: "description",
                          valueField: "hims_d_physical_examination_header_id",
                          data: this.state.examinationType,
                        },
                        onChange: this.dropDownHandle.bind(this),
                      }}
                    />

                    <div className="col">
                      <button
                        className="btn btn-primary"
                        onClick={this.addExamDesc.bind(this)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12" id="examinationDescGridCntr">
                  <AlgaehDataGrid
                    id="examinationDescGrid"
                    columns={[
                      // {
                      //   fieldName: "code",
                      //   label: "Code",
                      //   disabled: true,
                      //   others: {
                      //     maxWidth: 120,
                      //   },
                      // },
                      {
                        fieldName: "descr",
                        label: "Name",
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              textBox={{
                                className: "txt-fld",
                                name: "descr",
                                value: row.descr,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                error: this.state.EDnameError,
                                helperText: this.state.EDnameErrorText,
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "description",
                        label: "Examination Type",

                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              selector={{
                                name: "physical_examination_header_id",
                                className: "select-fld",
                                value: row.physical_examination_header_id,
                                dataSource: {
                                  textField: "description",
                                  valueField:
                                    "hims_d_physical_examination_header_id",
                                  data: this.state.examinationType,
                                },
                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                    ]}
                    keyId="code"
                    dataSource={{
                      data: this.state.examDescription,
                    }}
                    isEditable={true}
                    filter={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      // onDelete: this.deleteVisaType.bind(this),
                      onEdit: (row) => {},
                      // onDone: row => {
                      //   alert(JSON.stringify(row));
                      // }
                      onDone: this.updateExamDesc.bind(this),
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4 row-card">
              <h6>Examination Categories</h6>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row">
                    {/* <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        fieldName: "code",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "code",
                        value: this.state.ECcode,
                        events: {
                          onChange: this.texthandle.bind(this),
                        },
                        error: this.state.ECcodeError,
                        helperText: this.state.ECcodeErrorText,
                      }}
                    /> */}

                    {/* <AlagehFormGroup
                      div={{ className: "col-7" }}
                      label={{
                        fieldName: "name",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "name",
                        value: this.state.ECname,
                        events: {
                          onChange: this.texthandle.bind(this),
                        },
                        error: this.state.ECnameError,
                        helperText: this.state.ECnameErrorText,
                      }}
                    /> */}
                    <AlagehAutoComplete
                      div={{ className: "col-9" }}
                      label={{
                        fieldName: "Category Type",
                        isImp: true,
                      }}
                      selector={{
                        name: "ECname",
                        className: "select-fld",
                        value: this.state.ECname,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: [
                            { name: "Normal", value: "Normal" },
                            { name: "AbNormal", value: "AbNormal" },
                          ],
                        },
                        onChange: this.dropDownHandleForCategory.bind(this),
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-9" }}
                      label={{
                        fieldName: "select_exmn_desc",
                        isImp: true,
                      }}
                      selector={{
                        name: "physical_examination_details_id",
                        className: "select-fld",
                        value: this.state.physical_examination_details_id,
                        dataSource: {
                          textField: "descr",
                          valueField: "hims_d_physical_examination_details_id",
                          data: this.state.examDescription,
                        },
                        onChange: this.dropDownHandleForCategory.bind(this),
                      }}
                    />
                    <div className="col">
                      <button
                        className="btn btn-primary"
                        onClick={this.addExaminationCategory.bind(this)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12" id="examinationCategoriesGridCntr">
                  <AlgaehDataGrid
                    id="examinationCategoriesGrid"
                    columns={[
                      // {
                      //   fieldName: "code",
                      //   label: "Code",
                      //   disabled: true,
                      //   others: {
                      //     maxWidth: 120,
                      //   },
                      // },
                      {
                        fieldName: "ecDescr",
                        label: "Name",
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              selector={{
                                name: "ecDescr",
                                className: "select-fld",
                                value: row.ecDescr,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: [
                                    { name: "Normal", value: "Normal" },
                                    { name: "AbNormal", value: "AbNormal" },
                                  ],
                                },
                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "description",
                        label: "Examination Description",
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              selector={{
                                name: "physical_examination_details_id",
                                className: "select-fld",
                                value: row.physical_examination_details_id,
                                dataSource: {
                                  textField: "descr",
                                  valueField:
                                    "hims_d_physical_examination_details_id",
                                  data: this.state.examDescription,
                                },
                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                    ]}
                    keyId="code"
                    dataSource={{
                      data: this.state.examCategory,
                    }}
                    filter={true}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      // onDelete: this.deleteVisaType.bind(this),
                      onEdit: (row) => {},
                      // onDone: row => {
                      //   alert(JSON.stringify(row));
                      // }
                      onDone: this.updateExamCategory.bind(this),
                    }}
                  />
                  {/* Detail Grid2 End */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhysicalExamination;
