import React from "react";
import { AlgaehModal, Spin } from "algaeh-react-components";
import { useQuery } from "react-query";
import { getInvoiceForVisit } from "./apis";
import { InvoiceDetails } from "../InvoiceGeneration/InvoiceDetails";

export function InvoiceModal({ visible, onClose, visit_id, extra }) {
  const { data: details, isLoading: detailLoading } = useQuery(
    ["get-invoice", { visit_id }],
    getInvoiceForVisit,
    {
      enabled: !!visit_id && visible,
    }
  );
  //   const { data, isLoading: billLoading } = useQuery(
  //     ["getbilling", { details }],
  //     getBillDetails,
  //     {
  //       enabled: !!details?.length,
  //     }
  //   );
  return (
    <AlgaehModal
      title={"Invoice Details"}
      visible={visible}
      mask={true}
      maskClosable={true}
      onCancel={onClose}
      width={1200}
      footer={[
        <button onClick={onClose} className="btn btn-default">
          Close
        </button>,
      ]}
    >
      <Spin spinning={detailLoading}>
        <InvoiceDetails
          details={details}
          data={{
            insurance_provider_name: extra?.insurance_provider_name,
            sub_insurance_provider_name: extra?.insurance_sub_name,
            ...extra,
            company_payble: extra?.company_payable,
          }}
        />
      </Spin>
    </AlgaehModal>
  );
}
