import { algaehApiCall } from "../../utils/algaehApiCall";
// import Enumerable from "linq";

export default function ProcedureSetupEvent() {
  return {
    getProcedure: ($this) => {
      algaehApiCall({
        uri: "/serviceType/getProceduresNew",
        module: "masterSettings",
        method: "GET",
        onSuccess: (response) => {
          if (response.data.success) {
            $this.setState({
              all_procedures: response.data.records,
            });
            // let ItemList = Enumerable.from(response.data.records)
            //   .groupBy("$.hims_d_procedure_id", null, (k, g) => {
            //     let firstRecordSet = Enumerable.from(g).firstOrDefault();

            //     return {
            //       hims_d_procedure_id: firstRecordSet.hims_d_procedure_id,
            //       procedure_code: firstRecordSet.procedure_code,

            //       procedure_desc: firstRecordSet.procedure_desc,
            //       procedure_desc_arabic: firstRecordSet.procedure_desc_arabic,
            //       procedure_status: firstRecordSet.procedure_status,
            //       service_id: firstRecordSet.header_service_id,
            //       header_service_name: firstRecordSet.header_service_name,
            //       procedure_type: firstRecordSet.procedure_type,
            //       vat_applicable: firstRecordSet.vat_applicable,
            //       vat_percent: firstRecordSet.vat_percent,
            //       procedure_amount: firstRecordSet.procedure_amount,

            //       ProcedureDetail:
            //         firstRecordSet.hims_d_procedure_detail_id === null
            //           ? []
            //           : g.getSource(),
            //     };
            //   })
            //   .toArray();

            // $this.setState({
            //   all_procedures: ItemList,
            // });
          }
        },
      });
    },
    OpenProcedureMaster: ($this, row) => {
      debugger
      algaehApiCall({
        uri: "/serviceType/getProceduresDetail",
        module: "masterSettings",
        method: "GET",
        data: { procedure_header_id: row.hims_d_procedure_id },
        onSuccess: (response) => {
          debugger
          if (response.data.success) {
            row.ProcedureDetail = response.data.records
            $this.setState({
              isOpen: !$this.state.isOpen,
              ProceduresPop: row,
            });
          }
        },
      });

    },
  };
}
