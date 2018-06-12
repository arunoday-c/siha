import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination
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
      data: [
        createData("Cupcake", 305, 3.7),
        createData("Donut", 452, 25.0),
        createData("Eclair", 262, 16.0),
        createData("Frozen yoghurt", 159, 6.0),
        createData("Gingerbread", 356, 16.0),
        createData("Honeycomb", 408, 3.2),
        createData("Ice cream sandwich", 237, 9.0),
        createData("Jelly Bean", 375, 0.0),
        createData("KitKat", 518, 26.0),
        createData("Lollipop", 392, 0.2),
        createData("Marshmallow", 318, 0),
        createData("Nougat", 360, 19.0),
        createData("Oreo", 437, 18.0)
      ].sort((a, b) => (a.calories < b.calories ? -1 : 1)),
      page: 0,
      rowsPerPage: 5,
      selectedRow: null,
      isEditable: false,
      rowToIndexEdit: -1,
      expanded: {
        multiExpand: true,
        expandRows: []
      }
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
    let row = this.state.data[rowId];
    alert("Selected row is : " + JSON.stringify(row));
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

    this.setState({ expandRows: _expandRows }, () => {
      console.log(this.state._expandRows);
    });
    let row = this.state.data[rowId];
  };
  expandButton = rowKey => {
    if (this.state.expanded) {
      if (this.state.expanded.multiExpand) {
        let _expand = this.state.expanded.expandRows.filter(f => f == rowKey);
        if (_expand != null && _expand.length > 0) {
          expandInternalState = true;
          // this.setState({ internalExpandState: true });
          return (
            <IconButton
              title="Collapse"
              row-key={rowKey}
              thisIs="C"
              onClick={this.handleExpandRow.bind(this)}
            >
              <KeyboardArrowDown />
            </IconButton>
          );
        } else {
          expandInternalState = false;
          return (
            <IconButton
              title="Expand"
              row-key={rowKey}
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
  render() {
    const { data, rowsPerPage, page, isEditable, rowToIndexEdit } = this.state;

    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell numeric>Calories</TableCell>
            <TableCell numeric>Fat (g)</TableCell>
            <TableCell numeric>Carbs (g)</TableCell>
            <TableCell numeric>Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((n, i) => {
              if (isEditable && i == rowToIndexEdit) {
                return (
                  <TableRow key={n.id}>
                    <TableCell padding="checkbox">
                      <IconButton title="Done" row-key={n.id}>
                        <Done />
                      </IconButton>
                      <IconButton title="Cancel">
                        <CancelIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>{this.expandButton(n.id)}</TableCell>
                    <TableCell>{n.name}</TableCell>
                    <TableCell numeric>{n.calories}</TableCell>
                    <TableCell numeric>{n.fat}</TableCell>
                    <TableCell numeric>{n.carbs}</TableCell>
                    <TableCell numeric>{n.protein}</TableCell>
                  </TableRow>
                );
              } else {
                return (
                  <TableRow key={n.id}>
                    <TableCell padding="checkbox">
                      <IconButton
                        title="Edit record"
                        row-key={n.id}
                        onClick={this.handleEditRow.bind(this)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton title="Delete  record">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>{this.expandButton(n.id)}</TableCell>
                    <TableCell>{n.name}</TableCell>
                    <TableCell numeric>{n.calories}</TableCell>
                    <TableCell numeric>{n.fat}</TableCell>
                    <TableCell numeric>{n.carbs}</TableCell>
                    <TableCell numeric>{n.protein}</TableCell>
                  </TableRow>
                );
              }
              console.log(expandInternalState);
              if (expandInternalState) {
                {
                  console.log("Hello Printed");
                }
                <TableRow>
                  <div>Helllloooooooo world nnnnnnn mmmmm</div>
                </TableRow>;
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
                //ActionsComponent={TablePaginationActionsWrapped}
              />
            </TableRow>
          </TableFooter>
        </TableBody>
      </Table>
    );
  }
}
