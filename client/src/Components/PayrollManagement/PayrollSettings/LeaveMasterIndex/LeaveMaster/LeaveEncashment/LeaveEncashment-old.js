// import React, { Component } from "react";
// import "./LeaveEncashment.scss";

// import {
//   AlgaehDateHandler,
//   AlagehFormGroup,
//   AlgaehLabel,
//   AlagehAutoComplete,
//   AlgaehDataGrid
// } from "../../../../../Wrapper/algaehWrapper";

// //import GlobalVariables from "../../../../../utils/GlobalVariables.json";

// export default class LeaveEncashment extends Component {
//   render() {
//     return (
//       <div className="Leave_Encashment">
//         <div className="popRightDiv">
//           <div className="row">
//             <AlagehFormGroup
//               div={{ className: "col form-group" }}
//               label={{
//                 forceLabel: "Encashment Code",
//                 isImp: true
//               }}
//               textBox={{
//                 className: "txt-fld",
//                 name: "",
//                 events: {},
//                 others: {
//                   type: "number"
//                 }
//               }}
//             />

//             <AlagehAutoComplete
//               div={{ className: "col form-group" }}
//               label={{ forceLabel: "Encashment Type", isImp: false }}
//               selector={{
//                 name: "",
//                 className: "select-fld",
//                 dataSource: {},
//                 others: {}
//               }}
//             />

//             <AlagehFormGroup
//               div={{ className: "col form-group" }}
//               label={{
//                 forceLabel: "Value %",
//                 isImp: false
//               }}
//               textBox={{
//                 className: "txt-fld",
//                 name: "",
//                 value: "",
//                 events: {},
//                 option: {
//                   type: "number"
//                 }
//               }}
//             />

//             <AlagehFormGroup
//               div={{ className: "col form-group" }}
//               label={{
//                 forceLabel: "Description",
//                 isImp: true
//               }}
//               textBox={{
//                 className: "txt-fld",
//                 name: "",
//                 events: {},
//                 others: {
//                   type: "text"
//                 }
//               }}
//             />

//             <div className="col-2">
//               <button className="btn btn-primary" style={{ marginTop: 19 }}>
//                 Add to List
//               </button>
//             </div>
//           </div>

//           <div className="row">
//             <div
//               className="col-12 margin-top-15"
//               id="leaveEncashment_grid_cntr"
//             >
//               <AlgaehDataGrid
//                 id="leaveRules_grid"
//                 columns={[
//                   {
//                     fieldName: "",
//                     label: "Encashment Code"
//                     //disabled: true
//                   },
//                   {
//                     fieldName: "",
//                     label: "Encashment Type"
//                     //disabled: true
//                   },
//                   {
//                     fieldName: "",
//                     label: "Value %"
//                     //disabled: true
//                   },
//                   {
//                     fieldName: "",
//                     label: "Description"
//                     //disabled: true
//                   }
//                 ]}
//                 keyId="algaeh_d_module_id"
//                 dataSource={{
//                   data: []
//                 }}
//                 isEditable={true}
//                 paging={{ page: 0, rowsPerPage: 10 }}
//                 events={{
//                   onEdit: () => {},
//                   onDelete: () => {},
//                   onDone: () => {}
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
