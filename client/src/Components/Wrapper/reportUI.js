import React, { Component } from "react";
import "./wrapper.scss";
import {
  successfulMessage,
  AlgaehValidation
} from "../../utils/GlobalFunctions";
import { algaehApiCall, valueReviver } from "../../utils/algaehApiCall";
import { accessReport } from "../Wrapper/printReports";
import Enumerable from "linq";
import ReactDOM from "react-dom";
import AlgaehSearch from "../Wrapper/globalSearch";
import ButtonType from "../Wrapper/algaehButton";
import moment from "moment";

export default class ReportUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportQuery:
        props.options === undefined ? null : props.options.report.reportQuery,
      pageDisplay: "",
      openPopup: true,
      hasError: false,
      _htmlString: "",
      parameterCollection: {},
      hasTable: false,
      report_preview_type: 0,
      buttonDisable: true,
      report_name: null
    };

    if (props.options !== undefined && props.options.plotUI !== undefined) {
      if (
        props.options.plotUI.paramters !== undefined &&
        props.options.plotUI.paramters.length > 0
      ) {
        this.callApiForParameters(
          Enumerable.from(props.options.plotUI.paramters)
            .where(w => w.link !== undefined)
            .select(s => {
              return {
                ...s.link,
                ...{ method: "GET" },
                ...{
                  onSuccess: response => {
                    if (response.data.success) {
                      const manupulateResult = s.manupulation;
                      if (typeof manupulateResult === "function") {
                        manupulateResult(response.data, this, s.name + "_list");
                      } else {
                        if (s.link.schema !== undefined) {
                          s.link.schema.map(sch => {
                            this.setState({
                              [sch.name + "_list"]: eval(
                                "response.data.records." + sch.response
                              )
                            });
                          });
                        } else {
                          this.setState({
                            [s.name + "_list"]: response.data.records
                          });
                        }
                      }
                    }
                  }
                }
              };
            })
            .toArray()
        );

        Enumerable.from(props.options.plotUI.paramters)
          .where(w => w.value !== undefined)
          .select(s => {
            if (s.type === "date" || s.type === "time") {
              this.state.parameterCollection[s.name] = moment(
                s.value,
                s.type === "time" ? "HH:mm" : "YYYY-MM-DD"
              )._d;
            } else {
              this.state.parameterCollection[s.name] = s.value;
            }
            return {
              [s.name]: s.value
            };
          })
          .toArray();
      }
    }
  }
  callApiForParameters(arrayUrl) {
    if (arrayUrl !== undefined && arrayUrl.length > 0) {
      for (let i = 0; i < arrayUrl.length; i++) {
        const _initalLoad =
          arrayUrl[i].initialLoad === undefined
            ? true
            : arrayUrl[i].initialLoad;
        if (_initalLoad) algaehApiCall(arrayUrl[i]);
      }
    }
  }
  componentWillUnmount() {
    if (this.state.hasTable) {
      document
        .querySelectorAll("[algaeh-report-table='true']")
        .forEach(item => {
          item.removeEventListener(
            "scroll",
            function(e) {
              e.target.previousElementSibling.scrollLeft = e.target.scrollLeft;
              e.target.nextElementSibling.scrollLeft = e.target.scrollLeft;
            },
            false
          );
        });
    }
  }

  componentDidMount() {
    this.setState({
      openPopup: true
    });
  }
  internallyCallAPI(parametes) {
    algaehApiCall({
      ...parametes,
      ...{ method: "GET" },
      ...{
        onSuccess: response => {
          if (response.data.success) {
            if (parametes.link.schema !== undefined) {
              parametes.link.schema.map(sch => {
                this.setState({
                  [sch.name + "_list"]: eval(
                    "response.data.records." + sch.response
                  )
                });
              });
            } else {
              this.setState({
                [parametes.name + "_list"]: response.data.records
              });
            }
          }
        }
      }
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      openPopup: true,
      reportQuery: props.options.report.reportQuery
    });
  }

  handleClose = e => {
    ReactDOM.unmountComponentAtNode(document.getElementById("reportWindow"));
  };

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    console.error(
      "Report UI has error with info :" + info + " \n Message : ",
      error
    );
    successfulMessage({
      message: error
    });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.hasTable) {
      document
        .querySelectorAll("[algaeh-report-table='true']")
        .forEach(item => {
          item.addEventListener("scroll", function(e) {
            e.target.previousElementSibling.scrollLeft = e.target.scrollLeft;
            e.target.nextElementSibling.scrollLeft = e.target.scrollLeft;
          });
        });
    }
  }

  generateReport(source, e, loader) {
    AlgaehValidation({
      querySelector: "data-validate='parameters-data'",
      alertTypeIcon: "warning",
      pageState: this,
      onSuccess: that => {
        if (
          that.props.options !== undefined &&
          that.props.options.report !== undefined &&
          that.props.options.report.requireIframe === true
        ) {
          const element = document.getElementById(
            "report_generation_interface"
          );
          let parameters = [];
          element.querySelectorAll("input").forEach(item => {
            if (item.name !== undefined) {
              let type = item.getAttribute("data_role");
              let data =
                type === "dropdownlist"
                  ? item.getAttribute("referencevalue")
                  : item.value;

              parameters.push({
                name: item.name,
                value: data
              });
            }
          });
          const reportProperties = that.props.options.report;

          algaehApiCall({
            uri: "/report",
            module: "reports",
            method: "GET",
            headers: {
              Accept: "blob"
            },
            others: { responseType: "blob" },
            data: {
              report: {
                ...reportProperties,
                reportParams: parameters
              }
            },
            onSuccess: response => {
              const url = URL.createObjectURL(response.data);
              loader.setState({
                loading: false
              });

              let myWindow = window.open(
                "",
                "",
                "width=800,height=500,left=200,top=200"
              );
              myWindow.document.write(
                "<iframe src= '" + url + "' width='100%' height='100%' />"
              );
              myWindow.document.title = reportProperties.displayName;
              myWindow.document.body.style.overflow = "hidden";
            }
          });
        } else {
          const _reportQuery =
            this.state.reportQuery !== undefined
              ? this.state.reportQuery
              : this.props.options.report.fileName;

          let inputs = { ...this.state.parameterCollection };

          inputs["reportName"] = _reportQuery;
          let querString =
            inputs.sub_department_id !== undefined
              ? "S.sub_department_id=" + inputs.sub_department_id
              : "";

          const that = this;
          let options = { ...this.props.options, ...{ getRaw: true } };

          const uri =
            typeof options.report.reportUri === "string"
              ? options.report.reportUri
              : "/generateReport/getReport";

          const _module =
            typeof options.report.module === "string"
              ? { module: options.report.module }
              : {};

          algaehApiCall({
            uri: uri,
            data: inputs,
            method: "GET",
            inputs: querString,
            ..._module,
            onSuccess: response => {
              let buttonDisable = true;
              if (response.data.success === true) {
                new Promise((resolve, reject) => {
                  resolve(response.data.records);
                }).then(data => {
                  if (Array.isArray(data)) {
                    if (data.length > 0) {
                      buttonDisable = false;
                    }
                  } else if (data !== null || data !== undefined) {
                    buttonDisable = false;
                  }
                  options.inputData = that.state.parameterCollection;
                  options.data = data;
                  let _optionsFetch = options;

                  let _htm = accessReport(_optionsFetch);
                  let _hasTable =
                    _htm !== undefined
                      ? String(_htm).indexOf("algaeh-report-table") > -1
                        ? true
                        : false
                      : false;

                  that.setState({
                    _htmlString: _htm,
                    hasTable: _hasTable,
                    buttonDisable: buttonDisable
                  });
                });
              }
            }
          });
        }
      }
    });
  }
  dropDownHandle(e) {
    const _hasEvents = Enumerable.from(this.props.options.plotUI.paramters)
      .where(w => w.name === e.name)
      .firstOrDefault().events;
    if (_hasEvents !== undefined) {
      if (_hasEvents.onChange !== undefined) {
        let that = this;
        _hasEvents.onChange(this, e, options => {
          that.setState(options);
        });
      }
    } else {
      let _inputText = "";
      const _inputBox = document.getElementsByName(e.name);
      if (_inputBox.length != 0) {
        _inputText = _inputBox[0].value;
      }

      this.setState({
        parameterCollection: {
          ...this.state.parameterCollection,
          [e.name]: e.value,
          [e.name + "_text"]: _inputText
        }
      });
    }
  }
  dropDownOnClear(e) {
    const _hasEvents = Enumerable.from(this.props.options.plotUI.paramters)
      .where(w => w.name === e)
      .firstOrDefault().events;
    if (_hasEvents !== undefined) {
      if (typeof _hasEvents.onClear === "function") {
        _hasEvents.onClear(this, e);
      } else {
        this.setState({ [e]: undefined });
      }
    } else {
      this.setState({ [e]: undefined });
    }
  }

  searchButton(e) {
    const _name = e.currentTarget.getAttribute("surrounds");
    const _hasSearch = Enumerable.from(this.props.options.plotUI.paramters)
      .where(w => w.name === _name)
      .firstOrDefault();
    AlgaehSearch({
      searchGrid: {
        columns: _hasSearch.search.columns
      },
      searchName: _hasSearch.search.searchName,
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        if (
          _hasSearch.search.schema !== undefined &&
          _hasSearch.search.schema.length > 0
        ) {
          _hasSearch.search.schema.map(item => {
            this.setState({ [item.name]: row[item.response] });
          });
        } else {
          this.setState({ [_name]: row[_name] });
        }
      }
    });
  }
  checkBoxRadioHandle(e) {
    const _name = e.currentTarget.name;
    const _hasEvents = Enumerable.from(this.props.options.plotUI.paramters)
      .where(w => w.name === _name)
      .firstOrDefault().events;
    if (_hasEvents !== undefined) {
      if (_hasEvents.onChange !== undefined) {
        _hasEvents.onChange(this, e);
      }
    } else {
      const _checked = e.currentTarget.checked;

      this.setState({
        parameterCollection: {
          ...this.state.parameterCollection,
          [_name + "_checked"]: _checked
        }
      });
    }
  }

  textBoxHandle(e) {
    const _name = e.currentTarget.name;
    const _hasEvents = Enumerable.from(this.props.options.plotUI.paramters)
      .where(w => w.name === _name)
      .firstOrDefault().events;
    if (_hasEvents !== undefined) {
      if (_hasEvents.onChange !== undefined) {
        _hasEvents.onChange(this, e);
      }
    } else {
      this.setState({
        parameterCollection: {
          ...this.state.parameterCollection,
          [_name]: e.currentTarget.value
        }
      });
    }
  }
  datePickerHandler(selectedDate) {
    const _hasEvents = Enumerable.from(this.props.options.plotUI.paramters)
      .where(w => w.name === selectedDate.name)
      .firstOrDefault().events;
    if (_hasEvents !== undefined) {
      if (_hasEvents.onChange !== undefined) {
        _hasEvents.onChange(this, selectedDate);
      }
    } else {
      this.setState({
        parameterCollection: {
          ...this.state.parameterCollection,
          [selectedDate.name]: selectedDate.value
        }
      });
    }

    // this.setState({
    //   [_param.name]: selectedDate
    // });
  }

  generateInputParameters() {
    const _parameters = this.props.options.plotUI.paramters;
    let _controls = [];
    const {
      AlagehAutoComplete,
      AlagehFormGroup,
      AlgaehDateHandler
    } = require("./algaehWrapper");
    for (let i = 0; i < _parameters.length; i++) {
      const _param = _parameters[i];
      const _className =
        _param.className === undefined ? "col" : _param.className;
      switch (_param.type) {
        case "dropdown":
          const _data =
            this.state[_param.name + "_list"] === undefined
              ? _param.dataSource.data === undefined
                ? []
                : _param.dataSource.data
              : this.state[_param.name + "_list"];

          _controls.push(
            <AlagehAutoComplete
              key={i}
              div={{ className: _className }}
              label={{
                fieldName: _param.name,
                forceLabel: _param.label,
                isImp:
                  _param.isImp === undefined || _param.isImp === false
                    ? false
                    : _param.isImp
              }}
              selector={{
                name: _param.name,
                className: "select-fld",
                value: this.state.parameterCollection[_param.name],
                dataSource: {
                  textField: _param.dataSource.textField,
                  valueField: _param.dataSource.valueField,
                  data: _data
                },
                onChange: this.dropDownHandle.bind(this),
                onClear: this.dropDownOnClear.bind(this),
                ..._param.others
              }}
            />
          );
          break;
        case "date":
          _controls.push(
            <AlgaehDateHandler
              key={i}
              singleOutput={false}
              div={{ className: _className }}
              label={{
                fieldName: _param.name,
                forceLabel: _param.label,
                isImp: _param.isImp !== undefined ? false : _param.isImp
              }}
              textBox={{
                className: "txt-fld",
                name: _param.name
              }}
              {..._param.others}
              events={{
                onChange: this.datePickerHandler.bind(this)
              }}
              value={this.state.parameterCollection[_param.name]}
            />
          );
          break;
        case "time":
          _controls.push(
            <AlgaehDateHandler
              type="time"
              key={i}
              singleOutput={false}
              div={{ className: _className }}
              label={{
                fieldName: _param.name,
                forceLabel: _param.label,
                isImp: _param.isImp !== undefined ? false : _param.isImp
              }}
              textBox={{
                className: "txt-fld",
                name: _param.name
              }}
              {..._param.others}
              events={{
                onChange: this.datePickerHandler.bind(this)
              }}
              value={this.state.parameterCollection[_param.name]}
            />
          );
          break;
        case "search":
          _controls.push(
            <React.Fragment key={i}>
              <AlagehFormGroup
                div={{ className: _className }}
                label={{
                  fieldName: _param.name,
                  forceLabel: _param.label,
                  isImp: _param.isImp !== undefined ? false : _param.isImp
                }}
                textBox={{
                  className: "txt-fld",
                  name: _param.name,

                  value: this.state.parameterCollection[_param.name],
                  ..._param.others
                }}
              />
              <div className="col-1">
                <i
                  surrounds={_param.name}
                  onClick={this.searchButton.bind(this)}
                  className="fas fa-search"
                  style={{
                    cursor: "pointer",
                    marginTop: "28px"
                  }}
                />
              </div>
            </React.Fragment>
          );
          break;
        case "checkbox":
          const _default =
            this.state[_param.name + "_checked"] === undefined
              ? _param.default === undefined
                ? false
                : _param.default
              : this.state[_param.name + "_checked"];
          _controls.push(
            <div
              key={i}
              className="customCheckbox col-2"
              style={{ border: "none", marginTop: "28px" }}
            >
              <label className="checkbox" style={{ color: "rgb(33, 37, 41)" }}>
                <input
                  type="checkbox"
                  name={_param.name}
                  checked={_default}
                  value={_default ? "Y" : "N"}
                  onChange={this.checkBoxRadioHandle.bind(this)}
                />
                <span style={{ fontSize: "0.8rem" }}>{_param.label}</span>
              </label>
            </div>
          );
          break;
        case "radio":
          const _Rdefault =
            this.state[_param.name + "_checked"] === undefined
              ? _param.default === undefined
                ? false
                : _param.default
              : this.state[_param.name + "_checked"];
          _controls.push(
            <div key={i} className="customRadio col-2">
              <label className="radio inline">
                <input
                  type="radio"
                  checked={_Rdefault}
                  name={_param.name}
                  value={_Rdefault ? "Y" : "N"}
                  onChange={this.checkBoxRadioHandle.bind(this)}
                />
                <span>{_param.label}</span>
              </label>
            </div>
          );
          break;
        default:
          _controls.push(
            <AlagehFormGroup
              key={i}
              div={{ className: _className }}
              label={{
                fieldName: _param.name,
                forceLabel: _param.label,
                isImp: _param.isImp !== undefined ? false : _param.isImp
              }}
              textBox={{
                className: "txt-fld",
                name: _param.name,
                value: this.state.parameterCollection[_param.name],
                events: {
                  onChange: this.textBoxHandle.bind(this)
                },
                ..._param.others
              }}
            />
          );
          break;
      }
    }

    return _controls;
  }

  render() {
    const _isBarcodeReport = this.props.isbarcodereport;

    if (this.state.hasError) {
      return null;
    }
    if (this.state.openPopup)
      return (
        <div
          className={
            _isBarcodeReport
              ? "algaehModalWrapper barcodePopup"
              : "algaehModalWrapper"
          }
        >
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Print Preview</h4>
                </div>
                <div className="col-lg-4">
                  <button
                    type="button"
                    className=""
                    onClick={this.handleClose.bind(this)}
                  >
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>
            <div />
            <div>
              {this.props.options !== undefined &&
              this.props.options.plotUI !== undefined ? (
                <React.Fragment>
                  <div id="report_generation_interface">
                    {/* {this.props.options.plotUI.paramters()} */}

                    <div
                      className="col-lg-12 margin-top-15"
                      data-validate="parameters-data"
                    >
                      <div className="row">
                        {this.generateInputParameters()}
                      </div>
                    </div>
                    <div className="reportActionBtns">
                      <ButtonType
                        others={{ style: { float: "right" } }}
                        classname="btn-primary"
                        onClick={this.generateReport.bind(this, this)}
                        label={{
                          forceLabel: "  Generate Report",
                          returnText: true
                        }}
                      />
                      {/*<button
                        className="btn btn-primary"
                        onClick={this.generateReport.bind(this)}
                      >
                        Generate Report
                      </button>*/}
                    </div>
                  </div>
                </React.Fragment>
              ) : null}
              {this.props.plotui !== undefined ? this.props.plotui : null}
            </div>
            <div
              className="popupInner "
              ref={el => (this.algehPrintRef = el)}
              style={{ minHeight: "30vh" }}
            >
              {/*this.props.options !== undefined &&
              this.props.options.report !== undefined &&
              this.props.options.report.requireIframe === true ? (
                <iframe
                  src={this.state._htmlString}
                  width="100%"
                  height="100%"
                  className="reportPDFIframe"
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.state._htmlString
                  }}
                />
            )*/}

              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    {this.props.children ? this.props.children : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>
                  <div className="col-lg-8">
                    {/* <ReactToPrint
                      trigger={() => (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={e => {
                            this.onClose(e);
                          }}
                        >
                          Print
                        </button>
                      )}
                      content={() => this.algehPrintRef}
                    /> */}

                    {/* <input
                      type="radio"
                      name="report_preview"
                      id="report_normal_preview"
                      value="0"
                      onChange={this.onChangeReportPreview.bind(this)}
                      checked={
                        this.state.report_preview_type === 0 ? true : false
                      }
                    />
                    <label htmlFor="report_normal_preview">Normal</label>
                    <input
                      type="radio"
                      name="report_preview"
                      id="report_pdf_preview"
                      value="1"
                      onChange={this.onChangeReportPreview.bind(this)}
                      checked={
                        this.state.report_preview_type === 1 ? true : false
                      }
                    />
                    <label htmlFor="report_pdf_preview">PDF</label>
                    <input
                      type="radio"
                      name="report_preview"
                      id="report_excel_preview"
                      value="2"
                      onChange={this.onChangeReportPreview.bind(this)}
                      checked={
                        this.state.report_preview_type === 2 ? true : false
                      }
                    />
                    <label htmlFor="report_excel_preview">Excel</label> */}

                    {/*<button
                      className="btn btn-default"
                      type="button"
                      disabled={this.state.buttonDisable}
                      onClick={this.onChangeReportPreview.bind(this, "PDF")}
                    >
                      Download as PDF
                    </button>

                    <button
                      className="btn btn-default"
                      type="button"
                      disabled={this.state.buttonDisable}
                      onClick={this.onChangeReportPreview.bind(this, "XSLS")}
                    >
                      Download as Excel
                    </button>*/}
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={this.handleClose.bind(this)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    else return null;
  }
}
