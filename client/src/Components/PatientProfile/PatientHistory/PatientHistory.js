import React, { Component } from "react";
import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";

class PatientHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  textHandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-lg-12">
          <div className="row">
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Medical History</h3>
                </div>
              </div>

              <div className="portlet-body">
                <AlagehFormGroup
                  div={{ className: "col-lg-12" }}
                  label={{
                    forceLabel: "",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "assesments_notes",
                    //value: this.state.assesments_notes,
                    others: {
                      multiline: true,
                      rows: "10"
                    },
                    events: {
                      //onChange: assnotetexthandle.bind(this, this)
                    }
                  }}
                />
              </div>
            </div>
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Social History</h3>
                </div>
              </div>

              <div className="portlet-body">
                <AlagehFormGroup
                  div={{ className: "col-lg-12" }}
                  label={{
                    forceLabel: "",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "assesments_notes",
                    //value: this.state.assesments_notes,
                    others: {
                      multiline: true,
                      rows: "10"
                    },
                    events: {
                      //onChange: assnotetexthandle.bind(this, this)
                    }
                  }}
                />
              </div>
            </div>
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Surgical History</h3>
                </div>
              </div>

              <div className="portlet-body">
                <AlagehFormGroup
                  div={{ className: "col-lg-12" }}
                  label={{
                    forceLabel: "",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "assesments_notes",
                    //value: this.state.assesments_notes,
                    others: {
                      multiline: true,
                      rows: "10"
                    },
                    events: {
                      //onChange: assnotetexthandle.bind(this, this)
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PatientHistory;
