import React, { Component } from "react";
import { Paper, TextField } from "material-ui";
import "./visit_type.css";
import { MuiThemeProvider, createMuiTheme } from "material-ui";
import { Button } from "material-ui";
import moment from "moment";
import SelectField from "../../common/Inputs/SelectField.js";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import { getVisittypes } from "../../../actions/CommonSetup/VisitTypeactions.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Done from "@material-ui/icons/Done";
import CancelIcon from "@material-ui/icons/Cancel";
import { AlagehFormGroup, AlgaehOptions } from "../../Wrapper/algaehWrapper";
import {
  EditingState,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering
} from "@devexpress/dx-react-grid";
import { withStyles } from "material-ui/styles";
import {
  Grid,
  Table,
  Toolbar,
  SearchPanel,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  VirtualTable
} from "@devexpress/dx-react-grid-material-ui";

//Grid Logic Start here
let sel_id = "";

const TableRow = ({ row, ...restProps }) => (
  <Table.Row
    {...restProps}
    onClick={control => {
      sel_id = JSON.stringify(row.hims_d_identity_document_id);
    }}
    style={{
      cursor: "pointer"
    }}
  />
);

const DateEditor = ({ value, onValueChange }) => (
  <TextField
    value={moment(value).format("YYYY-MM-DD")}
    type="date"
    onChange={e => onValueChange(e.target.value === "12")}
  />
);

const styles = theme => ({
  tableStriped: {
    "& tbody tr:nth-of-type(odd)": {
      backgroundColor: "#fbfbfb"
    }
  }
});

const TableComponentBase = ({ classes, ...restProps }) => (
  <Table.Table {...restProps} className={classes.tableStriped} />
);

export const TableComponent = withStyles(styles, { name: "TableComponent" })(
  TableComponentBase
);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} algaeh-command="edit" title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} algaeh-command="delete" title="Delete row">
    <DeleteIcon />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} algaeh-command="submit" title="Save changes">
    <Done />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton
    color="secondary"
    algaeh-command="cancel"
    onClick={onExecute}
    title="Cancel changes"
  >
    <CancelIcon />
  </IconButton>
);

const commandComponents = {
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return <CommandButton onExecute={onExecute} />;
};

//Grid Logic Ends here

const VISIT_TYPE = [
  { name: "CONSULTATION", value: "CONSULTATION", key: "cn" },
  { name: "NON CONSULTATION", value: "NON CONSULTATION", key: "ncn" }
];

