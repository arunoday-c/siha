// import React, { Component } from "react";
// import "./leave_entitlement.scss";

// import {
//   AlagehAutoComplete,
//   AlagehFormGroup
// } from "../../../../../Wrapper/algaehWrapper";
// import GlobalVariables from "../../../../../../utils/GlobalVariables.json";
// let myParent = null;
// export default class LeaveEntitlement extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       value: "Noor"
//     };
//     myParent = props.parent;
//   }

//   componentDidMount() {
//     myParent = this.props.parent;
//   }

//   changeTexts(e) {
//     myParent.setState({
//       [e.target.name]: e.target.value
//     });
//   }

//   dropDownHandler(value) {
//     myParent.setState({
//       [value.name]: value.value
//     });
//   }
//   addLeaveMaster() {}
//   render() {
//     return (
//       <div className="popRightDiv leave_entitlement">
//         <div className="row">
//           <AlagehFormGroup
//             div={{ className: "col  form-group" }}
//             label={{
//               forceLabel: "Leave Type Code",
//               isImp: true
//             }}
//             textBox={{
//               className: "txt-fld",
//               name: "earning_deduction_code",
//               value: myParent.state.earning_deduction_code,
//               events: {
//                 onChange: this.changeTexts.bind(this)
//               }
//             }}
//           />
//           <AlagehFormGroup
//             div={{ className: "col  form-group" }}
//             label={{
//               forceLabel: "Description",
//               isImp: true
//             }}
//             textBox={{
//               className: "txt-fld",
//               name: "earning_deduction_description",
//               value: this.state.value,
//               events: {
//                 //onChange: this.changeTexts.bind(this)
//               }
//             }}
//           />
//           <AlagehFormGroup
//             div={{ className: "col  form-group" }}
//             label={{
//               forceLabel: "Short Description",
//               isImp: true
//             }}
//             textBox={{
//               className: "txt-fld",
//               name: "short_desc",
//               // value: this.state.short_desc,
//               events: {
//                 //onChange: this.changeTexts.bind(this)
//               }
//             }}
//           />
//           <AlagehAutoComplete
//             div={{ className: "col form-group" }}
//             label={{ forceLabel: "Leave Mode", isImp: false }}
//             selector={{
//               name: "",
//               className: "select-fld",
//               dataSource: {},
//               others: {}
//             }}
//           />
//           <AlagehAutoComplete
//             div={{ className: "col form-group" }}
//             label={{ forceLabel: "Leave Frequency", isImp: false }}
//             selector={{
//               name: "",
//               className: "select-fld",
//               dataSource: {},
//               others: {}
//             }}
//           />

//           <AlagehAutoComplete
//             div={{ className: "col form-group" }}
//             label={{ forceLabel: "Leave Details", isImp: false }}
//             selector={{
//               name: "",
//               className: "select-fld",
//               dataSource: {},
//               others: {}
//             }}
//           />
//         </div>
//         <div className="row">
//           <AlagehFormGroup
//             div={{ className: "col form-group" }}
//             label={{
//               forceLabel: "Max Leave Litmit",
//               isImp: false
//             }}
//             textBox={{
//               className: "txt-fld",
//               name: "",
//               value: "",
//               events: {},
//               option: {
//                 type: "number"
//               }
//             }}
//           />
//           <div className="col  form-group">
//             <label>Is Encashment</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>

//           <AlagehFormGroup
//             div={{ className: "col  form-group" }}
//             label={{
//               forceLabel: "Encashment Percentage",
//               isImp: true
//             }}
//             textBox={{
//               className: "txt-fld",
//               name: "",
//               events: {},
//               others: {
//                 type: "number",
//                 disabled: "disabled"
//               }
//             }}
//           />
//           <div className="col  form-group">
//             <label>Is Carry Forward</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>
//           <AlagehFormGroup
//             div={{ className: "col  form-group" }}
//             label={{
//               forceLabel: "Carry Forward Percentage",
//               isImp: true
//             }}
//             textBox={{
//               className: "txt-fld",
//               name: "",
//               events: {},
//               others: {
//                 type: "number",
//                 disabled: "disabled"
//               }
//             }}
//           />
//           <div className="col  form-group">
//             <label>Include Weekoff/Holidays</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col  form-group">
//             <label>Include Holiday</label>
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
//           <div className="col  form-group">
//             <label>Include Weekoff</label>
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

//           <div className="col  form-group">
//             <label>Process Leave Monthly</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>

//           <div className="col  form-group">
//             <label>Is Document Mandatory</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>

//           <div className="col  form-group">
//             <label>Exit Permit Required</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>

//           <div className="col  form-group">
//             <label>Is Holiday Reimbursement</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col  form-group">
//             <label>Is Yearly Leave Booking</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>
//           <div className="col  form-group">
//             <label>Allow Round off</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>

//           <AlagehAutoComplete
//             div={{ className: "col form-group" }}
//             label={{ forceLabel: "Type", isImp: false }}
//             selector={{
//               name: "",
//               className: "select-fld",
//               dataSource: {},
//               others: {
//                 disabled: "disabled"
//               }
//             }}
//           />

//           <AlagehFormGroup
//             div={{ className: "col  form-group" }}
//             label={{
//               forceLabel: "Amount",
//               isImp: true
//             }}
//             textBox={{
//               className: "txt-fld",
//               name: "",
//               events: {},
//               others: {
//                 type: "number",
//                 disabled: "disabled"
//               }
//             }}
//           />
//           <div className="col  form-group">
//             <label>Religion Mandatory</label>
//             <div className="customCheckbox">
//               <label className="checkbox inline">
//                 <input
//                   type="checkbox"
//                   name="allow_round_off"
//                   checked={this.state.allow_round_off}
//                   //onChange={this.changeChecks.bind(this)}
//                 />
//                 <span>Yes</span>
//               </label>
//             </div>
//           </div>
//           <AlagehAutoComplete
//             div={{ className: "col form-group" }}
//             label={{ forceLabel: "Select Religion", isImp: false }}
//             selector={{
//               name: "",
//               className: "select-fld",
//               dataSource: {},
//               others: {
//                 disabled: "disabled"
//               }
//             }}
//           />

//           {/* <div className="col form-group">
//             <button
//               style={{ marginTop: 21 }}
//               className="btn btn-primary"
//               id="srch-sch"
//               //onClick={this.addEarningsDeductions.bind(this)}
//             >
//               Add to List
//             </button>
//           </div> */}
//         </div>
//       </div>
//     );
//   }
// }
