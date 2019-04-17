import { algaehApiCall } from "../../utils/algaehApiCall";
// import _ from "lodash";
import Enumerable from "linq";
// import { AlgaehValidation } from "../../utils/GlobalFunctions";

export default function PackageSetupEvent() {
  return {
    getPackage: $this => {
      debugger;
      algaehApiCall({
        uri: "/packagesetup/getPackage",
        module: "masterSettings",
        method: "GET",
        onSuccess: response => {
          debugger;
          if (response.data.success) {
            debugger;
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
