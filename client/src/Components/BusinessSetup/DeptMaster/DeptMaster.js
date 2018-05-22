import React, { Component, Fragment, PureComponent } from "react";
import { Paper, TextField, TableBody } from "material-ui";
import "./dept.css";
import IconButton from "material-ui/IconButton";
import { MuiThemeProvider, createMuiTheme, DatePicker } from "material-ui";
import { Button } from "material-ui";
import SelectField from "../commons/SelectField";
import moment from "moment";
import { algaehApiCall, SelectFiledData } from "../../../utils/algaehApiCall";
import {
  getDepartments,
  getSubDepartments
} from "../../../actions/CommonSetup/Department.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Done from "@material-ui/icons/Done";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  EditingState,
  PagingState,
  IntegratedFiltering,
  IntegratedPaging,
  RowDetailState,
  FilteringState,
  DataTypeProvider
} from "@devexpress/dx-react-grid";

import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableRowDetail,
  TableFilterRow,
  TableEditRow,
  TableEditColumn
} from "@devexpress/dx-react-grid-material-ui";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#00BCB0",
      main: "#00BCB0",
      dark: "#00BFC2",
      contrastText: "#fff"
    }
  }
});

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: "center" }}>
    <Button color="primary" onClick={onExecute} title="Create new row">
      New
    </Button>
  </div>
);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <Done />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return <CommandButton onExecute={onExecute} />;
};

const DEPT_TYPE = [
  { name: "CLINICAL", value: "CLINICAL", key: "c" },
  { name: "NON-CLINICAL", value: "NON-CLINICAL", key: "nc" }
];

const STATUS = [
  { name: "Active", value: "Active", key: "A" },
  { name: "Inactive", value: "Inactive", key: "IA" }
];

class StatusPick extends Component {
  constructor(props) {
    super(props);
    this.state = { status: this.props.value };
  }

  render() {
    return (
      <div>
        {console.log("Select Editor Componet ", this.state.status)}
        <SelectField children={STATUS} />
      </div>
    );
  }
}

class ExDate extends Component {
  constructor(props) {
    super(props);
    this.state = { startDate: moment(this.props.value).format("YYYY-MM-DD") };
  }
  handleChange(event) {
    this.setState({
      startDate: moment(event.target.value).format("YYYY-MM-DD")
    });
  }
  render() {
    return (
      <div>
        <TextField type="date" onChange={this.handleChange.bind(this)} />
      </div>
    );
  }
}

class DeptMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      department_code: "",
      sub_department_code: "",
      department_name: "",
      department_desc: "",
      department_type: "",
      hospital_id: "1",
      effective_start_date: "",
      effective_end_date: "9999-12-31",
      department_status: "",
      created_by: "1",
      deptList: [],
      subDeptList: [],
      buttonText: "ADD TO LIST",
      checkedActive: false,
      checkedInactive: false,
      department_id: "",
      hims_d_department_id: "",
      sub_department_name: "",
      sub_department_desc: "",
      sub_department_status: "",
      subTableHeight: "",
      dtVlaue: new Date(),
      subdeps: []
    };
  }

  selectedDeptType(deptType) {
    this.setState({ department_type: deptType });
  }

  selectedHeadDept(headDept) {
    this.setState({ hims_d_department_id: headDept, department_id: headDept });
  }

  changeDeptCode(e) {
    this.setState({
      department_code: e.target.value,
      sub_department_code: e.target.value
    });
  }

  changeDeptName(e) {
    this.setState({ department_name: e.target.value });
    this.setState({ department_desc: e.target.value });
    this.setState({ sub_department_name: e.target.value });
    this.setState({ sub_department_desc: e.target.value });
  }

  changeEST(e) {
    this.setState({ effective_start_date: e.target.value });
  }

  sendDate(date) {
    return String(moment(date).format("YYYY-MM-DD"));
  }

  getFullStatusText({ value }) {
    if (value == "A") {
      return "Active";
    } else if (value == "I") {
      return "Inactive";
    }
  }

  changeStatus(e) {
    this.setState({
      department_status: e.target.value,
      sub_department_status: e.target.value
    });
    if (e.target.value == "A")
      this.setState({ checkedActive: true, effective_end_date: "9999-12-31" });
    else if (e.target.value == "I") {
      this.setState({
        checkedInactive: true,
        effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
      });
    }
  }

  addBtnClick(e) {
    e.preventDefault();

    if (
      this.state.buttonText == "ADD TO LIST" &&
      this.state.department_id.length == 0
    ) {
      console.log("myState", this.state);
      algaehApiCall({
        uri: "/department/add",
        data: this.state,
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjUwNjk5NjcsImV4cCI6MTUyNzY2MTk2N30.7jVtM39kz3hPVAdX82v1JSQpgREJjQCFnVmDpvPN17g",
        onSuccess: response => {
          console.log("Res Data", response.data);
        },
        onFailure: error => {
          console.log(error);
        }
      });
    } else if (
      this.state.buttonText == "ADD TO LIST" &&
      this.state.department_id.length != 0
    ) {
      algaehApiCall({
        uri: "/department/add/subdepartment",
        data: this.state,
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjUwNjk5NjcsImV4cCI6MTUyNzY2MTk2N30.7jVtM39kz3hPVAdX82v1JSQpgREJjQCFnVmDpvPN17g",
        onSuccess: response => {
          console.log("Res Data", response.data);
        },
        onFailure: error => {
          console.log(error);
        }
      });
    } else if (this.state.buttonText == "UPDATE") {
      console.log("myState", this.state);
      algaehApiCall({
        uri: "/department/update",
        data: this.state,
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjUwNjk5NjcsImV4cCI6MTUyNzY2MTk2N30.7jVtM39kz3hPVAdX82v1JSQpgREJjQCFnVmDpvPN17g",
        onSuccess: response => {
          console.log("Update Data", response.data);
        },
        onFailure: error => {
          console.log(error);
        }
      });
    }
  }

  componentDidMount() {
    this.props.getDepartments();
  }

  commitChanges(rowId) {
    let rows = this.state;
  }

  commitSubdeptChanges({ added, changed, deleted }) {
    console.log("Inside commit sub deps");

    if (added) {
      console.log("Added Clicked");
    } else if (changed) {
      console.log("Changed");
    } else if (deleted) {
      console.log("Deleted");
    }
  }

  dateFormater({ value }) {
    return String(moment(value).format("DD-MM-YYYY"));
  }

  loadSubDeps(dep_id) {
    algaehApiCall({
      uri: "/department/get/subdepartment?department_id=" + dep_id,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU3ODI5MzcsImV4cCI6MTUyODM3NDkzN30.GwmNV2vAIi2N6HWGhhjAxAg0vUrnpb1vgmArwceUi34",
      //token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU3ODM1MTQsImV4cCI6MTUyODM3NTUxNH0.7j3qmIAm9e_GwTbOfPv9wNKKS2BY4V56SsAWokTmr18",
      method: "GET",
      onSuccess: response => {
        if (response.data.success == true) {
          {
            this.setState({ subdeps: response.data.records });
          }
        } else {
          this.setState({ subdeps: [] });
        }
      },
      onFailure: error => {}
    });

    return this.sd;
  }

  RowDetail = ({ row }) => {

    this.props.getSubDepartments(row.hims_d_department_id) 
    this.setState({ subdeps: this.props.subdepartments});
    console.log("subdeps : ", this.state.subdeps);

    <div>
      {console.log("in RowDetail")}
      {this.state.subdeps}
      <label>SUB DEPARTMENT LIST</label>
      <Grid
        columns={[
          { name: "sub_department_code", title: "Sub Dept Code" },
          { name: "sub_department_name", title: "Sub Dept Name" },
          { name: "effective_start_date", title: "Sub Dept Start Date" },
          { name: "effective_end_date", title: "Sub Dept End Date" },
          { name: "sub_department_status", title: "Sub Dept Status" }
        ]}
        rows={this.state.subdeps}
      >
        <DataTypeProvider
          formatterComponent={this.dateFormater}
          for={["effective_start_date"]}
        />
        <DataTypeProvider
          formatterComponent={this.dateFormater}
          for={["effective_end_date"]}
        />
        <DataTypeProvider
          formatterComponent={this.getFullStatusText}
          for={["sub_department_status"]}
        />
        <Table />
        <TableHeaderRow />
        <EditingState onCommitChanges={this.commitSubdeptChanges.bind(this)} />

        <TableEditRow />

        <TableEditColumn
          width={120}
          showEditCommand
          showDeleteCommand
          commandComponent={Command}
        />
      </Grid>
    </div>;
  };

  onDateChange = event => {
    console.log("date changed to ", event.target.value);
  };

  DatePickerEditor = ({ value, onchangeEvent }) => (
    <div>
      {console.log("come in render")}
      <TextField
        type="date"
        value={moment(value).format("YYYY-MM-DD")}
        onChange={this.onDateChange.bind(this)}
      />
    </div>
  );
  DropDownEditor = ({ value }) => (
    <SelectField
      displayValue={this.state.department_type}
      selected={this.selectedDeptType.bind(this)}
      children={DEPT_TYPE}
    />
  );

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="dept">
          <Paper className="container-fluid">
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

                <div className="col-lg-3">
                  <label>
                    DEPARTMENT CODE <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    onChange={this.changeDeptCode.bind(this)}
                    value={this.state.department_code}
                    className="txt-fld"
                  />
                </div>

                <div className="col-lg-3">
                  <label>
                    DEPARTMENT NAME <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    onChange={this.changeDeptName.bind(this)}
                    value={this.state.department_name}
                    className="txt-fld"
                  />
                </div>
                <div className="col-lg-3">
                  <label>
                    DEPARTMENT NAME
                    <span style={{ fontSize: 16 }}>(عربى) </span>
                  </label>
                  <br />
                  <TextField
                    // onChange={this.changeDeptName.bind(this)}
                    // value={this.state.department_name}
                    className="txt-fld"
                  />
                </div>
              </div>

              <div
                className="row"
                style={{
                  marginTop: 20,
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <div className="col-lg-3">
                  <label>
                    EFFECTIVE START DATE<span className="imp"> *</span>
                  </label>
                  <br />
                  <TextField
                    className="txt-fld"
                    type="date"
                    value={this.state.effective_start_date}
                    onChange={this.changeEST.bind(this)}
                  />
                </div>
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
                <label> DEPARTMENT LIST</label>
                <div className="col-lg-12">
                  {console.log("Grid Called")}
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
                    <PagingState currentPage={0} pageSize={4} />
                    <FilteringState defaultFilters={[]} />
                    <IntegratedPaging />
                    <IntegratedFiltering />

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
                    <Table />

                    <TableHeaderRow />
                    <RowDetailState />

                    <EditingState
                      onCommitChanges={this.commitChanges.bind(this)}
                    />
                    <TableEditRow />

                    <TableRowDetail
                      contentComponent={this.RowDetail.bind(this)}
                    />
                    <TableFilterRow />
                    <TableEditColumn
                      width={120}
                      showEditCommand
                      showDeleteCommand
                      commandComponent={Command}
                    />
                    <PagingPanel />
                  </Grid>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  console.log("in mapStateToProps");
  return {
    departments: state.departments.departments,
    subdepartments: state.subdepartments.subdepartments
  };
}

function mapDispatchToProps(dispatch) {
  console.log("in mapDispatchToProps");
  return bindActionCreators(
    {
      getDepartments: getDepartments,

      getSubDepartments: getSubDepartments
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DeptMaster)
);
