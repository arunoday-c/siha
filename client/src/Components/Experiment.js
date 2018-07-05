import React, { Component } from "react";
<<<<<<< HEAD
import { Paper, TextField, InputAdornment } from "material-ui";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import {
=======
// import { Paper, TextField, withStyles } from "@material-ui/core";
// import "../Components/BusinessSetup/DeptMaster/dept.css";
// import IconButton from "material-ui/core/IconButton";
// import { Button } from "material-ui/core";
import moment from "moment";
import { algaehApiCall, SelectFiledData } from "../utils/algaehApiCall";
import {
  getDepartments,
  getSubDepartments
} from "../actions/CommonSetup/Department.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import DeleteIcon from "@material-ui/icons/Delete";
// import EditIcon from "@material-ui/icons/Edit";
// import Done from "@material-ui/icons/Done";
// import CancelIcon from "@material-ui/icons/Cancel";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehDataGrid,
>>>>>>> 03b26bde3a0446d38e8fbf59f660e3caf6e7fc42
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../Components/Wrapper/algaehWrapper";
<<<<<<< HEAD
=======

>>>>>>> 03b26bde3a0446d38e8fbf59f660e3caf6e7fc42
class DeptMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openFinderForm: "d-none",
      definer: "",
      fieldSelectorValue: "",
      fieldSelectorType: "%"
    };
  }
  openFinderFinder = e => {
    if (this.state.openFinderForm === "d-none")
      this.setState({ openFinderForm: "d-block", definer: "dropdown-toggle" });
    else this.setState({ openFinderForm: "d-none", definer: "" });
  };

