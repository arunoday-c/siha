import React, { Component, PureComponent } from "react";
import { Slide, Snackbar } from "material-ui";

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

export default class AlgaehSnackBar extends PureComponent {
  constructor(args) {
    super(args);
    this.state = {
      values: [],
      age: "",
      SelectVal: ""
    };
  }

  render() {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={this.props.open}
        onClose={this.props.handleClose}
        // TransitionComponent={TransitionUp}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={
          <span id="message-id" style={{ color: "red" }}>
            {this.props.MandatoryMsg}
          </span>
        }
      />
    );
  }
}
