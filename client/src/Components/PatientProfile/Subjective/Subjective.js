import React, { Component } from "react";
import "./subjective.css";
import Allergies from "../Allergies/Allergies";
import ReviewofSystems from "../ReviewofSystems/ReviewofSystems";
import ChiefComplaints from "../ChiefComplaints/ChiefComplaints.js";

class Subjective extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="subjective">
        <div className="col-lg-12" style={{ marginTop: "15px" }}>
          <div className="row">
            <div className="col-lg-8">
              <ChiefComplaints />
            </div>

            <div className="col-lg-4">
              <Allergies />
              <ReviewofSystems />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Subjective;
