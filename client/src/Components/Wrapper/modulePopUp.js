import React, { PureComponent } from "react";
export default class AlgaehModalPopUp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false
    };
    this.setState({ openPopup: this.props.openPopup });
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose(e) {
    this.setState({ openPopup: false });
  }
  render() {
    const { openPopup } = this.state;
    if (openPopup) {
      return (
        <div className="algaehModalWrapper">
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Print Preview</h4>
                </div>
                <div className="col-lg-4">
                  <button type="button" className="" onClick={this.handleClose}>
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>
            {this.props.children}
          </div>
        </div>
      );
    } else return null;
  }
}
