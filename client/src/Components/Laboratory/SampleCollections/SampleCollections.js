// import React, { PureComponent } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import moment from "moment";
// import "./SampleCollections.scss";
// import "../../../styles/site.scss";
// // import DateTimePicker from "react-datetime-picker";
// import {
//   CollectSample,
//   printBarcode,
//   onchangegridcol,
//   updateLabOrderServiceStatus,
//   updateLabOrderServiceMultiple,
//   onchangegridcoldatehandle,
//   // selectToGenerateBarcode,
//   BulkSampleCollection,
//   printBulkBarcode,
//   onCleargridcol,
//   getSampleCollectionDetails,
//   // selectAll,
// } from "./SampleCollectionEvent";
// import { Tooltip } from "antd";
// import {
//   AlgaehLabel,
//   // AlgaehDataGrid,
//   AlgaehModalPopUp,
//   AlgaehAutoComplete,
//   // AlgaehDateHandler,
// } from "../../Wrapper/algaehWrapper";
// import { AlgaehDataGrid } from "algaeh-react-components";
// import { AlgaehActions } from "../../../actions/algaehActions";
// import {
//   AlgaehAutoComplete,
//   MainContext,
//   AlgaehSecurityComponent,
//   RawSecurityComponent,
//   DatePicker,
// } from "algaeh-react-components";
// import variableJson from "../../../utils/GlobalVariables.json";
// const STATUS = {
//   CHECK: true,
//   UNCHECK: false,
//   INDETERMINATE: true,
// };
// class SampleCollectionPatient extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       collected: true,
//       hospital_id: null,
//       send_out_test: "N",
//       editableGrid: undefined,
//       showCheckBoxColumn: false,
//       bulkGenerate: [],
//       checkAll: STATUS.UNCHECK,
//       enableColumn: false,
//     };
//     this.allChecked = undefined;
//   }

//   static contextType = MainContext;
//   componentDidMount() {
//     const userToken = this.context.userToken;

//     // RawSecurityComponent({ componentCode: "ID_NOTIFY_EXP" }).then((result) => {

//     //   if (result === "hide") {
//     //     this.setState({ showCheckBoxColumn: true });
//     //   }
//     // });

//     this.setState({
//       hospital_id: userToken.hims_d_hospital_id,
//       portal_exists: userToken.portal_exists,
//       checkAll: STATUS.UNCHECK,
//     });

//     if (
//       this.props.labspecimen === undefined ||
//       this.props.labspecimen.length === 0
//     ) {
//       this.props.getLabSpecimen({
//         uri: "/labmasters/selectSpecimen",
//         module: "laboratory",
//         method: "GET",
//         redux: {
//           type: "SPECIMEN_GET_DATA",
//           mappingName: "labspecimen",
//         },
//       });
//     }

//     if (
//       this.props.labcontainer === undefined ||
//       this.props.labcontainer.length === 0
//     ) {
//       this.props.getLabContainer({
//         uri: "/labmasters/selectContainer",
//         module: "laboratory",
//         method: "GET",
//         redux: {
//           type: "CONTAINER_GET_DATA",
//           mappingName: "labcontainer",
//         },
//       });
//     }

//     if (
//       this.props.userdrtails === undefined ||
//       this.props.userdrtails.length === 0
//     ) {
//       this.props.getUserDetails({
//         uri: "/algaehappuser/selectAppUsers",
//         method: "GET",
//         redux: {
//           type: "USER_DETAILS_GET_DATA",
//           mappingName: "userdrtails",
//         },
//       });
//     }
//   }
//   UNSAFE_componentWillReceiveProps(nextProps) {
//     if (nextProps.selected_patient !== null) {
//       getSampleCollectionDetails(this, nextProps.selected_patient);
//       RawSecurityComponent({ componentCode: "BTN_BLK_SAM_BAR_COL" }).then(
//         (result) => {
//           console.log("result===", result);
//           if (result === "hide") {
//             this.setState({ showCheckBoxColumn: false });
//           } else {
//             this.setState({ showCheckBoxColumn: true });
//           }
//         }
//       );

//       RawSecurityComponent({ componentCode: "SPEC_COLL_STATUS_CHANGE" }).then(
//         (result) => {
//           if (result === "hide") {
//             this.setState({ editableGrid: undefined });
//           } else {
//             this.setState({
//               editableGrid: "editOnly",
//             });
//           }
//         }
//       );
//     }
//   }

//   onClose = (e) => {
//     this.props.onClose && this.props.onClose(e);
//   };
//   selectAll = (e) => {
//     const staus = e.target.checked;
//     const myState = this.state.test_details.map((f) => {
//       return { ...f, checked: staus };
//     });

//     const hasUncheck = myState.filter((f) => {
//       return f.checked === undefined || f.checked === false;
//     });

//     const totalRecords = myState.length;

//     this.setState({
//       test_details: [...myState],
//       checkAll:
//         totalRecords === hasUncheck.length
//           ? "UNCHECK"
//           : hasUncheck.length === 0
//           ? "CHECK"
//           : "INDETERMINATE",
//     });
//   };
//   selectToGenerateBarcode = (row, e) => {
//     const status = e.target.checked;
//     // const currentRow = row;
//     row.checked = status;
//     const records = this.state.test_details;
//     const hasUncheck = records.filter((f) => {
//       return f.checked === undefined || f.checked === false;
//     });

//     const totalRecords = records.length;
//     let ckStatus =
//       totalRecords === hasUncheck.length
//         ? "UNCHECK"
//         : hasUncheck.length === 0
//         ? "CHECK"
//         : "INDETERMINATE";
//     if (ckStatus === "INDETERMINATE") {
//       this.allChecked.indeterminate = true;
//     } else {
//       this.allChecked.indeterminate = false;
//     }
//     this.setState({
//       checkAll: ckStatus,
//       test_details: [...records],
//     });
//   };
//   render() {
//     // const testDetails = this.state.test_details;
//     const manualColumns = this.state.showCheckBoxColumn
//       ? {
//           label: (
//             <input
//               type="checkbox"
//               defaultChecked={this.state.checkAll === "CHECK" ? true : false}
//               ref={(input) => {
//                 this.allChecked = input;
//               }}
//               onChange={this.selectAll.bind(this)}
//             />
//           ),
//           fieldName: "select",
//           displayTemplate: (row) => {
//             return (
//               <input
//                 type="checkbox"
//                 checked={row.checked}
//                 onChange={this.selectToGenerateBarcode.bind(this, row)}
//               />
//             );
//           },
//           others: {
//             maxWidth: 50,
//             filterable: false,
//             sortable: false,
//           },
//         }
//       : null;
//     return (
//       <React.Fragment>
//         <div>
//           <AlgaehModalPopUp
//             events={{
//               onClose: this.onClose.bind(this),
//             }}
//             title="Specimen Collections"
//             openPopup={this.props.open}
//             class={"sampleCollectionModal"}
//           >
//             <div>
//               <div className="col-lg-12 popupInner">
//                 <div className="row">
//                   <div className="col-lg-2">
//                     <AlgaehLabel
//                       label={{
//                         fieldName: "patient_code",
//                       }}
//                     />
//                     <h6>
//                       {this.state.patient_code
//                         ? this.state.patient_code
//                         : "Patient Code"}
//                     </h6>
//                   </div>
//                   <div className="col">
//                     <AlgaehLabel
//                       label={{
//                         fieldName: "patient_name",
//                       }}
//                     />
//                     <h6>
//                       {this.state.full_name
//                         ? this.state.full_name
//                         : "Patient Name"}
//                     </h6>
//                   </div>

//                   <div className="col">
//                     <AlgaehLabel
//                       label={{
//                         fieldName: "ordered_by",
//                       }}
//                     />
//                     <h6>
//                       {this.state.doctor_name
//                         ? this.state.doctor_name
//                         : "------"}
//                     </h6>
//                   </div>
//                   <div className="col-lg-3">
//                     <AlgaehLabel
//                       label={{
//                         fieldName: "ordered_date",
//                       }}
//                     />
//                     <h6>
//                       {this.state.ordered_date
//                         ? this.state.ordered_date
//                         : "Ordered Date"}
//                     </h6>
//                   </div>
//                 </div>

