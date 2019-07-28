import { algaehApiCall } from "../../utils/algaehApiCall";
// import _ from "lodash";
// import Enumerable from "linq";
// import { AlgaehValidation } from "../../utils/GlobalFunctions";

export default function PackageSetupEvent() {
  return {
    getPatientPackage: ($this, row) => {
      $this.props.getPatientPackage({
        uri: "/orderAndPreApproval/getPatientPackage",
        method: "GET",
        data: { package_visit_type: "M" },
        redux: {
          type: "ORDER_SERVICES_GET_DATA",
          mappingName: "PatientPackageList"
        }
      });
    },

    ShowPackageUtilize: ($this, row) => {
      $this.setState({
        isPackUtOpen: !$this.state.isPackUtOpen,
        package_detail: row
      });
    },
    ClosePackageUtilize: $this => {
      $this.setState(
        {
          isPackUtOpen: !$this.state.isPackUtOpen
        },
        () => {
          $this.props.getPatientPackage({
            uri: "/orderAndPreApproval/getPatientPackage",
            method: "GET",
            data: { package_visit_type: "M" },
            redux: {
              type: "ORDER_SERVICES_GET_DATA",
              mappingName: "PatientPackageList"
            }
          });
        }
      );
    },

    ShowAdvanceScreen: ($this, row) => {
      
      $this.setState({
        patient_id: row.patient_id,
        hims_f_package_header_id: row.hims_f_package_header_id,
        advance_amount: row.balance_amount,
        AdvanceOpen: !$this.state.AdvanceOpen,
        patient_code: row.patient_code,
        full_name: row.full_name
      });
    }
  };
}
