import React, { Component } from "react";
import "./physical_examination.css";
import Vitals from "../Vitals/Vitals";
import Examination from "../Examination/Examination";

class PhysicalExamination extends Component {
  render() {
    return (
      <div className="physical_examination">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-8">
              <Examination />
              <Vitals />
            </div>
            <div className="col-lg-4 margin-top-15">
              {/* Chart Goes Here */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhysicalExamination;
