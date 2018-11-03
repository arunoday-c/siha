import React, { Component } from "react";
import "./PatientHistory.css";
import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";

class PatientHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  textHandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    this.accordianHistory();
  }

  accordianHistory() {
    const acc = document.getElementsByClassName("accordion-btn");
    let i;
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-lg-12">
          <div id="subjectAccordian" className="row">
            <button className="accordion-btn">Section 1</button>
            <div className="panel">
              <AlagehFormGroup
                div={{ className: "" }}
                label={{
                  forceLabel: "",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "social_history",
                  value: this.state.social_history,
                  others: {
                    multiline: true,
                    rows: "6"
                  },
                  events: {
                    onChange: this.textHandle.bind(this)
                  }
                }}
              />
            </div>

            <button className="accordion-btn">Section 2</button>
            <div className="panel">
              <AlagehFormGroup
                div={{ className: "" }}
                label={{
                  forceLabel: "",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "medical_history",
                  value: this.state.medical_history,
                  others: {
                    multiline: true,
                    rows: "6"
                  },
                  events: {
                    onChange: this.textHandle.bind(this)
                  }
                }}
              />
            </div>

            <button className="accordion-btn">Section 3</button>
            <div className="panel">
              <AlagehFormGroup
                div={{ className: "" }}
                label={{
                  forceLabel: "",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "surgical_history",
                  value: this.state.surgical_history,
                  others: {
                    multiline: true,
                    rows: "6"
                  },
                  events: {
                    onChange: this.textHandle.bind(this)
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* <div className="row">
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Medical History</h3>
                </div>
              </div>

              <div className="portlet-body" style={{minHeight:"20vh"}}>
                
              </div>
            </div>
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Social History</h3>
                </div>
              </div>

              <div className="portlet-body" style={{minHeight:"20vh"}}>
               
              </div>
            </div>
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Surgical History</h3>
                </div>
              </div>

              <div className="portlet-body" style={{minHeight:"20vh"}}>
               
              </div>
            </div>
          </div> */}
      </React.Fragment>
    );
  }
}

export default PatientHistory;
