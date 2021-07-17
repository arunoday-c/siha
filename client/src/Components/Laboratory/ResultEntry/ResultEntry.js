// import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import "./ResultEntry.scss";
// import "./../../../styles/site.scss";
// import {
//   AlgaehAutoComplete,
//   AlgaehFormGroup,
//   AlgaehDataGrid,
//   AlgaehLabel,
//   AlgaehModalPopUp,
// } from "../../Wrapper/algaehWrapper";
// import { AlgaehActions } from "../../../actions/algaehActions";
// import moment from "moment";
// import Options from "../../../Options.json";
// import { FORMAT_YESNO } from "../../../utils/GlobalVariables.json";
// import {
//   onchangegridcol,
//   getAnalytes,
//   onvalidate,
//   onconfirm,
//   confirmedgridcol,
//   onReRun,
//   resultEntryUpdate,
//   onchangegridresult,
//   onchangeAmend,
//   generateLabResultReport,
//   addComments,
//   deleteComment,
//   ongridEditRanges,
//   eidtRanges,
//   reloadAnalytesMaster,
//   eidtUnits,
// } from "./ResultEntryEvents";
// import { ResultInput } from "./ResultInput";
// import AlgaehReport from "../../Wrapper/printReports";
// import {
//   // AlgaehSecurityElement,
//   AlgaehSecurityComponent,
//   AlgaehButton,
//   MainContext,
// } from "algaeh-react-components";

// class ResultEntry extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       test_analytes: [],
//       run_type: "N",
//       comments: "",
//       comments_data: [],
//       test_comments_id: null,
//       comment_list: [],
//       selcted_comments: "",
//       ordered_by_name: "",
//       entered_by_name: "",
//       confirm_by_name: "",
//       validate_by_name: "",
//       edit_range: false,
//       edit_units: false,
//       records_test_formula: [],
//       loading: false,
//       portal_exists: "N",
//     };
//   }
//   static contextType = MainContext;
//   componentDidMount() {
//     if (
//       this.props.labiologyusers === undefined ||
//       this.props.labiologyusers.length === 0
//     ) {
//       this.props.getUserDetails({
//         uri: "/algaehappuser/selectAppUsers",
//         method: "GET",
//         redux: {
//           type: "LAB_EMP_GET_DATA",
//           mappingName: "labiologyusers",
//         },
//       });
//     }
//     if (
//       this.props.providers === undefined ||
//       this.props.providers.length === 0
//     ) {
//       this.props.getProviderDetails({
//         uri: "/employee/get",
//         module: "hrManagement",
//         method: "GET",
//         redux: {
//           type: "DOCTOR_GET_DATA",
//           mappingName: "providers",
//         },
//       });
//     }

//     if (
//       this.props.labanalytes === undefined ||
//       this.props.labanalytes.length === 0
//     ) {
//       this.props.getLabAnalytes({
//         uri: "/labmasters/selectAnalytes",
//         module: "laboratory",
//         method: "GET",
//         redux: {
//           type: "ANALYTES_GET_DATA",
//           mappingName: "labanalytes",
//         },
//       });
//     }
//     const { portal_exists } = this.context.userToken;
//     this.setState({ portal_exists });
//   }

//   static contextType = MainContext;
//   UNSAFE_componentWillReceiveProps(newProps) {
//     const userToken = this.context.userToken;
//     if (newProps.selectedPatient !== undefined && newProps.open === true) {
//       newProps.selectedPatient.portal_exists = userToken.portal_exists;
//       this.setState({ ...newProps.selectedPatient }, () => {
//         getAnalytes(this);
//       });
//     }
//   }

//   selectCommentEvent(e) {
//     let name = e.name || e.target.name;
//     let value = e.value || e.target.value;

//     this.setState({
//       [name]: value,
//       selcted_comments: e.selected.commet,
//     });
//   }

//   textAreaEvent(e) {
//     let name = e.name || e.target.name;
//     let value = e.value || e.target.value;

//     this.setState({
//       [name]: value,
//     });
//   }

//   textAreaEventGrid(row, e) {
//     let name = e.name || e.target.name;
//     let value = e.value || e.target.value;

//     let test_analytes = this.state.test_analytes;
//     const _index = test_analytes.indexOf(row);

//     row[name] = value;
//     test_analytes[_index] = row;
//     this.setState({
//       test_analytes: test_analytes,
//     });
//   }

//   showReport(refBy) {
//     AlgaehReport({
//       report: {
//         fileName: "haematologyReport",
//       },
//       data: {
//         investigation_name: this.state.service_name,
//         test_analytes: this.state.test_analytes,
//         payment_type: "cash",
//         patient_code: this.state.patient_code,
//         full_name: this.state.full_name,
//         advance_amount: "",
//         receipt_number: "",
//         receipt_date: this.state.ordered_date,
//         doctor_name: refBy,
//         test_name: this.state.service_name,
//         specimen: this.state.specimen,
//       },
//     });
//   }

//   isCritical = () => {
//     const { test_analytes } = this.state;
//     let status = test_analytes.some((el) => el.critical_type !== "N");
//     return status;
//   };

//   onClose = (e) => {
//     this.setState(
//       {
//         test_analytes: [],
//         comments_data: [],
//         test_comments_id: null,
//         comment_list: [],
//         edit_range: false,
//         edit_units: false,
//         selcted_comments: "",
//       },
//       () => {
//         this.props.onClose && this.props.onClose(e);
//       }
//     );
//   };

//   dateFormater({ value }) {
//     if (value !== null) {
//       return moment(value).format(Options.dateFormat);
//     }
//   }
//   onClickPrintHandle() {
//     this.setState({ loading: true });
//     generateLabResultReport(this.state)
//       .then(() => {
//         this.setState({ loading: false });
//       })
//       .catch(() => {
//         this.setState({ loading: false });
//       });
//   }
//   render() {
//     // let display =
//     //   this.props.providers === undefined
//     //     ? []
//     //     : this.props.providers.filter(
//     //         (f) => f.hims_d_employee_id === this.state.provider_id
//     //       );
//     // let isCritical = this.isCritical();
//     // let color_display =
//     //   this.state.critical_status === "N"
//     //     ? "badge badge-primary"
//     //     : "badge badge-danger";
//     return (
//       <div>
//         <AlgaehModalPopUp
//           class="labResultModalPopup"
//           events={{
//             onClose: this.onClose.bind(this),
//           }}
//           title="Result Entry"
//           openPopup={this.props.open}
//         >
//           <div className="popupInner">
//             <div className="popRightDiv">
//               <div className="row">
//                 <div className="col-12 topbarPatientDetails">
//                   <div className="row">
//                     <div className="col-2">
//                       <AlgaehLabel
//                         label={{
//                           forceLabel: "Patient Name",
//                         }}
//                       />

//                       <h6>
//                         {this.state.full_name ? this.state.full_name : "------"}
//                         <small
//                           style={{ display: "block", fontStyle: "italic" }}
//                         >
//                           {this.state.patient_code}
//                         </small>
//                       </h6>
//                     </div>
//                     <div className="col-2">
//                       <AlgaehLabel
//                         label={{
//                           forceLabel: "Test Name",
//                         }}
//                       />

//                       <h6>
//                         {this.state.service_name
//                           ? this.state.service_name
//                           : "------"}
//                         {/* <small style={{display:"table",fontStyle:"italic"}}
//                           className={`badge ${
//                             isCritical ? "badge-danger" : "badge-primary"
//                           }`}
//                         >
//                           {" "}
//                           {isCritical ? "Critical" : "Normal"}
//                         </small> */}
//                       </h6>
//                     </div>

//                     <div className="col-2">
//                       <AlgaehLabel
//                         label={{
//                           forceLabel: "Ordered By",
//                         }}
//                       />
//                       <h6>
//                         {this.state.ordered_by_name
//                           ? this.state.ordered_by_name
//                           : "------"}

//                         {this.state.ordered_by_name ? (
//                           <small
//                             style={{ display: "block", fontStyle: "italic" }}
//                           >
//                             On{" "}
//                             {moment(this.state.ordered_date).format(
//                               `${Options.dateFormat} ${Options.timeFormat}`
//                             )}
//                           </small>
//                         ) : (
//                           <small
//                             style={{ display: "block", fontStyle: "italic" }}
//                           >
//                             -------
//                           </small>
//                         )}
//                       </h6>
//                     </div>
//                     <div className="col-2">
//                       <AlgaehLabel
//                         label={{
//                           forceLabel: "Entered By",
//                         }}
//                       />

//                       <h6>
//                         {this.state.entered_by_name
//                           ? this.state.entered_by_name
//                           : "------"}

//                         {this.state.entered_by_name ? (
//                           <small
//                             style={{ display: "block", fontStyle: "italic" }}
//                           >
//                             On{" "}
//                             {moment(this.state.entered_date).format(
//                               `${Options.dateFormat} ${Options.timeFormat}`
//                             )}
//                           </small>
//                         ) : (
//                           <small
//                             style={{ display: "block", fontStyle: "italic" }}
//                           >
//                             -------
//                           </small>
//                         )}
//                       </h6>
//                     </div>

//                     <div className="col-2">
//                       <AlgaehLabel
//                         label={{
//                           forceLabel: "Confirmed By",
//                         }}
//                       />

//                       <h6>
//                         {this.state.confirm_by_name
//                           ? this.state.confirm_by_name
//                           : "------"}