//                 <div className="row grid-details">
//                   <div className="col-lg-12" id="sampleCollectionGrid_Cntr">
//                     <div className="margin-bottom-15">
//                       <AlgaehDataGrid
//                         id="update_order_grid"
//                         columns={[
//                           {
//                             fieldName: "action",
//                             label: (
//                               <AlgaehLabel label={{ fieldName: "action" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 <>
//                                   {row.collected !== "Y" ? (
//                                     <Tooltip
//                                       title="Collect Specimen"
//                                       zIndex={9999}
//                                     >
//                                       <i
//                                         style={{
//                                           pointerEvents:
//                                             row.billed === "N" ? "none" : "",
//                                           opacity:
//                                             row.billed === "N" ? "0.1" : "",
//                                         }}
//                                         className="fas fa-check"
//                                         onClick={CollectSample.bind(
//                                           this,
//                                           this,
//                                           row
//                                         )}
//                                       />
//                                     </Tooltip>
//                                   ) : (
//                                     <Tooltip
//                                       title="Generate Barcode"
//                                       zIndex={9999}
//                                     >
//                                       <i
//                                         style={{
//                                           pointerEvents:
//                                             row.billed === "N" ? "none" : "",
//                                           opacity:
//                                             row.billed === "N" ? "0.1" : "",
//                                         }}
//                                         className="fas fa-barcode"
//                                         onClick={printBarcode.bind(
//                                           this,
//                                           this,
//                                           row
//                                         )}
//                                       />
//                                     </Tooltip>
//                                   )}
//                                 </>
//                               );
//                             },
//                             editorTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {row.collected !== "Y" ? (
//                                     <Tooltip title="Collect Specimen">
//                                       <i
//                                         style={{
//                                           pointerEvents:
//                                             row.billed === "N" ? "none" : "",
//                                           opacity:
//                                             row.billed === "N" ? "0.1" : "",
//                                         }}
//                                         className="fas fa-check"
//                                         onClick={CollectSample.bind(
//                                           this,
//                                           this,
//                                           row
//                                         )}
//                                       />
//                                     </Tooltip>
//                                   ) : (
//                                     <Tooltip title="Generate Barcode">
//                                       <i
//                                         style={{
//                                           pointerEvents:
//                                             row.billed === "N" ? "none" : "",
//                                           opacity:
//                                             row.billed === "N" ? "0.1" : "",
//                                         }}
//                                         className="fas fa-barcode"
//                                         onClick={printBarcode.bind(
//                                           this,
//                                           this,
//                                           row
//                                         )}
//                                       />
//                                     </Tooltip>
//                                   )}
//                                 </span>
//                               );
//                             },

//                             others: {
//                               maxWidth: 100,
//                               // resizable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           manualColumns,
//                           {
//                             fieldName: "billed",
//                             label: (
//                               <AlgaehLabel label={{ fieldName: "billed" }} />
//                             ),

//                             displayTemplate: (row) => {
//                               return row.billed === "Y" ? (
//                                 <span className="badge badge-success">
//                                   Billed
//                                 </span>
//                               ) : (
//                                 <span className="badge badge-danger">
//                                   Not Billed
//                                 </span>
//                               );
//                             },

//                             // displayTemplate: (row) => {
//                             //   return row.billed === "N"
//                             //     ? "Not Billed"
//                             //     : "Billed";
//                             // },
//                             editorTemplate: (row) => {
//                               return row.billed === "N"
//                                 ? "Not Billed"
//                                 : "Billed";
//                             },
//                             filterable: true,
//                             filterType: "choices",
//                             choices: [
//                               {
//                                 name: "Not Billed",
//                                 value: "N",
//                               },
//                               {
//                                 name: "Billed",
//                                 value: "Y",
//                               },
//                             ],
//                             others: {
//                               // resizable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "collected",
//                             label: (
//                               <AlgaehLabel label={{ fieldName: "collected" }} />
//                             ),
//                             filterable: true,
//                             filterType: "choices",
//                             choices: [
//                               {
//                                 name: "No",
//                                 value: "N",
//                               },
//                               {
//                                 name: "Yes",
//                                 value: "Y",
//                               },
//                             ],
//                             displayTemplate: (row) => {
//                               return row.collected === "Y" ? (
//                                 <span className="badge badge-success">Yes</span>
//                               ) : (
//                                 <span className="badge badge-danger">No</span>
//                               );
//                             },
//                             editorTemplate: (row) => {
//                               return row.collected === "Y" ? (
//                                 <span className="badge badge-success">Yes</span>
//                               ) : (
//                                 <span className="badge badge-danger">No</span>
//                               );
//                             },
//                           },
//                           {
//                             fieldName: "test_type",
//                             label: (
//                               <AlgaehLabel label={{ fieldName: "proiorty" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {row.test_type === "S" ? "Stat" : "Routine"}
//                                 </span>
//                               );
//                             },
//                             editorTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {row.test_type === "S" ? "Stat" : "Routine"}
//                                 </span>
//                               );
//                             },
//                             disabled: true,
//                             filterable: true,
//                             filterType: "choices",
//                             choices: [
//                               {
//                                 name: "Stat",
//                                 value: "S",
//                               },
//                               {
//                                 name: "Routine",
//                                 value: "R",
//                               },
//                             ],
//                             others: {
//                               // resizable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "service_code",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Test Code" }}
//                               />
//                             ),
//                             editorTemplate: (row) => {
//                               return row.service_code;
//                             },
//                             filterable: true,
//                             others: {
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "service_name",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Test Name" }}
//                               />
//                             ),
//                             editorTemplate: (row) => {
//                               return row.service_name;
//                             },
//                             filterable: true,
//                             others: {
//                               minWidth: 250,

