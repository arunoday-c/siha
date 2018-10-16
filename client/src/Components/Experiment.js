import React, { Component } from "react";
import { algaehApiCall } from "../utils/algaehApiCall";

class Experiment extends Component {
  closeConnections() {
    //masters/killDbConnections

    algaehApiCall({
      uri: "/masters/killDbConnections",
      method: "GET"
    });
  }

  render() {
    return (
      <div style={{ margin: "auto" }}>
        <button
          className="btn btn-primary"
          onClick={this.closeConnections.bind(this)}
        >
          Kill Connections
        </button>
      </div>
    );
  }
}

export default Experiment;
