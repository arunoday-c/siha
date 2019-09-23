import React, { Component } from "react";
import "./HolidayMgmnt.scss";
import HolidayMgmntClndr from "./HolidayMgmntClndr/HolidayMgmntClndr";
// import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

class HolidayMgmnt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "HolidayMgmntClndr"
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
          {this.state.pageDisplay === "HolidayMgmntClndr" ? (
            <HolidayMgmntClndr />
          ) : null}
        </div>
      </div>
    );
  }
}

export default HolidayMgmnt;
