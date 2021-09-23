import React from "react";
import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";
import CustomerList from "../CustomerListFinance";
import JournalVoucher from "../JournalVoucher";
export default React.memo(function AccountReceivable(props) {
  return (
    <AlgaehTabs
      removeCommonSection={true}
      content={[
        {
          title: (
            <AlgaehLabel
              label={{
                forceLabel: "Customer List",
              }}
            />
          ),
          children: (
            <div className="col-12">
              <div style={{ marginTop: 40 }}>
                <CustomerList />
              </div>
            </div>
          ),
        },
        {
          title: (
            <AlgaehLabel
              label={{
                forceLabel: "Credit Notes",
              }}
            />
          ),
          children: (
            <div className="col-12">
              <div style={{ marginTop: 40 }}>
                <JournalVoucher
                  voucher_type="credit_note"
                  voucher_type_disabled={true}
                />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
});
