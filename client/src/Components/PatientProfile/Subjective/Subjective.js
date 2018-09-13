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
