import React, { Component } from "react";
import "./mrd_list.css";
import PatientMRD from "../PatientMRD/PatientMRD.js";

class MRDList extends Component {
  render() {
    return (
      <div className="mrd-list">
        <PatientMRD />
      </div>
    );
  }
}

export default MRDList;
