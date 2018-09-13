import React, { Component } from "react";
import "./physical_examination.css";
import Vitals from "../Vitals/Vitals";
import Examination from "../Examination/Examination";
import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";

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
              <div className="portlet portlet-bordered box-shadow-normal">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Examination Notes</h3>
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
        </div>
      </div>
    );
  }
}

export default PhysicalExamination;
