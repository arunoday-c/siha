import React, { Component } from "react";
import "./subjective.css";
import Paper from "@material-ui/core/Paper";

class Subjective extends Component {
  render() {
    return (
      <div className="subjective">
        <div className="row">
          <div className="card box-shadow-normal col-lg-8">
            Chief Complaints
            <div className="float-right">Add</div>
          </div>
          <div className="card box-shadow-normal col-lg-4">Allergies</div>
        </div>
      </div>
    );
  }
}

export default Subjective;
