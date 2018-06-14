import React, { Component, Fragment } from "react";
import { Paper } from "material-ui";
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
import extend from "extend";

//Grid Logic Start here
let sel_id = "";
let row_id = "";

let rowelements = new Object();
const TableRow = ({ row, ...restProps }) => (
  <Fragment>
    <Table.Row
      {...restProps}
      data-algaeh-reference={JSON.stringify(row)}
      onClick={control => {
        sel_id = JSON.stringify(row.hims_d_identity_document_id);

        let getattr = control.currentTarget.getAttribute(
          "data-algaeh-reference"
        );
        let rowId = control.currentTarget.rowIndex;
        let JsonParse = JSON.parse(getattr);
        let obj = { [rowId]: JsonParse };
        extend(rowelements, obj);
      }}
      style={{
        cursor: "pointer"
      }}
    />
  </Fragment>
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

// const StatusEditor = ({ value, onValueChange }) => (
//   <Select
//     // input={<Input />}
//     value={value ? "Active" : "Inactive"}
//     onChange={event => onValueChange(event.target.value === "Active")}
//     style={{ width: "100%" }}
//   >
//     <MenuItem value="Active">Active</MenuItem>
//     <MenuItem value="Inactive">Inactive</MenuItem>
//   </Select>
// );

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
      currentRowID: "",
      id_code_error: false,
      id_code_error_txt: "",
      id_name_error: false,
      id_name_error_txt: ""
    };
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

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeStatus(e) {
    this.setState({ id_type_status: e.target.value });

    if (e.target.value === "A")
      this.setState({ effective_end_date: "9999-12-31" });
    else if (e.target.value === "I") {
      this.setState({
        effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
      });
    }
  }

  addIDType(e) {
    e.preventDefault();
    if (this.state.identity_document_code.length === 0) {
      this.setState({
        id_code_error: true,
        id_code_error_txt: "ID Code cannot be empty"
      });
    } else if (this.state.identity_document_name.length === 0) {
      this.setState({
        id_name_error: true,
        id_name_error_txt: "ID Name cannot be empty"
      });
    } else {
      algaehApiCall({
        uri: "/identity/add",
        data: this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            this.props.getIDTypes();
            this.setState({
              effective_end_date: "",
              identity_document_code: "",
              identity_document_name: "",
              openDialog: false,
              id_code_error: false,
              id_code_error_txt: "",
              id_name_error: false,
              id_name_error_txt: ""
            });
          }
        },
        onFailure: error => {}
      });
    }
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

    algaehApiCall({
      uri: "/identity/delete",
      data: data,
      method: "DELETE",
      onSuccess: response => {
        this.setState({ open: false });
        this.props.getIDTypes();
      },
      onFailure: error => {
        this.setState({ open: false });
      }
    });
  }

  componentDidMount() {
    this.props.getIDTypes();
  }

  onCommitChanges({ added, changed, deleted }) {
    if (added) {
    }
    if (changed) {
      let _key = Object.keys(changed);
      let getKey = changed[_key[0]];
      if (getKey !== undefined) {
        let data = new Object();

        data = {
          ...rowelements[_key[0]],
          ...getKey
        };

        this.updateIDtypes(data);
      }

      delete rowelements[String(_key[0])];
    }
    if (deleted) {
      this.setState({ openDialog: true });
    }
  }

  updateIDtypes(data) {
    algaehApiCall({
      uri: "/identity/update",
      data: data,
      method: "PUT",
      onSuccess: response => {
        this.props.getIDTypes();
      },
      onFailure: error => {}
    });
  }

  handleDialogClose() {
    this.setState({ openDialog: false });
  }

  render() {
    return (
      <div className="id_type">
        <DeleteDialog
          dept_name={this.state.dept_name}
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
              <AlgaehOptions
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "status",
                  isImp: true
                }}
                optionsType="radio"
                group={{
                  name: "Status",
                  value: this.state.id_type_status,
                  controls: [
                    { label: "Active", value: "A" },
                    { label: "Inactive", value: "I" }
                  ],
                  events: { onChange: this.changeStatus.bind(this) }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "identity_document_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "identity_document_code",
                  value: this.state.identity_document_code,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },

                  error: this.state.id_code_error,
                  helperText: this.state.id_code_error_txt
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "identity_document_name",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "identity_document_name",
                  value: this.state.identity_document_name,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  error: this.state.id_name_error,
                  helperText: this.state.id_name_error_txt
                }}
              />

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
                    },
                    {
                      name: "identity_status",
                      title: "STATUS"
                    }
                  ]}
                >
                  <DataTypeProvider
                    formatterComponent={this.getFullStatusText}
                    // editorComponent={StatusEditor}
                    for={["identity_status"]}
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
    );
  }
}

function mapStateToProps(state) {
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(IDType)
);
