import React, { Component } from "react";
import "./physical_examination.scss";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";

class PhysicalExamination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pe_type: "A",
      code: "",
      codeError: false,
      codeErrorText: "",
      name: "",
      nameError: false,
      nameErrorText: ""
    };
  }

  changeStatus(row, status) {
    this.setState({ pe_type: status.value });
  }

  texthandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  add(e) {
    e.preventDefault();

    if (this.state.code.length === 0) {
      this.setState({ codeError: true, codeErrorText: "Code cannot be empty" });
    } else if (this.state.name.length === 0) {
      this.setState({ nameError: true, nameErrorText: "Code cannot be empty" });
    } else {
      // console.log("Added");
      //Do the Api Call here
    }
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
                    <AlagehFormGroup
                      div={{ className: "col-4" }}
                      label={{
                        fieldName: "code",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "code",
                        value: this.state.code,
                        events: {
                          onChange: this.texthandle.bind(this)
                        },
                        error: this.state.codeError,
                        helperText: this.state.codeErrorText
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-8" }}
                      label={{
                        fieldName: "name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "name",
                        value: this.state.name,
                        events: {
                          onChange: this.texthandle.bind(this)
                        },
                        error: this.state.nameError,
                        helperText: this.state.nameErrorText
                      }}
                    />
                    <div
                      className="col-9 customRadio"
                      style={{ paddingTop: 22 }}
                    >
                      <label className="radio inline">
                        <input
                          type="radio"
                          name="insured"
                          value="1"
                          checked={this.state.radioYes}
                          //onChange="null"
                        />
                        <span>General</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          name="insured"
                          value="2"
                          checked={this.state.radioNo}
                          //onChange={radioChange.bind(this, this)}
                        />
                        <span>Specific</span>
                      </label>
                    </div>

                    <div className="col">
                      <button
                        className="btn btn-primary"
                        onClick={this.add.bind(this)}
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
                      {
                        fieldName: "code",
                        label: "Code",
                        disabled: true,
                        others: {
                          maxWidth: 120
                        }
                      },
                      {
                        fieldName: "name",
                        label: "Name"
                      },
                      {
                        fieldName: "examinationType",
                        label: "Type"
                      }
                    ]}
                    keyId="code"
                    dataSource={{
                      data:
                        this.props.visatypes === undefined
                          ? []
                          : this.props.visatypes
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={
                      {
                        // onDelete: this.deleteVisaType.bind(this),
                        // onEdit: row => {},
                        // onDone: row => {
                        //   alert(JSON.stringify(row));
                        // }
                        // onDone: this.updateVisaTypes.bind(this)
                      }
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4 row-card">
              <h6>Examination Description</h6>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-4" }}
                      label={{
                        fieldName: "code",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "code",
                        value: this.state.code,
                        events: {
                          onChange: this.texthandle.bind(this)
                        },
                        error: this.state.codeError,
                        helperText: this.state.codeErrorText
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-8" }}
                      label={{
                        fieldName: "name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "name",
                        value: this.state.name,
                        events: {
                          onChange: this.texthandle.bind(this)
                        },
                        error: this.state.nameError,
                        helperText: this.state.nameErrorText
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-9" }}
                      label={{
                        fieldName: "select_exmn_type",
                        isImp: true
                      }}
                      selector={{
                        name: "hims_d_sub_department_id",
                        className: "select-fld",
                        value: "",
                        dataSource: {
                          textField: "sub_department_name",
                          valueField: "hims_d_sub_department_id",
                          data: this.state.depts
                        },
                        onChange: null
                      }}
                    />

                    <div className="col">
                      <button
                        className="btn btn-primary"
                        onClick={this.add.bind(this)}
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
                      {
                        fieldName: "code",
                        label: "Code",
                        disabled: true,
                        others: {
                          maxWidth: 120
                        }
                      },
                      {
                        fieldName: "name",
                        label: "Name"
                      },
                      {
                        fieldName: "examinationDescType",
                        label: "Type"
                      }
                    ]}
                    keyId="code"
                    dataSource={{
                      data:
                        this.props.visatypes === undefined
                          ? []
                          : this.props.visatypes
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={
                      {
                        // onDelete: this.deleteVisaType.bind(this),
                        // onEdit: row => {},
                        // onDone: row => {
                        //   alert(JSON.stringify(row));
                        // }
                        // onDone: this.updateVisaTypes.bind(this)
                      }
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4 row-card">
              <h6>Examination Categories</h6>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        fieldName: "code",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "code",
                        value: this.state.code,
                        events: {
                          onChange: this.texthandle.bind(this)
                        },
                        error: this.state.codeError,
                        helperText: this.state.codeErrorText
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-7" }}
                      label={{
                        fieldName: "name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "name",
                        value: this.state.name,
                        events: {
                          onChange: this.texthandle.bind(this)
                        },
                        error: this.state.nameError,
                        helperText: this.state.nameErrorText
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-9" }}
                      label={{
                        fieldName: "select_exmn_desc",
                        isImp: true
                      }}
                      selector={{
                        name: "hims_d_sub_department_id",
                        className: "select-fld",
                        value: "",
                        dataSource: {
                          textField: "sub_department_name",
                          valueField: "hims_d_sub_department_id",
                          data: this.state.depts
                        },
                        onChange: null
                      }}
                    />
                    <div className="col">
                      <button
                        className="btn btn-primary"
                        onClick={this.add.bind(this)}
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
                      {
                        fieldName: "code",
                        label: "Code",
                        disabled: true,
                        others: {
                          maxWidth: 120
                        }
                      },
                      {
                        fieldName: "examinationDesc",
                        label: "Name"
                      },
                      {
                        fieldName: "examinationCategoriesType",
                        label: "Description"
                      }
                    ]}
                    keyId="code"
                    dataSource={{
                      data:
                        this.props.visatypes === undefined
                          ? []
                          : this.props.visatypes
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={
                      {
                        // onDelete: this.deleteVisaType.bind(this),
                        // onEdit: row => {},
                        // onDone: row => {
                        //   alert(JSON.stringify(row));
                        // }
                        // onDone: this.updateVisaTypes.bind(this)
                      }
                    }
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
