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
      <div>
        <Modal open={this.state.openPopup}>
          <div className="algaeh-modal">
            <div className="row popupHeader">
              <h4>Print Preview</h4>
            </div>
            <div ref={el => (this.algehPrintRef = el)}>
              {this.props.children}
            </div>
            <div className="row popupFooter">
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
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
