import React, { Component } from "react";
import { TextField, Paper, TablePagination } from "material-ui";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Done from "@material-ui/icons/Done";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "material-ui/IconButton";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import "./wrapper.css";

class DataGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 0,
      rowsPerPage: 5,
      selectedPreviousRow: null,
      isEditable: false,
      rowToIndexEdit: -1,
      expanded: null,
      keyField: "",
      width: null,
      id: null
    };
  }
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  handleEditRow = event => {
    let width = document.getElementById(this.props.id).clientWidth + "px";
    let rowId = event.currentTarget.parentElement.parentElement.rowIndex - 1;
    let row = this.state.data[rowId];
    sessionStorage.setItem(this.state.id, JSON.stringify(row));
    this.setState(
      {
        isEditable: true,
        rowToIndexEdit: rowId,
        width: width
      },
      () => {
        if (this.props.events != null) {
          if (this.props.events.onEdit) {
            this.props.events.onEdit(row);
          }
        }
      }
    );
  };
  componentDidMount() {
    sessionStorage.removeItem(this.state.id);
  }
  handleDeleteRow = event => {
    sessionStorage.removeItem(this.state.id);
    let rowId = event.currentTarget.parentElement.parentElement.rowIndex - 1;
    let row = this.state.data[rowId];
    if (this.props.events != null) {
      if (this.props.events.onDelete) {
        this.props.events.onDelete(row);
      }
    }
  };

  handleCancelRow = event => {
    this.setState({ rowToIndexEdit: -1, width: null });
    let rowId = event.currentTarget.parentElement.parentElement.rowIndex - 1;
    this.state.data[rowId] = JSON.parse(sessionStorage.getItem(this.state.id));
    this.setState({ data: this.state.data });
    sessionStorage.removeItem(this.state.id);
  };
  handleDoneRow = event => {
    sessionStorage.removeItem(this.state.id);
    this.setState({ rowToIndexEdit: -1, width: null });
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
    let target = event.currentTarget.getAttribute("thisis");
    let _expandRows;
    let currentArray =
      this.state.expanded.expandRows == null
        ? []
        : this.state.expanded.expandRows;
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
      if (
        this.state.expanded.multiExpand != null &&
        this.state.expanded.multiExpand == true
      ) {
        let _expand = this.state.expanded.expandRows;
        if (_expand != null)
          _expand = this.state.expanded.expandRows.filter(
            f => f == String(rowKey)
          );
        if (_expand != null && _expand.length > 0) {
          return (
            <IconButton
              row-key={String(rowKey)}
              thisis="C"
              onClick={this.handleExpandRow.bind(this)}
            >
              <KeyboardArrowDown />
            </IconButton>
          );
        } else {
          return (
            <IconButton
              row-key={String(rowKey)}
              thisis="E"
              onClick={this.handleExpandRow.bind(this)}
            >
              <KeyboardArrowUp />
            </IconButton>
          );
        }
      } else {
        return (
          <IconButton
            row-key={String(rowKey)}
            thisis="E"
            onClick={this.handleExpandRow.bind(this)}
          >
            <KeyboardArrowUp />
          </IconButton>
        );
      }
    }
  };
  renderDetailTemplate = (row, rowid) => {
    if (this.state.expanded.expandRows == null) return null;
    var index = this.state.expanded.expandRows.indexOf(
      String(row[this.state.keyField])
    );
    if (index > -1) {
      let colSpan =
        this.props.columns.length + 1 + (this.state.isEditable ? 1 : 0);
      return (
        <tr key={rowid + "_Expand"}>
          <td colSpan={colSpan}>{this.props.expanded.detailTemplate(row)}</td>
        </tr>
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
    this.setState({
      data: nextProps.dataSource.data,
      expanded:
        nextProps.expanded != null
          ? {
            multiExpand: true,
            expandRows: [],
            detailTemplate:
              nextProps.expanded != null
                ? nextProps.expanded.detailTemplate
                : null
          }
          : null,
      id: nextProps.id ? "prevRecord_" + nextProps.id : "prevRecord"
    });
  }
  componentWillMount() {
    this.setState({
      page: this.props.paging != null ? this.props.paging.page : 0,
      rowsPerPage:
        this.props.paging != null ? this.props.paging.rowsPerPage : 0,
      isEditable: this.props.isEditable,
      data: this.props.dataSource.data,
      expanded: this.props.expanded,
      keyField: this.props.keyField
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps === this.state) return false;
    else return true;
  }
  returnTableHeaderColumns = () => {
    return this.props.columns.map((row, i) => {
      return (
        <td key={i.toString()}>
          {typeof row.label == "function" ? row.label() : row.label}
        </td>
      );
    });
  };
  returnExpandColumn = () => {
    if (this.state.expanded != null) {
      return <td />;
    }
  };
  returnEditableColumn = () => {
    if (this.state.isEditable != null && this.state.isEditable) {
      return <td />;
    }
  };
  returnEditableButtons = (row, rowId) => {
    if (this.state.isEditable != null && this.state.isEditable == true) {
      return (
        <td width="10%">
          <IconButton row-key={rowId} onClick={this.handleDoneRow.bind(this)}>
            <Done />
          </IconButton>
          <IconButton onClick={this.handleCancelRow.bind(this)}>
            <CancelIcon />
          </IconButton>
          {this.returnExpandButton(row[this.state.keyField])}
        </td>
      );
    } else
      return (
        <React.Fragment>
          {this.returnExpandButton(row[this.state.keyField])}
        </React.Fragment>
      );
  };
  returnExpandButton = row => {
    if (this.state.expanded != null) {
      if (this.state.isEditable != null && this.state.isEditable == true)
        return (
          <React.Fragment>
            {this.expandButton(row[[this.state.keyField]])}
          </React.Fragment>
        );
      else return <td>{this.expandButton(row[[this.state.keyField]])}</td>;
    }
  };

  returnTableRowWithColumns = (row, index) => {
    return this.props.columns.map((col, ind) => {
      return (
        <td key={ind}>
          {col.editorTemplate != null ? (
            col.editorTemplate(row)
          ) : (
              <TextField
                name={col.fieldName}
                value={row[col.fieldName]}
                disabled={col.disabled}
                onChange={(control, $this = this) => {
                  const value = control.target.value;
                  $this.state.data[index][col.fieldName] = value;
                  $this.setState({ data: $this.state.data });
                }}
              />
            )}
        </td>
      );
    });
  };

  returnEditableStateRow = (row, index) => {
    return (
      <React.Fragment>
        <tr key={index.toString()}>
          {this.returnEditableButtons(row, row[this.state.keyField])}
          {this.returnTableRowWithColumns(row, index)}
        </tr>
      </React.Fragment>
    );
  };

  returnEditDeleteButtons = row => {
    if (this.state.isEditable != null && this.state.isEditable == true) {
      return (
        <td width="10%">
          {/* <IconButton
           
          > */}
          <EditIcon
            row-key={row[this.state.keyField]}
            onClick={this.handleEditRow.bind(this)}
            style={{ height: "20px", width: "30px", cursor: "pointer" }}
          />
          {/* </IconButton> 
          <IconButton
           
          >*/}
          <DeleteIcon
            row-key={row[this.state.keyField]}
            onClick={this.handleDeleteRow.bind(this)}
            style={{ height: "20px", width: "30px", cursor: "pointer" }}
          />
          {/* </IconButton> */}
          {this.returnExpandButton(row)}
        </td>
      );
    } else {
      return <React.Fragment>{this.returnExpandButton(row)}</React.Fragment>;
    }
  };

  returnTableRoNonEditWithColumns = (row, index) => {
    return this.props.columns.map((col, i) => {
      return (
        <td key={i}>
          {col.displayTemplate != null
            ? col.displayTemplate(row)
            : row[col.fieldName]}
        </td>
      );
    });
  };

  returnNonEditedStateRow = (row, index) => {
    return (
      <React.Fragment>
        <tr key={index.toString()}>
          {this.returnEditDeleteButtons(row)}
          {this.returnTableRoNonEditWithColumns(row, index)}
        </tr>
      </React.Fragment>
    );
  };
  renderDetailedTemplateRecords = (row, index) => {
    if (this.state.expanded != null) {
      if (this.props.expanded.detailTemplate != null) {
        return (
          <React.Fragment key={index}>
            {this.renderDetailTemplate(row, index)}
          </React.Fragment>
        );
      }
    }
  };
  renderTableRows = () => {
    let { data, rowsPerPage, page, isEditable, rowToIndexEdit } = this.state;

    if (this.props.paging == null) {
      page = 0;
      rowsPerPage = data.length;
    }
    return (
      <React.Fragment>
        {data
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((n, i) => {
            if (isEditable && i == rowToIndexEdit) {
              return (
                <React.Fragment key={i.toString()}>
                  {this.returnEditableStateRow(n, i)}
                  {this.renderDetailedTemplateRecords(n, i)}
                </React.Fragment>
              );
            } else {
              return (
                <React.Fragment key={i}>
                  {this.returnNonEditedStateRow(n, i)}
                  {this.renderDetailedTemplateRecords(n, i)}
                </React.Fragment>
              );
            }
          })}
      </React.Fragment>
    );
  };

  renderFooter = () => {
    if (this.props.paging != null) {
      const { data, rowsPerPage, page } = this.state;
      return (
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      );
    } else null;
  };

  render() {
    return (
      <Paper
        style={{ width: this.state.width != null ? this.state.width : "100%" }}
      >
        <div className="table-responsive">
          <table id={this.props.id} className="table table-hover table-fixed">
            <thead>
              <tr>
                {this.returnEditableColumn()}
                {this.returnTableHeaderColumns()}
              </tr>
            </thead>
            <tbody>{this.renderTableRows()}</tbody>
          </table>

          {this.renderFooter()}
        </div>
      </Paper>
    );
  }
}
export default DataGrid;
