import React, { Component } from "react";
import { Paper, TextField } from "material-ui";
import "./numbering.css";
import { MuiThemeProvider, createMuiTheme } from "material-ui";
import { Button } from "material-ui";
import { algaehApiCall } from "../../../../utils/algaehApiCall.js";
import { getOptions } from "../../../../actions/BusinessSetup/Options.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Done from "@material-ui/icons/Done";
import CancelIcon from "@material-ui/icons/Cancel";
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

class Numbering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnTxt: "ADD TO LIST",
      hims_f_app_numgen_id: null,
      numgen_code: "",
      module_desc: "",
      prefix: "",
      intermediate_series: "",
      postfix: "",
      length: "",
      increment_by: "",
      numgen_seperator: "",
      postfix_start: "",
      postfix_end: "",
      current_num: "",
      created_by: "1",
      updated_by: "1",
      errorTxt: "",
      numgen_code_error: false,
      module_desc_error: false,
      prefix_error: false,
      intermediate_series_error: false,
      postfix_error: false,
      length_error: false,
      increment_by_error: false,
      numgen_seperator_error: false,
      postfix_start_error: false,
      postfix_end_error: false,
      current_num_error: false
    };
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  add(e) {
    e.preventDefault();

    if (this.state.numgen_code.length === 0) {
      this.setState({ numgen_code_error: true });
    } else if (this.state.module_desc.length === 0) {
      this.setState({ module_desc_error: true });
    } else if (this.state.prefix.length === 0) {
      this.setState({ prefix_error: true });
    } else if (this.state.intermediate_series.length === 0) {
      this.setState({ intermediate_series_error: true });
    } else if (this.state.postfix.length === 0) {
      this.setState({ postfix_error: true });
    } else if (this.state.length.length === 0) {
      this.setState({ length_error: true });
    } else if (this.state.increment_by.length === 0) {
      this.setState({ increment_by_error: true });
    } else if (this.state.numgen_seperator.length === 0) {
      this.setState({ numgen_seperator_error: true });
    } else if (this.state.postfix_start.length === 0) {
      this.setState({ postfix_start_error: true });
    } else if (this.state.postfix_end.length === 0) {
      this.setState({ postfix_end_error: true });
    } else if (this.state.current_num.length === 0) {
      this.setState({ current_num_error: true });
    }
    algaehApiCall({
      uri: "/masters/set/autogen",
      data: this.state,

      onSuccess: response => {
        if (response.data.success === true) {
          window.location.reload();
        } else {
          //Handle unsuccessful Login here.
        }
      },
      onFailure: error => {
        console.log(error);

        // Handle network error here.
      }
    });
  }

  componentDidMount() {
    this.props.getOptions();
  }

  onCommitChanges({ added, changed, deleted }) {
    if (added) {
    }
    if (changed) {
    }
    if (deleted) {
    }
  }

  render() {
    return (
      <div className="numbering">
        <Paper className="container-fluid">
          <form>
            <div
              className="row"
              style={{
                paddingTop: 20,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <div className="col-lg-3">
                <label>
                  OPTIONS CODE <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  error={this.state.numgen_code_error}
                  helperText={this.state.errorTxt}
                  name="numgen_code"
                  value={this.state.numgen_code}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>

              <div className="col-lg-3">
                <label>
                  MODULE NAME <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  error={this.state.module_desc_error}
                  helperText={this.state.errorTxt}
                  name="module_desc"
                  value={this.state.module_desc}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>
            </div>
            <br />
            <div
              className="row"
              style={{
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <div className="col-lg-3">
                <label>
                  PREFIX <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  error={this.state.prefix_error}
                  helperText={this.state.errorTxt}
                  name="prefix"
                  value={this.state.prefix}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>
              <div className="col-lg-3">
                <label>
                  INTERMEDIATE SERIES <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  error={this.state.intermediate_series_error}
                  helperText={this.state.errorTxt}
                  name="intermediate_series"
                  value={this.state.intermediate_series}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>
              <div className="col-lg-3">
                <label>
                  POSTFIX <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  error={this.state.postfix_error}
                  helperText={this.state.errorTxt}
                  name="postfix"
                  value={this.state.postfix}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>
            </div>
            <br />
            <div
              className="row"
              style={{
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <div className="col-lg-3">
                <label>
                  LENGTH <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  error={this.state.length_error}
                  helperText={this.state.errorTxt}
                  name="length"
                  value={this.state.length}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>
              <div className="col-lg-3">
                <label>
                  INCREMENT BY <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  error={this.state.increment_by_error}
                  helperText={this.state.errorTxt}
                  name="increment_by"
                  value={this.state.increment_by}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>
              <div className="col-lg-3">
                <label>
                  SEPERATOR <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  error={this.state.numgen_seperator_error}
                  helperText={this.state.errorTxt}
                  name="numgen_seperator"
                  value={this.state.numgen_seperator}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>
            </div>
            <br />
            <div
              className="row"
              style={{
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <div className="col-lg-3">
                <label>
                  POSTFIX START <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  error={this.state.postfix_start_error}
                  helperText={this.state.errorTxt}
                  name="postfix_start"
                  value={this.state.postfix_start}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>
              <div className="col-lg-3">
                <label>
                  POSTFIX END <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  error={this.state.postfix_end_error}
                  helperText={this.state.errorTxt}
                  name="postfix_end"
                  value={this.state.postfix_end}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>
              <div className="col-lg-3">
                <label>
                  CURRENT NUMBER <span className="imp">*</span>
                </label>
                <br />
                <TextField
                  error={this.state.current_num_error}
                  helperText={this.state.errorTxt}
                  name="current_num"
                  value={this.state.current_num}
                  onChange={this.changeTexts.bind(this)}
                  className="txt-fld"
                />
              </div>
              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  onClick={this.add.bind(this)}
                  color="primary"
                  variant="raised"
                >
                  {this.state.btnTxt}
                </Button>
              </div>
            </div>
            <br />
          </form>

          <div className="row form-details">
            <div className="col">
              <Grid
                rows={this.props.options}
                columns={[
                  { name: "numgen_code", title: "OPTIONS CODE" },
                  { name: "module_desc", title: "OPTIONS NAME" },
                  { name: "prefix", title: "PREFIX" },
                  { name: "intermediate_series", title: "INTERMEDIATE SERIES" },
                  { name: "postfix", title: "POSTFIX" },
                  { name: "length", title: "LENGTH" },
                  { name: "increment_by", title: "INCREMENT BY" },
                  { name: "numgen_seperator", title: "SEPERATOR" },
                  { name: "postfix_start", title: "POSTFIX START" },
                  { name: "postfix_end", title: "POSTFIX END" },
                  { name: "current_num", title: "CURRENT NUMBER" }
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
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    options: state.options.options
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOptions: getOptions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Numbering)
);
