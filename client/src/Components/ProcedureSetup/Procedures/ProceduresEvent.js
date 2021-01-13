import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import algaehLoader from "../../Wrapper/fullPageLoader";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import Enumerable from "linq";
import extend from "extend";

export default function ProceduresEvent() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
      });
    },
    checkHandle: ($this, e) => {
      let name = e.name || e.target.name;
      $this.setState({
        [name]: e.target.checked ? "Y" : "N",
      });
    },

    itemchangeText: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
        item_category_id: e.selected.category_id,
        s_service: e.selected.service_id,
      });
    },
    serviceHandeler: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
        s_service_amount: e.selected.standard_fee,
      });
    },

    serviceTypeHandeler: ($this, e) => {
      $this.setState({
        [e.name]: e.value,
      });
    },
    AddToList: ($this) => {
      // let isError = false;

      let SelectedService = _.filter($this.state.ProcedureDetail, (f) => {
        return f.item_id === $this.state.item_id;
      });

      if (SelectedService.length === 0) {
        let ProcedureDetail = $this.state.ProcedureDetail;
        let insertProcedure = $this.state.insertProcedure;

        let InputObj = {
          service_id: $this.state.s_service,
          item_id: $this.state.item_id,
          qty: $this.state.qty,
        };

        if ($this.state.hims_d_procedure_id !== null) {
          let InsertObj = {
            procedure_header_id: $this.state.hims_d_procedure_id,
            item_id: $this.state.item_id,
            service_id: $this.state.s_service,
            qty: $this.state.qty,
          };
          insertProcedure.push(InsertObj);
        }

        ProcedureDetail.push(InputObj);

        $this.setState({
          ProcedureDetail: ProcedureDetail,
          item_id: null,
          s_service: null,
          insertProcedure: insertProcedure,
          qty: 1,
        });
      } else {
        swalMessage({
          title: "Selected Item already exists.",
          type: "warning",
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
            hims_d_procedure_detail_id: row.hims_d_procedure_detail_id,
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
        insertProcedure: insertProcedure,
      });
    },

    AddProcedure: ($this, e) => {
      e.preventDefault();

      AlgaehValidation({
        alertTypeIcon: "warning",
        onSuccess: () => {
          $this.state.service_code = $this.state.procedure_code;
          $this.state.service_type_id = "2";
          $this.state.service_name = $this.state.procedure_desc;
          $this.state.arabic_service_name = $this.state.procedure_desc_arabic;
          $this.state.service_status = "A";
          $this.state.standard_fee = $this.state.procedure_amount;
          if ($this.state.hims_d_procedure_id === null) {
            const item_code_exit = _.filter(
              $this.props.all_procedures,
              f => f.procedure_code === $this.state.procedure_code
            );

            if (item_code_exit.length > 0) {
              swalMessage({
                type: "warning",
                title: "Procedure Code Already Exist."
              });
              return
            }
            algaehLoader({ show: true });
            algaehApiCall({
              uri: "/serviceType/addProcedure",
              module: "masterSettings",
              data: $this.state,
              onSuccess: (response) => {
                if (response.data.success === true) {
                  swalMessage({
                    type: "success",
                    title: "Saved successfully . .",
                  });
                  $this.setState(
                    {
                      hims_d_procedure_id: null,
                      procedure_code: null,
                      procedure_desc: null,
                      procedure_desc_arabic: null,
                      procedure_amount: 0,
                      vat_applicable: "N",
                      vat_percent: 0,

                      open: false,
                      ProcedureDetail: [],
                      deletePackage: [],
                      insertProcedure: [],
                      s_service_amount: null,
                      s_service_type: null,
                      s_service: null,
                    },
                    () => {
                      $this.props.onClose && $this.props.onClose(true);
                    }
                  );
                  algaehLoader({ show: false });
                }
              },
            });
          } else {
            algaehLoader({ show: true });
            algaehApiCall({
              uri: "/serviceType/updateProcedures",
              module: "masterSettings",
              data: $this.state,
              method: "PUT",
              onSuccess: (response) => {
                if (response.data.success === true) {
                  swalMessage({
                    type: "success",
                    title: "Updated successfully . .",
                  });
                  $this.setState(
                    {
                      hims_d_procedure_id: null,
                      procedure_code: null,
                      procedure_desc: null,
                      procedure_desc_arabic: null,
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
                      s_service: null,
                    },
                    () => {
                      $this.props.onClose && $this.props.onClose(true);
                    }
                  );
                  algaehLoader({ show: false });
                }
              },
            });
          }
        },
      });
    },
    getFinanceAccountsMaping: ($this) => {
      algaehApiCall({
        uri: "/finance/getFinanceAccountMapingSingle",
        data: { accounts: ["DEF_INCOME_PACK"] },
        module: "finance",
        method: "GET",
        onSuccess: (response) => {
          if (response.data.success === true) {
            if (response.data.result.length > 0) {
              $this.setState({
                head_id: response.data.result[0].head_id,
                child_id: response.data.result[0].child_id
              });
            }
          }
        },
      });
    },
    itemSearch: $this => {

      AlgaehSearch({
        searchGrid: {
          columns: spotlightSearch.Items.Invitemmaster
        },
        searchName: "invopeningstock",
        uri: "/gloabelSearch/get",
        onContainsChange: (text, serchBy, callBack) => {
          callBack(text);
        },
        onRowSelect: row => {
          $this.setState({
            item_id: row.hims_d_inventory_item_master_id,
            item_description: row.item_description,
            service_id: row.service_id,
            qty: 1
          });
        }
      });

    },
    selectToPay: ($this, row, e) => {
      let _allProcedure = $this.state.all_procedures;
      let applyBtn = true;

      if (e.target.checked === true) {
        row["select_to_pay"] = "Y";
      } else if (e.target.checked === false) {
        row["select_to_pay"] = "N";
      }

      _allProcedure[row.rowIdx] = row;

      let listOfinclude = Enumerable.from(_allProcedure)
        .where((w) => w.select_to_pay === "Y")
        .toArray();
      if (listOfinclude.length > 0) {
        applyBtn = false;
      }
      $this.setState({
        applyBtn: applyBtn,
        all_procedures: _allProcedure,
      });
    },
    ApplyProcedures: ($this) => {
      let _allProcedure = $this.state.all_procedures

      let listOfinclude = Enumerable.from(_allProcedure)
        .where((w) => w.select_to_pay === "Y")
        .toArray();

      let inputObj = []

      for (let i = 0; i < listOfinclude.length; i++) {
        inputObj.push({
          procedure_header_id: listOfinclude[i].hims_d_procedure_id,
          item_id: $this.state.item_id,
          service_id: $this.state.service_id,
          qty: $this.state.qty
        })
      }

      algaehApiCall({
        uri: "/serviceType/applyItemProcedure",
        module: "masterSettings",
        data: inputObj,
        onSuccess: (response) => {
          if (response.data.success === true) {
            swalMessage({
              type: "success",
              title: "Saved successfully . .",
            });
            $this.setState({
              item_description: null,
              all_procedures: [],
              applyBtn: true,
              qty: 1,
              item_id: null,
              service_id: null
            }, () => {
              $this.props.onClose && $this.props.onClose(true);
            })

            algaehLoader({ show: false });
          }
        },
      });

    },
    gridtexthandel: ($this, row, e) => {
      const name = e.name || e.target.name;
      const value = e.value || e.target.value;
      let ProcedureDetail = extend([], $this.state.ProcedureDetail)
      let _index = ProcedureDetail.indexOf(row);

      row[name] = value;
      ProcedureDetail[_index] = row;


      $this.setState({
        ProcedureDetail: ProcedureDetail
      });
    }
  };
}
