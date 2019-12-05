import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
const modalRoot = document.getElementById("algaeh_model_Popup");
export default class AlgaehModalPopUp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false
    };
    this.el = document.createElement("div");
    // this.setState({ openPopup: this.props.openPopup });
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose(e) {
    this.setState({ openPopup: false }, () => {
      if (this.props.events !== undefined)
        if (typeof this.props.events.onClose === "function")
          this.props.events.onClose();
    });
  }
  componentDidMount() {
    modalRoot.appendChild(this.el);
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({ openPopup: newProps.openPopup });
  }
  render() {
    const openPopup = this.state.openPopup;

    if (openPopup) {
      return ReactDOM.createPortal(
        <div className={"algaehModalWrapper " + this.props.class}>
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
            {this.props.children}
          </div>
        </div>,
        this.el
      );
    } else return null;
  }
}
