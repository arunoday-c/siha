import React from "react";
// import "./WardBedSetup.scss";
// // import { DatePicker } from "antd";
// import {
//   // AlgaehDateHandler,
//   AlgaehAutoComplete,
//   AlgaehFormGroup,
//   AlgaehTable,
// } from "algaeh-react-components";
// export default function FinanceYearlyClosing() {
//   return (
//     <div className="WardBedSetupScreen" style={{ marginTop: 50 }}>
//       <div className="row">
//         <div className="col-6">
//           <div className="portlet portlet-bordered margin-bottom-15">
//             <div className="portlet-title">
//               <div className="caption">
//                 <h3 className="caption-subject">Ward Setup</h3>
//               </div>
//             </div>
//             <div className="portlet-body">
//               <div className="row">
//                 <AlgaehFormGroup
//                   div={{
//                     className: "col-6 form-group",
//                   }}
//                   label={{
//                     forceLabel: "Ward Desc.",
//                     isImp: true,
//                   }}
//                   textBox={{
//                     type: "text",
//                     className: "form-control",
//                     // placeholder: "Enter Invoice No.",
//                     value: "",
//                   }}
//                 />
//                 <AlgaehFormGroup
//                   div={{
//                     className: "col-6 form-group",
//                   }}
//                   label={{
//                     forceLabel: "Ward Short Desc.",
//                     isImp: true,
//                   }}
//                   textBox={{
//                     type: "text",
//                     className: "form-control",
//                     // placeholder: "Enter Invoice No.",
//                     value: "",
//                   }}
//                 />
//                 <AlgaehAutoComplete
//                   div={{ className: "col-6" }}
//                   label={{
//                     forceLabel: "Ward Type",
//                     isImp: true,
//                   }}
//                   selector={{
//                     name: "default_cost_center_id",
//                     value: "",
//                     dataSource: {
//                       data: "",
//                       valueField: "cost_center_id",
//                       textField: "cost_center",
//                     },
//                     // onChange: '',
//                   }}
//                 />
//                 <div className="col-6" style={{ marginTop: 21 }}>
//                   <button className="btn btn-primary btn-small">
//                     Add to List
//                   </button>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-12 margin-top-15" id="WardSetupGrid">
//                   <AlgaehTable
//                     columns={[
//                       {
//                         label: "Bed Desc.",
//                         sortable: true,
//                         fieldName: "child_name",
//                         filterable: true,
//                       },
//                       {
//                         label: "Bed Short Desc.",
//                         sortable: true,
//                         fieldName: "child_name",
//                         filterable: true,
//                       },
//                       {
//                         label: "Bed Service Type",
//                         sortable: true,
//                         fieldName: "child_name",
//                         filterable: true,
//                       },
//                       {
//                         label: "Status",
//                         sortable: true,
//                         fieldName: "child_name",
//                         filterable: true,
//                       },
//                     ]}
//                     isFilterable={true}
//                     rowUniqueId=""
//                     // data=""
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-6">
//           <div className="portlet portlet-bordered margin-bottom-15">
//             <div className="portlet-title">
//               <div className="caption">
//                 <h3 className="caption-subject">Bed Setup</h3>
//               </div>
//             </div>
//             <div className="portlet-body">
//               <div className="row">
//                 <AlgaehFormGroup
//                   div={{
//                     className: "col-6 form-group",
//                   }}
//                   label={{
//                     forceLabel: "Bed Desc.",
//                     isImp: true,
//                   }}
//                   textBox={{
//                     type: "text",
//                     className: "form-control",
//                     // placeholder: "Enter Invoice No.",
//                     value: "",
//                   }}
//                 />
//                 <AlgaehFormGroup
//                   div={{
//                     className: "col-6 form-group",
//                   }}
//                   label={{
//                     forceLabel: "Bed Short Desc.",
//                     isImp: true,
//                   }}
//                   textBox={{
//                     type: "text",
//                     className: "form-control",
//                     // placeholder: "Enter Invoice No.",
//                     value: "",
//                   }}
//                 />
//                 <AlgaehAutoComplete
//                   div={{ className: "col-6" }}
//                   label={{
//                     forceLabel: "Bed Service Type",
//                     isImp: true,
//                   }}
//                   selector={{
//                     name: "default_cost_center_id",
//                     value: "",
//                     dataSource: {
//                       data: "",
//                       valueField: "cost_center_id",
//                       textField: "cost_center",
//                     },
//                     // onChange: '',
//                   }}
//                 />
//                 <div className="col-6" style={{ marginTop: 21 }}>
//                   <button className="btn btn-primary btn-small">
//                     Add to List
//                   </button>
//                 </div>
//               </div>{" "}
//               <div className="row">
//                 <div className="col-12 margin-top-15" id="BedSetupGrid">
//                   <AlgaehTable
//                     // className="BedSetupGrid"
//                     columns={[
//                       {
//                         label: "Bed Desc.",
//                         sortable: true,
//                         fieldName: "child_name",
//                         filterable: true,
//                       },
//                       {
//                         label: "Bed Short Desc.",
//                         sortable: true,
//                         fieldName: "child_name",
//                         filterable: true,
//                       },
//                       {
//                         label: "Bed Service Type",
//                         sortable: true,
//                         fieldName: "child_name",
//                         filterable: true,
//                       },
//                       {
//                         label: "Status",
//                         sortable: true,
//                         fieldName: "child_name",
//                         filterable: true,
//                       },
//                     ]}
//                     isFilterable={true}
//                     rowUniqueId=""
//                     data=""
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function WardBedSetup() {
  return <h1>test</h1>;
}
