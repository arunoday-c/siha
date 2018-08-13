import React, { Component } from "react";
import "./experiment.css";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import { AlagehAutoComplete } from "./Wrapper/algaehWrapper";
import GlobalVariables from "../utils/GlobalVariables.json";

class DeptMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pain: 0
    };
  }

  handleChangeStart = () => {
    console.log("Change event started");
  };

  handleChange = pain => {
    this.setState({
      pain: pain
    });
  };

  handleChangeComplete = () => {
    console.log("Change event completed");
  };

  setPainScale(pain_number, e) {
    var element = document.querySelectorAll("[painTab]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    this.setState({ pain: pain_number });
  }

  render() {
    return (
      <div className="experiment">
        <div>PAIN SCALE {" " + this.state.pain} </div>
        <br />
        <div className="row">
          <div className="pain_slider col">
            <Slider
              step={2}
              min={0}
              max={10}
              value={this.state.pain}
              onChangeStart={this.handleChangeStart}
              onChange={this.handleChange}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>

          <AlagehAutoComplete
            div={{ className: "col-lg-3" }}
            label={{
              fieldName: "pain",
              forceLabel: "Pain",
              isImp: true
            }}
            selector={{
              name: "pain",
              className: "select-fld",
              value: this.state.pain,
              dataSource: {
                textField:
                  this.state.selectedLang === "en" ? "name" : "arabic_name",
                valueField: "value",
                data: GlobalVariables.PAIN_SCALE
              }
              // onChange: texthandle.bind(this, this)
            }}
          />
        </div>

        <div>
          <ul className="pain-scale-ul">
            <li
              className="pain-1"
              painTab="1"
              onClick={this.setPainScale.bind(this, 0)}
            />
            <li
              className="pain-2"
              painTab="2"
              onClick={this.setPainScale.bind(this, 2)}
            />
            <li
              className="pain-3"
              painTab="3"
              onClick={this.setPainScale.bind(this, 4)}
            />
            <li
              className="pain-4"
              painTab="4"
              onClick={this.setPainScale.bind(this, 6)}
            />
            <li
              className="pain-5"
              painTab="5"
              onClick={this.setPainScale.bind(this, 8)}
            />
            <li
              className="pain-6"
              painTab="6"
              onClick={this.setPainScale.bind(this, 10)}
            />
          </ul>
        </div>
      </div>
    );
  }
}

export default DeptMaster;
