import React, { memo } from "react";
import { AlgaehLabel } from "algaeh-react-components";

export default memo(function DoctorInLeave() {
  return (
    <tr>
      <td>
        <span className="doctorLeaveCntr">
          <AlgaehLabel
            label={{
              fieldName: "doctorLeave",
            }}
          />
        </span>
      </td>
    </tr>
  );
});
