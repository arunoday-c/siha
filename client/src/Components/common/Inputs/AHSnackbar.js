import React, { PureComponent } from "react";
// import Slide from "@material-ui/core/Slide";
// import Snackbar from "@material-ui/core/Snackbar";
// import SnackbarContent from "@material-ui/core/SnackbarContent";
import { swalMessage } from "../../../utils/algaehApiCall";
// function TransitionUp(props) {
//   return <Slide {...props} direction="up" />;
// }

export default class AlgaehSnackBar extends PureComponent {
  constructor(args) {
    super(args);
    this.state = {
      values: [],
      age: "",
      SelectVal: ""
    };
  }
  renderSweetalert(message) {
    if (message !== undefined && message !== "" && message !== null) {
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
        {this.renderSweetalert(this.props.MandatoryMsg)}
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
