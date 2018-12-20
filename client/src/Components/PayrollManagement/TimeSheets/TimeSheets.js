import React, { Component } from "react";
import "./TimeSheets.css";
import TimeSheetData from "./TimeSheetData/TimeSheetData";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

class TimeSheets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "TimeSheetData"
    };
  }

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
    this.setState({
      pageDisplay: specified
    });
  }

  render() {
    return (
      <div className="time_sheets">
        <div className="time_sheets-setion">
          {this.state.pageDisplay === "TimeSheetData" ? (
            <TimeSheetData />
          ) : null}
        </div>
      </div>
    );
  }
}

export default TimeSheets;