//                               style: { textAlign: "left" },
//                             },
//                           },
//                           {
//                             fieldName: "sample_id",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ fieldName: "specimen_name" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               let display =
//                                 this.props.labspecimen === undefined
//                                   ? []
//                                   : this.props.labspecimen.filter(
//                                       (f) =>
//                                         f.hims_d_lab_specimen_id ===
//                                         row.sample_id
//                                     );
//                               return row.collected === "Y" ||
//                                 row.billed === "N" ? (
//                                 <span>
//                                   {display !== null && display.length !== 0
//                                     ? display[0].SpeDescription
//                                     : ""}
//                                 </span>
//                               ) : (
//                                 <AlgaehAutoComplete
//                                   div={{ className: "noLabel" }}
//                                   selector={{
//                                     name: "sample_id",
//                                     className: "select-fld",
//                                     value: row.sample_id,
//                                     dataSource: {
//                                       textField: "SpeDescription",
//                                       valueField: "hims_d_lab_specimen_id",
//                                       data: this.props.labspecimen,
//                                     },
//                                     onChange: onchangegridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                     onClear: onCleargridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                   }}
//                                 />
//                               );
//                             },
//                             editorTemplate: (row) => {
//                               let display =
//                                 this.props.labspecimen === undefined
//                                   ? []
//                                   : this.props.labspecimen.filter(
//                                       (f) =>
//                                         f.hims_d_lab_specimen_id ===
//                                         row.sample_id
//                                     );
//                               return row.collected === "Y" ||
//                                 row.billed === "N" ? (
//                                 <span>
//                                   {display !== null && display.length !== 0
//                                     ? display[0].SpeDescription
//                                     : ""}
//                                 </span>
//                               ) : (
//                                 <AlgaehAutoComplete
//                                   div={{ className: "noLabel" }}
//                                   selector={{
//                                     name: "sample_id",
//                                     className: "select-fld",
//                                     value: row.sample_id,
//                                     dataSource: {
//                                       textField: "SpeDescription",
//                                       valueField: "hims_d_lab_specimen_id",
//                                       data: this.props.labspecimen,
//                                     },
//                                     onChange: onchangegridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                     onClear: onCleargridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                   }}
//                                 />
//                               );
//                             },
//                             others: {
//                               maxWidth: 200,
//                               // resizable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "container_id",
//                             label: (
//                               <AlgaehLabel label={{ fieldName: "Container" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               let display =
//                                 this.props.labcontainer === undefined
//                                   ? []
//                                   : this.props.labcontainer.filter(
//                                       (f) =>
//                                         f.hims_d_lab_container_id ===
//                                         row.container_id
//                                     );
//                               return row.collected === "Y" ||
//                                 row.billed === "N" ? (
//                                 <span>
//                                   {display !== null && display.length !== 0
//                                     ? display[0].ConDescription
//                                     : ""}
//                                 </span>
//                               ) : (
//                                 <AlgaehAutoComplete
//                                   div={{ className: "noLabel" }}
//                                   selector={{
//                                     name: "container_id",
//                                     className: "select-fld",
//                                     value: row.container_id,
//                                     dataSource: {
//                                       textField: "ConDescription",
//                                       valueField: "hims_d_lab_container_id",
//                                       data: this.props.labcontainer,
//                                     },
//                                     onChange: onchangegridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                     onClear: onCleargridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                   }}
//                                 />
//                               );
//                             },
//                             editorTemplate: (row) => {
//                               let display =
//                                 this.props.labcontainer === undefined
//                                   ? []
//                                   : this.props.labcontainer.filter(
//                                       (f) =>
//                                         f.hims_d_lab_container_id ===
//                                         row.container_id
//                                     );
//                               return row.collected === "Y" ||
//                                 row.billed === "N" ? (
//                                 <span>
//                                   {display !== null && display.length !== 0
//                                     ? display[0].ConDescription
//                                     : ""}
//                                 </span>
//                               ) : (
//                                 <AlgaehAutoComplete
//                                   div={{ className: "noLabel" }}
//                                   selector={{
//                                     name: "container_id",
//                                     className: "select-fld",
//                                     value: row.container_id,
//                                     dataSource: {
//                                       textField: "ConDescription",
//                                       valueField: "hims_d_lab_container_id",
//                                       data: this.props.labcontainer,
//                                     },
//                                     onChange: onchangegridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                     onClear: onCleargridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                   }}
//                                 />
//                               );
//                             },
//                             others: {
//                               maxWidth: 200,
//                               // resizable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "send_out_test",
//                             label: (
//                               <AlgaehLabel label={{ forceLabel: "Send Out" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return row.collected === "Y" ||
//                                 row.billed === "N" ? (
//                                 row.send_out_test === "Y" ? (
//                                   <span className="badge badge-success">
//                                     Yes
//                                   </span>
//                                 ) : (
//                                   <span className="badge badge-danger">No</span>
//                                 )
//                               ) : (
//                                 <AlgaehAutoComplete
//                                   div={{ className: "noLabel" }}
//                                   selector={{
//                                     name: "send_out_test",
//                                     className: "select-fld",
//                                     value: row.send_out_test,
//                                     dataSource: {
//                                       textField: "name",
//                                       valueField: "value",
//                                       data: variableJson.FORMAT_YESNO,
//                                     },
//                                     onChange: onchangegridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                     onClear: onCleargridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                   }}
//                                 />
//                               );
//                             },
//                             editorTemplate: (row) => {
//                               return row.collected === "Y" ||
//                                 row.billed === "N" ? (
//                                 row.send_out_test === "Y" ? (
//                                   <span className="badge badge-success">
//                                     Yes
//                                   </span>
//                                 ) : (
//                                   <span className="badge badge-danger">No</span>
//                                 )
//                               ) : (
//                                 <AlgaehAutoComplete
//                                   div={{ className: "noLabel" }}
//                                   selector={{
//                                     name: "send_out_test",
//                                     className: "select-fld",
//                                     value: row.send_out_test,
//                                     dataSource: {
//                                       textField: "name",
//                                       valueField: "value",
//                                       data: variableJson.FORMAT_YESNO,
//                                     },
//                                     onChange: onchangegridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                     onClear: onCleargridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                   }}
//                                 />
//                               );
//                             },
//                             others: {
//                               maxWidth: 150,
//                               // resizable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "send_in_test",
//                             label: (
//                               <AlgaehLabel label={{ forceLabel: "Send In" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return row.collected === "Y" ||
//                                 row.billed === "N" ? (
//                                 row.send_in_test === "Y" ? (
//                                   <span className="badge badge-success">
//                                     Yes
//                                   </span>
//                                 ) : (
//                                   <span className="badge badge-danger">No</span>
//                                 )
//                               ) : (
//                                 <AlgaehAutoComplete
//                                   div={{ className: "noLabel" }}
//                                   selector={{
//                                     name: "send_in_test",
//                                     className: "select-fld",
//                                     value: row.send_in_test,
//                                     dataSource: {
//                                       textField: "name",
//                                       valueField: "value",
//                                       data: variableJson.FORMAT_YESNO,
//                                     },
//                                     onChange: onchangegridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                     onClear: onCleargridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                   }}
//                                 />
//                               );
//                             },
//                             editorTemplate: (row) => {
//                               return row.collected === "Y" ||
//                                 row.billed === "N" ? (
//                                 row.send_in_test === "Y" ? (
//                                   <span className="badge badge-success">
//                                     Yes
//                                   </span>
//                                 ) : (
//                                   <span className="badge badge-danger">No</span>
//                                 )
//                               ) : (
//                                 <AlgaehAutoComplete
//                                   div={{ className: "noLabel" }}
//                                   selector={{
//                                     name: "send_in_test",
//                                     className: "select-fld",
//                                     value: row.send_in_test,
//                                     dataSource: {
//                                       textField: "name",
//                                       valueField: "value",
//                                       data: variableJson.FORMAT_YESNO,
//                                     },
//                                     updateInternally: true,
//                                     onChange: onchangegridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                     onClear: onCleargridcol.bind(
//                                       this,
//                                       this,
//                                       row
//                                     ),
//                                   }}
//                                 />
//                               );
//                             },
//                             others: {
//                               maxWidth: 150,
//                               // show: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                           {
//                             fieldName: "collected_date",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ fieldName: "collected_date" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               if (
//                                 row.send_in_test === "Y" &&
//                                 row.collected === "N"
//                               ) {
//                                 return (
//                                   <DatePicker
//                                     name="collected_date"
//                                     disabledDate={(d) =>
//                                       !d ||
//                                       d.isAfter(
//                                         moment()
//                                           .add(1, "days")
//                                           .format("YYYY-MM-DD")
//                                       )
//                                     }
//                                     format="YYYY-MM-DD HH:mm:ss"
//                                     // minDate={new Date()}
//                                     showTime
//                                     onChange={onchangegridcoldatehandle.bind(
//                                       this,
//                                       this,
//                                       row
//                                     )}
//                                     onOk={onchangegridcoldatehandle.bind(
//                                       this,
//                                       this,
//                                       row
//                                     )}
//                                   />
//                                 );
//                               } else {
//                                 return (
//                                   <span>
//                                     {moment(row.collected_date).isValid()
//                                       ? moment(row.collected_date).format(
//                                           "DD-MM-YYYY hh:mm"
//                                         )
//                                       : "------"}
//                                   </span>
//                                 );
//                               }
//                             },
//                             editorTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {moment(row.collected_date).isValid()
//                                     ? moment(row.collected_date).format(
//                                         "DD-MM-YYYY hh:mm"
//                                       )
//                                     : "------"}
//                                 </span>
//                               );
//                             },

//                             others: {
//                               minWidth: 200,
//                               // show: false,
//                               style: { textAlign: "left" },
//                             },
//                           },
//                           {
//                             fieldName: "status",
//                             label: (
//                               <AlgaehLabel label={{ fieldName: "Status" }} />
//                             ),
//                             displayTemplate: (row) => {
//                               return row.status === "O"
//                                 ? "Ordered"
//                                 : row.status === "CL"
//                                 ? "Collected"
//                                 : row.status === "CN"
//                                 ? "Test Canceled"
//                                 : row.status === "CF"
//                                 ? "Result Confirmed"
//                                 : "Result Validated";
//                             },
//                             editorTemplate: (row) => {
//                               return (
//                                 <AlgaehAutoComplete
//                                   // error={errors2}
//                                   div={{ className: "col " }}
//                                   selector={{
//                                     className: "select-fld",
//                                     name: "status",
//                                     value: row.status,
//                                     onChange: (e, value) => {
//                                       row.status = value;
//                                     },
//                                     // others: { defaultValue: row.bed_id },
//                                     dataSource: {
//                                       textField: "name",
//                                       valueField: "value",
//                                       data: [
//                                         {
//                                           name: "Ordered",
//                                           value: "O",
//                                         },
//                                         {
//                                           name: "Collected",
//                                           value: "CL",
//                                         },
//                                         {
//                                           name: "Canceled",
//                                           value: "CN",
//                                         },
//                                         {
//                                           name: "Result Confirmed",
//                                           value: "CF",
//                                         },
//                                       ],
//                                     },
//                                     updateInternally: true,
//                                     // others: {
//                                     //   disabled:
//                                     //     current.request_status === "APR" &&
//                                     //     current.work_status === "COM",
//                                     //   tabIndex: "4",
//                                     // },
//                                   }}
//                                 />
//                               );
//                             },
//                             // others: {
//                             //   // resizable: false,
//                             //   style: { textAlign: "center" }
//                             // }
//                           },

//                           {
//                             fieldName: "collected_by",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ fieldName: "collected_by" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               let display =
//                                 this.props.userdrtails === undefined
//                                   ? []
//                                   : this.props.userdrtails.filter(
//                                       (f) =>
//                                         f.algaeh_d_app_user_id ===
//                                         row.collected_by
//                                     );

//                               return (
//                                 <span>
//                                   {display !== null && display.length !== 0
//                                     ? display[0].username
//                                     : ""}
//                                 </span>
//                               );
//                             },
//                             editorTemplate: (row) => {
//                               let display =
//                                 this.props.userdrtails === undefined
//                                   ? []
//                                   : this.props.userdrtails.filter(
//                                       (f) =>
//                                         f.algaeh_d_app_user_id ===
//                                         row.collected_by
//                                     );

//                               return (
//                                 <span>
//                                   {display !== null && display.length !== 0
//                                     ? display[0].username
//                                     : ""}
//                                 </span>
//                               );
//                             },
//                             others: {
//                               minWidth: 200,
//                               // show: false,
//                               style: { textAlign: "left" },
//                             },
//                           },

