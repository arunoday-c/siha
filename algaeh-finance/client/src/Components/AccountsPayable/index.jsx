import React from "react";
import { AlgaehTabs, AlgaehLabel } from "algaeh-react-components";
import SupplierList from "../SupplierListFinance";
export default React.memo(function AccountsPayable(props) {
  return (
    <AlgaehTabs
      removeCommonSection={true}
      content={[
        {
          title: (
            <AlgaehLabel
              label={{
                forceLabel: "Supplier List",
              }}
            />
          ),
          children: (
            <div className="col-12">
              <div style={{ marginTop: 40 }}>
                <SupplierList />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
});
