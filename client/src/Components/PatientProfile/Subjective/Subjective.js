import React, { Component } from "react";
import "./subjective.css";
import Allergies from "../Allergies/Allergies";
import ReviewofSystems from "../ReviewofSystems/ReviewofSystems";
import ChiefComplaints from "../ChiefComplaints/ChiefComplaints.js";

import Vitals from "../Vitals/Vitals";
class Subjective extends Component {
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
          </div>
        </div>
      </div>
    );
  }
}

export default Subjective;

// <AlagehAutoComplete
// div={{ className: "col-lg-10 displayInlineBlock" }}
// label={{
//   forceLabel: "Chief Complaint",
//   fieldName: "sample"
// }}
// selector={{
//   name: "chief_complaint_id",
//   className: "select-fld",
//   value: this.state.chief_complaint_id,
//   dataSource: {
//     textField: "hpi_description",
//     valueField: "hims_d_hpi_header_id",
//     data:
//       this.state.chiefComplainList.length !== 0
//         ? this.state.chiefComplainList
//         : null
//   },
//   onChange: this.dropDownHandle.bind(this),
//   userList: list => {
//     //TODO need to change with appropriate service call --noor
//     debugger;
//     alert(JSON.stringify(list));
//   }
// }}
// />
