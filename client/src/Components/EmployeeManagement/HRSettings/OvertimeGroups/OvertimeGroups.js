import React, { Component } from "react";
import "./overtime_groups.css";
import { AlagehFormGroup } from "../../../Wrapper/algaehWrapper";

class OvertimeGroups extends Component {
  render() {
    return (
      <div className="overtime_groups">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "overtime_group_code",
                value: this.state.overtime_group_code,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                forceLabel: "Description",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                //decimal: { allowNegative: false },
                name: "overtime_group_description",
                value: this.state.overtime_group_description,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default OvertimeGroups;
