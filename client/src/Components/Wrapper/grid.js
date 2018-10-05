import React, { PureComponent } from "react";
import ReactTable from "react-table";
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table/react-table.css";
import Enumerable from "linq";
import moment from "moment";
import { AlgaehDateHandler, AlagehFormGroup } from "../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../utils/algaehApiCall";
import "../Wrapper/wrapper.css";
const ReactTableFixedColumns = withFixedColumns(ReactTable);
class DataGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      data: [],
      editableRows: {},
      totalPages: 0,
      showLoading: false,
      rowsPerPage: 10,
      selectionChanged: false,
      recordsTotal: 0
    };
    this.tmp = new Set();
  }
  onTextHandleEditChange(e) {
    const data = [...this.state.data];
    const _element = e.currentTarget;
    const _rowIndex = parseInt(_element.getAttribute("row-id"));
    const _colIndex = _element.getAttribute("column-id");
    let _value = "";
    if (typeof data[_rowIndex][_colIndex] === "number")
      _value =
        e.target.value !== "" ? parseFloat(e.target.value) : e.target.value;
    else {
      _value = e.target.value;
    }
    data[_rowIndex][_colIndex] = _value;

    this.setState({ data });
  }

  onDateHandleEditChange(e, index, columnId) {
    const data = [...this.state.data];
    const _rowIndex = index;
    const _colIndex = columnId;
    let _value = e;
    data[_rowIndex][_colIndex] = _value;
    this.setState({ data });
  }

  renderEditable = (templates, cellInfo) => {
    const editable = this.state.editableRows[cellInfo.index];
    const rowDetail = this.state.data[cellInfo.index];
    if (editable === undefined || editable === false) {
      if (templates.displayTemp !== undefined) {
        return templates.displayTemp(rowDetail);
      } else {
        return <span>{rowDetail[cellInfo.column.id]}</span>;
      }
    } else {
      if (templates.editorTemp !== undefined) {
        return templates.editorTemp(rowDetail);
      } else {
        const _value = rowDetail[cellInfo.column.id];
        const _date = moment(_value).isValid();
        if (_date && typeof _value !== "number") {
          return (
            <AlgaehDateHandler
              textBox={{
                className: "txt-fld",
                name: "effective_start_date"
              }}
              events={{
                onChange: e => {
                  this.onDateHandleEditChange(
                    e,
                    cellInfo.index,
                    cellInfo.column.id
                  );
                }
              }}
              value={_value}
            />
          );
        } else {
          const isnumber = typeof _value === "number" ? { number: true } : {};
          return (
            <AlagehFormGroup
              textBox={{
                className: "txt-fld",
                value: _value,
                events: {
                  onChange: this.onTextHandleEditChange.bind(this)
                },
                others: {
                  "column-id": cellInfo.column.id,
                  "row-id": cellInfo.index
                },
                ...isnumber
              }}
            />
          );
        }
      }
    }
  };
  toggleRowEditable = index => {
    let existsing = sessionStorage.getItem(this.props.id);
    existsing = existsing !== null ? JSON.parse(existsing)["collection"] : [];
    const prevStateIndexData = this.state.data[index];
    let row = Enumerable.from(existsing)
      .where(w => w.rowIdx === index)
      .firstOrDefault();
    const _index = existsing.indexOf(row);
    if (_index > -1) {
      existsing.splice(_index, 1);
    } else {
      row = {};
    }
    row = prevStateIndexData;
    row["rowIdx"] = index;
    existsing.push(row);
    sessionStorage.removeItem(this.props.id);
    sessionStorage.setItem(
      this.props.id,
      JSON.stringify({ collection: existsing })
    );
    this.setState(
      {
        editableRows: {
          ...this.state.editableRows,
          [index]: !this.state.editableRows[index]
        }
      },
      () => {
        this.props.events.onEdit(this.state.data[index]);
      }
    );
  };
  componentWillUnmount() {
    sessionStorage.removeItem(this.props.id);
  }
  toggleRowCancel = index => {
    const row = this.settingPreviousRowData(index);
    const data = [...this.state.data];
    data[row.rowIdx] = row;
    this.setState({
      editableRows: {
        ...this.state.editableRows,
        [index]: !this.state.editableRows[index]
      },
      data
    });
  };
  settingPreviousRowData = index => {
    let existsing = sessionStorage.getItem(this.props.id);
    existsing = existsing !== null ? JSON.parse(existsing)["collection"] : [];
    let row = Enumerable.from(existsing)
      .where(w => w.rowIdx === index)
      .firstOrDefault();
    const _index = existsing.indexOf(row);
    if (_index > -1) {
      existsing.splice(_index, 1);
    }

    sessionStorage.removeItem(this.props.id);
    sessionStorage.setItem(
      this.props.id,
      JSON.stringify({ collection: existsing })
    );
    return row;
  };
  toggleRowDelete = index => {
    if (
      this.props.events !== undefined &&
      this.props.events.onDelete !== undefined
    ) {
      this.props.events.onDelete(this.state.data[index]);
    }
  };
  toggleRowSave = index => {
    this.settingPreviousRowData(index);
    if (this.props.events !== undefined) {
      if (this.props.events.onDone !== undefined) {
        this.setState(
          {
            editableRows: {
              ...this.state.editableRows,
              [index]: !this.state.editableRows[index]
            }
          },
          () => {
            const row = this.state.data[index];
            this.props.events.onDone(row);
          }
        );
      } else {
        console.warn(
          "No data save from algaeh grid '" +
            this.props.id +
            "', Reason no  on done event"
        );
      }
    } else {
      console.warn(
        "No data save from algaeh grid '" +
          this.props.id +
          "', Reason no events linked"
      );
    }
  };

  apiCallingFunction = ($this, page, callBack, inputProps) => {
    inputProps = inputProps || $this.state.inputParam;
    let input = {
      ...inputProps,
      ...{ pageSize: $this.state.rowsPerPage, pageNo: page }
    };

    new Promise((resolve, reject) => {
      if ($this.props.dataSource.validateBeforeServiceCall !== undefined) {
        resolve($this.props.dataSource.validateBeforeServiceCall($this));
      } else {
        resolve(true);
      }
    }).then(result => {
      if (result === true) {
        algaehApiCall({
          uri: $this.props.dataSource.uri,
          data: input,
          method: $this.props.dataSource.method
            ? $this.props.dataSource.method
            : "GET",
          onSuccess: response => {
            if (response.data.success === true) {
              let dataS = eval(
                "response.data." + $this.props.dataSource.responseSchema.data
              );
              let total_pages = eval(
                "response.data." +
                  $this.props.dataSource.responseSchema.totalPages
              );
              callBack(dataS, total_pages);
            } else {
              console.error(response);
            }
          },
          onFailure: data => {
            console.error(data);
          }
        });
      }
    });
  };

  componentDidMount() {
    if (this.state.columns.length == 0) {
      if (this.props.columns !== undefined && this.props.columns.length !== 0) {
        let _columns = Enumerable.from(this.props.columns)
          .select(s => {
            const _displayTemp =
              s.displayTemplate === undefined
                ? { accessor: s.fieldName }
                : { accessor: row => s.displayTemplate(row) };
            const _assignClass =
              s.className !== undefined ? row => s.className(row) : "";

            return {
              Header: s.label,
              id: s.fieldName,
              Cell: this.renderEditable.bind(this, {
                displayTemp: s.displayTemplate,
                editorTemp: s.editorTemplate
              }),
              assignTdClass: _assignClass,
              ..._displayTemp
            };
          })
          .toArray();
        const _allowEditButton =
          this.props.actions === undefined
            ? true
            : this.props.actions.allowEdit !== undefined
              ? this.props.actions.allowEdit
              : true;
        const _allowDeleteButton =
          this.props.actions === undefined
            ? true
            : this.props.actions.allowDelete !== undefined
              ? this.props.actions.allowDelete
              : true;
        if (
          this.props.isEditable !== undefined &&
          this.props.isEditable === true
        ) {
          if (_allowEditButton || _allowDeleteButton) {
            _columns.splice(0, 0, {
              Header: "Actions",
              headerClassName: "sticky",
              fixed: "left",
              Cell: ({ index }) => {
                const edit =
                  this.state.editableRows[index] === undefined
                    ? false
                    : this.state.editableRows[index];
                return (
                  <React.Fragment>
                    {_allowEditButton ? (
                      edit ? (
                        <i
                          className="fas fa-save"
                          onClick={() => this.toggleRowSave(index)}
                        />
                      ) : (
                        <i
                          className="fas fa-pen"
                          onClick={() => this.toggleRowEditable(index)}
                        />
                      )
                    ) : null}
                    {_allowDeleteButton ? (
                      edit ? (
                        <i
                          className="fas fa-times"
                          onClick={() => this.toggleRowCancel(index)}
                        />
                      ) : (
                        <i
                          className="fas fa-trash-alt"
                          onClick={() => this.toggleRowDelete(index)}
                        />
                      )
                    ) : null}
                  </React.Fragment>
                );
              },
              style: { textAlign: "center" }
            });
          }
        }
        if (this.props.dataSource.uri !== undefined) {
          this.apiCallingFunction(this, 0, (data, totalPages) => {
            const _total = Math.ceil(
              this.props.dataSource.responseSchema.totalPages === undefined
                ? data.length / this.props.paging.rowsPerPage
                : totalPages / this.props.paging.rowsPerPage
            );

            this.setState({
              data: data,
              totalPages: _total,
              rowsPerPage: this.props.paging.rowsPerPage,
              recordsTotal: totalPages
            });
          });
        } else {
          const _total = Math.ceil(
            this.props.dataSource.uri === undefined
              ? this.props.dataSource.data !== undefined
                ? this.props.dataSource.data.length /
                  this.props.paging.rowsPerPage
                : 0
              : 0 / this.props.paging.rowsPerPage
          );
          const _data =
            this.props.dataSource.uri === undefined
              ? this.props.dataSource.data
              : [];
          this.setState({
            columns: _columns,
            data: _data,
            totalPages: _total,
            rowsPerPage:
              this.props.paging !== undefined
                ? this.props.paging.rowsPerPage !== undefined
                  ? this.props.paging.rowsPerPage
                  : 10
                : 10,
            recordsTotal: _data.length
          });
        }
      }
    }
  }

  componentWillReceiveProps(props) {
    if (props.algaehSearch !== undefined) {
      if (props.columns !== undefined && props.columns.length !== 0) {
        let _columns = Enumerable.from(props.columns)
          .select(s => {
            const _displayTemp =
              s.displayTemplate === undefined
                ? { accessor: s.fieldName }
                : { accessor: row => s.displayTemplate(row) };
            const _assignClass =
              s.className !== undefined ? row => s.className(row) : "";

            return {
              Header: s.label,
              id: s.fieldName,
              Cell: this.renderEditable.bind(this, {
                displayTemp: s.displayTemplate,
                editorTemp: s.editorTemplate
              }),
              assignTdClass: _assignClass,
              ..._displayTemp
            };
          })
          .toArray();
        const _allowEditButton =
          props.actions === undefined
            ? true
            : props.actions.allowEdit !== undefined
              ? props.actions.allowEdit
              : true;
        const _allowDeleteButton =
          props.actions === undefined
            ? true
            : props.actions.allowDelete !== undefined
              ? props.actions.allowDelete
              : true;
        if (props.isEditable !== undefined && props.isEditable === true) {
          if (_allowEditButton || _allowDeleteButton) {
            _columns.splice(0, 0, {
              Header: "Actions",
              headerClassName: "sticky",
              fixed: "left",
              Cell: ({ index }) => {
                const edit =
                  this.state.editableRows[index] === undefined
                    ? false
                    : this.state.editableRows[index];
                return (
                  <React.Fragment>
                    {_allowEditButton ? (
                      edit ? (
                        <i
                          className="fas fa-save"
                          onClick={() => this.toggleRowSave(index)}
                        />
                      ) : (
                        <i
                          className="fas fa-pen"
                          onClick={() => this.toggleRowEditable(index)}
                        />
                      )
                    ) : null}
                    {_allowDeleteButton ? (
                      edit ? (
                        <i
                          className="fas fa-times"
                          onClick={() => this.toggleRowCancel(index)}
                        />
                      ) : (
                        <i
                          className="fas fa-trash-alt"
                          onClick={() => this.toggleRowDelete(index)}
                        />
                      )
                    ) : null}
                  </React.Fragment>
                );
              },
              style: { textAlign: "center" }
            });
          }
        }
        this.setState({
          columns: _columns
        });
      }

      this.apiCallingFunction(
        this,
        0,
        (data, totalPages) => {
          const _total = Math.ceil(
            props.dataSource.responseSchema.totalPages === undefined
              ? data.length / this.state.rowsPerPage
              : totalPages / this.state.rowsPerPage
          );
          this.setState({
            data: data,
            totalPages: _total,
            rowsPerPage:
              props.paging !== undefined
                ? props.paging.rowsPerPage !== undefined
                  ? props.paging.rowsPerPage
                  : 10
                : 10,
            recordsTotal: totalPages
          });
        },
        props.dataSource.inputParam
      );
    } else {
      const _total = Math.ceil(
        props.dataSource !== undefined
          ? props.dataSource.data !== undefined
            ? props.dataSource.data.length / props.paging.rowsPerPage
            : 0
          : 0 / props.paging.rowsPerPage
      );
      this.setState({
        data: props.dataSource.data,
        totalPages: _total,
        rowsPerPage: props.paging.rowsPerPage,
        recordsTotal: props.dataSource.data.length
      });
    }
  }
  pageChangeHandler(pageIndex) {
    if (
      this.props.dataSource.uri !== undefined &&
      this.props.dataSource.responseSchema.totalPages !== undefined
    ) {
      this.apiCallingFunction(this, pageIndex, (data, totalPages) => {
        const _total = Math.ceil(
          this.props.dataSource.responseSchema.totalPages === undefined
            ? data.length / this.state.rowsPerPage
            : totalPages / this.state.rowsPerPage
        );

        this.setState({
          data: data,
          totalPages: _total,
          recordsTotal: totalPages
        });
      });
    }
  }
  pageSizeChange(pageSize) {
    this.setState({ rowsPerPage: pageSize }, () => {
      if (
        this.props.dataSource.uri !== undefined &&
        this.props.dataSource.responseSchema.totalPages !== undefined
      ) {
        this.apiCallingFunction(this, 0, (data, totalPages) => {
          const _total = Math.ceil(
            this.props.dataSource.responseSchema.totalPages === undefined
              ? data.length / this.state.rowsPerPage
              : totalPages / this.state.rowsPerPage
          );

          this.setState({
            data: data,
            totalPages: _total,
            recordsTotal: totalPages
          });
        });
      }
    });
  }
  isRowSelected = rowID => {
    return this.tmp.has(rowID);
  };
  RowClickHandler = (action, row, index) => {
    if (
      this.props.multiSelect !== undefined &&
      this.props.multiSelect === true
    ) {
      if (this.tmp.has(index)) this.tmp.delete(index);
      this.tmp.add(index);
    } else {
      this.tmp = new Set();
      this.tmp.add(index);
    }
    this.setState(
      {
        selectionChanged: !this.state.selectionChanged
      },
      () => {
        if (this.props.onRowSelect !== undefined) {
          this.props.onRowSelect(row);
        }
      }
    );
  };

  getTrHandler = (state, rowInfo, column) => {
    if (rowInfo !== undefined) {
      const _isRowSelected = this.isRowSelected(rowInfo.index);
      const _selectedColor =
        _isRowSelected !== false ? "selected-grid-row " : "";
      const _rowSel =
        this.props.rowClassName !== undefined
          ? this.props.rowClassName(rowInfo.original)
          : "";
      return {
        className: _selectedColor + " " + _rowSel
      };
    } else {
      return {
        className: ""
      };
    }
  };
  getTdHandler = (state, rowInfo, column) => {
    if (rowInfo !== undefined) {
      const _clickEvent = {
        onClick: (event, handleOriginal) => {
          event.stopPropagation();
          this.RowClickHandler("click", rowInfo.row._original, rowInfo.index);
          if (handleOriginal) handleOriginal();
        }
      };
      if (
        column.assignTdClass !== undefined &&
        typeof column.assignTdClass === "function"
      ) {
        return {
          className: column.assignTdClass(rowInfo.original),
          ..._clickEvent
        };
      } else {
        return {
          className: column.assignTdClass,
          ..._clickEvent
        };
      }
    } else {
      return { className: "" };
    }
  };
  render() {
    const _data = this.state.data;
    const _filter =
      this.props.filter !== undefined ? { filterable: this.props.filter } : {};
    const _noDataText =
      this.props.noDataText !== undefined
        ? this.props.noDataText
        : "No records to show";
    const _defaultSize =
      this.props.paging !== undefined
        ? this.props.paging.rowsPerPage !== undefined
          ? {
              defaultPageSize: this.props.paging.rowsPerPage
            }
          : {}
        : {};
    const _subComponent =
      this.props.expanded !== undefined
        ? this.props.expanded.detailTemplate !== undefined
          ? {
              SubComponent: row => {
                return this.props.expanded.detailTemplate(row);
              }
            }
          : {}
        : {};
    const _onExpandRow =
      this.props.expanded !== undefined
        ? this.props.expanded.events !== undefined
          ? this.props.expanded.events.onExpandRow !== undefined
            ? {
                onExpandRow: row => {
                  this.props.expanded.events.onExpandRow(row);
                }
              }
            : {}
          : {}
        : {};

    return (
      <React.Fragment>
        <ReactTableFixedColumns
          data={_data}
          columns={this.state.columns}
          className="-striped -highlight"
          {..._filter}
          {..._defaultSize}
          pages={this.state.totalPages}
          noDataText={_noDataText}
          loading={this.state.showLoading}
          showPagination={
            this.props.paging !== undefined
              ? this.props.paging.showPagination !== undefined
                ? this.props.paging.showPagination
                : true
              : true
          }
          showPaginationTop={
            this.props.paging !== undefined
              ? this.props.paging.showPaginationTop !== undefined
                ? this.props.paging.showPaginationTop
                : false
              : false
          }
          showPaginationBottom={
            this.props.paging !== undefined
              ? this.props.paging.showPaginationBottom !== undefined
                ? this.props.paging.showPaginationBottom
                : true
              : true
          }
          showPageJump={
            this.props.paging !== undefined
              ? this.props.paging.showPageJump !== undefined
                ? this.props.paging.showPageJump
                : true
              : true
          }
          showPageSizeOptions={
            this.props.paging !== undefined
              ? this.props.paging.showPageSizeOptions !== undefined
                ? this.props.paging.showPageSizeOptions
                : true
              : true
          }
          pageSizeOptions={[10, 20, 25, 50, 100]}
          previousText="Previous"
          nextText="Next"
          pageText={
            <span>
              Total Records:
              {this.state.recordsTotal}
              ,&nbsp;Current Page
            </span>
          }
          ofText="of"
          rowsText=""
          onPageSizeChange={this.pageSizeChange.bind(this)}
          onPageChange={this.pageChangeHandler.bind(this)}
          {..._subComponent}
          {..._onExpandRow}
          style={{ maxHeight: "400px", minHeight: "400px" }}
          getTdProps={this.getTdHandler.bind(this)}
          getTrProps={this.getTrHandler.bind(this)}
        />
      </React.Fragment>
    );
  }
}
export default DataGrid;