<<<<<<< HEAD
  decideArraows = () => {
    if (this.state.openFinderForm === "d-block") {
      return <ArrowDropUp />;
    } else {
      return <ArrowDropDown />;
    }
  };

  render() {
    return (
      <Paper>
        <center>
          <div className="col-lg-6">
            <div className="row">
              <div className="form-group next_actions">
                <i className="fas fa-step-backward" />
                <i className="fas fa-chevron-left" />
              </div>
              <div className="form-group col-lg-8">
                <TextField
                  // className={this.state.definer + " form-control"}
                  className="form-control"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={this.openFinderFinder.bind(this)}
                      >
                        {this.decideArraows()}
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <div className="form-group previous_actions">
                <i className="fas fa-chevron-right" />
                <i className="fas fa-step-forward" />
              </div>
              <div className="form-group print_actions">
                <i className="fas fa-search fa-2x" />
              </div>
            </div>
            <div className={this.state.openFinderForm}>
              <Paper>
                <div className="row">
                  <div className="col-lg-6">
                    <AlagehAutoComplete
                      selector={{
                        dataSource: {
                          textField: "text",
                          valueField: "value",
                          data: [
                            {
                              text: "Patient Code",
                              value: "hims_patient_code"
                            },
                            {
                              text: "Patient Name",
                              value: "hims_patient_Name"
                            },
                            { text: "Gender", value: "hims_patient_gender" },
                            { text: "Mobile No", value: "hims_patient_Mobile" }
                          ]
                        },
                        onChange: selector => {
                          this.setState({ fieldSelectorValue: selector.value });
=======
  // selectedDeptType(deptType) {
  //   this.setState({ department_type: deptType });
  // }

  // selectedHeadDept(headDept) {
  //   this.setState({ hims_d_department_id: headDept, department_id: headDept });
  // }

  // changeDeptCode(e) {
  //   this.setState({
  //     department_code: e.target.value,
  //     sub_department_code: e.target.value
  //   });
  // }

  // changeDeptName(e) {
  //   this.setState({ department_name: e.target.value });
  //   this.setState({ department_desc: e.target.value });
  //   this.setState({ sub_department_name: e.target.value });
  //   this.setState({ sub_department_desc: e.target.value });
  // }

  // changeEST(date) {
  //   console.log(date);
  // }

  // sendDate(date) {
  //   return String(moment(date).format("YYYY-MM-DD"));
  // }

  // getFullStatusText({ value }) {
  //   if (value === "A") {
  //     return "Active";
  //   } else if (value === "I") {
  //     return "Inactive";
  //   } else {
  //     return "";
  //   }
  // }

  // changeStatus(e) {
  //   this.setState({
  //     department_status: e.target.value,
  //     sub_department_status: e.target.value
  //   });
  //   if (e.target.value === "A")
  //     this.setState({ checkedActive: true, effective_end_date: "9999-12-31" });
  //   else if (e.target.value === "I") {
  //     this.setState({
  //       checkedInactive: true,
  //       effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
  //     });
  //   }
  // }

  // addBtnClick(e) {
  //   e.preventDefault();

  //   if (
  //     this.state.buttonText === "ADD TO LIST" &&
  //     this.state.department_id.length === 0
  //   ) {
  //     algaehApiCall({
  //       uri: "/department/add",
  //       data: this.state,
  //       onSuccess: response => {
  //         window.location.reload();
  //       },
  //       onFailure: error => {}
  //     });
  //   } else if (
  //     this.state.buttonText === "ADD TO LIST" &&
  //     this.state.department_id.length !== 0
  //   ) {
  //     algaehApiCall({
  //       uri: "/department/add/subdepartment",
  //       data: this.state,
  //       onSuccess: response => {
  //         window.location.reload();
  //       },
  //       onFailure: error => {}
  //     });
  //   } else if (this.state.buttonText === "UPDATE") {
  //     algaehApiCall({
  //       uri: "/department/update",
  //       data: this.state,
  //       onSuccess: response => {},
  //       onFailure: error => {}
  //     });
  //   }
  // }

  // componentDidMount() {
  //   this.props.getDepartments();
  // }

  // commitChanges(rowId) {
  //   // let rows = this.state;
  // }

  // commitSubdeptChanges({ added, changed, deleted }) {
  //   if (added) {
  //   } else if (changed) {
  //   } else if (deleted) {
  //   }
  // }

  // dateFormater({ value }) {
  //   if (value !== null) {
  //     return String(moment(value).format("DD-MM-YYYY"));
  //   } else {
  //     return "";
  //   }
  // }

  // loadSubDeps(dep_id) {
  //   algaehApiCall({
  //     uri: "/department/get/subdepartment?department_id=" + dep_id,
  //     method: "GET",
  //     onSuccess: response => {
  //       if (response.data.success === true) {
  //         this.setState({ subdeps: response.data.records });
  //       } else {
  //         this.setState({ subdeps: [] });
  //       }
  //     },
  //     onFailure: error => {}
  //   });

  //   return this.sd;
  // }

  // RowDetail = ({ row }) => (
  //   <div>
  //     {this.props.getSubDepartments(row.hims_d_department_id)}
  //     <label>SUB DEPARTMENT LIST</label>
  //     <Paper>
  //       <Grid
  //         rows={this.props.subdepartments}
  //         columns={[
  //           { name: "sub_department_code", title: "Sub Dept Code" },
  //           { name: "sub_department_name", title: "Sub Dept Name" },
  //           { name: "effective_start_date", title: "Sub Dept Start Date" },
  //           { name: "effective_end_date", title: "Sub Dept End Date" },
  //           { name: "sub_department_status", title: "Sub Dept Status" }
  //         ]}
  //       >
  //         <DataTypeProvider
  //           formatterComponent={this.dateFormater}
  //           for={["effective_start_date"]}
  //         />

  //         <DataTypeProvider
  //           formatterComponent={this.dateFormater}
  //           for={["effective_end_date"]}
  //         />

  //         <DataTypeProvider
  //           formatterComponent={this.getFullStatusText}
  //           for={["sub_department_status"]}
  //         />

  //         <Table />
  //         <TableHeaderRow />

  //         <EditingState onCommitChanges={this.commitChanges.bind(this)} />
  //         <TableEditRow />
  //         <TableEditColumn
  //           width={120}
  //           showEditCommand
  //           showDeleteCommand
  //           commandComponent={Command}
  //         />
  //       </Grid>
  //     </Paper>
  //   </div>
  // );

  // onDateChange = event => {};

  // DatePickerEditor = ({ value, onchangeEvent }) => (
  //   <div>
  //     <TextField
  //       type="date"
  //       value={moment(value).format("YYYY-MM-DD")}
  //       onChange={this.onDateChange.bind(this)}
  //     />
  //   </div>
  // );
  // DropDownEditor = ({ value }) => (
  //   <SelectField
  //     displayValue={this.state.department_type}
  //     selected={this.selectedDeptType.bind(this)}
  //     children={DEPT_TYPE}
  //   />
  // );
  // changeDateFormat = date => {
  //   if (date != null) {
  //     return moment(date).format("YYYY-MM-DD");
  //   }
  // };

  render() {
    return (
      <div className="dept">
        {/* <Paper Style={{ maxHeight: "200px" }}>
          <AlgaehDataGrid
            columns={[
              {
                fieldName: "department_code",
                label: () => {
                  return (
                    <AlgaehLabel
                      label={{
                        fieldName: "department_code",
                        forceLabel: "Departmet Code"
                      }}
                    />
                  );
                },
                disabled: true
              },
              { fieldName: "department_name", label: "Dept Name" },
              {
                fieldName: "effective_start_date",
                label: "Sub Dept Start Date",
                displayTemplate: row => {
                  return (
                    <span>
                      {this.changeDateFormat(row.effective_start_date)}
                    </span>
                  );
                },
                editorTemplate: (row, callBack) => {
                  return (
                    <AlgaehDateHandler
                      div={{ others: { style: { width: "100%" } } }}
                      textBox={{ className: "txt-fld" }}
                      value={row.effective_start_date}
                      events={{
                        onChange: (selected, mode) => {
                          row["effective_start_date"] = selected;
                          callBack(row);
>>>>>>> 03b26bde3a0446d38e8fbf59f660e3caf6e7fc42
                        }
                      }}
                      value={this.state.fieldSelectorValue}
                    />
                  </div>
                  <div className="col-lg-6">
                    <AlagehAutoComplete
                      selector={{
                        dataSource: {
                          textField: "text",
                          valueField: "value",
                          data: [
                            {
                              text: "Contains",
                              value: "%"
                            },
                            {
                              text: "Equals",
                              value: "="
                            },
                            { text: "Grater Than", value: ">" },
                            { text: "Less Than", value: "<" }
                          ]
                        },
                        onChange: selector => {
                          this.setState({ fieldSelectorType: selector.value });
                        }
                      }}
                      value={this.state.fieldSelectorValue}
                    />
<<<<<<< HEAD
                  </div>
                </div>
                <div className="row">
                  <AlgaehDataGrid />
                </div>
              </Paper>
            </div>
          </div>
        </center>
      </Paper>
=======
                  );
                }
              }
            ]}
            keyField="department_code"
            dataSource={{
              data: this.props.departments
            }}
            isEditable={true}
            paging={{ page: 0, rowsPerPage: 5 }}
            events={{
              onDone: row => {
                alert("done is raisedd");
              }
            }}
            expanded={{
              multiExpand: true,
              detailTemplate: row => {
                return "Hello Mr Nowshadan...";
              }
            }}
            // others={{
            //   className: "testingHeight"
            // }}
          />
        </Paper> */}
        {/* <Paper className="container-fluid">
          <div>
            <div
              className="row"
              style={{
                padding: 20,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <div className="col-lg-3">
                <label>
                  Status <span className="imp">*</span>
                </label>
                <br />
                <input
                  checked={this.state.checkedActive}
                  onChange={this.changeStatus.bind(this)}
                  style={{
                    padding: 8,
                    margin: 8
                  }}
                  type="radio"
                  name="status"
                  value="A"
                />
                <label className="center">Active </label>

                <input
                  checked={this.state.checkedInactive}
                  onChange={this.changeStatus.bind(this)}
                  style={{
                    padding: 8,
                    margin: 8
                  }}
                  type="radio"
                  name="status"
                  value="I"
                />
                <label className="center">Inactive </label>
              </div>

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "department_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "department_code",
                  value: this.state.department_code,
                  events: {
                    onChange: this.changeDeptCode.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "department_name",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "department_name",
                  value: this.state.department_name,
                  events: {
                    onChange: this.changeDeptName.bind(this)
                  }
                }}
              />

              {/* <div className="col-lg-3">
                <label>
                  DEPARTMENT NAME
                  <span style={{ fontSize: 16 }}>(عربى) </span>
                </label>
                <br />
                <TextField className="txt-fld" />
              </div> */}

        {/* <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "department_name",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "department_name",
                  // value: this.state.department_name,
                  events: {
                    //  onChange: this.changeDeptName.bind(this)
                  }
                }}
              />
            </div>

            <div
              className="row"
              style={{
                marginTop: 20,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <AlgaehDateHandler
                div={{ className: "col-lg-3" }}
                label={{ fieldName: "effective_start_date", isImp: true }}
                textBox={{ className: "txt-fld" }}
                maxDate={new Date()}
                events={{
                  onChange: this.changeEST.bind(this)
                }}
              />
              <div className="col-lg-3">
                <label>
                  DEPARTMENT TYPE <span className="imp"> *</span>
                </label>
                <br />
                <SelectField
                  selected={this.selectedDeptType.bind(this)}
                  children={DEPT_TYPE}
                />
              </div>
              <div className="col-lg-3">
                <label>HEAD DEPARTMENT</label>
                <br />
                <SelectField
                  children={SelectFiledData({
                    textField: "department_name",
                    valueField: "hims_d_department_id",
                    payload: this.props.departments
                  })}
                  selected={this.selectedHeadDept.bind(this)}
                />
              </div>
              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  onClick={this.addBtnClick.bind(this)}
                  variant="raised"
                  color="primary"
                >
                  {this.state.buttonText}
                </Button>
              </div>
            </div>
          </div>

          <div className="row form-details">
            <div className="col">
              <div className="col-lg-12">
                <Paper>
                  <Grid
                    rows={this.props.departments}
                    columns={[
                      { name: "department_code", title: "Department Code" },
                      { name: "department_name", title: "Department Name" },
                      { name: "department_type", title: "Department Type" },
                      { name: "created_date", title: "Added Date" },
                      {
                        name: "effective_start_date",
                        title: "Effective Start Date"
                      },
                      {
                        name: "effective_end_date",
                        title: "Effective End Date"
                      },
                      { name: "department_status", title: "STATUS" }
                    ]}
                  >
                    <FilteringState defaultFilters={[]} />

                    <SearchState />
                    <IntegratedFiltering />
                    <Toolbar />
                    <SearchPanel />
                    <DataTypeProvider
                      formatterComponent={this.dateFormater}
                      editorComponent={({ value }) => <ExDate value={value} />}
                      for={["created_date"]}
                    />
                    <DataTypeProvider
                      formatterComponent={this.dateFormater}
                      for={["effective_start_date"]}
                    />

                    <DataTypeProvider
                      formatterComponent={this.dateFormater}
                      for={["effective_end_date"]}
                    />

                    <DataTypeProvider
                      editorComponent={this.DropDownEditor}
                      for={["department_type"]}
                    />
                    <DataTypeProvider
                      formatterComponent={this.getFullStatusText}
                      editorComponent={({ value }) => (
                        <StatusPick value={value} />
                      )}
                      for={["department_status"]}
                    />
                    <VirtualTable
                      tableComponent={TableComponent}
                      rowComponent={TableRow}
                      height={350}
                    />

                    <TableHeaderRow />
                    <RowDetailState />

                    <EditingState
                      onCommitChanges={this.commitChanges.bind(this)}
                    />
                    <TableEditRow />

                    <TableRowDetail contentComponent={this.RowDetail} />
                    <TableEditColumn
                      width={120}
                      showEditCommand
                      showDeleteCommand
                      commandComponent={Command}
                    />
                  </Grid>
                </Paper>
              </div>
            </div>
          </div>
        </Paper> */}
      </div>
>>>>>>> 03b26bde3a0446d38e8fbf59f660e3caf6e7fc42
    );
  }
}

export default DeptMaster;