class VisitType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      visit_status: "A",
      visit_type_code: "",
      visit_type_code_error: false,
      visit_type_code_error_txt: "",
      visit_type: "",
      visit_type_error: false,
      visit_type_error_txt: "",
      hims_d_visit_type: "",
      hims_d_visit_type_error: false,
      hims_d_visit_type_error_txt: "",
      created_by: "1",
      buttonText: "ADD TO LIST",
      hims_d_visit_type_id: "",
      deleteId: ""
    };
  }

  onCommitChanges({ added, changed, deleted }) {
    if (added) {
    }
    if (changed) {
    }
    if (deleted) {
    }
  }
  changeStatus(e) {
    this.setState({ visit_status: e.target.value });
    console.log("Status:", this.state.visit_status);
    if (e.target.value == "A")
      this.setState({ effective_end_date: "9999-12-31" });
    else if (e.target.value == "I") {
      this.setState({
        effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
      });
    }
  }

  handleConfirmDelete() {
    const data = { hims_d_visit_type_id: this.state.deleteId };

    algaehApiCall({
      uri: "/visitType/delete",
      data: data,
      method: "DELETE",
      onSuccess: response => {
        this.setState({ open: false });
        window.location.reload();
      },
      onFailure: error => {
        this.setState({ open: false });
      }
    });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDelete(e) {
    const visit_id = JSON.parse(e.currentTarget.getAttribute("sltd_id"));
    this.setState({ open: true, deleteId: visit_id });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  selectedVisitType(visitType) {
    this.setState({ hims_d_visit_type: visitType });
  }

  componentDidMount() {
    this.props.getVisittypes();
  }

  dateFormater({ value }) {
    return String(moment(value).format("DD-MM-YYYY"));
  }

  addVisit(e) {
    e.preventDefault();
    if (this.state.visit_type_code.length == 0) {
      this.setState({
        visit_type_code_error: true,
        visit_type_code_error_txt: "Visit Code Cannot be Empty"
      });
    } else if (this.state.visit_type.length == 0) {
      this.setState({
        visit_type_error: true,
        visit_type_error_txt: "Visit Name Cannot be Empty"
      });
    } else {
      this.setState({
        visit_type_code_error: false,
        visit_type_code_error_txt: "",
        visit_type_error: false,
        visit_type_error_txt: ""
      });

      let uri = "";
      if (
        this.state.buttonText == "ADD TO LIST" &&
        this.state.hims_d_visit_type_id.length == 0
      ) {
        uri = "/visitType/add";
      } else if (
        this.state.buttonText == "UPDATE" &&
        this.state.hims_d_visit_type_id.length != 0
      ) {
        uri = "/visitType/update";
      }

      algaehApiCall({
        uri: uri,
        data: this.state,
        onSuccess: response => {
          window.location.reload();
          if (response.data.success == true) {
            //Handle Successful Add here
          } else {
            //Handle unsuccessful Add here.
          }
        },
        onFailure: error => {
          // Handle network error here.
        }
      });
    }
  }

  getFormatedDate(date) {
    return String(moment(date).format("DD-MM-YYYY"));
  }

  editVisitTypes(e) {
    const data = JSON.parse(e.currentTarget.getAttribute("current_edit"));

    this.setState({
      visit_type_code: data.visit_type_code,
      visit_type: data.visit_type,
      hims_d_visit_type: data.hims_d_visit_type,
      buttonText: "UPDATE",
      hims_d_visit_type_id: data.hims_d_visit_type_id
    });
  }

  getFullStatusText({ value }) {
    if (value === "A") {
      return "Active";
    } else if (value === "I") {
      return "Inactive";
    } else {
      return "";
    }
  }

  render() {
    return (
      <div>
        <div className="visit_type">
          <Paper className="container-fluid">
            <form>
              <div
                className="row"
                style={{
                  padding: 20,
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <AlgaehOptions
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "status",
                    isImp: true
                  }}
                  optionsType="radio"
                  group={{
                    name: "Status",
                    value: this.state.visit_status,
                    controls: [
                      { label: "Active", value: "A" },
                      { label: "Inactive", value: "I" }
                    ],
                    events: { onChange: this.changeStatus.bind(this) }
                  }}
                />

                {/* <div className="col-lg-3">
                  <label>
                    VISIT CODE <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.visit_type_code_error}
                    helperText={this.state.visit_type_code_error_txt}
                    name="visit_type_code"
                    value={this.state.visit_type_code}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div> */}

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "visit_type_code",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "visit_type_code",
                    value: this.state.visit_type_code,
                    error: this.state.visit_type_code_error,
                    helperText: this.state.visit_type_code_error_txt,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                {/* <div className="col-lg-3">
                  <label>
                    VISIT NAME <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.visit_type_error}
                    helperText={this.state.visit_type_error_txt}
                    name="visit_type"
                    value={this.state.visit_type}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div> */}

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "visit_type",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "visit_type",
                    value: this.state.visit_type,
                    error: this.state.visit_type_error,
                    helperText: this.state.visit_type_error_txt,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                {/* <div className="col-lg-3">
                  <label>
                    VISIT TYPE <span className="imp">*</span>
                  </label>
                  <br />
                  <SelectField
                    displayValue={this.state.hims_d_visit_type}
                    selected={this.selectedVisitType.bind(this)}
                    children={VISIT_TYPE}
                  />
                </div> */}

                <div
                  className="col-lg-3 align-middle"
                  style={{ marginBottom: "2px" }}
                >
                  <br />
                  <Button
                    onClick={this.addVisit.bind(this)}
                    variant="raised"
                    color="primary"
                  >
                    {this.state.buttonText}
                  </Button>
                </div>
              </div>
            </form>

            <div className="row form-details">
              <div className="col">
                <Paper>
                  <Grid
                    rows={this.props.visittypes}
                    columns={[
                      { name: "visit_type_code", title: "VISIT CODE" },
                      {
                        name: "visit_type_desc",
                        title: "VISIT NAME"
                      },
                      // { name: "hims_d_visit_type", title: "VISIT TYPE" },
                      { name: "created_date", title: "ADDED DATE" },
                      { name: "visit_status", title: "Visit Status" }
                    ]}
                  >
                    <DataTypeProvider
                      formatterComponent={this.dateFormater}
                      editorComponent={({ value }) => (
                        <DateEditor value={value} />
                      )}
                      for={["created_date"]}
                    />
                    <DataTypeProvider
                      formatterComponent={this.getFullStatusText}
                      // editorComponent={StatusEditor}
                      for={["visit_status"]}
                    />

                    <SearchState />
                    <IntegratedFiltering />
                    <Toolbar />
                    <SearchPanel />
                    <VirtualTable
                      tableComponent={TableComponent}
                      rowComponent={TableRow}
                      height={400}
                    />
                    <TableHeaderRow />
                    <EditingState
                      onCommitChanges={this.onCommitChanges.bind(this)}
                    />
                    <TableEditRow />
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
          </Paper>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    visittypes: state.visittypes.visittypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisittypes: getVisittypes
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VisitType)
);
