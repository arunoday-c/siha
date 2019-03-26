import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";

export default function NewPackageEvent() {
  return {
    texthandle: ($this, e) => {
      debugger;
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },
    serviceHandeler: ($this, e) => {
      debugger;
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
        s_service_amount: e.selected.standard_fee
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
      debugger;
      let SelectedService = _.filter($this.state.PakageDetail, f => {
        return (
          f.service_type_id === $this.state.s_service_type &&
          f.services_id === $this.state.s_service
        );
      });

      if (SelectedService.length === 0) {
        let PakageDetail = $this.state.PakageDetail;
        let profit_loss = "P";
        let InputObj = {
          service_type_id: $this.state.s_service_type,
          services_id: $this.state.s_service,
          service_amount: $this.state.s_service_amount
        };
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
          s_service_type: null,
          s_service: null,
          s_service_amount: null,
          total_service_amount: total_service_amount,
          pl_amount: pl_amount,
          profit_loss: profit_loss
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
      PakageDetail.splice(row.rowIdx, 1);
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
        total_service_amount: total_service_amount,
        pl_amount: pl_amount,
        profit_loss: profit_loss
      });
    }
  };
}
