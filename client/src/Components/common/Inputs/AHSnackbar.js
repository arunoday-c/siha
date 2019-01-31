import React, { PureComponent } from "react";
import { swalMessage } from "../../../utils/algaehApiCall";

export default class AlgaehSnackBar extends PureComponent {
  constructor(args) {
    super(args);
    this.state = {
      values: [],
      age: "",
      SelectVal: "",
      isopen: false
    };
  }
  componentDidMount() {
    this.setState({
      isopen: this.props.open
    });
  }
  componentWillReceiveProps(props) {
    this.setState({
      isopen: props.open
    });
    //this.renderSweetalert();
  }

  renderSweetalert(message, isopen) {
    if (message !== null) {
      // console.log("MEssage", isopen);
      if (isopen)
        swalMessage({
          title: message,
          type: "warning"
        });
    }

    return null;
  }
  render() {
    return (
      <React.Fragment>
        {this.renderSweetalert(this.props.MandatoryMsg, this.state.open)}
      </React.Fragment>
    );
  }
}

// <Snackbar
//   anchorOrigin={{ vertical: "top", horizontal: "center" }}
//   open={this.props.open}
//   onClose={this.props.handleClose}
//   // TransitionComponent={TransitionUp}
//   ContentProps={{
//     "aria-describedby": "message-id",
//     className: "test"
//   }}
//   message={
//     <span id="message-id" style={{ color: "red" }}>
//       {this.props.MandatoryMsg}
//     </span>
//   }
// />
