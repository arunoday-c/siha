import React, { Component } from "react";
import AlgaehModalPopUp from "../../../../Wrapper/modulePopUp";

class LeaveAuthDetail extends Component {
  render() {
    return (
      <AlgaehModalPopUp
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
      >
        LEAVE AUTH DETAIL
      </AlgaehModalPopUp>
    );
  }
}

export default LeaveAuthDetail;
