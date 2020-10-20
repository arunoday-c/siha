import React, { useState } from "react";
import "./PolicyModal.scss";
import { AlgaehModal, Button } from "algaeh-react-components";
import { InsuranceDropdown } from "../../common/InsuranceDropdown";
import NetworkPlan from "../NetworkPlan/NetworkPlan";

export function PolicyModal({ visible, onClose }) {
  const [insurance, setInsurance] = useState(null);

  return (
    <AlgaehModal
      title={"Add New Policy"}
      visible={visible}
      mask={true}
      maskClosable={true}
      onCancel={onClose}
      footer={[
        <Button className="btn btn-default" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={720}
      // footer={null}
      className={`row algaehNewModal patPolicyModal`}
    // class={this.state.lang_sets}
    >
      <div className="popupInner">
        <div className="row">
          <div className="col-12 insHeadSec">
            <InsuranceDropdown
              div={{ className: "col-5 mandatory" }}
              value={insurance?.hims_d_insurance_provider_id}
              onChange={(obj) => setInsurance(obj)}
              label={{ forceLabel: "Insurance" }}
            />
          </div>
          <div className="col-12 insPolicySec">
            <NetworkPlan
              key={insurance?.hims_d_insurance_provider_id || "idle"}
              InsuranceSetup={{
                insurance_provider_id: insurance?.hims_d_insurance_provider_id,
                insurance_provider_name: insurance?.insurance_provider_name,
              }}
            />
          </div>
        </div>
      </div>
    </AlgaehModal>
  );
}
