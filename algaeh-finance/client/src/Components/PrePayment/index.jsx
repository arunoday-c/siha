import React from "react";
import "./PrePayment.scss";
import { PrepaymentMaster } from "./PrepaymentMaster";
import { PrepaymentRequest } from "./PrepaymentRequest";
import { PrepaymentList } from "./PrepaymentList";
import { PrepaymentProcess } from "./PrepaymentProcess";

import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";

export default function PrePayment() {
  return (
    <div className="PrepaymentModule">
      <AlgaehTabs
        removeCommonSection={true}
        content={[
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Prepayment Master",
                }}
              />
            ),
            children: <PrepaymentMaster />,
            componentCode: "PRE_PAY_MST",
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Prepayment Request",
                }}
              />
            ),
            children: <PrepaymentRequest />,
            componentCode: "PRE_PAY_REQ",
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Prepayment Auth List",
                }}
              />
            ),
            children: <PrepaymentList />,
            componentCode: "PRE_PAY_LST",
          },
          {
            title: (
              <AlgaehLabel
                label={{
                  forceLabel: "Prepayment Process",
                }}
              />
            ),
            children: <PrepaymentProcess />,
            componentCode: "PRE_PAY_PRS",
          },
        ]}
        renderClass="PrepaymentCntr"
      />
    </div>
  );
}