//                         {this.state.confirm_by_name ? (
//                           <small
//                             style={{ display: "block", fontStyle: "italic" }}
//                           >
//                             On{" "}
//                             {moment(this.state.confirmed_date).format(
//                               `${Options.dateFormat} ${Options.timeFormat}`
//                             )}
//                           </small>
//                         ) : (
//                           <small
//                             style={{ display: "block", fontStyle: "italic" }}
//                           >
//                             -------
//                           </small>
//                         )}
//                       </h6>
//                     </div>

//                     <div className="col-2">
//                       <AlgaehLabel
//                         label={{
//                           forceLabel: "Validated By",
//                         }}
//                       />

//                       <h6>
//                         {this.state.validate_by_name
//                           ? this.state.validate_by_name
//                           : "------"}

//                         {this.state.validate_by_name ? (
//                           <small
//                             style={{ display: "block", fontStyle: "italic" }}
//                           >
//                             On{" "}
//                             {moment(this.state.validated_date).format(
//                               `${Options.dateFormat} ${Options.timeFormat}`
//                             )}
//                           </small>
//                         ) : (
//                           <small
//                             style={{ display: "block", fontStyle: "italic" }}
//                           >
//                             -------
//                           </small>
//                         )}
//                       </h6>
//                     </div>
//                     {/* <div className="col">
//                       <AlgaehLabel
//                         label={{
//                           forceLabel: "Critical Result",
//                         }}
//                       />

//                       <h6>
//                         <small
//                           className={`badge ${
//                             isCritical ? "badge-danger" : "badge-primary"
//                           }`}
//                         >
//                           {" "}
//                           {isCritical ? "Yes" : "No"}
//                         </small>
//                       </h6>
//                     </div> */}
//                   </div>
//                 </div>
//                 <hr />
//                 <div className="col-12">
//                   <div className="row">
//                     <div className="col-9" id="labResultGrid_Cntr">
//                       <AlgaehDataGrid
//                         id="labResult_list_grid"
//                         columns={[
//                           {
//                             fieldName: "status",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Analyte Status" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return row.status === "E" ? (
//                                 <span className="badge badge-secondary">
//                                   Result Entered
//                                 </span>
//                               ) : row.status === "C" ? (
//                                 <span className="badge badge-primary">
//                                   Confirmed
//                                 </span>
//                               ) : row.status === "V" ? (
//                                 <span className="badge badge-success">
//                                   Validated
//                                 </span>
//                               ) : (
//                                 <span className="badge badge-light">
//                                   Result Not Entered
//                                 </span>
//                               );
//                             },
//                             others: {
//                               maxWidth: 150,
//                               resizable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "description", //"analyte_id",
//                             label: (
//                               <AlgaehLabel label={{ forceLabel: "Analyte" }} />
//                             ),
//                             // displayTemplate: (row) => {
//                             //   let display =
//                             //     this.props.labanalytes === undefined
//                             //       ? []
//                             //       : this.props.labanalytes.filter(
//                             //           (f) =>
//                             //             f.hims_d_lab_analytes_id ===
//                             //             row.analyte_id
//                             //         );

//                             //   return (
//                             //     <span>
//                             //       {display !== null && display.length !== 0
//                             //         ? display[0].description
//                             //         : ""}
//                             //     </span>
//                             //   );
//                             // },
//                             others: {
//                               minWidth: 250,
//                               resizable: false,
//                               style: { textAlign: "left" },
//                             },
//                           },
//                           {
//                             fieldName: "analyte_type",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Analyte Type" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return row.analyte_type === "QU"
//                                 ? "Quality"
//                                 : row.analyte_type === "QN"
//                                 ? "Quantity"
//                                 : "Text";
//                             },
//                             others: {
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "result",
//                             label: (
//                               <AlgaehLabel
//                                 label={{
//                                   forceLabel: "Result",
//                                 }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {row.validate === "N" ? (
//                                     row.analyte_type === "QU" ? (
//                                       <AlgaehAutoComplete
//                                         div={{ className: "noLabel" }}
//                                         selector={{
//                                           name: "result",
//                                           className: "select-fld",
//                                           value: row.result,
//                                           dataSource: {
//                                             textField: "name",
//                                             valueField: "value",
//                                             data: [
//                                               {
//                                                 name: "Positive",
//                                                 value: "Positive",
//                                               },
//                                               {
//                                                 name: "Negative",
//                                                 value: "Negative",
//                                               },
//                                               {
//                                                 name: "Not Seen",
//                                                 value: "Not Seen",
//                                               },
//                                               {
//                                                 name: "Reactive",
//                                                 value: "Reactive",
//                                               },
//                                               {
//                                                 name: "Non-Reactive",
//                                                 value: "Non-Reactive",
//                                               },
//                                             ],
//                                           },
//                                           onChange: onchangegridresult.bind(
//                                             this,
//                                             this,
//                                             row
//                                           ),
//                                         }}
//                                       />
//                                     ) : (
//                                       <ResultInput
//                                         row={row}
//                                         onChange={(e) =>
//                                           onchangegridresult(this, row, e)
//                                         }
//                                       />
//                                     )
//                                   ) : (
//                                     row.result
//                                   )}
//                                 </span>
//                               );
//                             },
//                             others: {
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },

//                           {
//                             fieldName: "result_unit",
//                             label: (
//                               <AlgaehLabel label={{ forceLabel: "Units" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return this.state.edit_units === true &&
//                                 row.analyte_type === "QN" ? (
//                                 <AlgaehFormGroup
//                                   div={{}}
//                                   textBox={{
//                                     value: row.result_unit,
//                                     className: "txt-fld",
//                                     name: "result_unit",
//                                     events: {
//                                       onChange: ongridEditRanges.bind(
//                                         this,
//                                         this,
//                                         row
//                                       ),
//                                     },
//                                   }}
//                                 />
//                               ) : (
//                                 <span>
//                                   {row.result_unit !== "NULL"
//                                     ? row.result_unit
//                                     : "--"}
//                                 </span>
//                               );
//                             },
//                             others: {
//                               maxWidth: 70,
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "run1",
//                             label: (
//                               <AlgaehLabel
//                                 label={{
//                                   forceLabel: "Run 1",
//                                 }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {row.run1 !== "null" ? row.run1 : "----"}
//                                 </span>
//                               );
//                             },
//                             others: {
//                               maxWidth: 70,
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },

