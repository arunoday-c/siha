import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

export default function ProceduresEvent() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },

    itemchangeText: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
        item_category_id: e.selected.category_id,
        s_service: e.selected.service_id
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

    serviceTypeHandeler: ($this, e) => {
      $this.setState({
        [e.name]: e.value
      });
    },
    AddToList: $this => {
      // let isError = false;

      let SelectedService = _.filter($this.state.ProcedureDetail, f => {
        return f.item_id === $this.state.item_id;
      });

      if (SelectedService.length === 0) {
        let ProcedureDetail = $this.state.ProcedureDetail;
        let insertProcedure = $this.state.insertProcedure;

        let InputObj = {
          service_id: $this.state.s_service,
          item_id: $this.state.item_id,
          qty: $this.state.qty
        };

        if ($this.state.hims_d_procedure_id !== null) {
          let InsertObj = {
            procedure_header_id: $this.state.hims_d_procedure_id,
            item_id: $this.state.item_id,
            service_id: $this.state.s_service,
            qty: $this.state.qty
          };
          insertProcedure.push(InsertObj);
        }

        ProcedureDetail.push(InputObj);

        $this.setState({
          ProcedureDetail: ProcedureDetail,
          item_id: null,
          s_service: null,
          insertProcedure: insertProcedure,
          qty: 1
        });
      } else {
        swalMessage({
          title: "Selected Item already exists.",
          type: "warning"
        });
      }
    },
    DeleteService: ($this, row) => {
      let ProcedureDetail = $this.state.ProcedureDetail;
      let deleteProcedure = $this.state.deleteProcedure;
      let insertProcedure = $this.state.insertProcedure;

      if ($this.state.hims_d_procedure_id !== null) {
        if (row.hims_d_procedure_detail_id !== undefined) {
          deleteProcedure.push({
            hims_d_procedure_detail_id: row.hims_d_procedure_detail_id
          });
        } else {
          for (let k = 0; k < insertProcedure.length; k++) {
            if (
              insertProcedure[k].hims_d_procedure_detail_id ===
              row.hims_d_procedure_detail_id
            ) {
              insertProcedure.splice(k, 1);
            }
          }
        }
      }

      for (let x = 0; x < ProcedureDetail.length; x++) {
        if (ProcedureDetail[x].service_id === row.service_id) {
          ProcedureDetail.splice(x, 1);
        }
      }

      $this.setState({
        ProcedureDetail: ProcedureDetail,
        deleteProcedure: deleteProcedure,
        insertProcedure: insertProcedure
      });
    },

    AddProcedure: ($this, e) => {
      e.preventDefault();

      AlgaehValidation({
        alertTypeIcon: "warning",
        onSuccess: () => {
          if ($this.state.hims_d_procedure_id === null) {
            $this.state.service_code = $this.state.procedure_code;
            $this.state.service_type_id = "2";
            $this.state.service_name = $this.state.procedure_desc;
            $this.state.service_status = "A";
            $this.state.standard_fee = $this.state.procedure_amount;
            algaehApiCall({
              uri: "/serviceType/addProcedure",
              module: "masterSettings",
              data: $this.state,
              onSuccess: response => {
                if (response.data.success === true) {
                  swalMessage({
                    type: "success",
                    title: "Saved successfully . ."
                  });
                  $this.setState(
                    {
                      hims_d_procedure_id: null,
                      procedure_code: null,
                      procedure_desc: null,
                      procedure_amount: 0,
                      total_service_amount: 0,
                      profit_loss: null,
                      pl_amount: 0,

                      open: false,
                      ProcedureDetail: [],
                      deletePackage: [],
                      insertProcedure: [],
                      s_service_amount: null,
                      s_service_type: null,
                      s_service: null
                    },
                    () => {
                      $this.props.onClose && $this.props.onClose(true);
                    }
                  );
                }
              }
            });
          } else {
            algaehApiCall({
              uri: "/serviceType/updateProcedures",
              module: "masterSettings",
              data: $this.state,
              method: "PUT",
              onSuccess: response => {
                if (response.data.success === true) {
                  swalMessage({
                    type: "success",
                    title: "Updated successfully . ."
                  });
                  $this.setState(
                    {
                      hims_d_procedure_id: null,
                      procedure_code: null,
                      procedure_desc: null,
                      procedure_amount: 0,
                      total_service_amount: 0,
                      profit_loss: null,
                      pl_amount: 0,

                      open: false,
                      ProcedureDetail: [],
                      deletePackage: [],
                      insertProcedure: [],
                      s_service_amount: null,
                      s_service_type: null,
                      s_service: null
                    },
                    () => {
                      $this.props.onClose && $this.props.onClose(true);
                    }
                  );
                }
              }
            });
          }
        }
      });
    }
  };
}
