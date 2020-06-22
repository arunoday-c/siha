import React, { Component, useContext } from "react";
import { MainContext } from "algaeh-react-components/context";
import ReactTable from "react-table";
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table/react-table.css";
import Enumerable from "linq";
import moment from "moment";
import { AlgaehDateHandler, AlagehFormGroup } from "../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../utils/algaehApiCall";
import { AlgaehValidation } from "../../utils/GlobalFunctions";
const CreateCsv = React.lazy(() => import("./csvGenerator"));

let ReactTableFixedColumns = withFixedColumns(ReactTable);
class DataGrid extends Component {
  constructor(props) {
    if (props.expanded !== undefined) {
      ReactTableFixedColumns = ReactTable;
    }
    super(props);

    this.state = {
      columns: [],
      data: [],
      editableRows: {},
      totalPages: 0,
      showLoading: false,
      rowsPerPage: 10,
      selectionChanged: false,
      recordsTotal: 0,
      inputParam: {},
      isEditable: false,
      uiUpdate: true,
      forceRender: undefined,
    };

    this.tmp = new Set();
    this.updateStateVariables = this.updateStateVariables.bind(this);
  }

  onTextHandleEditChange(e) {
    const data = [...this.state.data];
    const _element = e.currentTarget;
    const _row_ID = _element.getAttribute("row-id");
    const _rowIndex = parseInt(_row_ID, 10);
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

  scrollOnTop(id) {
    if (id !== undefined && id !== "") {
      const _element = document.getElementById(id);
      if (_element.children.length > 0) {
        const _innerElement = _element.children[0];
        if (_innerElement.children.length > 0) {
          _innerElement.children[0].scrollTop = 0;
        }
      }
    }
  }

  filterCaseInsensitive = (filter, row) => {
    this.scrollOnTop(this.props.id);
    const id = filter.pivotId || filter.id;
    if (id === undefined || id === null) return false;
    if (row[id] === undefined || row[id] === null) return false;
    if (typeof row[id] === "object") {
      const _value = row[id].props.children;
      if (_value === undefined) {
        return false;
      }
      return row[id] !== undefined
        ? String(_value.toString().toLowerCase()).startsWith(
            filter.value.toLowerCase()
          )
        : true;
    } else {
      return row[id] !== undefined
        ? String(row[id].toString().toLowerCase()).startsWith(
            filter.value.toLowerCase()
          )
        : true;
    }
  };
  onDateHandleEditChange(e, index, columnId) {
    const data = [...this.state.data];
    const _rowIndex = index;
    const _colIndex = columnId;
    let _value = e;
    data[_rowIndex][_colIndex] = _value;
    this.setState({ data });
  }
  updateStateVariables() {
    const _state =
      this.state.dummyUpdate === undefined ? false : !this.state.dummyUpdate;
    this.setState({
      dummyUpdate: _state,
    });
  }
  renderEditable = (templates, cellInfo) => {
    const editable = this.state.editableRows[cellInfo.index];
    const rowDetail =
      this.props.dataSource.data !== undefined
        ? this.state.data.length !== this.props.dataSource.data.length
          ? this.props.dataSource.data[cellInfo.index]
          : this.state.data[cellInfo.index]
        : this.state.data[cellInfo.index];

    const _fullNonEditor =
      this.state.isEditable !== undefined ? this.state.isEditable : false;
    const _disabled =
      cellInfo.column.disabled !== undefined ? cellInfo.column.disabled : false;
    const _capitalize =
      cellInfo.column.capitalize === undefined
        ? false
        : cellInfo.column.capitalize;
    let _value = rowDetail[cellInfo.column.id];
    let _calss = {};
    if (_capitalize && typeof _value === "string") {
      _value = _value.toLowerCase();
      _calss = { className: "textCapitalize" };
    }

    if (editable === undefined || editable === false) {
      if (templates.displayTemp !== undefined) {
        if (_calss.className !== undefined) {
          rowDetail[cellInfo.column.id] = _value;
        }
        return (
          <div data_role="grid" {..._calss}>
            {templates.displayTemp(rowDetail)}
          </div>
        );
      } else {
        return <span {..._calss}>{_value}</span>;
      }
    } else {
      if (_disabled || !_fullNonEditor) {
        // const _value = rowDetail[cellInfo.column.id];
        //const _width = this.getTextWidth(_value);
        return <span {..._calss}>{_value}</span>; //style={{ width: _width }}
        // return <span>{rowDetail[cellInfo.column.id]}</span>;
      } else {
        if (templates.editorTemp !== undefined) {
          rowDetail["update"] = () => {
            this.updateStateVariables();
          };
          if (_calss.className !== undefined) {
            rowDetail[cellInfo.column.id] = _value;
          }
          return (
            <div data_role="grid" {..._calss}>
              {templates.editorTemp(rowDetail)}
            </div>
          );
        } else {
          // const _value = rowDetail[cellInfo.column.id];
          const _date = moment(_value).isValid();
          if (_date && typeof _value !== "number") {
            return (
              <AlgaehDateHandler
                textBox={{
                  className: "txt-fld",
                  name: "effective_start_date",
                }}
                events={{
                  onChange: (e) => {
                    this.onDateHandleEditChange(
                      e,
                      cellInfo.index,
                      cellInfo.column.id
                    );
                  },
                }}
                value={_value}
              />
            );
          } else {
            const isnumber = typeof _value === "number" ? { number: true } : {};
            return (
              <AlagehFormGroup
                textBox={{
                  className:
                    "txt-fld " + isnumber.number === undefined
                      ? "textCapitalize"
                      : "",
                  value: _value,
                  events: {
                    onChange: this.onTextHandleEditChange.bind(this),
                  },
                  others: {
                    "column-id": cellInfo.column.id,
                    "row-id": cellInfo.index,
                  },
                  ...isnumber,
                }}
              />
            );
          }
        }
      }
    }
  };
  toggleRowEditable = (index) => {
    let existsing = sessionStorage.getItem(this.props.id);
    existsing = existsing !== null ? JSON.parse(existsing)["collection"] : [];
    const prevStateIndexData =
      this.props.forceRender === true
        ? this.props.dataSource.data[index]
        : this.state.data[index];
    let row = Enumerable.from(existsing)
      .where((w) => w.rowIdx === index)
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
          [index]: !this.state.editableRows[index],
        },
      },
      () => {
        this.props.events.onEdit(this.state.data[index]);
      }
    );
  };
  componentWillUnmount() {
    sessionStorage.removeItem(this.props.id);
  }
  toggleRowCancel = (index) => {
    const row = this.settingPreviousRowData(index);
    const data = [...this.state.data];
    data[row.rowIdx] = row;
    this.setState(
      {
        editableRows: {
          ...this.state.editableRows,
          [index]: !this.state.editableRows[index],
        },
        data,
      },
      () => {
        if (typeof this.props.events.onCancel === "function") {
          this.props.events.onCancel(row);
        }
      }
    );
  };
  settingPreviousRowData = (index) => {
    let existsing = sessionStorage.getItem(this.props.id);
    existsing = existsing !== null ? JSON.parse(existsing)["collection"] : [];
    let row = Enumerable.from(existsing)
      .where((w) => w.rowIdx === index)
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
  toggleRowDelete = (index) => {
    if (
      this.props.events !== undefined &&
      this.props.events.onDelete !== undefined
    ) {
      let _row = this.state.data[index];
      _row["rowIdx"] = index;
      this.props.events.onDelete(_row);
    }
  };
  toggleRowSave = (index) => {
    const existsing = Enumerable.from(
      JSON.parse(sessionStorage.getItem(this.props.id))["collection"]
    )
      .where((w) => w.rowIdx === index)
      .firstOrDefault();

    const row =
      this.props.forceRender === true
        ? this.props.dataSource.data[index]
        : this.state.data[index];
    if (this.props.byForceEvents === undefined) {
      if (JSON.stringify(existsing) === JSON.stringify(row)) {
        this.setState({
          editableRows: {
            ...this.state.editableRows,
            [index]: !this.state.editableRows[index],
          },
        });
        return;
      }
    }

    let isError = false;
    if (this.props.datavalidate !== undefined) {
      AlgaehValidation({
        querySelector: this.props.datavalidate,
        onCatch: (val) => {
          isError = true;
        },
      });
    }
    if (isError) return;
    this.settingPreviousRowData(index);

    if (this.props.events !== undefined) {
      if (this.props.events.onDone !== undefined) {
        this.setState(
          {
            editableRows: {
              ...this.state.editableRows,
              [index]: !this.state.editableRows[index],
            },
          },
          () => {
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

  apiCallingFunction = ($this, page, callBack, inputProps, pageSizeP) => {
    inputProps = inputProps || $this.props.dataSource.inputParam; // $this.state.inputParam;
    pageSizeP = pageSizeP || $this.state.rowsPerPage;
    const _page = pageSizeP * page;
    const _pagaeInput =
      $this.props.dataSource.pageInputExclude !== undefined &&
      $this.props.dataSource.pageInputExclude === true
        ? {}
        : { pageSize: pageSizeP, pageNo: _page };

    let input = {
      ...inputProps,
      ..._pagaeInput,
    };

    new Promise((resolve, reject) => {
      if ($this.props.dataSource.validateBeforeServiceCall !== undefined) {
        resolve($this.props.dataSource.validateBeforeServiceCall($this));
      } else {
        resolve(true);
      }
    }).then((result) => {
      if (result === true) {
        algaehApiCall({
          uri: $this.props.dataSource.uri,
          data: input,
          method: $this.props.dataSource.method
            ? $this.props.dataSource.method
            : "GET",
          onSuccess: (response) => {
            if (response.data.success === true) {
              let dataS = eval(
                "response.data." + $this.props.dataSource.responseSchema.data
              );
              let total_pages = 0;
              if (
                $this.props.dataSource.responseSchema.totalPages !== undefined
              ) {
                total_pages = eval(
                  "response.data." +
                    $this.props.dataSource.responseSchema.totalPages
                );
              } else {
                total_pages = dataS.length;
              }

              callBack(dataS, total_pages);
            } else {
              console.error(response);
            }
          },
          onFailure: (data) => {
            console.error(data);
          },
        });
      }
    });
  };
  getTextWidth(text, font) {
    let element = document.createElement("canvas");
    let context = element.getContext("2d");
    // context.font = font;
    return context.measureText(text).width + 24;
  }

  componentDidMount() {
    this.setState({
      isEditable: this.props.isEditable,
    });

    if (this.state.columns.length === 0) {
      if (this.props.columns !== undefined && this.props.columns.length !== 0) {
        let _columns = Enumerable.from(this.props.columns)
          .select((s) => {
            const _displayTemp =
              s.displayTemplate === undefined
                ? { accessor: s.fieldName }
                : {
                    accessor: (row) => s.displayTemplate(row, this.state.data),
                  };
            const _assignClass =
              s.className !== undefined ? (row) => s.className(row) : "";
            const _disabled =
              s.disabled !== undefined ? { disabled: s.disabled } : {};
            return {
              Header: s.label,
              id: s.fieldName,
              width: undefined, // A hardcoded width for the column. This overrides both min and max width options
              minWidth: 100, // A minimum width for this column. If there is extra room, column will flex to fill available space (up to the max-width, if set)
              maxWidth: undefined, // A maximum width for this column.
              style: { whiteSpace: "unset" },
              Cell: this.renderEditable.bind(this, {
                displayTemp: s.displayTemplate,
                editorTemp: s.editorTemplate,
              }),
              assignTdClass: _assignClass,
              ..._displayTemp,
              ...s.others,
              ..._disabled,
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
          this.props.isEditable !== undefined
          // &&
          // this.props.isEditable === true
        ) {
          //  if (_allowEditButton || _allowDeleteButton) {
          _columns.splice(0, 0, {
            Header: <label className="style_Label ">ACTIONS</label>,
            headerClassName: "sticky",
            fixed: "left",
            width: 100,
            filterable: false,
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
                        title="Save Edited"
                        className="fas fa-save"
                        onClick={() => this.toggleRowSave(index)}
                      />
                    ) : (
                      <i
                        title="Edit Row"
                        className="fas fa-pen"
                        onClick={() => this.toggleRowEditable(index)}
                      />
                    )
                  ) : null}
                  {_allowDeleteButton ? (
                    edit ? (
                      <i
                        title="Cancel Edit"
                        className="fas fa-times"
                        onClick={() => this.toggleRowCancel(index)}
                      />
                    ) : (
                      <i
                        title="Delete Row"
                        className="fas fa-trash-alt"
                        onClick={() => this.toggleRowDelete(index)}
                      />
                    )
                  ) : null}
                </React.Fragment>
              );
            },
            style: { textAlign: "center" },
            show: this.props.isEditable,
          });
          //}
        }
        if (this.props.dataSource.uri !== undefined) {
          this.setState({
            columns: _columns,
            data: [],
            inputParam: this.props.dataSource.inputParam,
          });
          const that = this;
          this.apiCallingFunction(this, 0, (data, totalPages) => {
            const _total = Math.ceil(
              that.props.dataSource.responseSchema.totalPages === undefined
                ? data.length / that.props.paging.rowsPerPage
                : totalPages / that.props.paging.rowsPerPage
            );

            that.setState({
              data: data,
              totalPages: _total,
              rowsPerPage: that.props.paging.rowsPerPage,
              recordsTotal: totalPages,
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
              ? this.props.dataSource.data !== undefined
                ? this.props.dataSource.data
                : []
              : [];
          const _loading =
            this.props.loading !== undefined
              ? { showLoading: this.props.loading }
              : {};
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
            recordsTotal: _data.length,
            ..._loading,
          });
        }
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.uiUpdate !== undefined) {
      return nextState.uiUpdate;
    }
    if (
      this.state.forceRender !== undefined &&
      this.state.forceRender === true
    ) {
      return true;
    }
    if (this.state !== nextState) return true;
    else return false;
  }
  UNSAFE_componentWillReceiveProps(props) {
    if (props.uiUpdate !== undefined) {
      this.setState({ uiUpdate: props.uiUpdate });
    }
    if (props.isEditable !== this.props.isEditable) {
      this.setState({
        isEditable: props.isEditable,
      });
    }

    if (props.columns !== undefined && props.columns.length !== 0) {
      let _columns = Enumerable.from(props.columns)
        .select((s) => {
          const _displayTemp =
            s.displayTemplate === undefined
              ? { accessor: s.fieldName }
              : { accessor: (row) => s.displayTemplate(row, this.state.data) };
          const _assignClass =
            s.className !== undefined ? (row) => s.className(row) : "";

          return {
            Header: s.label,
            id: s.fieldName,
            Cell: this.renderEditable.bind(this, {
              displayTemp: s.displayTemplate,
              editorTemp: s.editorTemplate,
            }),
            assignTdClass: _assignClass,
            ..._displayTemp,
            ...s.others,
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
            filterable: false,
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
            show: props.isEditable,
            style: { textAlign: "center", maxWidth: "70px" },
          });
        }
      }
      this.setState({
        columns: _columns,
        inputParam: props.dataSource.inputParam,
      });
    }

    if (
      props.algaehSearch !== undefined ||
      (props.forceRender !== undefined && props.forceRender === true)
    ) {
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
            recordsTotal: totalPages,
            forceRender: props.forceRender,
          });
        },
        props.dataSource.inputParam
      );
    } else {
      if (this.props.isEditable !== props.isEditable) {
        this.state.columns[0] = {
          ...this.state.columns[0],
          show: props.isEditable,
        };
      }
      const _total = Math.ceil(
        props.dataSource !== undefined
          ? props.dataSource.data !== undefined
            ? props.dataSource.data.length / props.paging.rowsPerPage
            : 0
          : 0 / props.paging.rowsPerPage
      );
      const _loading =
        props.loading !== undefined ? { showLoading: props.loading } : {};

      this.setState({
        data: props.dataSource.data,
        totalPages: _total,
        rowsPerPage: props.paging.rowsPerPage,
        recordsTotal:
          props.dataSource.data !== undefined
            ? props.dataSource.data.length
            : 0,
        ..._loading,
        inputParam: props.dataSource.inputParam,
        forceRender: props.forceRender,
      });
    }
  }
  pageChangeHandler(pageIndex) {
    this.scrollOnTop(this.props.id);
    if (
      this.props.dataSource.uri !== undefined &&
      this.props.dataSource.responseSchema.totalPages !== undefined
    ) {
      this.setState({ showLoading: true });
      this.apiCallingFunction(this, pageIndex, (data, totalPages) => {
        const _total = Math.ceil(
          this.props.dataSource.responseSchema.totalPages === undefined
            ? data.length / this.state.rowsPerPage
            : totalPages / this.state.rowsPerPage
        );

        this.setState({
          data: data,
          totalPages: _total,
          recordsTotal: totalPages,
          showLoading: false,
        });
      });
    }
  }
  pageSizeChange(pageSize) {
    this.scrollOnTop(this.props.id);
    if (
      this.props.dataSource.uri !== undefined &&
      this.props.dataSource.responseSchema.totalPages !== undefined
    ) {
      this.setState({ showLoading: true, rowsPerPage: pageSize });

      this.apiCallingFunction(
        this,
        0,
        (data, totalPages) => {
          const _total = Math.ceil(
            this.props.dataSource.responseSchema.totalPages === undefined
              ? data.length / this.state.rowsPerPage
              : totalPages / this.state.rowsPerPage
          );

          this.setState({
            data: data,
            totalPages: _total,
            recordsTotal: totalPages,
            rowsPerPage: pageSize,
            showLoading: false,
          });
        },
        null,
        pageSize
      );
    } else {
      const _data = this.state.data !== undefined ? this.state.data.length : 0;
      const _total = Math.ceil(_data / pageSize);
      this.setState({
        rowsPerPage: pageSize,
        totalPages: _total,
      });
    }
  }
  isRowSelected = (rowID) => {
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
        selectionChanged: !this.state.selectionChanged,
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
        _isRowSelected !== false ? "rowHighliter selected-grid-row " : "";

      return {
        className: _selectedColor,
      };
    } else {
      return {
        className: "",
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
        },
      };
      const _rowSel =
        this.props.rowClassName !== undefined ? this.props.rowClassName : "";
      if (
        column.assignTdClass !== undefined &&
        typeof column.assignTdClass === "function"
      ) {
        return {
          className: column.assignTdClass(rowInfo.original),
          ..._clickEvent,
        };
      } else if (_rowSel !== "") {
        return {
          className: _rowSel(rowInfo.original),
        };
      } else {
        return {
          className: column.assignTdClass,
          ..._clickEvent,
        };
      }
    } else {
      return { className: "" };
    }
  };

  CsvFileHandler() {
    if (this.props.tool === undefined) {
      return null;
    }
    const { tool, columns } = this.props;
    return (
      <CreateCsv
        fileName={tool.fileName}
        columns={columns}
        rows={this.state.data}
        tool={tool}
      />
    );
  }

  render() {
    const _data =
      this.props.dataSource.data !== undefined
        ? this.state.data.length !== this.props.dataSource.data.length
          ? this.props.dataSource.data
          : this.state.data
        : this.state.data;
    const _filter =
      this.props.filter !== undefined
        ? {
            filterable: this.props.filter,
            defaultFilterMethod: this.filterCaseInsensitive.bind(this),
          }
        : {};
    const _noDataText =
      this.props.noDataText !== undefined
        ? this.props.noDataText
        : "No Records Available";
    const _defaultSize =
      this.props.paging !== undefined
        ? this.props.paging.rowsPerPage !== undefined
          ? {
              defaultPageSize: this.props.paging.rowsPerPage,
            }
          : {}
        : {};
    const _subComponent =
      this.props.expanded !== undefined
        ? this.props.expanded.detailTemplate !== undefined
          ? {
              SubComponent: (row) => {
                return this.props.expanded.detailTemplate(row.original);
              },
            }
          : {}
        : {};
    const _onExpandRow =
      this.props.expanded !== undefined
        ? this.props.expanded.events !== undefined
          ? this.props.expanded.events.onExpandRow !== undefined
            ? {
                onExpandRow: (row) => {
                  this.props.expanded.events.onExpandRow(row.original);
                },
              }
            : {}
          : {}
        : {};
    const _decissionShowPaging =
      this.state.recordsTotal >= this.props.paging.rowsPerPage || 10
        ? this.props.paging !== undefined
          ? this.props.paging.showPagination !== undefined
            ? this.props.paging.showPagination
            : true
          : true
        : false;
    const _manual =
      this.props.dataSource.uri !== undefined ? { manual: true } : {};

    if (this.state.columns !== undefined && this.state.columns.length > 0) {
      return (
        <React.Fragment>
          <div className="row">
            <div className="col gridToolSec">{this.CsvFileHandler()}</div>
          </div>
          <div id={this.props.id}>
            <ReactTableFixedColumns
              id={this.props.id}
              data={_data}
              columns={this.state.columns}
              className="-striped -highlight"
              {..._filter}
              {..._defaultSize}
              pages={this.state.totalPages}
              noDataText={_noDataText}
              loading={this.state.showLoading}
              showPagination={_decissionShowPaging}
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
              resizable={false}
              freezeWhenExpanded={true}
              pageSizeOptions={[10, 20, 25, 50, 100]}
              previousText="Previous"
              nextText="Next"
              pageText={
                <span>
                  Total Records:
                  {this.state.recordsTotal}, Page
                </span>
              }
              ofText="of"
              rowsText=""
              onPageSizeChange={this.pageSizeChange.bind(this)}
              onPageChange={this.pageChangeHandler.bind(this)}
              {..._subComponent}
              {..._onExpandRow}
              style={{
                maxHeight: "400px",
                minHeight: "120px",
              }}
              getTdProps={this.getTdHandler.bind(this)}
              getTrProps={this.getTrHandler.bind(this)}
              {..._manual}
              {...this.props.others}
            />
          </div>
        </React.Fragment>
      );
    } else {
      return <div>No Columns</div>;
    }
  }
}

export default function Grid(props) {
  const context = useContext(MainContext);
  if (context) {
    const [perm] = context.selectElement.filter(
      (item) => item.screen_element_code === "READ_ONLY_GRID"
    );
    let editable = props.isEditable || false;
    if (perm && perm.ele_view_previlage === "H") {
      editable = false;
    }
    return <DataGrid {...props} isEditable={editable} />;
  } else {
    return <DataGrid {...props} />;
  }
}

// export default DataGrid;
