import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";
import {
  AlgaehValidation,
  AlgaehOpenContainer
} from "../../../utils/GlobalFunctions";

export default function NewPackageEvent() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },
    serviceHandeler: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
        s_service_amount: e.selected.standard_fee
      });
    },
    pakageamtHandaler: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      let profit_loss = "P";
      let pl_amount =
        parseFloat(value) - parseFloat($this.state.total_service_amount);
      if (pl_amount < 0) {
        profit_loss = "L";
      }

      $this.setState({
        [name]: value,
        profit_loss: profit_loss,
        pl_amount: pl_amount
      });
    },
    serviceTypeHandeler: ($this, e) => {
      $this.setState(
        {
          [e.name]: e.value
        },
        () => {
          $this.props.getServices({
            uri: "/serviceType/getService",
            module: "masterSettings",
            method: "GET",
            data: { service_type_id: $this.state.s_service_type },
            redux: {
              type: "SERVICES_GET_DATA",
              mappingName: "services"
            }
          });
        }
      );
    },
    AddToList: $this => {
      let isError = false;
      if ($this.state.s_service_type === null) {
        isError = true;

        swalMessage({
          type: "warning",
          title: "Select Service Type."
        });

        return isError;
      } else if ($this.state.s_service === null) {
        isError = true;

        swalMessage({
          type: "warning",
          title: "Select Service."
        });

        return isError;
      }
      let SelectedService = _.filter($this.state.PakageDetail, f => {
        return (
          f.service_type_id === $this.state.s_service_type &&
          f.service_id === $this.state.s_service
        );
      });

      if (SelectedService.length === 0) {
        let PakageDetail = $this.state.PakageDetail;
        let insertPackage = $this.state.insertPackage;

        let profit_loss = "P";
        let InputObj = {
          service_type_id: $this.state.s_service_type,
          service_id: $this.state.s_service,
          service_amount: $this.state.s_service_amount,
          qty: $this.state.qty
        };

        if ($this.state.hims_d_package_header_id !== null) {
          let InsertObj = {
            package_header_id: $this.state.hims_d_package_header_id,
            service_type_id: $this.state.s_service_type,
            service_id: $this.state.s_service,
            service_amount: $this.state.s_service_amount,
            qty: $this.state.qty
          };
          insertPackage.push(InsertObj);
        }

        PakageDetail.push(InputObj);
        let total_service_amount = _.sumBy(PakageDetail, s =>
          parseFloat(s.service_amount)
        );
        let pl_amount =
          parseFloat($this.state.package_amount) -
          parseFloat(total_service_amount);
        if (pl_amount < 0) {
          profit_loss = "L";
        }
        $this.setState({
          PakageDetail: PakageDetail,
          // s_service_type: null,
          s_service: null,
          s_service_amount: null,
          total_service_amount: total_service_amount,
          pl_amount: pl_amount,
          profit_loss: profit_loss,
          insertPackage: insertPackage,
          qty: 0
        });
      } else {
        swalMessage({
          title: "Selected Service already exists.",
          type: "warning"
        });
      }
    },
    DeleteService: ($this, row) => {
      let PakageDetail = $this.state.PakageDetail;
      let deletePackage = $this.state.deletePackage;
      let insertPackage = $this.state.insertPackage;

      if ($this.state.hims_d_package_header_id !== null) {
        if (row.hims_d_package_detail_id !== undefined) {
          deletePackage.push({
            hims_d_package_detail_id: row.hims_d_package_detail_id
          });
        } else {
          for (let k = 0; k < insertPackage.length; k++) {
            if (
              insertPackage[k].hims_d_package_detail_id ===
              row.hims_d_package_detail_id
            ) {
              insertPackage.splice(k, 1);
            }
          }
        }
      }

      for (let x = 0; x < PakageDetail.length; x++) {
        if (PakageDetail[x].service_id === row.service_id) {
          PakageDetail.splice(x, 1);
        }
      }

      let profit_loss = "P";

      let total_service_amount = _.sumBy(PakageDetail, s =>
        parseFloat(s.service_amount)
      );
      let pl_amount =
        parseFloat($this.state.package_amount) -
        parseFloat(total_service_amount);
      if (pl_amount < 0) {
        profit_loss = "L";
      }
      $this.setState({
        PakageDetail: PakageDetail,
        deletePackage: deletePackage,
        insertPackage: insertPackage,
        total_service_amount: total_service_amount,
        pl_amount: pl_amount,
        profit_loss: profit_loss
      });
    },

    AddPackages: ($this, e) => {
      e.preventDefault();

      AlgaehValidation({
        alertTypeIcon: "warning",
        onSuccess: () => {
          if ($this.state.hims_d_package_header_id === null) {
            $this.state.service_code = $this.state.package_code;
            $this.state.service_type_id = "14";
            $this.state.service_name = $this.state.package_name;
            $this.state.service_status = "A";
            $this.state.standard_fee = $this.state.package_amount;
            $this.state.hospital_id = JSON.parse(
              AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
            ).hims_d_hospital_id;
            algaehApiCall({
              uri: "/packagesetup/addPackage",
              module: "masterSettings",
              data: $this.state,
              onSuccess: response => {
                if (response.data.success === true) {
                  swalMessage({
                    type: "success",
                    title: "Saved successfully . ."
                  });
                  $this.props.onClose && $this.props.onClose(true);
                }
              }
            });
          } else {
            algaehApiCall({
              uri: "/packagesetup/updatePackageSetup",
              module: "masterSettings",
              data: $this.state,
              method: "PUT",
              onSuccess: response => {
                if (response.data.success === true) {
                  swalMessage({
                    type: "success",
                    title: "Updated successfully . ."
                  });
                  $this.props.onClose && $this.props.onClose(true);
                }
              }
            });
          }
        }
      });
    },

    discounthandle: ($this, e) => {
      
      let advance_percentage = 0,
        advance_amount = 0;
      advance_percentage =
        e.target.value === undefined ? "" : parseFloat(e.target.value);
      advance_amount =
        e.target.value === ""
          ? 0
          : (parseFloat($this.state.package_amount) * advance_percentage) / 100;

      $this.setState({
        advance_percentage: advance_percentage,
        advance_amount: advance_amount
      });
    }
  };
}
