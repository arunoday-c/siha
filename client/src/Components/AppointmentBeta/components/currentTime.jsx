import React from "react";
import moment from "moment";
export default React.memo(function CurrentTime(props) {
  function changeDisplay(changeTime) {
    const toTime = moment(props.slotTime, "hh:mm A")
      .add(parseInt(props.slot, 10), "minutes")
      .format("HHmm");
    const fromTime = moment(props.slotTime, "hh:mm A").format("HHmm");
    const currentFromTime = moment(changeTime, "HH:mm").format("HHmm");
    const currentToTime = moment(currentFromTime)
      .add(parseInt(props.slot, 10), "minutes")
      .format("HHmm");
    const result =
      (parseInt(fromTime, 10) <= parseInt(currentFromTime, 10) &&
        parseInt(toTime, 10) > parseInt(currentFromTime, 10)) ||
      (parseInt(fromTime, 10) <= parseInt(currentToTime, 10) &&
        parseInt(toTime, 10) >= parseInt(currentToTime, 10));
    return result;
  }
  return (
    <td activetime="true">
      <span
        className="schedulePosition"
        style={{
          display: changeDisplay(props.changeTime) === true ? "block" : "none",
        }}
      >
        <i className="fas fa-caret-left"></i>
      </span>
    </td>
  );
});