//                           {
//                             fieldName: "run2",
//                             label: (
//                               <AlgaehLabel label={{ forceLabel: "Run 2" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {row.run2 !== "null" ? row.run2 : "----"}
//                                 </span>
//                               );
//                             },
//                             others: {
//                               maxWidth: 70,
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "run3",
//                             label: (
//                               <AlgaehLabel label={{ forceLabel: "Run 3" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {row.run3 !== "null" ? row.run3 : "----"}
//                                 </span>
//                               );
//                             },
//                             others: {
//                               maxWidth: 70,
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "critical_type",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Critical Type" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return !row.critical_type ? null : row.critical_type ===
//                                 "N" ? (
//                                 <span className="badge badge-success">
//                                   Normal
//                                 </span>
//                               ) : row.critical_type === "L" ? (
//                                 <span className="badge badge-warning">Low</span>
//                               ) : row.critical_type === "H" ? (
//                                 <span className="badge badge-danger">High</span>
//                               ) : row.critical_type === "CL" ? (
//                                 <span className="badge badge-danger">
//                                   Critical Low
//                                 </span>
//                               ) : (
//                                 row.critical_type === "CH" && (
//                                   <span className="badge badge-danger">
//                                     Critical High
//                                   </span>
//                                 )
//                               );
//                             },
//                           },
//                           {
//                             fieldName: "normal_low",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Normal Low" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return this.state.edit_range === true &&
//                                 row.analyte_type === "QN" ? (
//                                 <AlgaehFormGroup
//                                   div={{}}
//                                   textBox={{
//                                     value: row.normal_low,
//                                     className: "txt-fld",
//                                     name: "normal_low",
//                                     events: {
//                                       onChange: ongridEditRanges.bind(
//                                         this,
//                                         this,
//                                         row
//                                       ),
//                                     },
//                                   }}
//                                 />
//                               ) : (
//                                 row.normal_low
//                               );
//                             },
//                             others: {
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "normal_high",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Normal High" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return this.state.edit_range === true &&
//                                 row.analyte_type === "QN" ? (
//                                 <AlgaehFormGroup
//                                   div={{}}
//                                   textBox={{
//                                     value: row.normal_high,
//                                     className: "txt-fld",
//                                     name: "normal_high",
//                                     events: {
//                                       onChange: ongridEditRanges.bind(
//                                         this,
//                                         this,
//                                         row
//                                       ),
//                                     },
//                                   }}
//                                 />
//                               ) : (
//                                 row.normal_high
//                               );
//                             },
//                             others: {
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "critical_low",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Critical Low" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return this.state.edit_range === true &&
//                                 row.analyte_type === "QN" ? (
//                                 <AlgaehFormGroup
//                                   div={{}}
//                                   textBox={{
//                                     value: row.critical_low,
//                                     className: "txt-fld",
//                                     name: "critical_low",
//                                     events: {
//                                       onChange: ongridEditRanges.bind(
//                                         this,
//                                         this,
//                                         row
//                                       ),
//                                     },
//                                   }}
//                                 />
//                               ) : (
//                                 row.critical_low
//                               );
//                             },
//                             others: {
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "critical_high",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Critical High" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return this.state.edit_range === true &&
//                                 row.analyte_type === "QN" ? (
//                                 <AlgaehFormGroup
//                                   div={{}}
//                                   textBox={{
//                                     value: row.critical_high,
//                                     className: "txt-fld",
//                                     name: "critical_high",
//                                     events: {
//                                       onChange: ongridEditRanges.bind(
//                                         this,
//                                         this,
//                                         row
//                                       ),
//                                     },
//                                   }}
//                                 />
//                               ) : (
//                                 row.critical_high
//                               );
//                             },
//                             others: {
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "dis_text_value",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Default Value" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 // normal_qualitative_value
//                                 row.normal_qualitative_value === "QU" ? (
//                                   row.normal_qualitative_value
//                                 ) : this.state.edit_range === true &&
//                                   row.analyte_type === "T" ? (
//                                   <textarea
//                                     value={row.text_value}
//                                     name="text_value"
//                                     onChange={(e) =>
//                                       this.textAreaEventGrid(row, e)
//                                     }
//                                   />
//                                 ) : (
//                                   <ul className="analyteTxtUL">
//                                     {row.dis_text_value.length > 0
//                                       ? row.dis_text_value.map((row) => {
//                                           return <li>{row}</li>;
//                                         })
//                                       : "-"}
//                                   </ul>
//                                 )
//                               );
//                             },
//                             others: {
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                               minWidth: 200,
//                             },
//                           },
//                           {
//                             fieldName: "confirm",
//                             label: (
//                               <AlgaehLabel label={{ forceLabel: "Confirm" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {row.validate === "N" ? (
//                                     <AlgaehAutoComplete
//                                       div={{ className: "noLabel" }}
//                                       selector={{
//                                         name: "confirm",
//                                         className: "select-fld",
//                                         value: row.confirm,
//                                         dataSource: {
//                                           textField: "name",
//                                           valueField: "value",
//                                           data: FORMAT_YESNO,
//                                         },
//                                         onChange: confirmedgridcol.bind(
//                                           this,
//                                           this,
//                                           row
//                                         ),
//                                       }}
//                                     />
//                                   ) : row.confirm === "N" ? (
//                                     "No"
//                                   ) : (
//                                     "Yes"
//                                   )}
//                                 </span>
//                               );
//                             },
//                             others: {
//                               maxWidth: 70,
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "validate",
//                             label: (
//                               <AlgaehLabel label={{ forceLabel: "Validate" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {row.validate === "N" ? (
//                                     <AlgaehAutoComplete
//                                       div={{ className: "noLabel" }}
//                                       selector={{
//                                         name: "validate",
//                                         className: "select-fld",
//                                         value: row.validate,
//                                         dataSource: {
//                                           textField: "name",
//                                           valueField: "value",
//                                           data: FORMAT_YESNO,
//                                         },
//                                         onChange: onchangegridcol.bind(
//                                           this,
//                                           this,
//                                           row
//                                         ),
//                                       }}
//                                     />
//                                   ) : row.confirm === "N" ? (
//                                     "No"
//                                   ) : (
//                                     "Yes"
//                                   )}
//                                 </span>
//                               );
//                             },
//                             others: {
//                               maxWidth: 70,
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           //TODO
//                           {
//                             fieldName: "amended",
//                             label: (
//                               <AlgaehLabel label={{ forceLabel: "Amend" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {row.amended === "N" ? (
//                                     <AlgaehAutoComplete
//                                       div={{ className: "noLabel" }}
//                                       selector={{
//                                         name: "amended",
//                                         className: "select-fld",
//                                         value: row.amended,
//                                         dataSource: {
//                                           textField: "name",
//                                           valueField: "value",
//                                           data: FORMAT_YESNO,
//                                         },
//                                         onChange: onchangeAmend.bind(
//                                           this,
//                                           this,
//                                           row
//                                         ),
//                                       }}
//                                     />
//                                   ) : row.amended === "N" ? (
//                                     "No"
//                                   ) : (
//                                     "Yes"
//                                   )}
//                                 </span>
//                               );
//                             },
//                             others: {
//                               maxWidth: 70,
//                               resizable: false,
//                               filterable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "remarks",
//                             label: (
//                               <AlgaehLabel
//                                 label={{
//                                   forceLabel: "Remarks",
//                                 }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {row.validate === "N" ? (
//                                     <AlgaehFormGroup
//                                       div={{ className: "noLabel" }}
//                                       textBox={{
//                                         value: row.remarks,
//                                         className: "txt-fld",
//                                         name: "remarks",
//                                         events: {
//                                           onChange: onchangegridcol.bind(
//                                             this,
//                                             this,
//                                             row
//                                           ),
//                                         },
//                                       }}
//                                     />
//                                   ) : row.remarks !== "null" ? (
//                                     row.remarks
//                                   ) : (
//                                     ""
//                                   )}
//                                 </span>
//                               );
//                             },
//                             others: {
//                               filterable: false,
//                               minWidth: 250,
//                               resizable: false,
//                             },
//                           },
//                         ]}
//                         keyId="patient_code"
//                         filter={true}
//                         dataSource={{
//                           data: this.state.test_analytes,
//                         }}
//                         paging={{ page: 0, rowsPerPage: 30 }}
//                       />
//                     </div>
//                     <div className="col-3">
//                       <div className="row">
//                         <AlgaehAutoComplete
//                           div={{ className: "col-12  form-group" }}
//                           label={{
//                             forceLabel: "Select Comment",
//                           }}
//                           selector={{
//                             name: "test_comments_id",
//                             className: "select-fld",
//                             value: this.state.test_comments_id,
//                             dataSource: {
//                               textField: "commnet_name",
//                               valueField:
//                                 "hims_d_investigation_test_comments_id",
//                               data: this.state.comments_data,
//                             },
//                             onChange: this.selectCommentEvent.bind(this),
//                             onClear: () => {
//                               this.setState({
//                                 test_comments_id: null,
//                                 selcted_comments: "",
//                               });
//                             },
//                           }}
//                         />
//                         <div className="col-12">
//                           <AlgaehLabel
//                             label={{
//                               forceLabel: "Enter Comment",
//                             }}
//                           />

//                           <textarea
//                             value={this.state.selcted_comments}
//                             name="selcted_comments"
//                             onChange={this.textAreaEvent.bind(this)}
//                           />
//                         </div>

//                         <div className="col-12" style={{ textAlign: "right" }}>
//                           <button
//                             onClick={addComments.bind(this, this)}
//                             className="btn btn-default"
//                             style={{ marginBottom: 15 }}
//                           >
//                             Add
//                           </button>
//                         </div>
//                       </div>

//                       <div className="col-12">
//                         <div className="row finalCommentsSection">
//                           <h6>View Final Comments</h6>
//                           <ol>
//                             {this.state.comment_list?.length > 0
//                               ? this.state.comment_list.map((row, index) => {
//                                   if (row) {
//                                     return (
//                                       <React.Fragment key={index}>
//                                         <li key={index}>
//                                           <span>{row}</span>
//                                           <i
//                                             className="fas fa-times"
//                                             onClick={deleteComment.bind(
//                                               this,
//                                               this,
//                                               row
//                                             )}
//                                           ></i>
//                                         </li>
//                                       </React.Fragment>
//                                     );
//                                   } else {
//                                     return null;
//                                   }
//                                 })
//                               : null}
//                           </ol>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="popupFooter">
//             <div className="col-12 ">
//               <div className="row">
//                 <div className="col-lg-6 leftBtnGroup">
//                   {" "}
//                   <AlgaehSecurityComponent componentCode="PRI_LAB_RES">
//                     <AlgaehButton
//                       className="btn btn-default"
//                       loading={this.state.loading}
//                       onClick={this.onClickPrintHandle.bind(this)}
//                       disabled={
//                         this.state.status === "V" &&
//                         this.state.credit_order === "N"
//                           ? false
//                           : true
//                       }
//                     >
//                       Print
//                     </AlgaehButton>
//                     {/* <button
//                       className="btn btn-default"
//                       onClick={this.onClickPrintHandle.bind(this)}
//                       disabled={this.state.status === "V" ? false : true}
//                     >
//                       Print
//                     </button> */}
//                   </AlgaehSecurityComponent>
//                   <AlgaehSecurityComponent componentCode="EDIT_RANGE_LAB_RES">
//                     <button
//                       type="button"
//                       className="btn btn-default"
//                       disabled={this.state.status === "V" ? true : false}
//                       onClick={eidtRanges.bind(this, this)}
//                     >
//                       Edit Ranges
//                     </button>
//                   </AlgaehSecurityComponent>
//                   <AlgaehSecurityComponent componentCode="EDIT_UNIT_LAB_RES">
//                     <button
//                       type="button"
//                       className="btn btn-default"
//                       disabled={this.state.status === "V" ? true : false}
//                       onClick={eidtUnits.bind(this, this)}
//                     >
//                       Edit Units
//                     </button>
//                   </AlgaehSecurityComponent>
//                   <AlgaehSecurityComponent componentCode="RELOAD_ANALYTES_MAS">
//                     <button
//                       type="button"
//                       className="btn btn-default"
//                       // disabled={this.state.status === "V" ? true : false}
//                       onClick={reloadAnalytesMaster.bind(this, this)}
//                     >
//                       Reload Analytes
//                     </button>
//                   </AlgaehSecurityComponent>
//                 </div>
//                 <div className="col-lg-6">
//                   {/* <button
//                 className="btn btn-primary"
//                 onClick={this.showReport.bind(
//                   this,
//                   display !== null && display.length !== 0
//                     ? display[0].full_name
//                     : ""
//                 )}
//                 disabled={this.state.status === "V" ? false : true}
//               >
//                 Print
//               </button> */}

