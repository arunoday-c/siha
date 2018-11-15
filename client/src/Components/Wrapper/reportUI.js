import React, { Component } from "react";
import "./wrapper.scss";
import Modal from "@material-ui/core/Modal";
import ReactToPrint from "react-to-print";
import { successfulMessage } from "../../utils/GlobalFunctions";
import { algaehApiCall } from "../../utils/algaehApiCall";
import { accessReport } from "../Wrapper/printReports";
export default class ReportUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "",
      openPopup: true,
      hasError: false,
      _htmlString: {}
    };
  }
  componentWillMount() {
    this.setState({
      openPopup: true
    });
  }

  componentWillReceiveProps() {
    this.setState({
      openPopup: true
    });
  }

  handleClose = e => {
    this.setState({
      openPopup: false
    });
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
  generateReport(e) {
    let _inputServiceParameter = {};
    const _rootElements = document.querySelectorAll("[report-parameter]");
    for (let i = 0; i < _rootElements.length; i++) {
      let _value = "";
      switch (_rootElements[i].type) {
        case "date":
          _value = new Date(_rootElements[i].value);
          break;

        default:
          const _refValue = _rootElements[i].getAttribute("referencevalue");
          if (_refValue !== undefined) {
            _value = _refValue;
          } else {
            const _checkBox = _rootElements[i].getAttribute("checkvalue");
            if (_checkBox !== undefined) {
              _value = _checkBox;
            } else _value = _rootElements[i].value;
          }
      }
      _inputServiceParameter[
        _rootElements[i].getAttribute("report-parameter")
      ] = _value;
    }
    const _checkInput =
      this.props.options.onInput !== undefined
        ? this.props.options.onInput(_inputServiceParameter)
        : _inputServiceParameter;
    const that = this;
    let options = { ...this.props.options, ...{ getRaw: true } };
    algaehApiCall({
      uri: options.plotUI.api,
      data: _checkInput,
      method: "GET",
      onSucesss: response => {
        if (response.data.success === true) {
          new Promise((resolve, reject) => {
            resolve(options.onSucesss(response.data.records));
          }).then(data => {
            options.data = data;
            that.setState({
              _htmlString: {
                dangerouslySetInnerHTML: {
                  __html: accessReport(options)
                }
              }
            });
          });
        }
      }
    });
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    if (this.state.openPopup)
      return (
        <div className="algaehModalWrapper">
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
                <div id="report_generation_interface">
                  {this.props.options.plotUI.paramters()}

                  <button
                    style={{ textAlign: "center", margin: "16px" }}
                    className="btn btn-primary"
                    onClick={this.generateReport.bind(this)}
                  >
                    Generate Report
                  </button>
                </div>
              ) : null}
              {this.props.plotui !== undefined ? this.props.plotui : null}
            </div>
            <div
              className="popupInner "
              ref={el => (this.algehPrintRef = el)}
              {...this.state._htmlString}
            >
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12 popRightDiv">
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
                    <ReactToPrint
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
                    />
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
