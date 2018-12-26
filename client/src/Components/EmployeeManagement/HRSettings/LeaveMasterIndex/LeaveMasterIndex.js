import React, { Component } from "react";
import LeaveMaster from "./LeaveMaster/LeaveMaster";

export default class LeaveMasterIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  render() {
    return (
      <div className="leave_master_index">
        <LeaveMaster open={this.state.open} />

        <button
          onClick={() => {
            this.setState({
              open: true
            });
          }}
          className="btn btn-primary"
        >
          OPEN POPUP
        </button>
      </div>
    );
  }
}
