import React, { useState } from "react";
import {
  AlgaehLabel,
  AlgaehMessagePop,
  AlgaehModal,
  Spin,
} from "algaeh-react-components";
// import { useForm, Controller } from "react-hook-form";
import sockets from "../../sockets";
import { newAlgaehApi } from "../../hooks";
export default function RequestForCorrection({
  title,
  type,
  visible,
  onClose,
  rowData,
  // dataProps,
}) {
  const [req_correction_reason, setReq_correction_reason] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    newAlgaehApi({
      uri: "/invoiceGeneration/updateClaimReqCorrectionStatusRCM",
      module: "insurance",
      method: "PUT",
      data: {
        hims_f_invoice_header_id: rowData.hims_f_invoice_header_id,
        request_comment: req_correction_reason,
        correction_requested: "R",
      },
    })
      .then((result) => {
        if (sockets.connected) {
          sockets.emit("request_insurance_correction", {
            type,
            rowData,
            // dataProps,
          });
        }
        onClose();
        setLoading(false);
        AlgaehMessagePop({
          type: "success",
          display: "Notified doctor Successfully",
        });
      })
      .catch((err) => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: err.message,
        });
      });
  };
  //   const {
  //     handleSubmit,
  //     control,
  //     formState: { errors },
  //   } = useForm();
  return (
    <div>
      <Spin spinning={loading}>
        <AlgaehModal
          title={title}
          visible={visible}
          mask={true}
          maskClosable={true}
          onCancel={onClose}
          footer={null}
          className={`row algaehNewModal correctionModal`}
        >
          <form onSubmit={onSubmit}>
            <div className="col-12 popupInner margin-top-15">
              <div className="col-12">
                <div className="row">
                  {" "}
                  <AlgaehLabel
                    label={{
                      forceLabel: "Enter Correction Reasons.",
                    }}
                  />
                  <textarea
                    value={req_correction_reason}
                    onChange={(e) => setReq_correction_reason(e.target.value)}
                    name="req_correction_reason"
                    maxLength={160}
                  />
                  <small className="float-right">
                    Max Char. {req_correction_reason?.length ?? 0} /{160}
                  </small>
                </div>
              </div>
            </div>
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      // onClick={onSubmit}
                      // disabled={!shifts?.length || !inputs?.cash_amount}
                    >
                      Notify Doctor
                    </button>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* </div> */}
        </AlgaehModal>
      </Spin>
    </div>
  );
}
