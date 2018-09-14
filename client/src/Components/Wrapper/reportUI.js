import React, { Component } from "react";
import "./wrapper.scss";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import ReactToPrint from "react-to-print";
export default class ReportUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "",
      openPopup: true
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
  render() {
    return (
      <Modal open={this.state.openPopup}>
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

          <div className="popupInner" ref={el => (this.algehPrintRef = el)}>
            {this.props.children ? this.props.children : null}
          </div>
          {/* <div className="row popupFooter">
            <Button
              variant="raised"
              onClick={this.handleClose.bind(this)}
              style={{ backgroundColor: "#D5D5D5" }}
              size="small"
            >
              Close
            </Button>
            <ReactToPrint
              trigger={() => (
                <Button
                  variant="raised"
                  style={{ backgroundColor: "#D5D5D5" }}
                  size="small"
                >
                  Print
                </Button>
              )}
              content={() => this.algehPrintRef}
            />
          </div> */}

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
      </Modal>
    );
  }
}