//                   <AlgaehSecurityComponent componentCode="VAL_LAB_RES">
//                     <button
//                       type="button"
//                       className="btn btn-primary"
//                       onClick={onvalidate.bind(this, this)}
//                       disabled={
//                         this.state.status === "V" ||
//                         this.state.entered_by_name === "" ||
//                         this.state.confirm_by_name === ""
//                           ? true
//                           : false
//                       }
//                     >
//                       Validate All
//                     </button>
//                   </AlgaehSecurityComponent>

//                   <AlgaehSecurityComponent componentCode="CONF_LAB_RES">
//                     <button
//                       type="button"
//                       className="btn btn-primary"
//                       onClick={onconfirm.bind(this, this)}
//                       disabled={
//                         this.state.status === "C" ||
//                         this.state.entered_by_name === ""
//                           ? true
//                           : this.state.status === "V"
//                           ? true
//                           : false
//                       }
//                     >
//                       Confirm All
//                     </button>
//                   </AlgaehSecurityComponent>
//                   <AlgaehSecurityComponent componentCode="SAVE_LAB_RES">
//                     <button
//                       type="button"
//                       className="btn btn-primary"
//                       onClick={resultEntryUpdate.bind(this, this)}
//                       disabled={
//                         this.state.status === "V" ||
//                         this.state.test_analytes.length <= 0
//                           ? true
//                           : false
//                       }
//                     >
//                       Save
//                     </button>
//                   </AlgaehSecurityComponent>

//                   <AlgaehSecurityComponent componentCode="RE_RUN_LAB_RES">
//                     <button
//                       type="button"
//                       className="btn btn-default"
//                       onClick={onReRun.bind(this, this)}
//                       disabled={
//                         this.state.entered_by !== null
//                           ? this.state.run_type === 3
//                             ? true
//                             : false
//                           : true
//                       }
//                     >
//                       Re-Run
//                     </button>
//                   </AlgaehSecurityComponent>
//                   <button
//                     type="button"
//                     className="btn btn-default"
//                     onClick={(e) => {
//                       this.onClose(e);
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </AlgaehModalPopUp>
//       </div>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     labiologyusers: state.labiologyusers,
//     providers: state.providers,
//     testanalytes: state.testanalytes,
//     labanalytes: state.labanalytes,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getUserDetails: AlgaehActions,
//       getProviderDetails: AlgaehActions,
//       getTestAnalytes: AlgaehActions,
//       getLabAnalytes: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(ResultEntry)
// );

