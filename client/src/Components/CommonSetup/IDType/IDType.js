import React, { Component } from "react";
import { Paper, TextField } from "material-ui";
import "./id_type.css";
import { Button } from "material-ui";
import moment from "moment";
import { getIDTypes } from "../../../actions/CommonSetup/IDType.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Done from "@material-ui/icons/Done";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteDialog from "../../../utils/DeleteDialog";
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

// TODO
// Testing the New Plugin

//Grid Logic Start here
let sel_id = "";
let row_id = "";

const TableRow = ({ row, ...restProps }) => (
  <Table.Row
    {...restProps}
    onClick={control => {
      sel_id = JSON.stringify(row.hims_d_identity_document_id);
      row_id = row.id;
    }}
    style={{
      cursor: "pointer"
    }}
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

class IDType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id_type_status: "A",
      effective_end_date: "",
      identity_document_code: "",
      identity_document_name: "",
      created_by: "1",
      currentRowID: ""
    };
  }

  handleDel() {
    alert("CLicked");
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeStatus(e) {
    this.setState({ id_type_status: e.target.value });

    if (e.target.value == "A")
      this.setState({ effective_end_date: "9999-12-31" });
    else if (e.target.value == "I") {
      this.setState({
        effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
      });
    }
  }

  addIDType(e) {
    e.preventDefault();

    //console.log("myState", this.state);
    algaehApiCall({
      uri: "/identity/add",
      data: this.state,
      onSuccess: response => {
        this.props.getIDTypes();
        this.setState({
          effective_end_date: "",
          identity_document_code: "",
          identity_document_name: "",
          openDialog: false
        });
      },
      onFailure: error => {
        console.log(error);
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.idtypes !== nextProps.idtypes) {
      return true;
    }

    return true;
  }

  handleConfirmDelete() {
    const data = { hims_d_identity_document_id: sel_id, updated_by: 1 };
    this.setState({ openDialog: false });
    console.log("Data Delete ID:", data + row_id);
    algaehApiCall({
      uri: "/identity/delete",
      data: data,
      method: "DELETE",
      onSuccess: response => {
        this.setState({ open: false });
        this.props.getIDTypes();
      },
      onFailure: error => {
        console.log("Delete Error: ", error);
        this.setState({ open: false });
      }
    });
  }

  componentDidMount() {
    this.props.getIDTypes();
  }

  onCommitChanges({ added, changed, deleted }) {
    if (added) {
      console.log("Added: ", added);
    }
    if (changed) {
      console.log("Changed: ", JSON.stringify(changed));
    }
    if (deleted) {
      this.setState({ openDialog: true });
      console.log("Deleted: ", deleted);
    }
  }

  handleDialogClose() {
    this.setState({ openDialog: false });
  }

  render() {
    return (
      <div className="id_type">
        <DeleteDialog
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
          handleDialogClose={this.handleDialogClose.bind(this)}
          openDialog={this.state.openDialog}
        />

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
              <div className="col-lg-3">
                <label>
                  Status <span className="imp">*</span>
                </label>
                <br />
                <input
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
                  ID TYPE CODE <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  name="identity_document_code"
                  value={this.state.identity_document_code}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>

              <div className="col-lg-3">
                <label>
                  ID TYPE NAME <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  name="identity_document_name"
                  value={this.state.identity_document_name}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>

              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  onClick={this.addIDType.bind(this)}
                  variant="raised"
                  color="primary"
                >
                  ADD TO LIST
                </Button>
              </div>
            </div>
          </form>

          <div className="row form-details">
            <div className="col">
              <Paper>
                <Grid
                  rows={this.props.idtypes}
                  columns={[
                    { name: "identity_document_code", title: "ID CODE" },
                    {
                      name: "identity_document_name",
                      title: "ID NAME"
                    }
                  ]}
                >
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
    );
  }
}

function mapStateToProps(state) {
  debugger;
  return {
    idtypes: state.idtypes.idtypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getIDTypes: getIDTypes
    },
    dispatch
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IDType));
