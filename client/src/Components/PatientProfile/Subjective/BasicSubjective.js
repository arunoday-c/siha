import React, { Component } from "react";
import "./subjective.css";
// import Allergies from "../Allergies/Allergies";
// import ReviewofSystems from "../ReviewofSystems/ReviewofSystems";
// import ChiefComplaints from "../ChiefComplaints/ChiefComplaints.js";

import Vitals from "../Vitals/Vitals";
class BasicSubjective extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="subjective">
        <div className="row margin-top-15">
          <div className="col-lg-3">
            <Vitals />
          </div>
          {/* 
          <div className="col-lg-9">
            <ChiefComplaints />
            <div className="row">
              <div className="col-lg-6">
                <Allergies />
              </div>
              <div className="col-lg-6">
                <ReviewofSystems />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default BasicSubjective;