import React, { useContext, useState, useEffect } from "react";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  MainContext,
  AlgaehModal,
  // RawSecurityComponent,
  AlgaehAutoComplete,
  AlgaehMessagePop,
  AlgaehSecurityComponent,
  AlgaehButton,
  // AlgaehFormGroup,
  AlgaehFormGroup,
} from "algaeh-react-components";
import Options from "../../../Options.json";
import "./ResultEntry.scss";
import { ResultInput } from "./ResultInput";
import { useQuery } from "react-query";
import { newAlgaehApi } from "../../../hooks";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import swal from "sweetalert2";
import _ from "lodash";
// import axios from "axios";
import moment from "moment";
import "../../../styles/site.scss";
import { FORMAT_YESNO } from "../../../utils/GlobalVariables.json";
const getAnalytes = async (key, selectedPatient) => {
  const result = await Promise.all([
    newAlgaehApi({
      uri: "/laboratory/getTestAnalytes",
      module: "laboratory",
      method: "GET",
      data: { order_id: selectedPatient.hims_f_lab_order_id },
    }),
    newAlgaehApi({
      uri: "/laboratory/getLabOrderedComment",
      module: "laboratory",
      method: "GET",
      data: { hims_f_lab_order_id: selectedPatient.hims_f_lab_order_id },
    }),
  ]);

  return {
    analyteData: result[0]?.data?.records,
    commentsData: result[1]?.data?.records,
  };
};
function SampleCollectionPatient({ onClose, selectedPatient = {}, open }) {
  const { userToken } = useContext(MainContext);

  const [portal_exists, setPortal_exists] = useState(false);

  // const [editableGrid, setEditableGrid] = useState(undefined);

  const [run_type, setRun_type] = useState("N");
  const [test_comments_id, setTest_comments_id] = useState(null);
  const [selcted_comments, setSelcted_comments] = useState("");
  const [ordered_by_name, setOrdered_by_name] = useState({
    name: selectedPatient.ordered_by,
    date: selectedPatient.ordered_date,
  });
  const [entered_by_name, setEntered_by_name] = useState({
    name: "",
    date: "",
  });
  const [confirm_by_name, setConfirm_by_name] = useState({
    name: "",
    date: "",
  });
  const [validate_by_name, setValidate_by_name] = useState({
    name: "",
    date: "",
  });
  const [comments_data, setComments_data] = useState([]);
  const [comments, setComments] = useState();
  const [test_analytes, setTest_analytes] = useState([]);
  const [records_test_formula, setRecords_test_formula] = useState([]);
  const [comment_list, setComment_list] = useState([]);
  const [edit_range, setEdit_range] = useState(false);
  const [edit_units, setEdit_units] = useState(false);
  const [status, setStatus] = useState("");
  let [, setState] = useState();
  // const PORTAL_HOST = process.env.REACT_APP_PORTAL_HOST;
  useEffect(() => {
    setPortal_exists(userToken.portal_exists);

    setOrdered_by_name(selectedPatient.ordered_by_name);
    setStatus(selectedPatient.status);
    setComments_data(selectedPatient.comments_data);
    setComments(selectedPatient.comments);
    // RawSecurityComponent({ componentCode: "SPEC_COLL_STATUS_CHANGE" }).then(
    //   (result) => {
    //     if (result === "hide") {
    //       setEditableGrid(undefined);
    //     } else {
    //       setEditableGrid("editOnly");
    //     }
    //   }
    // );
  }, []);

  // const { data: providers } = useQuery(
  //   ["getProviderDetails", {}],
  //   getProviderDetails,
  //   {
  //     keepPreviousData: true,
  //     onSuccess: (data) => {},
  //     onError: (err) => {
  //       AlgaehMessagePop({
  //         display: err?.message,
  //         type: "error",
  //       });
  //     },
  //   }
  // );
  // async function getProviderDetails(key) {
  //   const result = await newAlgaehApi({
  //     uri: "/employee/get",
  //     module: "hrManagement",
  //     method: "GET",
  //   });
  //   return result?.data?.records;
  // }

  const { refetch: getAnalytesReload } = useQuery(
    ["getAnalytes", { ...selectedPatient }],
    getAnalytes,
    {
      initialData: {
        analyteData: [],
        commentsData: [],
      },
      cacheTime: Infinity,
      initialStale: true,
      onSuccess: (data) => {
        for (let i = 0; i < data.length; i++) {
          if (data.analyteData[i].analyte_type === "T") {
            data.analyteData[i].dis_text_value =
              data.analyteData[i].text_value !== null &&
              data.analyteData[i].text_value !== ""
                ? data.analyteData[i].text_value.split("<br/>")
                : [];

            // response.data.records[i].text_value = response.data.records[i].text_value.replace("<br/>", "\n/g")
            data.analyteData[i].text_value =
              data.analyteData[i].text_value !== null &&
              data.analyteData[i].text_value !== ""
                ? data.analyteData[i].text_value.replace(
                    new RegExp("<br/>|<br />", "g"),
                    "\n"
                  )
                : null;
          } else {
            data.analyteData[i].dis_text_value = [];
          }
        }
        const records_test_formula = _.filter(data, (f) => f.formula !== null);

        setTest_analytes(data.analyteData);
        setComment_list(
          data.commentsData.comments !== null
            ? data.commentsData.comments.split("<br/>")
            : []
        );
        debugger;
        setRecords_test_formula(records_test_formula);
        setOrdered_by_name({
          name: data.analyteData[0].ordered_by_name,
          date: data.analyteData[0].ordered_date,
        });
        setConfirm_by_name({
          name: data.analyteData[0].confirm_by_name,
          date: data.analyteData[0].confirmed_date,
        });
        setEntered_by_name({
          name: data.analyteData[0].entered_by_name,
          date: data.analyteData[0].entered_date,
        });
        setValidate_by_name({
          name: data.analyteData[0].validate_by_name,
          date: data.analyteData[0].validated_date,
        });
        // records_test_formula, setEntered_by_name;
        // test_analytes: response.data.records,
        // entered_by: response.data.records[0].entered_by,
        // ordered_by_name: response.data.records[0].ordered_by_name,
        // entered_by_name: response.data.records[0].entered_by_name,
        // confirm_by_name: response.data.records[0].confirm_by_name,
        // validate_by_name: response.data.records[0].validate_by_name,
        // entered_date: response.data.records[0].entered_date,
        // confirmed_date: response.data.records[0].confirmed_date,
        // validated_date: response.data.records[0].validated_date,
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );

  // const getAnalytes = () => {
  //   AlgaehLoader({ show: true });

  //   algaehApiCall({
  //     uri: "/laboratory/getTestAnalytes",
  //     module: "laboratory",
  //     method: "GET",
  //     data: { order_id: $this.state.hims_f_lab_order_id },
  //     onSuccess: (response) => {
  //       // console.timeEnd("lab");
  //       if (response.data.success) {
  //         for (let i = 0; i < response.data.records.length; i++) {
  //           if (response.data.records[i].analyte_type === "T") {
  //             response.data.records[i].dis_text_value =
  //               response.data.records[i].text_value !== null &&
  //               response.data.records[i].text_value !== ""
  //                 ? response.data.records[i].text_value.split("<br/>")
  //                 : [];

  //             // response.data.records[i].text_value = response.data.records[i].text_value.replace("<br/>", "\n/g")
  //             response.data.records[i].text_value =
  //               response.data.records[i].text_value !== null &&
  //               response.data.records[i].text_value !== ""
  //                 ? response.data.records[i].text_value.replace(
  //                     new RegExp("<br/>|<br />", "g"),
  //                     "\n"
  //                   )
  //                 : null;
  //           } else {
  //             response.data.records[i].dis_text_value = [];
  //           }
  //         }
  //         const records_test_formula = _.filter(
  //           response.data.records,
  //           (f) => f.formula !== null
  //         );

  //         setTest_analytes(response.data.records)
  //         setRecords_test_formula(records_test_formula)
  //         $this.setState(
  //           {
  //             records_test_formula,
  //             test_analytes: response.data.records,
  //             entered_by: response.data.records[0].entered_by,
  //             ordered_by_name: response.data.records[0].ordered_by_name,
  //             entered_by_name: response.data.records[0].entered_by_name,
  //             confirm_by_name: response.data.records[0].confirm_by_name,
  //             validate_by_name: response.data.records[0].validate_by_name,
  //             entered_date: response.data.records[0].entered_date,
  //             confirmed_date: response.data.records[0].confirmed_date,
  //             validated_date: response.data.records[0].validated_date,
  //           },
  //           () => {
  //             AlgaehLoader({ show: false });
  //             console.timeEnd("lab");
  //           }
  //         );
  //       }
  //     },
  //   });

  //   algaehApiCall({
  //     uri: "/laboratory/getLabOrderedComment",
  //     module: "laboratory",
  //     method: "GET",
  //     data: { hims_f_lab_order_id: $this.state.hims_f_lab_order_id },
  //     onSuccess: (response) => {
  //       if (response.data.success) {
  //         $this.setState({
  //           comment_list:
  //             response.data.records.comments !== null
  //               ? response.data.records.comments.split("<br/>")
  //               : [],
  //         });
  //       }
  //     },
  //   });
  // };

  const forceUpdate = (row) => {
    let testAnalytes = test_analytes;

    let _index = testAnalytes.indexOf(row);

    testAnalytes[_index] = row;
    setTest_analytes(testAnalytes);
    setState({});
  };

  // const { data: labanalytes } = useQuery(
  //   ["getLabAnalytes", {}],
  //   getLabAnalytes,
  //   {
  //     keepPreviousData: true,
  //     onSuccess: (data) => {},
  //     onError: (err) => {
  //       AlgaehMessagePop({
  //         display: err?.message,
  //         type: "error",
  //       });
  //     },
  //   }
  // );
  // async function getLabAnalytes(key) {
  //   const result = await newAlgaehApi({
  //     uri: "/labmasters/selectAnalytes",
  //             module: "laboratory",
  //             method: "GET",
  //   });
  //   return result?.data?.records;
  // }
  // const { data: labiologyusers } = useQuery(
  //   ["getUserDetails", {}],
  //   getUserDetails,
  //   {
  //     keepPreviousData: true,
  //     onSuccess: (data) => {
  //       // setEnabledHESN(false);
  //     },
  //     onError: (err) => {
  //       AlgaehMessagePop({
  //         display: err?.message,
  //         type: "error",
  //       });
  //     },
  //   }
  // );
  const onClickPrintHandle = () => {
    generateLabResultReport({ hidePrinting: false })
      .then(() => {
        // this.setState({ loading: false });
      })
      .catch(() => {
        // this.setState({ loading: false });
      });
  };
  // const [add] = useMutation(generateLabResultReport, {
  //   onSuccess: (data) => {
  //     onSuccess();
  //     AlgaehMessagePop({
  //       type: "success",
  //       display: "Card Added successfully",
  //     });
  //   },
  //   onError,
  // });

  function generateLabResultReport(data) {
    return new Promise((resolve, reject) => {
      let portalParams = {};
      debugger;
      if (portal_exists === "Y") {
        portalParams["reportToPortal"] = "true";
      }
      algaehApiCall({
        uri: "/report",
        method: "GET",
        module: "reports",
        headers: {
          Accept: "blob",
        },
        others: { responseType: "blob" },
        data: {
          report: {
            // reportName: "hematologyTestReport",
            ...portalParams,
            reportName:
              selectedPatient?.isPCR === "Y"
                ? "pcrTestReport"
                : "hematologyTestReport",
            reportParams: [
              { name: "hims_d_patient_id", value: selectedPatient.patient_id },
              {
                name: "visit_id",
                value: selectedPatient.visit_id,
              },
              {
                name: "hims_f_lab_order_id",
                value: selectedPatient.hims_f_lab_order_id,
              },
              {
                name: "visit_code",
                value: selectedPatient.visit_code,
              },
              {
                name: "patient_identity",
                value: selectedPatient.primary_id_no,
              },
              {
                name: "service_id",
                value: selectedPatient.service_id,
              },
            ],
            qrCodeReport: true,
            outputFileType: "PDF",
          },
        },
        onSuccess: (res) => {
          if (data.hidePrinting === true) {
            resolve();
          } else {
            const urlBlob = URL.createObjectURL(res.data);
            const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Lab Test Report`;
            window.open(origin);
            resolve();
          }
        },
        onCatch: (err) => {
          reject(err);
        },
      });
    });
  }

  const reloadAnalytesMaster = () => {
    AlgaehLoader({ show: true });

    const inputObj = {
      test_id: selectedPatient.hims_d_investigation_test_id,
      date_of_birth: selectedPatient.date_of_birth,
      gender: selectedPatient.gender,
      order_id: selectedPatient.hims_f_lab_order_id,
    };
    algaehApiCall({
      uri: "/laboratory/reloadAnalytesMaster",
      module: "laboratory",
      method: "PUT",
      data: inputObj,
      onSuccess: (response) => {
        if (response.data.success) {
          getAnalytesReload();
          AlgaehLoader({ show: false });
        }
      },
      onCatch: (error) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  const UpdateLabOrder = (value, status) => {
    value[0].comments = comment_list.join("<br/>");
    value[0].portal_exists = portal_exists;
    value[0].visit_code = selectedPatient.visit_code;
    value[0].primary_id_no = selectedPatient.primary_id_no;
    const critical_exit = _.filter(value, (f) => {
      return f.critical_status === "Y";
    });
    if (critical_exit.length > 0) {
      value[0].critical_status = "Y";
    }
    AlgaehLoader({ show: true });
    //

    for (let k = 0; k < value.length; k++) {
      if (value[k].analyte_type === "T" && edit_range) {
        value[k].val_text_value =
          value[k].text_value !== null && value[k].text_value !== ""
            ? value[k].text_value.replace(/\r?\n/g, "<br/>")
            : null;
        value[k].dis_text_value =
          value[k].text_value !== null && value[k].text_value !== ""
            ? value[k].val_text_value.split("<br/>")
            : [];
      }
    }

    debugger;
    algaehApiCall({
      uri: "/laboratory/updateLabResultEntry",
      module: "laboratory",
      data: value,
      method: "PUT",
      onSuccess: (response) => {
        if (response.data.success === true) {
          if (status === "N") {
            // if (portal_exists === "Y") {
            //   const portal_data = {
            //     service_id: selectedPatient.service_id,
            //     visit_code: selectedPatient.visit_code,
            //     patient_identity: selectedPatient.primary_id_no,
            //     service_status: "SAMPLE COLLECTED",
            //   };
            //   axios
            //     .post(`${PORTAL_HOST}/info/deletePatientService`, portal_data)
            //     .then(function (response) {
            //       //handle success
            //       console.log(response);
            //     })
            //     .catch(function (response) {
            //       //handle error
            //       console.log(response);
            //     });
            // }
            swalMessage({
              type: "success",
              title: "Re-Run Started, Investigation is in Progress . .",
            });
          } else {
            // if (status === "CF" || status === "V" || status === "AV") {
            //   if (portal_exists === "Y") {
            //     const portal_data = {
            //       service_id: selectedPatient.service_id,
            //       visit_code: selectedPatient.visit_code,
            //       patient_identity: selectedPatient.primary_id_no,
            //       service_status:
            //         status === "CF" ? "RESULT CONFIRMED" : "RESULT VALIDATED",
            //     };
            //     axios
            //       .post(`${PORTAL_HOST}/info/deletePatientService`, portal_data)
            //       .then(function (response) {
            //         //handle success
            //         console.log(response);
            //       })
            //       .catch(function (response) {
            //         //handle error
            //         console.log(response);
            //       });
            //   }
            // }
            swalMessage({
              type: "success",
              title: "Done successfully . .",
            });
            console.timeEnd("valid");
          }

          const last = value[value.length - 1];
          if (last.hasOwnProperty("runtype")) {
            value.pop();
          }

          getAnalytesReload();
          setTest_analytes(value);
          setStatus(status === "AV" ? "V" : status);
          // setConfirm_by_name(
          //   response.data.records.confirmed_by
          //     ? response.data.records.confirmed_by
          //     : confirm_by_name
          // );
          // setEntered_by_name(
          //   response.data.records.entered_by
          //     ? response.data.records.entered_by
          //     : entered_by_name.name
          // );

          // setValidate_by_name(
          //   response.data.records.validated_by
          //     ? response.data.records.validated_by
          //     : validate_by_name
          // );
          setRun_type(status === "N" ? last.runtype : run_type);
          setEdit_range(false);
          setEdit_units(false);

          AlgaehLoader({ show: false });

          if (portal_exists === "Y" && (status === "V" || status === "AV")) {
            generateLabResultReport({ hidePrinting: true });
          }
        }
      },
      onFailure: (error) => {
        swalMessage({
          type: "error",
          title: error.response.data.message || error.message,
        });
      },
    });
  };
  const onvalidate = () => {
    console.time("valid");

    let testAnalytes = test_analytes;

    let strTitle = "Are you sure want to Validate?";

    const intNoofAnalytes = testAnalytes.filter(
      (f) => f.result === null || f.result === ""
    );
    if (testAnalytes.length === intNoofAnalytes.length) {
      swalMessage({
        type: "warning",
        title: "Atleast one Analyte result to be entered.",
      });
      return;
    }

    for (let k = 0; k < testAnalytes.length; k++) {
      if (testAnalytes[k].result === null || testAnalytes[k].result === "") {
        strTitle =
          "Are you sure want to Validate, for few Analytes no Result Entered?";

        testAnalytes[k].status = "V";
        testAnalytes[k].validate = "Y";
        testAnalytes[k].isre_run = false;
      }
      testAnalytes[k].status = "V";
      // test_analytes[k].validate = "Y";
      testAnalytes[k].isre_run = false;
      testAnalytes[k].comments = comments;
    }

    swal({
      title: strTitle,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willProceed) => {
      if (willProceed.value) {
        testAnalytes.push({ runtype: run_type });
        UpdateLabOrder(testAnalytes, "V");
      }
    });
  };
  const onconfirm = () => {
    let testAnalytes = test_analytes;

    const intNoofAnalytes = testAnalytes.filter(
      (f) => f.result === null || f.result === ""
    );
    if (testAnalytes.length === intNoofAnalytes.length) {
      swalMessage({
        type: "warning",
        title: "Atleast one Analyte result to be entered.",
      });
      return;
    }

    let strTitle = "Are you sure want to Confirm?";
    for (let k = 0; k < testAnalytes.length; k++) {
      if (testAnalytes[k].result === null || testAnalytes[k].result === "") {
        strTitle =
          "Are you sure want to Confirm, for few Analytes no Result Entered?";
      } else {
        testAnalytes[k].status = "C";
        testAnalytes[k].confirm = "Y";
        testAnalytes[k].isre_run = false;
        if (selectedPatient.auto_validate === "Y") {
          testAnalytes[k].status = "AV";
          testAnalytes[k].validate = "Y";
          strTitle =
            "This Test is Auto Validate Are you sure want to Confirm ?";
        }
      }
      testAnalytes[k].comments = comments;
    }

    swal({
      title: strTitle,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willProceed) => {
      if (willProceed.value) {
        test_analytes.push({ runtype: run_type });
        UpdateLabOrder(
          test_analytes,
          selectedPatient.auto_validate === "Y" ? "AV" : "CF"
        );
      }
    });
  };

  const resultEntryUpdate = () => {
    let testAnalytes = test_analytes;
    // let enterResult = true;
    // let enterRemarks = true;
    for (let k = 0; k < testAnalytes.length; k++) {
      if (testAnalytes[k].result !== null) {
        // if (
        //   test_analytes[k].remarks === null &&
        //   test_analytes[k].amended === "Y"
        // ) {
        //   enterRemarks = false;
        // } else {
        testAnalytes[k].status = "E";
        if (testAnalytes[k].confirm !== "N") {
          testAnalytes[k].status = "C";
        }

        if (testAnalytes[k].validate !== "N") {
          testAnalytes[k].status = "V";
        }
      }
      // } else {
      //   enterResult = false;
      // }
      testAnalytes[k].isre_run = false;
      testAnalytes[k].comments = comments;
    }
    testAnalytes.push({ runtype: run_type });
    UpdateLabOrder(testAnalytes, "E");
    // if (enterResult === true && enterRemarks === true) {
    //   test_analytes.push({ runtype: $this.state.run_type });
    //   UpdateLabOrder($this, test_analytes, "E");
    // } else {
    //   if (enterResult === false) {
    //     swalMessage({
    //       type: "warning",
    //       title: "Please enter result for all the Analytes.",
    //     });
    //   } else if (enterRemarks === false) {
    //     swalMessage({
    //       type: "warning",
    //       title: "Please enter Remarks for Amended..",
    //     });
    //   }
    // }
  };

  const onReRun = () => {
    swal({
      title: "Are you sure want to Re-Run?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willProceed) => {
      if (willProceed.value) {
        let currentAnalytes = [...test_analytes];

        let runtype = run_type === "N" ? 1 : parseInt(run_type) + 1;

        for (let k = 0; k < currentAnalytes.length; k++) {
          currentAnalytes[k][`run${runtype}`] = currentAnalytes[k].result;

          currentAnalytes[k].result = "";
          currentAnalytes[k].confirm = "N";
          currentAnalytes[k].validate = "N";
          currentAnalytes[k].status = "N";
          currentAnalytes[k].isre_run = true;

          currentAnalytes[k].comments = comments;
        }

        currentAnalytes.push({ runtype });

        UpdateLabOrder(currentAnalytes, "N");
      }
    });
  };

  const deleteComment = (row) => {
    let commentList = comment_list;
    let _index = commentList.indexOf(row);
    commentList.splice(_index, 1);
    setComment_list(commentList);
    setState({});
  };
  const onchangegridresult = (row, e) => {
    row.result = e.target.value;
    let testAnalytes = test_analytes;
    // let critical_status = "N";
    const records_test = records_test_formula;
    //"[345]/[890]/[590]*100".match(/\d+]/g)

    const indexOfArray = testAnalytes.findIndex(
      (f) => f.hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
    );
    row["normal_low"] = testAnalytes[indexOfArray].normal_low;
    row["normal_high"] = testAnalytes[indexOfArray].normal_high;
    row["critical_low"] = testAnalytes[indexOfArray].critical_low;
    row["critical_high"] = testAnalytes[indexOfArray].critical_high;

    row["critical_type"] = checkRange(row);
    if (row["critical_type"] !== "N") {
      row["critical_status"] = "Y";
    }
    testAnalytes[indexOfArray] = row;

    for (let i = 0; i < records_test.length; i++) {
      const { formula, analyte_id, decimals } = records_test[i];
      if (formula) {
        let executableFormula = formula;
        const _aFormula = formula.match(/\d+]/g);
        for (let j = 0; j < _aFormula.length; j++) {
          const formula_id = _aFormula[j].replace(/\]/g, "");
          const _record = testAnalytes.find(
            (f) => String(f.analyte_id) === formula_id
          );
          if (_record) {
            if (_record.result !== "") {
              const formula_reg = new RegExp(`${formula_id}`, "g");
              executableFormula = executableFormula
                .replace(formula_reg, _record.result)
                .replace(/\[/gi, "")
                .replace(/\]/gi, "");
            } else {
              executableFormula = "";
            }
          }
        }

        let otherValue = eval(executableFormula);
        if (decimals) {
          otherValue =
            otherValue === undefined
              ? ""
              : parseFloat(otherValue).toFixed(decimals);
        }
        // console.log("otherValue", otherValue);
        const analyte_index = testAnalytes.findIndex(
          (f) => f.analyte_id === analyte_id
        );

        testAnalytes[analyte_index]["result"] = String(otherValue);
        testAnalytes[analyte_index]["critical_type"] = checkRange(
          testAnalytes[analyte_index]
        );
      }
    }
    setTest_analytes(testAnalytes);
    forceUpdate(row);
  };
  function checkRange(row) {
    let {
      result,
      normal_low,
      normal_high,
      critical_value_req,
      critical_low,
      critical_high,
    } = row;

    result = result === "" ? "" : parseFloat(result);
    critical_low = parseFloat(critical_low);
    normal_low = parseFloat(normal_low);
    normal_high = parseFloat(normal_high);
    critical_high = parseFloat(critical_high);

    if (row.analyte_type === "QN") {
      if (result === "") {
        return null;
      } else if (critical_value_req === "Y" && result < critical_low) {
        return "CL";
      } else if (result < normal_low) {
        return "L";
      } else if (critical_value_req === "Y" && result > critical_high) {
        return "CH";
      } else if (result > normal_high) {
        return "H";
      } else {
        return "N";
      }
    } else {
      return "N";
    }
  }
  const confirmedgridcol = (row, value) => {
    let testAnalytes = test_analytes;

    if (row.validate === "Y" && value === "N") {
      row["validate"] = "N";
    }

    row.confirm = value;
    // row["status"] = "C";
    for (let l = 0; l < testAnalytes.length; l++) {
      if (
        testAnalytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
      ) {
        testAnalytes[l] = row;
      }
    }
    setTest_analytes(testAnalytes);
  };

  const onchangeAmend = (row, value) => {
    let testAnalytes = test_analytes;

    // TO trigger re-render
    let l;
    for (l = 0; l < testAnalytes.length; l++) {
      if (
        testAnalytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
      ) {
        if (value === "N") {
          row.amended = "N";
        } else {
          row.amended = "";
        }
        testAnalytes[l] = row;
      }
    }

    setTest_analytes(testAnalytes);
    if (value === "Y") {
      swal({
        title: "Are you sure want to Amend?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
      }).then((willProceed) => {
        if (willProceed.value) {
          row.amended = value;
          row["confirm"] = "N";
          row["validate"] = "N";
          row["status"] = "E";
        } else {
          row.amended = "N";
        }
        testAnalytes[l - 1] = row;
        setTest_analytes(testAnalytes);
        if (willProceed.value) {
          setStatus("CL");
        }
        setState({});
      });
    }
  };

  const selectCommentEvent = (e, value) => {
    setTest_comments_id(value);
    setSelcted_comments(e.commet);
  };

  const addComments = () => {
    if (selcted_comments === "") {
      swalMessage({
        type: "warning",
        title: "Comment cannot be blank.",
      });
      return;
    }
    let commentList = comment_list;
    commentList.push(selcted_comments);
    setComment_list(commentList);
    setSelcted_comments("");
    setTest_comments_id(null);
  };
  return (
    <div>
      <AlgaehModal
        title="Result Entry"
        class="labResultModalPopup"
        visible={open}
        mask={true}
        maskClosable={true}
        onCancel={onClose}
        footer={[
          <div className="row">
            <div className="col-6 footer-btn-left">
              <AlgaehSecurityComponent componentCode="PRI_LAB_RES">
                <AlgaehButton
                  className="btn btn-default"
                  // loading={this.state.loading}
                  onClick={onClickPrintHandle}
                  disabled={
                    status === "V" && selectedPatient.credit_order === "N"
                      ? false
                      : true
                  }
                >
                  Print
                </AlgaehButton>
                {/* <button
         className="btn btn-default"
         onClick={this.onClickPrintHandle.bind(this)}
         disabled={this.state.status === "V" ? false : true}
       >
         Print
       </button> */}
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="EDIT_RANGE_LAB_RES">
                <button
                  type="button"
                  className="btn btn-default"
                  disabled={status === "V" ? true : false}
                  onClick={() => {
                    setEdit_range(!edit_range);
                  }}
                >
                  Edit Ranges
                </button>
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="EDIT_UNIT_LAB_RES">
                <button
                  type="button"
                  className="btn btn-default"
                  disabled={status === "V" ? true : false}
                  onClick={() => {
                    setEdit_units(!edit_units);
                  }}
                >
                  Edit Units
                </button>
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="RELOAD_ANALYTES_MAS">
                <button
                  type="button"
                  className="btn btn-default"
                  disabled={status === "V" ? true : false}
                  onClick={reloadAnalytesMaster}
                >
                  Reload Analytes
                </button>
              </AlgaehSecurityComponent>
            </div>

            <div className="col-6">
              <AlgaehSecurityComponent componentCode="VAL_LAB_RES">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onvalidate}
                  disabled={
                    status === "V" ||
                    entered_by_name.name === "" ||
                    confirm_by_name.name === ""
                      ? true
                      : false
                  }
                >
                  Validate All
                </button>
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="CONF_LAB_RES">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onconfirm}
                  disabled={
                    status === "C" || entered_by_name.name === ""
                      ? true
                      : status === "V"
                      ? true
                      : false
                  }
                >
                  Confirm All
                </button>
              </AlgaehSecurityComponent>
              <AlgaehSecurityComponent componentCode="SAVE_LAB_RES">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={resultEntryUpdate}
                  disabled={
                    status === "V" || test_analytes.length <= 0 ? true : false
                  }
                >
                  Save
                </button>
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="RE_RUN_LAB_RES">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={onReRun}
                  disabled={
                    entered_by_name.name
                      ? run_type === 3
                        ? true
                        : false
                      : true
                  }
                >
                  Re-Run
                </button>
              </AlgaehSecurityComponent>
              <button
                type="button"
                className="btn btn-default"
                onClick={(e) => {
                  onClose(e);
                }}
              >
                Cancel
              </button>
            </div>
          </div>,
        ]}
        className={`row algaehNewModal hemResultEntryPopup`}
      >
        <div className="popupInner">
          <div className="popRightDiv">
            <div className="row">
              <div className="col-12 topbarPatientDetails">
                <div className="row">
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Patient Name",
                      }}
                    />

                    <h6>
                      {selectedPatient.full_name
                        ? selectedPatient.full_name
                        : "------"}
                      <small style={{ display: "block", fontStyle: "italic" }}>
                        {selectedPatient.patient_code}
                      </small>
                    </h6>
                  </div>
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Test Name",
                      }}
                    />

                    <h6>
                      {selectedPatient.service_name
                        ? selectedPatient.service_name
                        : "------"}
                      {/* <small style={{display:"table",fontStyle:"italic"}}
                          className={`badge ${
                            isCritical ? "badge-danger" : "badge-primary"
                          }`}
                        >
                          {" "}
                          {isCritical ? "Critical" : "Normal"}
                        </small> */}
                    </h6>
                  </div>

                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Ordered By",
                      }}
                    />
                    <h6>
                      {ordered_by_name?.name ? ordered_by_name?.name : "------"}

                      {ordered_by_name?.name ? (
                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          On{" "}
                          {moment(ordered_by_name.date).format(
                            `${Options.dateFormat} ${Options.timeFormat}`
                          )}
                        </small>
                      ) : (
                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          -------
                        </small>
                      )}
                    </h6>
                  </div>
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Entered By",
                      }}
                    />

                    <h6>
                      {entered_by_name.name ? entered_by_name.name : "------"}

                      {entered_by_name.name ? (
                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          On{" "}
                          {moment(entered_by_name.date).format(
                            `${Options.dateFormat} ${Options.timeFormat}`
                          )}
                        </small>
                      ) : (
                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          -------
                        </small>
                      )}
                    </h6>
                  </div>

                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Confirmed By",
                      }}
                    />

                    <h6>
                      {confirm_by_name.name ? confirm_by_name.name : "------"}

                      {confirm_by_name.name ? (
                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          On{" "}
                          {moment(confirm_by_name.date).format(
                            `${Options.dateFormat} ${Options.timeFormat}`
                          )}
                        </small>
                      ) : (
                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          -------
                        </small>
                      )}
                    </h6>
                  </div>

                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Validated By",
                      }}
                    />

                    <h6>
                      {validate_by_name.name ? validate_by_name.name : "------"}

                      {validate_by_name.name ? (
                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          On{" "}
                          {moment(validate_by_name.date).format(
                            `${Options.dateFormat} ${Options.timeFormat}`
                          )}
                        </small>
                      ) : (
                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          -------
                        </small>
                      )}
                    </h6>
                  </div>
                  {/* <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Critical Result",
                        }}
                      />

                      <h6>
                        <small
                          className={`badge ${
                            isCritical ? "badge-danger" : "badge-primary"
                          }`}
                        >
                          {" "}
                          {isCritical ? "Yes" : "No"}
                        </small>
                      </h6>
                    </div> */}
                </div>
              </div>
              <hr />
              <div className="col-12">
                <div className="row">
                  <div className="col-9" id="hemResultEntryGrid">
                    <AlgaehDataGrid
                      // id="labResult_list_grid"
                      columns={[
                        {
                          fieldName: "status",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Analyte Status" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return row.status === "E" ? (
                              <span className="badge badge-secondary">
                                Result Entered
                              </span>
                            ) : row.status === "C" ? (
                              <span className="badge badge-primary">
                                Confirmed
                              </span>
                            ) : row.status === "V" ? (
                              <span className="badge badge-success">
                                Validated
                              </span>
                            ) : (
                              <span className="badge badge-light">
                                Result Not Entered
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "description", //"analyte_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Analyte" }} />
                          ),
                          // displayTemplate: (row) => {
                          //   let display =
                          //     this.props.labanalytes === undefined
                          //       ? []
                          //       : this.props.labanalytes.filter(
                          //           (f) =>
                          //             f.hims_d_lab_analytes_id ===
                          //             row.analyte_id
                          //         );

                          //   return (
                          //     <span>
                          //       {display !== null && display.length !== 0
                          //         ? display[0].description
                          //         : ""}
                          //     </span>
                          //   );
                          // },
                          others: {
                            minWidth: 250,
                            resizable: false,
                            style: { textAlign: "left" },
                          },
                        },
                        {
                          fieldName: "analyte_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Analyte Type" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return row.analyte_type === "QU"
                              ? "Quality"
                              : row.analyte_type === "QN"
                              ? "Quantity"
                              : "Text";
                          },
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "result",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Result",
                              }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.validate === "N" ? (
                                  row.analyte_type === "QU" ? (
                                    <AlgaehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "result",
                                        className: "select-fld",
                                        value: row.result,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: [
                                            {
                                              name: "Positive",
                                              value: "Positive",
                                            },
                                            {
                                              name: "Negative",
                                              value: "Negative",
                                            },
                                            {
                                              name: "Not Seen",
                                              value: "Not Seen",
                                            },
                                            {
                                              name: "Reactive",
                                              value: "Reactive",
                                            },
                                            {
                                              name: "Non-Reactive",
                                              value: "Non-Reactive",
                                            },
                                          ],
                                        },
                                        updateInternally: true,
                                        onChange: (e, value) => {
                                          row.result = value;
                                          forceUpdate(row);

                                          // onchangegridcol(row, e);
                                        },
                                        onClear: (e) => {
                                          forceUpdate(row);
                                        },
                                      }}
                                    />
                                  ) : (
                                    <ResultInput
                                      row={row}
                                      onChange={(e) => {
                                        onchangegridresult(row, e);
                                      }}
                                    />
                                  )
                                ) : (
                                  row.result
                                )}
                              </span>
                            );
                          },
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },

                        {
                          fieldName: "result_unit",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Units" }} />
                          ),
                          displayTemplate: (row) => {
                            return edit_units === true &&
                              (row.analyte_type === "QN" ||
                                row.analyte_type === "T") ? (
                              <AlgaehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.result_unit,
                                  className: "txt-fld",
                                  name: "result_unit",

                                  updateInternally: true,
                                  onChange: (e) => {
                                    row.result_unit = e.target.value;
                                    forceUpdate(row);
                                  },
                                }}
                              />
                            ) : (
                              <span>
                                {row.result_unit !== "NULL"
                                  ? row.result_unit
                                  : "--"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "run1",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Run 1",
                              }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.run1 !== "null" ? row.run1 : "----"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },

                        {
                          fieldName: "run2",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Run 2" }} />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.run2 !== "null" ? row.run2 : "----"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "run3",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Run 3" }} />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.run3 !== "null" ? row.run3 : "----"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "critical_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Critical Type" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return !row.critical_type ? null : row.critical_type ===
                              "N" ? (
                              <span className="badge badge-success">
                                Normal
                              </span>
                            ) : row.critical_type === "L" ? (
                              <span className="badge badge-warning">Low</span>
                            ) : row.critical_type === "H" ? (
                              <span className="badge badge-danger">High</span>
                            ) : row.critical_type === "CL" ? (
                              <span className="badge badge-danger">
                                Critical Low
                              </span>
                            ) : (
                              row.critical_type === "CH" && (
                                <span className="badge badge-danger">
                                  Critical High
                                </span>
                              )
                            );
                          },
                        },
                        {
                          fieldName: "normal_low",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Normal Low" }} />
                          ),
                          displayTemplate: (row) => {
                            return edit_range === true &&
                              row.analyte_type === "QN" ? (
                              <AlgaehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.normal_low,
                                  className: "txt-fld",
                                  name: "normal_low",
                                  updateInternally: true,
                                  onChange: (e) => {
                                    row.normal_low = e.target.value;
                                    forceUpdate(row);
                                  },
                                }}
                              />
                            ) : (
                              row.normal_low
                            );
                          },
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "normal_high",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Normal High" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return edit_range === true &&
                              row.analyte_type === "QN" ? (
                              <AlgaehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.normal_high,
                                  className: "txt-fld",
                                  name: "normal_high",
                                  updateInternally: true,
                                  onChange: (e) => {
                                    row.normal_high = e.target.value;
                                    forceUpdate(row);
                                  },
                                }}
                              />
                            ) : (
                              row.normal_high
                            );
                          },
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "critical_low",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Critical Low" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return edit_range === true &&
                              row.analyte_type === "QN" ? (
                              <AlgaehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.critical_low,
                                  className: "txt-fld",
                                  name: "critical_low",
                                  updateInternally: true,
                                  onChange: (e) => {
                                    row.critical_low = e.target.value;
                                    forceUpdate(row);
                                  },
                                }}
                              />
                            ) : (
                              row.critical_low
                            );
                          },
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "critical_high",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Critical High" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return edit_range === true &&
                              row.analyte_type === "QN" ? (
                              <AlgaehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  value: row.critical_high,
                                  className: "txt-fld",
                                  name: "critical_high",
                                  updateInternally: true,
                                  onChange: (e) => {
                                    row.critical_high = e.target.value;
                                    forceUpdate(row);
                                  },
                                }}
                              />
                            ) : (
                              // <AlgaehFormGroup
                              //   div={{}}
                              //   textBox={{
                              //     value: row.critical_high,
                              //     className: "txt-fld",
                              //     name: "critical_high",
                              //     events: {
                              //       onChange: ongridEditRanges.bind(
                              //         this,
                              //         this,
                              //         row
                              //       ),
                              //     },
                              //   }}
                              // />
                              row.critical_high
                            );
                          },
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "dis_text_value",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Default Value" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              // normal_qualitative_value
                              row.normal_qualitative_value === "QU" ? (
                                row.normal_qualitative_value
                              ) : edit_range === true &&
                                row.analyte_type === "T" ? (
                                <textarea
                                  value={row.text_value}
                                  name="text_value"
                                  onChange={
                                    (e) => {
                                      row.text_value = e.target.value;
                                      forceUpdate(row);
                                    }
                                    // this.textAreaEventGrid(row, e)
                                  }
                                />
                              ) : (
                                <ul className="analyteTxtUL">
                                  {row.dis_text_value?.length > 0
                                    ? row.dis_text_value.map((row) => {
                                        return <li>{row}</li>;
                                      })
                                    : "-"}
                                </ul>
                              )
                            );
                          },
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                            minWidth: 200,
                          },
                        },
                        {
                          fieldName: "confirm",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Confirm" }} />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.validate === "N" ? (
                                  <AlgaehAutoComplete
                                    div={{ className: "noLabel" }}
                                    selector={{
                                      name: "confirm",
                                      className: "select-fld",
                                      value: row.confirm,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: FORMAT_YESNO,
                                      },
                                      updateInternally: true,
                                      onChange: (e, value) => {
                                        if (
                                          row.result === null &&
                                          value === "Y"
                                        ) {
                                          swalMessage({
                                            type: "warning",
                                            title: "Please enter the result",
                                          });
                                        } else {
                                          confirmedgridcol(row, value);
                                        }
                                      },
                                    }}
                                  />
                                ) : row.confirm === "N" ? (
                                  "No"
                                ) : (
                                  "Yes"
                                )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "validate",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Validate" }} />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.validate === "N" ? (
                                  <AlgaehAutoComplete
                                    div={{ className: "noLabel" }}
                                    selector={{
                                      name: "validate",
                                      className: "select-fld",
                                      value: row.validate,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: FORMAT_YESNO,
                                      },
                                      updateInternally: true,
                                      onChange: (e, value) => {
                                        row.validate = value;
                                        forceUpdate(row);

                                        // onchangegridcol(row, e);
                                      },
                                      onClear: (e) => {
                                        forceUpdate(row);
                                      },
                                    }}
                                  />
                                ) : row.confirm === "N" ? (
                                  "No"
                                ) : (
                                  "Yes"
                                )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        //TODO
                        {
                          fieldName: "amended",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Amend" }} />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.amended === "N" ? (
                                  <AlgaehAutoComplete
                                    div={{ className: "noLabel" }}
                                    selector={{
                                      name: "amended",
                                      className: "select-fld",
                                      value: row.amended,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: FORMAT_YESNO,
                                      },
                                      updateInternally: true,
                                      onChange: (e, value) => {
                                        row.amended = value;
                                        // forceUpdate(row);
                                        onchangeAmend(row, value);

                                        // onchangegridcol(row, e);
                                      },
                                    }}
                                  />
                                ) : row.amended === "N" ? (
                                  "No"
                                ) : (
                                  "Yes"
                                )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "remarks",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Remarks",
                              }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.validate === "N" ? (
                                  <AlgaehFormGroup
                                    div={{ className: "col" }}
                                    textBox={{
                                      value: row.remarks,
                                      className: "txt-fld",
                                      name: "remarks",
                                      updateInternally: true,
                                      onChange: (e) => {
                                        row.nphies_code = e.target.value;
                                        forceUpdate(row);
                                      },
                                    }}
                                  />
                                ) : row.remarks !== "null" ? (
                                  row.remarks
                                ) : (
                                  ""
                                )}
                              </span>
                            );
                          },
                          others: {
                            filterable: false,
                            minWidth: 250,
                            resizable: false,
                          },
                        },
                      ]}
                      keyId="patient_code"
                      filter={true}
                      data={test_analytes}
                      paging={true}
                    />
                  </div>
                  <div className="col-3">
                    <div className="row">
                      <AlgaehAutoComplete
                        div={{ className: "col-12  form-group" }}
                        label={{
                          forceLabel: "Select Comment",
                        }}
                        selector={{
                          name: "test_comments_id",
                          className: "select-fld",
                          value: test_comments_id,
                          dataSource: {
                            textField: "commnet_name",
                            valueField: "hims_d_investigation_test_comments_id",
                            data: comments_data,
                          },
                          onChange: selectCommentEvent,
                          onClear: () => {
                            setTest_comments_id(null);
                            setSelcted_comments("");
                          },
                        }}
                      />
                      <div className="col-12">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Enter Comment",
                          }}
                        />

                        <textarea
                          value={selcted_comments}
                          name="selcted_comments"
                          onChange={(e) => {
                            setSelcted_comments(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-12" style={{ textAlign: "right" }}>
                        <button
                          onClick={addComments}
                          className="btn btn-default"
                          style={{ marginBottom: 15 }}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="row finalCommentsSection">
                        <h6>View Final Comments</h6>
                        <ol>
                          {comment_list?.length > 0
                            ? comment_list.map((row, index) => {
                                if (row) {
                                  return (
                                    <React.Fragment key={index}>
                                      <li key={index}>
                                        <span>{row}</span>
                                        <i
                                          className="fas fa-times"
                                          onClick={() => deleteComment(row)}
                                        ></i>
                                      </li>
                                    </React.Fragment>
                                  );
                                } else {
                                  return null;
                                }
                              })
                            : null}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="popupFooter">
            <div className="col-12 ">
              <div className="row">
                <div className="col-lg-6 leftBtnGroup">
                  {" "}
                 
                </div>
              </div>
            </div>
          </div> */}
      </AlgaehModal>
    </div>
  );
}

export default SampleCollectionPatient;