//                           {
//                             fieldName: "barcode_gen",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Barcode Gen Date" }}
//                               />
//                             ),
//                             displayTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {moment(row.barcode_gen).isValid()
//                                     ? moment(row.barcode_gen).format(
//                                         "DD-MM-YYYY hh:mm"
//                                       )
//                                     : "------"}
//                                 </span>
//                               );
//                             },
//                             editorTemplate: (row) => {
//                               return (
//                                 <span>
//                                   {moment(row.barcode_gen).isValid()
//                                     ? moment(row.barcode_gen).format(
//                                         "DD-MM-YYYY hh:mm"
//                                       )
//                                     : "------"}
//                                 </span>
//                               );
//                             },
//                             others: {
//                               minWidth: 200,
//                               // show: false,
//                               style: { textAlign: "left" },
//                             },
//                           },
//                           {
//                             fieldName: "remarks",
//                             label: (
//                               <AlgaehLabel
//                                 label={{ forceLabel: "Rejection Remarks" }}
//                               />
//                             ),
//                             editorTemplate: (row) => {
//                               return row.remarks;
//                             },
//                             others: {
//                               minWidth: 200,
//                               // resizable: false,
//                               style: { textAlign: "center" },
//                             },
//                           },
//                         ]}
//                         keyId="service_code"
//                         data={this.state.test_details}
//                         events={{
//                           onSave: updateLabOrderServiceStatus.bind(this, this),
//                         }}
//                         noDataText="No sample for collection"
//                         isEditable={this.state.editableGrid}
//                         pageOptions={{ rows: 50, page: 1 }}
//                         isFilterable={true}
//                         pagination={true}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* PAT-21-14323 */}

//               <div className=" popupFooter">
//                 <div className="col-lg-12">
//                   <div className="row">
//                     <div className="col-lg-12">
//                       <button
//                         className="btn btn-default"
//                         onClick={(e) => {
//                           this.onClose(e);
//                         }}
//                       >
//                         <AlgaehLabel label={{ fieldName: "btnclose" }} />
//                       </button>
//                       <AlgaehSecurityComponent componentCode="SPEC_COLL_STATUS_CHANGE">
//                         <button
//                           className="btn btn-other"
//                           onClick={updateLabOrderServiceMultiple.bind(
//                             this,
//                             this
//                           )}
//                         >
//                           <AlgaehLabel
//                             label={{
//                               forceLabel: "Mark as not collected",
//                             }}
//                           />
//                         </button>
//                       </AlgaehSecurityComponent>
//                       <AlgaehSecurityComponent componentCode="BTN_BLK_SAM_BAR_COL">
//                         <button
//                           className="btn btn-other"
//                           onClick={BulkSampleCollection.bind(this, this)}
//                         >
//                           <AlgaehLabel
//                             label={{
//                               forceLabel: "Bulk Sample Collection",
//                             }}
//                           />
//                         </button>
//                       </AlgaehSecurityComponent>
//                       <AlgaehSecurityComponent componentCode="BTN_BLK_SAM_BAR_COL">
//                         <button
//                           className="btn btn-other"
//                           onClick={printBulkBarcode.bind(this, this)}
//                         >
//                           <AlgaehLabel
//                             label={{
//                               forceLabel: "Print Bulk Barcode",
//                             }}
//                           />
//                         </button>
//                       </AlgaehSecurityComponent>
//                       {/* <div className="customCheckbox">
//                             <label
//                               className="checkbox inline"
//                               style={{ marginRight: 20 }}
//                             >
//                               <input
//                                 type="checkbox"
//                                 value=""
//                                 name=""
//                                 checked={this.state.checkAll}
//                                 onChange={selectAll.bind(this, this)}
//                               />
//                               <span>Select All</span>
//                             </label>
//                           </div> */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </AlgaehModalPopUp>
//         </div>
//       </React.Fragment>
//     );
//   }
// }
// function mapStateToProps(state) {
//   return {
//     labspecimen: state.labspecimen,
//     userdrtails: state.userdrtails,
//     labcontainer: state.labcontainer,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getDepartmentsandDoctors: AlgaehActions,
//       getLabSpecimen: AlgaehActions,
//       getUserDetails: AlgaehActions,
//       getLabContainer: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(SampleCollectionPatient)
// );
import React, { useContext, useState, useEffect, useRef } from "react";
// import Options from "../../../Options.json";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  MainContext,
  Tooltip,
  AlgaehModal,
  RawSecurityComponent,
  AlgaehAutoComplete,
  AlgaehMessagePop,
  DatePicker,
  AlgaehSecurityComponent,
  // AlgaehFormGroup,
} from "algaeh-react-components";

import variableJson from "../../../utils/GlobalVariables.json";

import { useQuery } from "react-query";
import { newAlgaehApi } from "../../../hooks";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
// import Options from "../../../Options.json";
import moment from "moment";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import sockets from "../../../sockets";
import swal from "sweetalert2";
import axios from "axios";
import "./SampleCollections.scss";
import "../../../styles/site.scss";
const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};

