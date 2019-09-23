// import React, { Component } from "react";
// import "./leave_details.scss";

// import {
//   AlgaehDateHandler,
//   AlagehFormGroup,
//   AlgaehLabel,
//   AlagehAutoComplete,
//   AlgaehDataGrid
// } from "../../../../../Wrapper/algaehWrapper";

// //import GlobalVariables from "../../../../../utils/GlobalVariables.json";

// export default class LeaveDetails extends Component {
//   render() {
//     return (
//       <div className="popRightDiv leave_details">
//         <div className="row">
//           <AlagehAutoComplete
//             div={{ className: "col-2" }}
//             label={{
//               forceLabel: "Employee Type",
//               isImp: true
//             }}
//             selector={{
//               name: "",
//               className: "select-fld",
//               dataSource: {}
//             }}
//           />
//           <AlagehAutoComplete
//             div={{ className: "col-2" }}
//             label={{
//               forceLabel: "Appointment Type",
//               isImp: true
//             }}
//             selector={{
//               name: "",
//               className: "select-fld",
//               dataSource: {}
//             }}
//           />
//           <AlagehAutoComplete
//             div={{ className: "col-2" }}
//             label={{
//               forceLabel: "Gender",
//               isImp: true
//             }}
//             selector={{
//               name: "",
//               className: "select-fld",
//               dataSource: {}
//             }}
//           />

//           <AlagehFormGroup
//             div={{ className: "col-2" }}
//             label={{
//               forceLabel: "Days of Eligibility",
//               isImp: true
//             }}
//             textBox={{
//               className: "txt-fld",
//               name: "",
//               events: {},
//               others: {
//                 type: "number"
//               }
//             }}
//           />

//           <AlagehFormGroup
//             div={{ className: "col-2" }}
//             label={{
//               forceLabel: "Maximum Limit",
//               isImp: true
//             }}
//             textBox={{
//               className: "txt-fld",
//               name: "",
//               events: {},
//               others: {
//                 type: "number"
//               }
//             }}
//           />

//           <div className="col-2">
//             <label>Min. Service Required</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   //checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>
//           <AlagehFormGroup
//             div={{ className: "col-2" }}
//             label={{
//               forceLabel: "Service in Years",
//               isImp: true
//             }}
//             textBox={{
//               className: "txt-fld",
//               name: "",
//               events: {},
//               others: {
//                 type: "number"
//               }
//             }}
//           />

//           <div className="col-2">
//             <label>Once in Life Time</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   //checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>

//           <div className="col-2">
//             <label>Allow during Probation</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   //checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>

//           <div className="col-2">
//             <label>Min. Service Required</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   //checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>

//           <AlagehFormGroup
//             div={{ className: "col-2" }}
//             label={{
//               forceLabel: "Mandatory Utlilize Leave",
//               isImp: true
//             }}
//             textBox={{
//               className: "txt-fld",
//               name: "",
//               events: {},
//               others: {
//                 type: "number"
//               }
//             }}
//           />

//           <div className="col-2">
//             <button className="btn btn-primary" style={{ marginTop: 21 }}>
//               Add to List
//             </button>
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-12 margin-top-15" id="leaveDetails_grid_cntr">
//             <AlgaehDataGrid
//               id="leaveDetails_grid"
//               columns={[
//                 {
//                   fieldName: "",
//                   label: "Loan Requested On"
//                   //disabled: true
//                 },
//                 {
//                   fieldName: "",
//                   label: "Loan Type"
//                   //disabled: true
//                 },
//                 {
//                   fieldName: "",
//                   label: "Loan Amount"
//                   //disabled: true
//                 },
//                 {
//                   fieldName: "",
//                   label: "No. of EMI"
//                   //disabled: true
//                 },
//                 {
//                   fieldName: "",
//                   label: " Reason for Loan"
//                   //disabled: true
//                 },
//                 {
//                   fieldName: "",
//                   label: "No. of EMI Pending"
//                   //disabled: true
//                 },
//                 {
//                   fieldName: "",
//                   label: "Balance Due"
//                   //disabled: true
//                 },
//                 {
//                   fieldName: "",
//                   label: "Status"
//                   //disabled: true
//                 }
//               ]}
//               keyId="algaeh_d_module_id"
//               dataSource={{
//                 data: []
//               }}
//               isEditable={false}
//               paging={{ page: 0, rowsPerPage: 10 }}
//               events={{
//                 onEdit: () => {},
//                 onDelete: () => {},
//                 onDone: () => {}
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
