import React, { Component } from "react";
import "../styles/site.scss";

class SuccessDialog extends Component {
  render() {
    return (
      <div>
        <div className="check_mark">
          <div className="sa-icon sa-success animate">
            <span className="sa-line sa-tip animateSuccessTip" />
            <span className="sa-line sa-long animateSuccessLong" />
            <div className="sa-placeholder" />
            <div className="sa-fix" />
          </div>
        </div>
      </div>
    );
  }
}

export default SuccessDialog;