function SampleCollectionPatient({ onClose, selected_patient = {}, isOpen }) {
  const { userToken } = useContext(MainContext);
  const [hospital_id, setHospital_id] = useState(null);
  const [showCheckBoxColumn, setShowCheckBoxColumn] = useState(false);
  const [portal_exists, setPortal_exists] = useState(false);
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  // const [editableGrid, setEditableGrid] = useState(undefined);
  const [test_details, setTest_details] = useState([]);
  let [, setState] = useState();
  let allChecked = useRef(undefined);
  useEffect(() => {
    // RawSecurityComponent({ componentCode: "ID_NOTIFY_EXP" }).then((result) => {

    //   if (result === "hide") {
    //     this.setState({ showCheckBoxColumn: true });
    //   }
    // });

    setPortal_exists(userToken.portal_exists);
    setHospital_id(userToken.hims_d_hospital_id);

    RawSecurityComponent({ componentCode: "BTN_BLK_SAM_BAR_COL" }).then(
      (result) => {
        console.log("result===", result);
        if (result === "hide") {
          setShowCheckBoxColumn(false);
        } else {
          setShowCheckBoxColumn(true);
        }
      }
    );

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

  const { data: labspecimen } = useQuery(
    ["getLabSpecimen", {}],
    getLabSpecimen,
    {
      keepPreviousData: true,
      onSuccess: (data) => {},
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getLabSpecimen(key) {
    const result = await newAlgaehApi({
      uri: "/labmasters/selectSpecimen",
      module: "laboratory",
      method: "GET",
    });
    return result?.data?.records;
  }

  const { refetch: labOrderRefetch } = useQuery(
    ["getSampleCollectionDetails", { selected_patient }],
    getSampleCollectionDetails,
    {
      onSuccess: (data) => {
        setTest_details(data);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getSampleCollectionDetails(key, selected_patient) {
    let inputobj = {};
    if (selected_patient.selected_patient.patient_id !== null) {
      inputobj.patient_id = selected_patient.selected_patient.patient_id;
    }
    if (selected_patient.selected_patient.visit_id !== null) {
      inputobj.visit_id = selected_patient.selected_patient.visit_id;
    }

    const result = await newAlgaehApi({
      uri: "/laboratory/getLabOrderedServices",
      module: "laboratory",
      method: "GET",
      data: inputobj,
    });
    return result?.data?.records;
  }

  const PORTAL_HOST = process.env.REACT_APP_PORTAL_HOST;
  const CollectSample = (row) => {
    if (row.container_id === null || row.container_id === undefined) {
      swalMessage({
        title: "Please select Container",
        type: "warning",
      });
      return;
    } else if (row.sample_id === null || row.sample_id === undefined) {
      swalMessage({
        title: "Please select Sample",
        type: "warning",
      });
      return;
    } else if (row.send_out_test === null || row.send_out_test === undefined) {
      swalMessage({
        title: "Please select Send Out",
        type: "warning",
      });
      return;
    } else if (row.send_in_test === null || row.send_in_test === undefined) {
      swalMessage({
        title: "Please select Send In",
        type: "warning",
      });
      return;
    }

    let inputobj = {
      hims_f_lab_order_id: row.hims_f_lab_order_id,
      hims_d_lab_sample_id: row.hims_d_lab_sample_id,
      visit_id: row.visit_id,
      order_id: row.hims_f_lab_order_id,
      sample_id: row.sample_id,
      collected: "Y",
      status: "N",
      hims_d_hospital_id: hospital_id,
      service_id: row.service_id,
      service_code: row.service_code,
      send_out_test: row.send_out_test,
      send_in_test: row.send_in_test,
      collected_date: row.collected_date,
      container_id: row.container_id,
      test_id: row.test_id,
      container_code: row.container_code,
      lab_id_number: row.lab_id_number,
    };

    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/laboratory/updateLabOrderServices",
      module: "laboratory",
      data: inputobj,
      method: "PUT",
      onSuccess: (response) => {
        if (response.data.success === true) {
          if (portal_exists === "Y") {
            const portal_data = {
              service_id: row.service_id,
              visit_code: row.visit_code,
              patient_identity: row.primary_id_no,
              service_status: "SAMPLE COLLECTED",
            };
            axios
              .post(`${PORTAL_HOST}/info/deletePatientService`, portal_data)
              .then(function (response) {
                console.log(response);
              })
              .catch(function (response) {
                console.log(response);
              });
          }

          if (sockets.connected) {
            sockets.emit("specimen_acknowledge", {
              test_details: response.data.records,
              collected_date: response.data.records.collected_date,
            });
          }
          // for (let i = 0; i < test_details.length; i++) {
          //   if (test_details[i].hims_f_lab_order_id === row.hims_f_lab_order_id) {
          //     test_details[i].collected = response.data.records.collected;
          //     test_details[i].collected_by = response.data.records.collected_by;
          //     test_details[i].collected_date =
          //       response.data.records.collected_date;
          //     test_details[i].barcode_gen = response.data.records.barcode_gen;
          //     test_details[i].send_in_test = response.data.records.send_in_test;
          //     test_details[i].lab_id_number = response.data.records.lab_id_number;
          //     test_details[i].status = response.data.records.status;
          //   }
          // }

          // getSampleCollectionDetails( {
          //   patient_id: row.patient_id,
          //   visit_id: row.visit_id,
          //   collected: "Y",
          // });
          labOrderRefetch();

          swalMessage({
            title: "Collected Successfully",
            type: "success",
          });
        }
        AlgaehLoader({ show: false });
      },
      onFailure: (error) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.response.data.message || error.message,
          type: "error",
        });
      },
    });
  };

  const BulkSampleCollection = () => {
    const data = test_details;

    const filterData = data.filter(
      (f) => f.checked && (f.collected === "N" || f.collected === null)
    );

    const sample_validate = filterData.find((f) => f.sample_id === null);

    const container_validate = filterData.find((f) => f.container_id === null);
    const send_out_validate = filterData.find((f) => f.send_out_test === null);
    const send_in_validate = filterData.find((f) => f.send_in_test === null);

    if (sample_validate) {
      swalMessage({
        title: "Please select Sample in " + sample_validate.service_name,
        type: "warning",
      });
      return;
    } else if (container_validate) {
      swalMessage({
        title: "Please select Container in " + container_validate.service_name,
        type: "warning",
      });
      return;
    } else if (send_out_validate) {
      swalMessage({
        title: "Please select Send Out in " + send_out_validate.service_name,
        type: "warning",
      });
      return;
    } else if (send_in_validate) {
      swalMessage({
        title: "Please select Send In in " + send_in_validate.service_name,
        type: "warning",
      });
      return;
    }
    const addedData = filterData.map((item) => {
      return {
        hims_f_lab_order_id: item.hims_f_lab_order_id,
        hims_d_lab_sample_id: item.hims_d_lab_sample_id,
        visit_id: item.visit_id,
        order_id: item.hims_f_lab_order_id,
        sample_id: item.sample_id,
        collected: "Y",
        status: "N",
        hims_d_hospital_id: hospital_id,
        service_id: item.service_id,
        service_code: item.service_code,
        send_out_test: item.send_out_test,
        send_in_test: item.send_in_test,
        container_id: item.container_id,
        test_id: item.hims_d_investigation_test_id,
        container_code: item.container_code,
        lab_id_number: item.lab_id_number,
      };
    });
    console.log(
      "filterData",
      filterData,
      process.env.REACT_APP_PORTAL_HOST,
      PORTAL_HOST
    );
    if (filterData.length > 0) {
      algaehApiCall({
        uri: "/laboratory/bulkSampleCollection",
        module: "laboratory",
        data: {
          bulkCollection: addedData,
          portal_exists: portal_exists,
          PORTAL_HOST: "http://1http://124.40.244.150//publisher/api/v1",
        },
        method: "PUT",
        onSuccess: (response) => {
          if (response.data.success === true) {
            // let test_details = $this.state.test_details;
            // for (let i = 0; i < test_details.length; i++) {
            //   if (
            //     test_details[i].visit_id === row.visit_id &&
            //     test_details[i].sample_id === row.sample_id
            //   ) {
            //     test_details[i].collected = response.data.records.collected;
            //     test_details[i].collected_by = response.data.records.collected_by;
            //     test_details[i].collected_date =
            //       response.data.records.collected_date;
            //     test_details[i].barcode_gen = response.data.records.barcode_gen;
            //   }
            // }
            // $this.setState({ test_details: test_details }, () => {
            //   if (sockets.connected) {
            //     sockets.emit("specimen_acknowledge", {
            //       test_details: test_details,
            //       collected_date: response.data.records.collected_date,
            //     });
            //   }
            //   swalMessage({
            //     title: "Collected Successfully",
            //     type: "success",
            //   });
            // });
          }
          AlgaehLoader({ show: false });
        },
        onFailure: (error) => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.response.data.message || error.message,
            type: "error",
          });
        },
      });
    } else {
      swalMessage({
        title: "No sample to collect",
        type: "warning",
      });
    }
  };
  const printBulkBarcode = () => {
    const data = test_details;
    const filterData = data.filter((f) => f.checked);
    const labOrderId = filterData.map((item) => item.hims_f_lab_order_id);

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
          others: {
            width: "50mm",
            height: "20mm",
            showHeaderFooter: false,
          },
          reportName: "specimenBarcodeBulk",
          reportParams: [
            {
              name: "hims_f_lab_order_id",
              value: labOrderId,
            },
          ],
          outputFileType: "PDF",
        },
      },

      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
        window.open(origin);
      },

      // onSuccess: (res) => {
      //   const urlBlob = URL.createObjectURL(res.data);
      //   const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Specimen Barcode`;
      //   window.open(origin);
      //    window.document.title = "Specimen Barcode";
      // },
    });
  };
  const forceUpdate = (row) => {
    let testDetails = test_details;

    let _index = testDetails.indexOf(row);

    testDetails[_index] = row;
    setTest_details(testDetails);
    setState({});
  };
  const updateLabOrderServiceStatus = (row) => {
    swal({
      title: `Are you sure to change specimen as not collected?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/laboratory/updateLabOrderServiceStatus",
          module: "laboratory",
          data: { hims_f_lab_order_id: row.hims_f_lab_order_id },
          method: "PUT",
          onSuccess: (response) => {
            if (response.data.success === true) {
              swalMessage({
                title: "Record Updated Successfully",
                type: "success",
              });
              labOrderRefetch();
            }
          },
          onFailure: (error) => {
            swalMessage({
              title: error.response.data.message || error.message,
              type: "error",
            });
          },
        });
      }
    });

    // } else {
    //   return;
    // }
  };

  const updateLabOrderServiceMultiple = () => {
    swal({
      title: `Are you sure to change all specimen not collected?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        let hims_f_lab_order_id = [];
        test_details.map((o) => {
          if (o.checked) {
            hims_f_lab_order_id.push(o.hims_f_lab_order_id);
          }
          return null;
        });

        algaehApiCall({
          uri: "/laboratory/updateLabOrderServiceStatus",
          module: "laboratory",
          data: { hims_f_lab_order_id: hims_f_lab_order_id },
          method: "PUT",
          onSuccess: (response) => {
            if (response.data.success === true) {
              swalMessage({
                title: "Record Updated Successfully",
                type: "success",
              });
              labOrderRefetch();
            }
          },
          onFailure: (error) => {
            swalMessage({
              title: error.response.data.message || error.message,
              type: "error",
            });
          },
        });
      }
    });
  };
  const printBarcode = (row) => {
    if (row.lab_id_number !== null) {
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
            others: {
              width: "50mm",
              height: "20mm",
              showHeaderFooter: false,
            },
            reportName: "specimenBarcode",
            reportParams: [
              {
                name: "hims_f_lab_order_id",
                value: row.hims_f_lab_order_id,
              },
            ],
            outputFileType: "PDF",
          },
        },

        onSuccess: (res) => {
          const urlBlob = URL.createObjectURL(res.data);
          const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
          window.open(origin);
        },
        // onSuccess: (res) => {
        //   const urlBlob = URL.createObjectURL(res.data);
        //   const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Specimen Barcode`;
        //   window.open(origin);
        //   window.document.title = "Specimen Barcode";
        // },
      });
    } else {
      let inputobj = {
        hims_f_lab_order_id: row.hims_f_lab_order_id,
        hims_d_lab_sample_id: row.hims_d_lab_sample_id,
        order_id: row.hims_f_lab_order_id,
        sample_id: row.sample_id,
        collected: "Y",
        status: "N",
        hims_d_hospital_id: hospital_id,
        service_id: row.service_id,
        service_code: row.service_code,
        send_out_test: row.send_out_test,
        container_id: row.container_id,
        test_id: row.hims_d_investigation_test_id,
        container_code: row.container_code,
      };

      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/laboratory/generateBarCode",
        module: "laboratory",
        data: inputobj,
        method: "PUT",
        onSuccess: (response) => {
          if (response.data.success === true) {
            let testDetails = test_details;

            const _index = testDetails.indexOf(row);

            row["lab_id_number"] = response.data.records.lab_id_number;
            testDetails[_index] = row;

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
                  others: {
                    width: "50mm",
                    height: "20mm",
                    showHeaderFooter: false,
                  },
                  reportName: "specimenBarcode",
                  reportParams: [
                    {
                      name: "hims_f_lab_order_id",
                      value: row.hims_f_lab_order_id,
                    },
                  ],
                  outputFileType: "PDF",
                },
              },

              onSuccess: (res) => {
                const urlBlob = URL.createObjectURL(res.data);
                const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
                window.open(origin);
              },

              // onSuccess: (res) => {
              //   const urlBlob = URL.createObjectURL(res.data);
              //   const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Specimen Barcode`;
              //   window.open(origin);
              //    window.document.title = "Specimen Barcode";
              // },
            });
          }
          AlgaehLoader({ show: false });
        },
        onFailure: (error) => {
          swalMessage({
            title: error.response.data.message || error.message,
            type: "error",
          });
        },
      });
    }
  };

  // const printBarcode = ($this, row, e) => {
  //   AlgaehReport({
  //     report: {
  //       fileName: "sampleBarcode",
  //       barcode: {
  //         parameter: "bar_code",
  //         options: {
  //           format: "",
  //           lineColor: "#0aa",
  //           width: 4,
  //           height: 40
  //         }
  //       }
  //     },
  //     data: {
  //       bar_code: $this.state.patient_code + row.service_code
  //     }
  //   });
  // };

  // const onchangegridcoldatehandle = (row, ctrl, e) => {
  //   let testDetails = test_details;
  //   if (Date.parse(moment(ctrl)._d) > Date.parse(new Date())) {
  //     swalMessage({
  //       title: "Collected date cannot be future Date.",
  //       type: "warning",
  //     });
  //   } else {
  //     let _index = testDetails.indexOf(row);
  //     row["collected_date"] = moment(ctrl)._d;
  //     testDetails[_index] = row;
  //     setTest_details(testDetails);
  //   }
  // };

  // const getSampleCollectionDetails = ($this, selected_patient) => {
  //   let inputobj = {};

  //   if (selected_patient.patient_id !== null) {
  //     inputobj.patient_id = selected_patient.patient_id;
  //   }
  //   if (selected_patient.visit_id !== null) {
  //     inputobj.visit_id = selected_patient.visit_id;
  //   }
  //   algaehApiCall({
  //     uri: "/laboratory/getLabOrderedServices",
  //     module: "laboratory",
  //     method: "GET",
  //     data: inputobj,
  //     onSuccess: (response) => {
  //       selected_patient.test_details = response.data.records;
  //       if (response.data.success) {
  //         $this.setState({ ...selected_patient });
  //       }
  //       if (selected_patient.collected === "Y") {
  //         if (sockets.connected) {
  //           sockets.emit("specimen_acknowledge", {
  //             test_details: response.data.records,
  //             collected_date: selected_patient.collected_date,
  //           });
  //         }
  //       }
  //     },
  //     onFailure: (error) => {
  //       swalMessage({
  //         title: error.message,
  //         type: "error",
  //       });
  //     },
  //   });
  // };

  const { data: labcontainer } = useQuery(
    ["getLabContainer", {}],
    getLabContainer,
    {
      keepPreviousData: true,
      onSuccess: (data) => {},
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getLabContainer(key) {
    const result = await newAlgaehApi({
      uri: "/labmasters/selectContainer",
      module: "laboratory",
      method: "GET",
    });
    return result?.data?.records;
  }
  const { data: userdrtails } = useQuery(
    ["getUserDetails", {}],
    getUserDetails,
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        // setEnabledHESN(false);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const selectAll = (e) => {
    const staus = e.target.checked;
    const myState = test_details.map((f) => {
      return { ...f, checked: staus };
    });

    const hasUncheck = myState.filter((f) => {
      return f.checked === undefined || f.checked === false;
    });

    const totalRecords = myState.length;
    setCheckAll(
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE"
    );
    setTest_details([...myState]);
  };

  const selectToGenerateBarcode = (row, e) => {
    const status = e.target.checked;
    row.checked = status;
    const records = test_details;
    const hasUncheck = records.filter((f) => {
      return f.checked === undefined || f.checked === false;
    });

    const totalRecords = records.length;
    let ckStatus =
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE";
    if (ckStatus === "INDETERMINATE") {
      allChecked.indeterminate = true;
    } else {
      allChecked.indeterminate = false;
    }
    setCheckAll(ckStatus);
    setTest_details([...records]);
  };
  async function getUserDetails(key) {
    const result = await newAlgaehApi({
      uri: "/algaehappuser/selectAppUsers",
      method: "GET",
    });
    return result?.data?.records;
  }

  const manualColumns = showCheckBoxColumn
    ? {
        label: (
          <input
            type="checkbox"
            defaultChecked={checkAll === "CHECK" ? true : false}
            ref={(input) => {
              allChecked = input;
            }}
            onChange={selectAll}
          />
        ),
        fieldName: "select",
        displayTemplate: (row) => {
          return (
            <input
              type="checkbox"
              checked={row.checked}
              onChange={(e) => selectToGenerateBarcode(row, e)}
            />
          );
        },
        others: {
          maxWidth: 50,
          filterable: false,
          sortable: false,
        },
      }
    : null;
  return (
    <div>
      <AlgaehModal
        title="Specimen Collections"
        visible={isOpen}
        mask={true}
        maskClosable={true}
        onCancel={onClose}
        footer={[
          <button onClick={onClose} className="btn btn-default">
            Close
          </button>,
          <AlgaehSecurityComponent componentCode="SPEC_COLL_STATUS_CHANGE">
            <button
              className="btn btn-other"
              onClick={updateLabOrderServiceMultiple.bind(this, this)}
            >
              <AlgaehLabel
                label={{
                  forceLabel: "Mark as not collected",
                }}
              />
            </button>
          </AlgaehSecurityComponent>,
          <AlgaehSecurityComponent componentCode="BTN_BLK_SAM_BAR_COL">
            <button
              className="btn btn-other"
              onClick={BulkSampleCollection.bind(this, this)}
            >
              <AlgaehLabel
                label={{
                  forceLabel: "Bulk Sample Collection",
                }}
              />
            </button>
          </AlgaehSecurityComponent>,
          <AlgaehSecurityComponent componentCode="BTN_BLK_SAM_BAR_COL">
            <button
              className="btn btn-other"
              onClick={printBulkBarcode.bind(this, this)}
            >
              <AlgaehLabel
                label={{
                  forceLabel: "Print Bulk Barcode",
                }}
              />
            </button>
          </AlgaehSecurityComponent>,
        ]}
        className={`row algaehNewModal SpecimenModalPopup`}
      >
        <div className="col-lg-12 popupInner">
          <div className="row">
            <div className="col-lg-2">
              <AlgaehLabel
                label={{
                  fieldName: "patient_code",
                }}
              />
              <h6>
                {selected_patient.patient_code
                  ? selected_patient.patient_code
                  : "Patient Code"}
              </h6>
            </div>
            <div className="col">
              <AlgaehLabel
                label={{
                  fieldName: "patient_name",
                }}
              />
              <h6>
                {selected_patient.full_name
                  ? selected_patient.full_name
                  : "Patient Name"}
              </h6>
            </div>

            <div className="col">
              <AlgaehLabel
                label={{
                  fieldName: "ordered_by",
                }}
              />
              <h6>
                {selected_patient.doctor_name
                  ? selected_patient.doctor_name
                  : "------"}
              </h6>
            </div>
            <div className="col-lg-3">
              <AlgaehLabel
                label={{
                  fieldName: "ordered_date",
                }}
              />
              <h6>
                {selected_patient.ordered_date
                  ? selected_patient.ordered_date
                  : "Ordered Date"}
              </h6>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Specimen Collection List
                    </h3>
                  </div>
                </div>

                <div className="portlet-body" id="samplecollection_grid">
                  <AlgaehDataGrid
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ fieldName: "action" }} />,
                        displayTemplate: (row) => {
                          return (
                            <>
                              {row.collected !== "Y" ? (
                                <Tooltip
                                  title="Collect Specimen"
                                  zIndex={99999}
                                >
                                  <i
                                    style={{
                                      pointerEvents:
                                        row.billed === "N" ? "none" : "",
                                      opacity: row.billed === "N" ? "0.1" : "",
                                    }}
                                    className="fas fa-check"
                                    onClick={() => CollectSample(row)}
                                  />
                                </Tooltip>
                              ) : (
                                <span>
                                  <Tooltip
                                    title="Generate Barcode"
                                    zIndex={99999}
                                  >
                                    <i
                                      style={{
                                        pointerEvents:
                                          row.billed === "N" ? "none" : "",
                                        opacity:
                                          row.billed === "N" ? "0.1" : "",
                                      }}
                                      className="fas fa-barcode"
                                      onClick={() => printBarcode(row)}
                                    />
                                  </Tooltip>

                                  <Tooltip title="Cancel Sample" zIndex={99999}>
                                    <i
                                      className="fa fa-times"
                                      onClick={() =>
                                        updateLabOrderServiceStatus(row)
                                      }
                                    />
                                  </Tooltip>
                                </span>
                              )}
                            </>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <span>
                              {row.collected !== "Y" ? (
                                <Tooltip title="Collect Specimen">
                                  <i
                                    style={{
                                      pointerEvents:
                                        row.billed === "N" ? "none" : "",
                                      opacity: row.billed === "N" ? "0.1" : "",
                                    }}
                                    className="fas fa-check"
                                    onClick={() => {
                                      CollectSample(row);
                                    }}
                                  />
                                </Tooltip>
                              ) : (
                                <Tooltip title="Generate Barcode">
                                  <i
                                    style={{
                                      pointerEvents:
                                        row.billed === "N" ? "none" : "",
                                      opacity: row.billed === "N" ? "0.1" : "",
                                    }}
                                    className="fas fa-barcode"
                                    onClick={() => printBarcode(row)}
                                  />
                                </Tooltip>
                              )}
                            </span>
                          );
                        },

                        others: {
                          maxWidth: 100,
                          // resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      manualColumns,
                      {
                        fieldName: "billed",
                        label: <AlgaehLabel label={{ fieldName: "billed" }} />,

                        displayTemplate: (row) => {
                          return row.billed === "Y" ? (
                            <span className="badge badge-success">Billed</span>
                          ) : (
                            <span className="badge badge-danger">
                              Not Billed
                            </span>
                          );
                        },

                        // displayTemplate: (row) => {
                        //   return row.billed === "N"
                        //     ? "Not Billed"
                        //     : "Billed";
                        // },
                        editorTemplate: (row) => {
                          return row.billed === "N" ? "Not Billed" : "Billed";
                        },
                        filterable: true,
                        filterType: "choices",
                        choices: [
                          {
                            name: "Not Billed",
                            value: "N",
                          },
                          {
                            name: "Billed",
                            value: "Y",
                          },
                        ],
                        others: {
                          // resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "collected",
                        label: (
                          <AlgaehLabel label={{ fieldName: "collected" }} />
                        ),
                        filterable: true,
                        filterType: "choices",
                        choices: [
                          {
                            name: "No",
                            value: "N",
                          },
                          {
                            name: "Yes",
                            value: "Y",
                          },
                        ],
                        displayTemplate: (row) => {
                          return row.collected === "Y" ? (
                            <span className="badge badge-success">Yes</span>
                          ) : (
                            <span className="badge badge-danger">No</span>
                          );
                        },
                        editorTemplate: (row) => {
                          return row.collected === "Y" ? (
                            <span className="badge badge-success">Yes</span>
                          ) : (
                            <span className="badge badge-danger">No</span>
                          );
                        },
                      },
                      {
                        fieldName: "test_type",
                        label: (
                          <AlgaehLabel label={{ fieldName: "proiorty" }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.test_type === "S" ? "Stat" : "Routine"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <span>
                              {row.test_type === "S" ? "Stat" : "Routine"}
                            </span>
                          );
                        },
                        disabled: true,
                        filterable: true,
                        filterType: "choices",
                        choices: [
                          {
                            name: "Stat",
                            value: "S",
                          },
                          {
                            name: "Routine",
                            value: "R",
                          },
                        ],
                        others: {
                          // resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "service_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Test Code" }} />
                        ),
                        editorTemplate: (row) => {
                          return row.service_code;
                        },
                        filterable: true,
                        others: {
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "service_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Test Name" }} />
                        ),
                        editorTemplate: (row) => {
                          return row.service_name;
                        },
                        filterable: true,
                        others: {
                          minWidth: 250,

                          style: { textAlign: "left" },
                        },
                      },
                      {
                        fieldName: "sample_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "specimen_name" }} />
                        ),
                        displayTemplate: (row) => {
                          let display =
                            labspecimen === undefined
                              ? []
                              : labspecimen.filter(
                                  (f) =>
                                    f.hims_d_lab_specimen_id === row.sample_id
                                );
                          return row.collected === "Y" || row.billed === "N" ? (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].SpeDescription
                                : ""}
                            </span>
                          ) : (
                            <AlgaehAutoComplete
                              div={{ className: "noLabel" }}
                              selector={{
                                name: "sample_id",
                                className: "select-fld",
                                value: row.sample_id,
                                dataSource: {
                                  textField: "SpeDescription",
                                  valueField: "hims_d_lab_specimen_id",
                                  data: labspecimen,
                                },
                                updateInternally: true,
                                onChange: (e, value) => {
                                  row.sample_id = value;
                                  forceUpdate(row);

                                  // onchangegridcol(row, e);
                                },
                                onClear: (e) => {
                                  row.sample_id = null;
                                  forceUpdate(row);
                                },
                              }}
                            />
                          );
                        },
                        editorTemplate: (row) => {
                          let display =
                            labspecimen === undefined
                              ? []
                              : labspecimen.filter(
                                  (f) =>
                                    f.hims_d_lab_specimen_id === row.sample_id
                                );
                          return row.collected === "Y" || row.billed === "N" ? (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].SpeDescription
                                : ""}
                            </span>
                          ) : (
                            <AlgaehAutoComplete
                              div={{ className: "noLabel" }}
                              selector={{
                                name: "sample_id",
                                className: "select-fld",
                                value: row.sample_id,
                                dataSource: {
                                  textField: "SpeDescription",
                                  valueField: "hims_d_lab_specimen_id",
                                  data: labspecimen,
                                },
                                updateInternally: true,
                                onChange: (e, value) => {
                                  row.sample_id = value;
                                  forceUpdate(row);

                                  // onchangegridcol(row, e);
                                },
                                onClear: (e) => {
                                  row.sample_id = null;
                                  forceUpdate(row);
                                },
                              }}
                            />
                          );
                        },
                        others: {
                          maxWidth: 200,
                          // resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "container_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Container" }} />
                        ),
                        displayTemplate: (row) => {
                          let display =
                            labcontainer === undefined
                              ? []
                              : labcontainer.filter(
                                  (f) =>
                                    f.hims_d_lab_container_id ===
                                    row.container_id
                                );
                          return row.collected === "Y" || row.billed === "N" ? (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].ConDescription
                                : ""}
                            </span>
                          ) : (
                            <AlgaehAutoComplete
                              div={{ className: "noLabel" }}
                              selector={{
                                name: "container_id",
                                className: "select-fld",
                                value: row.container_id,
                                dataSource: {
                                  textField: "ConDescription",
                                  valueField: "hims_d_lab_container_id",
                                  data: labcontainer,
                                },
                                updateInternally: true,
                                onChange: (e, value) => {
                                  row.container_code = value;
                                  forceUpdate(row);

                                  // onchangegridcol(row, e);
                                },
                                onClear: (e) => {
                                  row.container_code = null;
                                  forceUpdate(row);
                                },
                              }}
                            />
                          );
                        },
                        editorTemplate: (row) => {
                          let display =
                            labcontainer === undefined
                              ? []
                              : labcontainer.filter(
                                  (f) =>
                                    f.hims_d_lab_container_id ===
                                    row.container_id
                                );
                          return row.collected === "Y" || row.billed === "N" ? (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].ConDescription
                                : ""}
                            </span>
                          ) : (
                            <AlgaehAutoComplete
                              div={{ className: "noLabel" }}
                              selector={{
                                name: "container_id",
                                className: "select-fld",
                                value: row.container_id,
                                dataSource: {
                                  textField: "ConDescription",
                                  valueField: "hims_d_lab_container_id",
                                  data: labcontainer,
                                },
                                updateInternally: true,
                                onChange: (e, value) => {
                                  row.container_code = value;
                                  forceUpdate(row);

                                  // onchangegridcol(row, e);
                                },
                                onClear: (e) => {
                                  row.container_code = null;
                                  forceUpdate(row);
                                },
                              }}
                            />
                          );
                        },
                        others: {
                          maxWidth: 200,
                          // resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "send_out_test",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Send Out" }} />
                        ),
                        displayTemplate: (row) => {
                          return row.collected === "Y" || row.billed === "N" ? (
                            row.send_out_test === "Y" ? (
                              <span className="badge badge-success">Yes</span>
                            ) : (
                              <span className="badge badge-danger">No</span>
                            )
                          ) : (
                            <AlgaehAutoComplete
                              div={{ className: "noLabel" }}
                              selector={{
                                name: "send_out_test",
                                className: "select-fld",
                                value: row.send_out_test,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: variableJson.FORMAT_YESNO,
                                },
                                updateInternally: true,
                                onChange: (e, value) => {
                                  row.send_out_test = value;
                                  forceUpdate(row);

                                  // onchangegridcol(row, e);
                                },
                                onClear: (e) => {
                                  row.send_out_test = "N";
                                  forceUpdate(row);
                                },
                              }}
                            />
                          );
                        },
                        editorTemplate: (row) => {
                          return row.collected === "Y" || row.billed === "N" ? (
                            row.send_out_test === "Y" ? (
                              <span className="badge badge-success">Yes</span>
                            ) : (
                              <span className="badge badge-danger">No</span>
                            )
                          ) : (
                            <AlgaehAutoComplete
                              div={{ className: "noLabel" }}
                              selector={{
                                name: "send_out_test",
                                className: "select-fld",
                                value: row.send_out_test,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: variableJson.FORMAT_YESNO,
                                },
                                updateInternally: true,
                                onChange: (e, value) => {
                                  row.send_out_test = value;
                                  forceUpdate(row);

                                  // onchangegridcol(row, e);
                                },
                                onClear: (e) => {
                                  row.send_out_test = "N";
                                  forceUpdate(row);
                                },
                              }}
                            />
                          );
                        },
                        others: {
                          maxWidth: 150,
                          // resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "send_in_test",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Send In" }} />
                        ),
                        displayTemplate: (row) => {
                          return row.collected === "Y" || row.billed === "N" ? (
                            row.send_in_test === "Y" ? (
                              <span className="badge badge-success">Yes</span>
                            ) : (
                              <span className="badge badge-danger">No</span>
                            )
                          ) : (
                            <AlgaehAutoComplete
                              div={{ className: "noLabel" }}
                              selector={{
                                name: "send_in_test",
                                className: "select-fld",
                                value: row.send_in_test,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: variableJson.FORMAT_YESNO,
                                },
                                updateInternally: true,
                                onChange: (e, value) => {
                                  row.send_in_test = value;
                                  forceUpdate(row);

                                  // onchangegridcol(row, e);
                                },
                                onClear: (e) => {
                                  row.send_in_test = "N";
                                  forceUpdate(row);
                                },
                              }}
                            />
                          );
                        },
                        editorTemplate: (row) => {
                          return row.collected === "Y" || row.billed === "N" ? (
                            row.send_in_test === "Y" ? (
                              <span className="badge badge-success">Yes</span>
                            ) : (
                              <span className="badge badge-danger">No</span>
                            )
                          ) : (
                            <AlgaehAutoComplete
                              div={{ className: "noLabel" }}
                              selector={{
                                name: "send_in_test",
                                className: "select-fld",
                                value: row.send_in_test,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: variableJson.FORMAT_YESNO,
                                },
                                updateInternally: true,
                                onChange: (e, value) => {
                                  row.send_in_test = value;
                                  forceUpdate(row);

                                  // onchangegridcol(row, e);
                                },
                                onClear: (e) => {
                                  row.send_in_test = "N";
                                  forceUpdate(row);
                                },
                              }}
                            />
                          );
                        },
                        others: {
                          maxWidth: 150,
                          // show: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "collected_date",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "collected_date" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          if (
                            row.send_in_test === "Y" &&
                            row.collected === "N"
                          ) {
                            return (
                              <DatePicker
                                name="collected_date"
                                disabledDate={(d) =>
                                  !d ||
                                  d.isAfter(
                                    moment().add(1, "days").format("YYYY-MM-DD")
                                  )
                                }
                                format="YYYY-MM-DD HH:mm:ss"
                                // minDate={new Date()}
                                showTime
                                onChange={(e) => {}}
                                onOk={(ctrl) => {
                                  if (
                                    Date.parse(moment(ctrl)._d) >
                                    Date.parse(new Date())
                                  ) {
                                    swalMessage({
                                      title:
                                        "Collected date cannot be future Date.",
                                      type: "warning",
                                    });
                                  } else {
                                    row["collected_date"] = moment(ctrl)._d;
                                    forceUpdate(row);
                                  }
                                }}
                              />
                            );
                          } else {
                            return (
                              <span>
                                {moment(row.collected_date).isValid()
                                  ? moment(row.collected_date).format(
                                      "DD-MM-YYYY hh:mm"
                                    )
                                  : "------"}
                              </span>
                            );
                          }
                        },
                        editorTemplate: (row) => {
                          return (
                            <span>
                              {moment(row.collected_date).isValid()
                                ? moment(row.collected_date).format(
                                    "DD-MM-YYYY hh:mm"
                                  )
                                : "------"}
                            </span>
                          );
                        },

                        others: {
                          minWidth: 200,
                          // show: false,
                          style: { textAlign: "left" },
                        },
                      },
                      {
                        fieldName: "status",
                        label: <AlgaehLabel label={{ fieldName: "Status" }} />,
                        displayTemplate: (row) => {
                          return row.status === "O"
                            ? "Ordered"
                            : row.status === "CL"
                            ? "Collected"
                            : row.status === "CN"
                            ? "Test Canceled"
                            : row.status === "CF"
                            ? "Result Confirmed"
                            : "Result Validated";
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlgaehAutoComplete
                              // error={errors2}
                              div={{ className: "col " }}
                              selector={{
                                className: "select-fld",
                                name: "status",
                                value: row.status,
                                onChange: (e, value) => {
                                  row.status = value;
                                },
                                // others: { defaultValue: row.bed_id },
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: [
                                    {
                                      name: "Ordered",
                                      value: "O",
                                    },
                                    {
                                      name: "Collected",
                                      value: "CL",
                                    },
                                    {
                                      name: "Canceled",
                                      value: "CN",
                                    },
                                    {
                                      name: "Result Confirmed",
                                      value: "CF",
                                    },
                                  ],
                                },
                                updateInternally: true,
                                // others: {
                                //   disabled:
                                //     current.request_status === "APR" &&
                                //     current.work_status === "COM",
                                //   tabIndex: "4",
                                // },
                              }}
                            />
                          );
                        },
                        // others: {
                        //   // resizable: false,
                        //   style: { textAlign: "center" }
                        // }
                      },

                      {
                        fieldName: "collected_by",
                        label: (
                          <AlgaehLabel label={{ fieldName: "collected_by" }} />
                        ),
                        displayTemplate: (row) => {
                          let display =
                            userdrtails === undefined
                              ? []
                              : userdrtails.filter(
                                  (f) =>
                                    f.algaeh_d_app_user_id === row.collected_by
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].username
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          let display =
                            userdrtails === undefined
                              ? []
                              : userdrtails.filter(
                                  (f) =>
                                    f.algaeh_d_app_user_id === row.collected_by
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].username
                                : ""}
                            </span>
                          );
                        },
                        others: {
                          minWidth: 200,
                          // show: false,
                          style: { textAlign: "left" },
                        },
                      },

                      {
                        fieldName: "barcode_gen",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Barcode Gen Date" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {moment(row.barcode_gen).isValid()
                                ? moment(row.barcode_gen).format(
                                    "DD-MM-YYYY hh:mm"
                                  )
                                : "------"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <span>
                              {moment(row.barcode_gen).isValid()
                                ? moment(row.barcode_gen).format(
                                    "DD-MM-YYYY hh:mm"
                                  )
                                : "------"}
                            </span>
                          );
                        },
                        others: {
                          minWidth: 200,
                          // show: false,
                          style: { textAlign: "left" },
                        },
                      },
                      {
                        fieldName: "remarks",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Rejection Remarks" }}
                          />
                        ),
                        editorTemplate: (row) => {
                          return row.remarks;
                        },
                        others: {
                          minWidth: 200,
                          // resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                    ]}
                    keyId="patient_code"
                    // dataSource={{
                    data={test_details}
                    // }}
                    // events={{
                    //   onSave: (row) => updateLabOrderServiceStatus(row),
                    // }}
                    filter={true}
                    noDataText="No data available for selected period"
                    // isEditable={editableGrid}
                    pageOptions={{ rows: 50, page: 1 }}
                    isFilterable={true}
                    pagination={true}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    className="btn btn-default"
                    onClick={(e) => {
                      onClose(e);
                    }}
                  >
                    <AlgaehLabel label={{ fieldName: "btnclose" }} />
                  </button>
                  
                 
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </AlgaehModal>
    </div>
  );
}

export default SampleCollectionPatient;
