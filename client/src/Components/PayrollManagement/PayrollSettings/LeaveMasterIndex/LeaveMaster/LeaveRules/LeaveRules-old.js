// import React, { Component } from "react";
// import "./leave_rules.scss";

// import {
//   AlgaehDateHandler,
//   AlagehFormGroup,
//   AlgaehLabel,
//   AlagehAutoComplete,
//   AlgaehDataGrid
// } from "../../../../../Wrapper/algaehWrapper";

// //import GlobalVariables from "../../../../../utils/GlobalVariables.json";

// export default class leaveRules extends Component {
//   render() {
//     return (
//       <div className=" leave_rules">
//         <div className="popRightDiv">
//           <div className="row">
//             <AlagehFormGroup
//               div={{ className: "col form-group" }}
//               label={{
//                 forceLabel: "Leave Rule Code",
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

//             <AlagehFormGroup
//               div={{ className: "col form-group" }}
//               label={{
//                 forceLabel: "Leave Rule Type",
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

//             <AlagehFormGroup
//               div={{ className: "col form-group" }}
//               label={{
//                 forceLabel: "Pay Type",
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
//                   type: "number"
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
//             <div className="col-12 margin-top-15" id="leaveRules_grid_cntr">
//               <AlgaehDataGrid
//                 id="leaveRules_grid"
//                 columns={[
//                   {
//                     fieldName: "",
//                     label: "Leave Rule Code"
//                     //disabled: true
//                   },
//                   {
//                     fieldName: "",
//                     label: "Leave Rule Type"
//                     //disabled: true
//                   },
//                   {
//                     fieldName: "",
//                     label: "Pay Type"
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
