import React, { Component } from "react";
import { AlgaehDateHandler } from "../../Wrapper/algaehWrapper";

class HolidayList extends Component {
  render() {
    return (
      <div>
        HOLDAY LIST
        <br />
        <AlgaehDateHandler
          div={{ className: "col-lg-3" }}
          label={{ fieldName: "effective_start_date", isImp: true }}
          textBox={{ className: "txt-fld" }}
          maxDate={new Date()}
          events={
            {
              //   onChange: this.changeEST.bind(this)
            }
          }
        />
      </div>
    );
  }
}

export default HolidayList;
