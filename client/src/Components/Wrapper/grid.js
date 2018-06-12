import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  TextField
} from "material-ui";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Done from "@material-ui/icons/Done";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "material-ui/IconButton";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}
let expandInternalState = false;
export default class DataGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 0,
      rowsPerPage: 5,
      selectedRow: null,
      isEditable: false,
      rowToIndexEdit: -1,
      expanded: null,
      // expanded: {
      //   multiExpand: true,
      //   expandRows: []
      // },
      keyField: ""
    };
  }
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  handleEditRow = event => {
    let rowId = event.currentTarget.parentElement.parentElement.rowIndex - 1;
    this.setState({ isEditable: true, rowToIndexEdit: rowId });
    if (this.props.events != null) {
      if (this.props.events.onEdit) {
        let row = this.state.data[rowId];
        this.props.events.onEdit(row);
      }
    }
  };
  handleCancelRow = event => {
    this.setState({ rowToIndexEdit: -1 });
    let rowId = event.currentTarget.parentElement.parentElement.rowIndex - 1;
    if (this.props.events != null) {
      if (this.props.events.onCancel) {
        let row = this.state.data[rowId];
        this.props.events.onCancel(row);
      }
    }
  };
  handleDoneRow = event => {
    this.setState({ rowToIndexEdit: -1 });
    let rowId = event.currentTarget.parentElement.parentElement.rowIndex - 1;
    if (this.props.events != null) {
      if (this.props.events.onDone) {
        let row = this.state.data[rowId];
        this.props.events.onDone(row);
      }
    }
  };
  handleExpandRow = event => {
    let rowId = event.currentTarget.getAttribute("row-key");
    let target = event.currentTarget.getAttribute("thisIs");
    let _expandRows;
    let currentArray = this.state.expanded.expandRows;
    if (target == "E") {
      currentArray.splice(0, 0, rowId);
    } else {
      var index = currentArray.indexOf(rowId);
      if (index > -1) {
        currentArray.splice(index, 1);
      }
    }
    _expandRows = currentArray;
    let obj = {
      multiExpand: this.state.expanded.multiExpand,
      expandRows: _expandRows
    };
    this.setState({ expanded: obj });
  };
  expandButton = rowKey => {
    if (this.state.expanded) {
      if (this.state.expanded.multiExpand) {
        let _expand = this.state.expanded.expandRows.filter(
          f => f == String(rowKey)
        );
        if (_expand != null && _expand.length > 0) {
          return (
            <IconButton
              title="Collapse"
              row-key={String(rowKey)}
              thisIs="C"
              onClick={this.handleExpandRow.bind(this)}
            >
              <KeyboardArrowDown />
            </IconButton>
          );
        } else {
          return (
            <IconButton
              title="Expand"
              row-key={String(rowKey)}
              thisIs="E"
              onClick={this.handleExpandRow.bind(this)}
            >
              <KeyboardArrowUp />
            </IconButton>
          );
        }
      }
    } else {
    }
  };
  renderDetailTemplate = (row, rowid) => {
    var index = this.state.expanded.expandRows.indexOf(String(rowid));
    if (index > -1) {
      return (
        <TableRow key={rowid + "_Expand"}>
          <TableCell colSpan={this.props.columns.length}>
            {this.props.expanded.detailTemplate(row)}
          </TableCell>
        </TableRow>
      );
    }
  };
  /*
    columns:[{fieldName:"",label:"",numeric:flase,displayTemplate:return(),
    editorTemplate:return(),disabled:true}],
    keyId:string|int,
    expanded:{multiExpand:true,detailTemplate:object}
    dataSource:{data:[]}
*/
  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.dataSource.data });
  }
  componentWillMount() {
    this.setState({
      page: this.props.paging.page,
      rowsPerPage: this.props.paging.rowsPerPage,
      isEditable: this.props.isEditable,
      data: this.props.dataSource.data,
      expanded: this.props.expanded,
      keyField: this.props.keyField
    });
  }

  returnTableHeaderColumns = () => {
    return this.props.columns.map((row, i) => {
      return (
        <TableCell numeric={row.numeric == null ? false : row.numeric}>
          {row.label}
        </TableCell>
      );
    });
  };
  returnExpandColumn = () => {
    if (this.state.expanded != null) {
      return <TableCell />;
    }
  };
  returnEditableColumn = () => {
    if (this.state.isEditable != null && this.state.isEditable) {
      return <TableCell style={{ width: 70 }} />;
    }
  };
  returnEditableButtons = rowId => {
    if (this.state.isEditable != null && this.state.isEditable == true) {
      return (
        <TableCell>
          <IconButton
            title="Done"
            row-key={rowId}
            onClick={this.handleDoneRow.bind(this)}
          >
            <Done />
          </IconButton>
          <IconButton title="Cancel" onClick={this.handleCancelRow.bind(this)}>
            <CancelIcon />
          </IconButton>
        </TableCell>
      );
    } else return null;
  };
  returnExpandButton = rowId => {
    <TableCell>{this.expandButton(rowId)}</TableCell>;
  };

  returnTableRowWithColumns = (row, index) => {
    return this.props.columns.map(col => {
      debugger;
      return (
        <TableCell>
          {col.editorTemplate != null ? (
            col.editorTemplate(row, row => {
              return;
            })
          ) : (
            <TextField value={row[col.fieldName]} disabled={col.disabled} />
          )}
        </TableCell>
      );
    });
  };

  returnEditableStateRow = (row, index) => {
    return (
      <React.Fragment>
        <TableRow key={row[this.state.keyField]}>
          {this.returnEditableButtons(row[this.state.keyField])}
          {this.returnExpandButton(row[this.state.keyField])}
          {this.returnTableRowWithColumns(row, index)}
        </TableRow>
      </React.Fragment>
    );
  };

  returnEditDeleteButtons = row => {
    if (this.state.isEditable != null && this.state.isEditable == true) {
      return (
        <TableCell padding="checkbox">
          <IconButton
            title="Edit record"
            row-key={row[this.state.keyField]}
            onClick={this.handleEditRow.bind(this)}
          >
            <EditIcon />
          </IconButton>
          <IconButton title="Delete  record">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      );
    } else return null;
  };

  returnTableRoNonEditWithColumns = (row, index) => {
    return this.props.columns.map(col => {
      return (
        <TableCell>
          {col.displayTemplate != null
            ? col.displayTemplate(row)
            : row[col.fieldName]}
        </TableCell>
      );
    });
  };

  returnNonEditedStateRow = (row, index) => {
    return (
      <React.Fragment>
        <TableRow key={row[this.state.keyField]}>
          {this.returnEditDeleteButtons(row)}
          {this.returnTableRoNonEditWithColumns(row, index)}
        </TableRow>
      </React.Fragment>
    );
  };

  render() {
    const { data, rowsPerPage, page, isEditable, rowToIndexEdit } = this.state;

    // const emptyRows =
    //   rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return (
      <Table>
        <TableHead>
          <TableRow>
            {this.returnEditableColumn()}
            {this.returnExpandColumn()}
            {this.returnTableHeaderColumns()}
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((n, i) => {
              if (isEditable && i == rowToIndexEdit) {
                return (
                  <React.Fragment>
                    {this.returnEditableStateRow(n, i)}
                    {this.state.expanded != null &&
                    this.props.expanded.detailTemplate != null
                      ? this.renderDetailTemplate(n, i)
                      : null}
                  </React.Fragment>
                );
              } else {
                return (
                  <React.Fragment>
                    {this.returnNonEditedStateRow(n, i)}
                  </React.Fragment>
                );
              }
            })}
          <TableFooter>
            <TableRow>
              <TablePagination
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </TableBody>
      </Table>
    );
  }
}
