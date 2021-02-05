import { algaehApiCall } from "../../utils/algaehApiCall";

export default function InvItemSetupEvent() {
  return {
    getItems: ($this) => {
      $this.props.getItemMaster({
        uri: "/inventory/getItemMasterAndItemUom",
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEMS_GET_DATA",
          mappingName: "inventoryitemlist",
        },
      });
    },
    EditItemMaster: ($this, row) => {
      row.addNew = false;
      $this.setState({
        isOpen: !$this.state.isOpen,
        itemPop: row,
        addNew: false,
      });
    },
    OpenReQtyLocation: ($this, row) => {
      algaehApiCall({
        uri: "/inventory/getInvLocationReorder",
        method: "GET",
        module: "inventory",
        data: { item_id: row.hims_d_inventory_item_master_id },
        onSuccess: (response) => {
          if (response.data.success === true) {
            $this.setState({
              isReQtyOpen: !$this.state.isReQtyOpen,
              item_description: row.item_description,
              item_id: row.hims_d_inventory_item_master_id,
              reorder_locations: response.data.records,
            });
          }
        },
      });
    },
  };
}

// const generateLeaveReconilationReport = ($this) => {
//   // console.log("abcd");
//   algaehApiCall({
//     uri: "/report",
//     // uri: "/excelReport",
//     method: "GET",
//     module: "reports",
//     headers: {
//       Accept: "blob",
//     },
//     others: { responseType: "blob" },
//     data: {
//       report: {
//         reportName: "leave_gratuity_reconcil_Report",
//         pageOrentation: "landscape",
//         excelTabName: `${$this.state.inputs.hospital_name} | ${moment(
//           $this.state.inputs.month,
//           "MM"
//         ).format("MMM")}-${$this.state.inputs.year}`,
//         excelHeader: false,
//         reportParams: [
//           {
//             name: "hospital_id",
//             value: $this.state.inputs.hospital_id,
//           },
//           {
//             name: "year",
//             value: $this.state.inputs.year,
//           },
//           {
//             name: "month",
//             value: $this.state.inputs.month,
//           },
//           {
//             name: "department_id",
//             value: $this.state.inputs.department_id,
//           },
//           {
//             name: "sub_department_id",
//             value: $this.state.inputs.sub_department_id,
//           },
//           {
//             name: "designation_id",
//             value: $this.state.inputs.designation_id,
//           },
//           {
//             name: "group_id",
//             value: $this.state.inputs.group_id,
//           },
//           {
//             name: "hims_d_employee_id",
//             value: $this.state.inputs.hims_d_employee_id,
//           },
//         ],
//         // outputFileType: "EXCEL", //"EXCEL", //"PDF",
//       },
//     },
//     onSuccess: (res) => {
//       // const urlBlob = URL.createObjectURL(res.data);
//       // const a = document.createElement("a");
//       // a.href = urlBlob;
//       // a.download = `Leave & Airfare Reconciliation Report ${moment(
//       //   $this.state.inputs.month,
//       //   "MM"
//       // ).format("MMM")}-${$this.state.inputs.year}.${"xlsx"}`;
//       // a.click();

//       const urlBlob = URL.createObjectURL(res.data);
//       const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${$this.state.inputs.hospital_name} Leave and Airfare Reconciliation - ${$this.state.monthName} ${$this.state.inputs.year}`;
//       window.open(origin);
//     },
//   });
// };
