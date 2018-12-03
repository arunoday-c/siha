import React, { PureComponent } from "react";
export default class AlgaehModalPopUp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false
    };
    //this.setState({ openPopup: this.props.openPopup });
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose(e) {
    this.setState({ openPopup: false }, () => {
      if (this.props.events !== undefined)
        if (typeof this.props.events.onClose === "function")
          this.props.events.onClose();
    });
  }
  componentWillReceiveProps(newProps) {
    this.setState({ openPopup: newProps.openPopup });
  }
  render() {
    const { openPopup } = this.state.openPopup;
    if (this.state.openPopup === true) {
      return (
        <div className="algaehModalWrapper">
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>{this.props.title ? this.props.title : "Algaeh HIMS"}</h4>
                </div>
                <div className="col-lg-4">
                  <button type="button" className="" onClick={this.handleClose}>
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>
            <div className="popupInner">
              <div className="col-lg-12">{this.props.children}</div>
            </div>
          </div>
        </div>
      );
    } else return null;
  }
}
