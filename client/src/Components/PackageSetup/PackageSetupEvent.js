import { algaehApiCall } from "../../utils/algaehApiCall";
// import _ from "lodash";
import Enumerable from "linq";
// import { AlgaehValidation } from "../../utils/GlobalFunctions";

export default function PackageSetupEvent() {
  return {
    getPackage: $this => {
      algaehApiCall({
        uri: "/packagesetup/getPackage",
        module: "masterSettings",
        method: "GET",
        onSuccess: response => {
          if (response.data.success) {
            let ItemList = Enumerable.from(response.data.records)
              .groupBy("$.hims_d_package_header_id", null, (k, g) => {
                let firstRecordSet = Enumerable.from(g).firstOrDefault();

                return {
                  hims_d_package_header_id:
                    firstRecordSet.hims_d_package_header_id,
                  package_code: firstRecordSet.package_code,

                  package_name: firstRecordSet.package_name,
                  package_amount: firstRecordSet.package_amount,
                  total_service_amount: firstRecordSet.total_service_amount,
                  profit_loss: firstRecordSet.profit_loss,
                  pl_amount: firstRecordSet.pl_amount,

                  package_type: firstRecordSet.package_type,
                  expiry_days: firstRecordSet.expiry_days,
                  advance_type: firstRecordSet.advance_type,
                  advance_amount: firstRecordSet.advance_amount,
                  advance_percentage: firstRecordSet.advance_percentage,
                  package_visit_type: firstRecordSet.package_visit_type,
                  approved: firstRecordSet.approved,
                  package_status: firstRecordSet.package_status,
                  PakageDetail: g.getSource()
                };
              })
              .toArray();

            $this.setState({
              all_packages: ItemList
            });
          }
        }
      });
    },
    OpenPackageMaster: ($this, row) => {
      $this.setState({
        isOpen: !$this.state.isOpen,
        PackagesPop: row
      });
    }
  };
}
