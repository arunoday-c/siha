// import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import "react-quill/dist/quill.snow.css";
// import "./MicrobiologyResultEntry.scss";
// import "./../../../styles/site.scss";
// import {
//   AlagehAutoComplete,
//   AlagehFormGroup,
//   AlgaehLabel,
//   AlgaehModalPopUp,
// } from "../../Wrapper/algaehWrapper";
// import { AlgaehActions } from "../../../actions/algaehActions";
// import moment from "moment";
// import Options from "../../../Options.json";
// import {
//   texthandle,
//   onvalidate,
//   onconfirm,
//   resultEntryUpdate,
//   onchangegridcol,
//   generateLabResultReport,
//   radioChange,
//   getMicroResult,
//   addComments,
//   selectCommentEvent,
//   deleteComment,
//   ChangeHandel,
// } from "./MicrobiologyResultEntryEvents";
// import AlgaehReport from "../../Wrapper/printReports";
// import {
//   AlgaehDataGrid,
//   AlgaehSecurityComponent,
//   MainContext,
// } from "algaeh-react-components";
// class MicrobiologyResultEntry extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       comments: "",
//       group_id: null,
//       radioGrowth: false,
//       radioNoGrowth: true,
//       organism_type: null,
//       microAntbiotic: [],
//       data_exists: false,
//       group_comments_id: null,
//       comment_list: [],
//       selcted_comments: "",
//       contaminated_culture: "N",
//       portal_exists: "N",
//     };
//   }

//   textAreaEvent(e) {
//     let name = e.name || e.target.name;
//     let value = e.value || e.target.value;

//     this.setState({
//       [name]: value,
//     });
//   }

//   showReport(refBy) {
//     // console.log("test_analytes:", this.state.test_analytes);

//     AlgaehReport({
//       report: {
//         fileName: "haematologyReport",
//       },
//       data: {
//         investigation_name: this.state.service_name,
//         test_analytes: this.state.test_analytes,
//         patient_code: this.state.patient_code,
//         full_name: this.state.full_name,
//         receipt_date: this.state.ordered_date,
//         doctor_name: refBy,
//         test_name: this.state.service_name,
//         specimen: this.state.specimen,
//       },
//     });
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
//     this.props.getMicroGroups({
//       uri: "/labmasters/selectMicroGroup",
//       module: "laboratory",
//       method: "GET",
//       data: { group_status: "A" },
//       redux: {
//         type: "MICROGROUPS_GET_DATA",
//         mappingName: "microGroups",
//       },
//     });
//     const { portal_exists } = this.context.userToken;
//     this.setState({ portal_exists });
//   }
//   UNSAFE_componentWillReceiveProps(newProps) {
//     if (newProps.selectedPatient !== undefined && newProps.open === true) {
//       // newProps.selectedPatient.microopen = false;
//       newProps.selectedPatient.radioNoGrowth =
//         newProps.selectedPatient.bacteria_type === "NG" ? true : false;
//       newProps.selectedPatient.radioGrowth =
//         newProps.selectedPatient.bacteria_type === "G" ? true : false;
//       this.setState({ ...this.state, ...newProps.selectedPatient }, () => {
//         getMicroResult(this, this);
//       });
//     }
//   }

//   onClose = (e) => {
//     this.setState(
//       {
//         comments: "",
//         group_id: null,
//         radioGrowth: false,
//         radioNoGrowth: true,
//         organism_type: null,
//         microAntbiotic: [],
//       },
//       () => {
//         console.log(this.state);
//         this.props.onClose && this.props.onClose(e);
//       }
//     );
//   };

//   dateFormater({ value }) {
//     if (value !== null) {
//       return moment(value).format(Options.dateFormat);
//     }
//   }
//   render() {
//     let display =
//       this.props.providers === undefined
//         ? []
//         : this.props.providers.filter(
//             (f) => f.hims_d_employee_id === this.state.provider_id
//           );
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
//                   {" "}
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
//                     </div>{" "}
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
//                       </h6>
//                     </div>{" "}
//                     <div className="col-2">
//                       <AlgaehLabel
//                         label={{
//                           forceLabel: "Ordered By",
//                         }}
//                       />

//                       <h6>
//                         {display !== null && display.length !== 0
//                           ? display[0].full_name
//                           : "------"}

//                         <small
//                           style={{ display: "block", fontStyle: "italic" }}
//                         >
//                           On{" "}
//                           {moment(this.state.ordered_date).format(
//                             Options.dateFormat
//                           )}
//                         </small>
//                       </h6>
//                     </div>{" "}
//                     <div className="col-2">
//                       <AlgaehLabel
//                         label={{
//                           forceLabel: "ENTERED BY",
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
//                     </div>{" "}
//                     <div className="col-2">
//                       <AlgaehLabel
//                         label={{
//                           forceLabel: "CONFIRMED BY",
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
//                     </div>{" "}
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
//                     </div>{" "}
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className="row"
//                 style={{ borderBottom: "1px solid #e0e0e0", marginBottom: 10 }}
//               >
//                 <div className="col-2">
//                   <label>Growth Type</label>
//                   <div className="customRadio" style={{ borderBottom: 0 }}>
//                     <label className="radio inline">
//                       <input
//                         type="radio"
//                         value="NoGrowth"
//                         checked={this.state.radioNoGrowth}
//                         onChange={radioChange.bind(this, this)}
//                         disabled={this.state.data_exists}
//                       />
//                       <span>
//                         <AlgaehLabel
//                           label={{
//                             forceLabel: "No Growth",
//                           }}
//                         />
//                       </span>
//                     </label>

//                     <label className="radio inline">
//                       <input
//                         type="radio"
//                         value="Growth"
//                         checked={this.state.radioGrowth}
//                         onChange={radioChange.bind(this, this)}
//                         disabled={this.state.data_exists}
//                       />
//                       <span>
//                         <AlgaehLabel
//                           label={{
//                             forceLabel: "growth",
//                           }}
//                         />
//                       </span>
//                     </label>
//                   </div>
//                 </div>
//                 <div className="col">
//                   {" "}
//                   {this.state.radioGrowth === true ? (
//                     <div className="row">
//                       <AlagehFormGroup
//                         div={{ className: "col form-group mandatory" }}
//                         label={{
//                           forceLabel: "Bacteria Name",
//                           isImp: this.state.radioGrowth,
//                         }}
//                         textBox={{
//                           value: this.state.bacteria_name,
//                           className: "txt-fld",
//                           name: "bacteria_name",

//                           events: {
//                             onChange: texthandle.bind(this, this),
//                           },
//                           others: {
//                             disabled: this.state.data_exists,
//                           },
//                         }}
//                       />
//                       <AlagehAutoComplete
//                         div={{ className: "col form-group mandatory" }}
//                         label={{
//                           forceLabel: "Select Group",
//                           isImp: this.state.radioGrowth,
//                         }}
//                         selector={{
//                           name: "group_id",
//                           className: "select-fld",
//                           value: this.state.group_id,
//                           dataSource: {
//                             textField: "group_name",
//                             valueField: "hims_d_micro_group_id",
//                             data: this.props.microGroups,
//                           },
//                           onChange: texthandle.bind(this, this),
//                           others: {
//                             disabled: this.state.data_exists,
//                           },
//                         }}
//                       />
//                       <div className="col">
//                         <AlgaehLabel
//                           label={{
//                             forceLabel: "Organism Type",
//                           }}
//                         />
//                         <h6>
//                           {this.state.organism_type
//                             ? this.state.organism_type === "F"
//                               ? "Fastidious"
//                               : "Non-Fastidious"
//                             : "------"}
//                         </h6>
//                       </div>
//                     </div>
//                   ) : null}{" "}
//                 </div>
//                 <div className="col-2">
//                   <label>Contaminated Culture</label>
//                   <div className="customRadio" style={{ borderBottom: 0 }}>
//                     <label className="radio inline">
//                       <input
//                         type="radio"
//                         value="N"
//                         name="contaminated_culture"
//                         checked={
//                           this.state.contaminated_culture === "N" ? true : false
//                         }
//                         onChange={ChangeHandel.bind(this, this)}
//                         disabled={this.state.data_exists}
//                       />
//                       <span>
//                         <AlgaehLabel
//                           label={{
//                             forceLabel: "No",
//                           }}
//                         />
//                       </span>
//                     </label>

//                     <label className="radio inline">
//                       <input
//                         type="radio"
//                         value="Y"
//                         name="contaminated_culture"
//                         checked={
//                           this.state.contaminated_culture === "Y" ? true : false
//                         }
//                         onChange={ChangeHandel.bind(this, this)}
//                         disabled={this.state.data_exists}
//                       />
//                       <span>
//                         <AlgaehLabel
//                           label={{
//                             forceLabel: "Yes",
//                           }}
//                         />
//                       </span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-8">
//                   {" "}
//                   <div
//                     className="popLeftDiv"
//                     style={{ padding: 0, paddingRight: 15, minHeight: "56vh " }}
//                   >
//                     {" "}
//                     <div className="row">
//                       <div className="col-12">
//                         {this.state.radioGrowth === true ? (
//                           <div className="row">
//                             <div
//                               className="col-lg-12"
//                               id="microLabResultGrid_Cntr"
//                             >
//                               <AlgaehDataGrid
//                                 id="antibiotic_result"
//                                 columns={[
//                                   {
//                                     fieldName: "antibiotic_name",
//                                     label: (
//                                       <AlgaehLabel
//                                         label={{ forceLabel: "Antibiotic" }}
//                                       />
//                                     ),

//                                     others: {
//                                       resizable: false,
//                                       style: { textAlign: "left" },
//                                     },
//                                     filterable: true,
//                                   },

//                                   {
//                                     fieldName: "susceptible",
//                                     label: (
//                                       <AlgaehLabel
//                                         label={{
//                                           forceLabel: "S",
//                                         }}
//                                       />
//                                     ),
//                                     displayTemplate: (row) => {
//                                       return (
//                                         <label className="checkbox inline">
//                                           <input
//                                             type="checkbox"
//                                             name="susceptible"
//                                             checked={
//                                               row.susceptible === "Y"
//                                                 ? true
//                                                 : false
//                                             }
//                                             disabled={
//                                               this.state.status === "V"
//                                                 ? true
//                                                 : false
//                                             }
//                                             onChange={onchangegridcol.bind(
//                                               this,
//                                               this,
//                                               row
//                                             )}
//                                           />
//                                         </label>
//                                       );
//                                     },
//                                     others: {
//                                       maxWidth: 100,
//                                       resizable: false,
//                                       filterable: false,
//                                       style: { textAlign: "center" },
//                                     },
//                                   },

//                                   {
//                                     fieldName: "intermediate",
//                                     label: (
//                                       <AlgaehLabel
//                                         label={{ forceLabel: "I" }}
//                                       />
//                                     ),
//                                     displayTemplate: (row) => {
//                                       return (
//                                         <label className="checkbox inline">
//                                           <input
//                                             type="checkbox"
//                                             name="intermediate"
//                                             checked={
//                                               row.intermediate === "Y"
//                                                 ? true
//                                                 : false
//                                             }
//                                             disabled={
//                                               this.state.status === "V"
//                                                 ? true
//                                                 : false
//                                             }
//                                             onChange={onchangegridcol.bind(
//                                               this,
//                                               this,
//                                               row
//                                             )}
//                                           />
//                                         </label>
//                                       );
//                                     },
//                                     others: {
//                                       maxWidth: 100,
//                                       resizable: false,
//                                       filterable: false,
//                                       style: { textAlign: "center" },
//                                     },
//                                   },
//                                   {
//                                     fieldName: "resistant",
//                                     label: (
//                                       <AlgaehLabel
//                                         label={{ forceLabel: "R" }}
//                                       />
//                                     ),
//                                     displayTemplate: (row) => {
//                                       return (
//                                         <label className="checkbox inline">
//                                           <input
//                                             type="checkbox"
//                                             name="resistant"
//                                             checked={
//                                               row.resistant === "Y"
//                                                 ? true
//                                                 : false
//                                             }
//                                             disabled={
//                                               this.state.status === "V"
//                                                 ? true
//                                                 : false
//                                             }
//                                             onChange={onchangegridcol.bind(
//                                               this,
//                                               this,
//                                               row
//                                             )}
//                                           />
//                                         </label>
//                                       );
//                                     },
//                                     others: {
//                                       maxWidth: 100,
//                                       resizable: false,
//                                       filterable: false,
//                                       style: { textAlign: "center" },
//                                     },
//                                   },
//                                 ]}
//                                 keyId="microAntbiotic"
//                                 data={
//                                   this.state.microAntbiotic === undefined
//                                     ? []
//                                     : this.state.microAntbiotic
//                                 }
//                                 pagination={true}
//                                 pageOptions={{ rows: 50, page: 1 }}
//                                 isFilterable={true}
//                               />
//                             </div>
//                           </div>
//                         ) : null}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-4">
//                   <div className="popRightDiv" style={{ padding: 0 }}>
//                     <div className="row">
//                       <AlagehAutoComplete
//                         div={{ className: "col-12 form-group" }}
//                         label={{
//                           forceLabel: "Select Comment",
//                         }}
//                         selector={{
//                           name: "group_comments_id",
//                           className: "select-fld",
//                           value: this.state.group_comments_id,
//                           dataSource: {
//                             textField: "commnet_name",
//                             valueField: "hims_d_group_comment_id",
//                             data: this.state.comments_data,
//                           },
//                           onChange: selectCommentEvent.bind(this, this),
//                           onClear: () => {
//                             this.setState({
//                               group_comments_id: null,
//                               selcted_comments: "",
//                             });
//                           },
//                         }}
//                       />
//                       <div className="col-12">
//                         <AlgaehLabel
//                           label={{
//                             forceLabel: "Enter Comment",
//                           }}
//                         />

//                         <textarea
//                           value={this.state.selcted_comments}
//                           name="selcted_comments"
//                           onChange={this.textAreaEvent.bind(this)}
//                         />
//                       </div>
//                       <div className="col-12" style={{ textAlign: "right" }}>
//                         <button
//                           onClick={addComments.bind(this, this)}
//                           className="btn btn-default"
//                         >
//                           Add
//                         </button>
//                       </div>

//                       <div
//                         className="col-12 finalCommentsSection"
//                         style={{ marginTop: 15, marginBottom: 15 }}
//                       >
//                         <h6>View Final Comments</h6>
//                         <ol>
//                           {this.state.comment_list.length > 0
//                             ? this.state.comment_list.map((row, index) => {
//                                 if (row) {
//                                   return (
//                                     <React.Fragment key={index}>
//                                       <li key={index}>
//                                         <span>{row}</span>
//                                         <i
//                                           className="fas fa-times"
//                                           onClick={deleteComment.bind(
//                                             this,
//                                             this,
//                                             row
//                                           )}
//                                         ></i>
//                                       </li>
//                                     </React.Fragment>
//                                   );
//                                 } else {
//                                   return null;
//                                 }
//                               })
//                             : null}
//                         </ol>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="popupFooter">
//             <div className="col-6 leftBtnGroup">
//               {" "}
//               <AlgaehSecurityComponent componentCode="PRI_LAB_RES">
//                 <button
//                   className="btn btn-primary"
//                   onClick={generateLabResultReport.bind(this, this.state)}
//                   disabled={
//                     this.state.status === "V" && this.state.credit_order === "N"
//                       ? false
//                       : true
//                   }
//                 >
//                   Print
//                 </button>
//               </AlgaehSecurityComponent>
//             </div>
//             <div className="col-6">
//               <AlgaehSecurityComponent componentCode="VAL_LAB_RES">
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={onvalidate.bind(this, this)}
//                   disabled={
//                     this.state.status === "V" ||
//                     this.state.entered_by_name === "" ||
//                     this.state.confirm_by_name === ""
//                       ? true
//                       : false
//                   }
//                 >
//                   Validate
//                 </button>
//               </AlgaehSecurityComponent>

//               <AlgaehSecurityComponent componentCode="CONF_LAB_RES">
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={onconfirm.bind(this, this)}
//                   disabled={
//                     this.state.status === "C" ||
//                     this.state.entered_by_name === ""
//                       ? true
//                       : this.state.status === "V"
//                       ? true
//                       : false
//                   }
//                 >
//                   Confirm
//                 </button>
//               </AlgaehSecurityComponent>

//               <AlgaehSecurityComponent componentCode="SAVE_LAB_RES">
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={resultEntryUpdate.bind(this, this)}
//                   disabled={this.state.status !== "CL" ? true : false}
//                 >
//                   Save
//                 </button>
//               </AlgaehSecurityComponent>

//               <button
//                 type="button"
//                 className="btn btn-default"
//                 onClick={(e) => {
//                   this.onClose(e);
//                 }}
//               >
//                 Cancel
//               </button>
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
//     microGroups: state.microGroups,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getUserDetails: AlgaehActions,
//       getProviderDetails: AlgaehActions,
//       getTestAnalytes: AlgaehActions,
//       getLabAnalytes: AlgaehActions,
//       getMicroGroups: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(MicrobiologyResultEntry)
// );

import React, { useContext, useState, useEffect } from "react";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  MainContext,
  AlgaehModal,
  AlgaehAutoComplete,
  AlgaehMessagePop,
  AlgaehSecurityComponent,
  AlgaehFormGroup,
} from "algaeh-react-components";
import Options from "../../../Options.json";
import "react-quill/dist/quill.snow.css";
import "./MicrobiologyResultEntry.scss";
import "./../../../styles/site.scss";

import { useQuery } from "react-query";
import { newAlgaehApi } from "../../../hooks";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";

import swal from "sweetalert2";
// import _ from "lodash";
import axios from "axios";
import moment from "moment";

// import { FORMAT_YESNO } from "../../../utils/GlobalVariables.json";
const getAnalytes = async (key, { hims_f_lab_order_id }) => {
  const result = await Promise.all([
    newAlgaehApi({
      uri: "/laboratory/getMicroDetails",
      module: "laboratory",
      method: "GET",
      data: { order_id: hims_f_lab_order_id },
    }),
    newAlgaehApi({
      uri: "/laboratory/getLabOrderedComment",
      module: "laboratory",
      method: "GET",
      data: { hims_f_lab_order_id: hims_f_lab_order_id },
    }),
    newAlgaehApi({
      uri: "/laboratory/getMicroResult",
      module: "laboratory",
      method: "GET",
      data: { order_id: hims_f_lab_order_id },
    }),
  ]);

  return {
    analyteData: result[0]?.data?.records,
    commentsData: result[1]?.data?.records,
    microResult: result[2]?.data?.records,
  };
};
function MicrobiologyResultEntry({ onClose, selectedPatient, open }) {
  const { userToken } = useContext(MainContext);

  const [portal_exists, setPortal_exists] = useState(false);
  const [growthType, setGrowthType] = useState(
    selectedPatient.bacteria_type === "G" ? "Growth" : "NoGrowth"
  );
  const [organism_type, setOrganism_type] = useState(null);

  const [group_comments_id, setGroup_comments_id] = useState(null);
  const [selcted_comments, setSelcted_comments] = useState("");
  const [ordered_by_name, setOrdered_by_name] = useState({
    name: "",
    date: "",
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
  const [contaminated_culture, setContaminated_culture] = useState("N");
  const [comments_data, setComments_data] = useState([]);
  // const [comments, setComments] = useState();
  // const [test_analytes, setTest_analytes] = useState([]);
  const [data_exists, setData_exists] = useState(false);
  const [group_id, setGroup_id] = useState(null);
  const [comment_list, setComment_list] = useState([]);
  const [bacteria_name, setBacteria_name] = useState();
  const [status, setStatus] = useState("");
  const [radioGrowth, setRadioGrowth] = useState(
    selectedPatient.bacteria_type === "G" ? true : false
  );
  const [microAntbiotic, setMicroAntbiotic] = useState([]);
  let [, setState] = useState();
  const PORTAL_HOST = process.env.REACT_APP_PORTAL_HOST;
  useEffect(() => {
    setPortal_exists(userToken.portal_exists);
    debugger;
    setStatus(selectedPatient.status);
    setComments_data(selectedPatient.comments_data);
    // setComments(selectedPatient.comments);
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
    [
      "getAnalytes",
      { hims_f_lab_order_id: selectedPatient?.hims_f_lab_order_id },
    ],
    getAnalytes,
    {
      initialData: {
        analyteData: [],
        commentsData: [],
        microResult: [],
      },
      cacheTime: Infinity,
      initialStale: true,

      onSuccess: (data) => {
        // setTest_analytes(data.analyteData);
        setComment_list(
          data.commentsData?.comments
            ? data.commentsData.comments.split("<br/>")
            : []
        );

        setOrdered_by_name({
          name: data.analyteData[0].ordered_by_name,
          date: selectedPatient.ordered_date,
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

        setBacteria_name(
          selectedPatient.bacteria_name
            ? selectedPatient.bacteria_name
            : bacteria_name
        );
        setGroup_id(
          selectedPatient.group_id ? selectedPatient.group_id : group_id
        );
        setGrowthType(
          selectedPatient.bacteria_type === "G" ? "Growth" : "NoGrowth"
        );

        setOrganism_type(
          selectedPatient.organism_type
            ? selectedPatient.organism_type
            : organism_type
        );
        setData_exists(data.microResult.length > 0 ? true : false);
        setMicroAntbiotic(data.microResult);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );

  const forceUpdate = (row) => {
    let microAntbioticData = microAntbiotic;
    let _index = microAntbioticData.indexOf(row);
    microAntbioticData[_index] = row;

    setMicroAntbiotic(microAntbioticData);
    setState({});
  };

  const { data: microGroups } = useQuery(
    ["getMicroGroups", {}],
    getMicroGroups,
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
  async function getMicroGroups(key) {
    const result = await newAlgaehApi({
      uri: "/labmasters/selectMicroGroup",
      module: "laboratory",
      method: "GET",
    });
    return result?.data?.records;
  }
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

  const UpdateLabOrder = (value, status) => {
    const obj = {
      comments: comment_list.join("<br/>"),
      status,
      bacteria_type: growthType === "NoGrowth" ? "NG" : "G",
      data_exists: data_exists,
      microAntbiotic: microAntbiotic,

      hims_f_lab_order_id: selectedPatient.hims_f_lab_order_id,
      group_id: group_id,
      organism_type: organism_type,
      bacteria_name: bacteria_name,
      contaminated_culture: contaminated_culture,
    };

    if (bacteria_name.length < 0 && radioGrowth) {
      swalMessage({
        title: "Please Enter Bacteria Name",
        type: "warning",
      });
      document.querySelector("[name='bacteria_name']").focus();
      return;
    }
    if (!group_id && radioGrowth) {
      swalMessage({
        title: "Please Enter Bacteria Group",
        type: "warning",
      });
      document.querySelector("[name='group_id']").focus();
      return;
    }

    algaehApiCall({
      uri: "/laboratory/updateMicroResultEntry",
      module: "laboratory",
      data: { ...obj },
      method: "PUT",
      onSuccess: (response) => {
        if (response.data.success === true) {
          if (status === "CF" || status === "V") {
            if (portal_exists === "Y") {
              const portal_data = {
                service_id: selectedPatient.service_id,
                visit_code: selectedPatient.visit_code,
                patient_identity: selectedPatient.primary_id_no,
                service_status:
                  status === "CF" ? "RESULT CONFIRMED" : "RESULT VALIDATED",
              };
              axios
                .post(`${PORTAL_HOST}/info/deletePatientService`, portal_data)
                .then(function (response) {
                  //handle success
                  console.log(response);
                })
                .catch(function (response) {
                  //handle error
                  console.log(response);
                });
            }
          }
          swalMessage({
            type: "success",
            title: "Done successfully . .",
          });
          getAnalytesReload();
          // setTest_analytes(value);
          debugger;
          setStatus(status === "AV" ? "V" : status);
          if (portal_exists === "Y" && status === "V") {
            generateLabResultReport({ ...selectedPatient, hidePrinting: true });
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
  function generateLabResultReport(data) {
    let portalParams = {};
    if (data.portal_exists === "Y") {
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
          reportName: "microbioTestReport",
          ...portalParams,
          reportParams: [
            { name: "hims_d_patient_id", value: data.patient_id },
            {
              name: "visit_id",
              value: data.visit_id,
            },
            {
              name: "hims_f_lab_order_id",
              value: data.hims_f_lab_order_id,
            },
            {
              name: "visit_code",
              value: data.visit_code,
            },
            {
              name: "patient_identity",
              value: data.primary_id_no,
            },
            {
              name: "service_id",
              value: data.service_id,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        if (data.hidePrinting === undefined) {
          const urlBlob = URL.createObjectURL(res.data);
          const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Lab Test Report`;
          window.open(origin);
        }
      },
    });
  }
  const onvalidate = () => {
    let strTitle = "Are you sure want to Validate?";

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
        UpdateLabOrder([], "V");
      }
    });
  };
  const onconfirm = () => {
    let strTitle = "Are you sure want to Confirm?";
    if (selectedPatient.auto_validate === "Y") {
      strTitle = "This Test is Auto Validate Are you sure want to Confirm ?";
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
        UpdateLabOrder([], selectedPatient.auto_validate === "Y" ? "AV" : "CF");
      }
    });
  };

  const resultEntryUpdate = () => {
    UpdateLabOrder([], "E");
  };

  const deleteComment = (row) => {
    let commentList = comment_list;
    let _index = commentList.indexOf(row);
    commentList.splice(_index, 1);
    setComment_list(commentList);
    setState({});
  };

  const selectCommentEvent = (e, value) => {
    setGroup_comments_id(value);
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
  };

  const setGroupId = (e, value) => {
    setGroup_id(value);
    algaehApiCall({
      uri: "/labmasters/selectGroupAntiMap",
      module: "laboratory",
      data: {
        micro_group_id: value,
        urine_specimen: selectedPatient.urine_specimen,
      },
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          setOrganism_type(e.group_type);
          setMicroAntbiotic(response.data.records);
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });

    algaehApiCall({
      uri: "/labmasters/getGroupComments",
      module: "laboratory",
      data: { micro_group_id: value },
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          setComments_data(response.data.records);
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };

  // const texthandle = (e) => {
  //
  //   let name = e.name || e.target.name;
  //   let value = e.value || e.target.value;

  //   if (name === "group_id") {

  //   } else if (name === "bacteria_name") {
  //     setBacteria_name(value);
  //   }
  // };
  // let display =
  //   providers === undefined
  //     ? []
  //     : providers.filter(
  //         (f) => f.hims_d_employee_id === selectedPatient.provider_id
  //       );
  return (
    <div>
      <AlgaehModal
        title="Microbiology Result Entry"
        class="labResultModalPopup"
        visible={open}
        mask={true}
        maskClosable={true}
        onCancel={onClose}
        footer={[
          <div className="row">
            <div className="col-6 footer-btn-left">
              <AlgaehSecurityComponent componentCode="PRI_LAB_RES">
                <button
                  className="btn btn-primary"
                  onClick={() => generateLabResultReport(selectedPatient)}
                  disabled={
                    status === "V" && selectedPatient.credit_order === "N"
                      ? false
                      : true
                  }
                >
                  Print
                </button>
              </AlgaehSecurityComponent>
            </div>
            <div className="col-6 ">
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
                  Validate
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
                  Confirm
                </button>
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="SAVE_LAB_RES">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={resultEntryUpdate}
                  disabled={status === "V" ? true : false}
                >
                  Save
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
                {" "}
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
                      {ordered_by_name?.name ? ordered_by_name.name : "------"}

                      {ordered_by_name?.date ? (
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
            </div>
            <div
              className="row"
              style={{ borderBottom: "1px solid #e0e0e0", marginBottom: 10 }}
            >
              <div className="col-2">
                <label>Growth Type</label>
                <div className="customRadio" style={{ borderBottom: 0 }}>
                  <label className="radio inline">
                    {/* <input
                        type="radio"
                        value="NoGrowth"
                        checked={radioNoGrowth}
                        onChange={radioChange.bind(this, this)}
                        disabled={data_exists}
                      /> */}

                    <input
                      type="radio"
                      value="NoGrowth"
                      name="NoGrowth"
                      checked={growthType === "NoGrowth" ? true : false}
                      onChange={(e) => {
                        setGrowthType(e.target.value);
                        setRadioGrowth(false);
                      }}
                      disabled={data_exists}
                    />
                    <span>
                      <AlgaehLabel
                        label={{
                          forceLabel: "No Growth",
                        }}
                      />
                    </span>
                  </label>

                  <label className="radio inline">
                    <input
                      type="radio"
                      value="Growth"
                      name="Growth"
                      checked={growthType === "Growth" ? true : false}
                      onChange={(e) => {
                        setGrowthType(e.target.value);
                        setRadioGrowth(true);
                      }}
                    />
                    {/* <input
                        type="radio"
                        value="Growth"
                        checked={radioGrowth}
                        onChange={radioChange.bind(this, this)}
                        disabled={data_exists}
                      /> */}
                    <span>
                      <AlgaehLabel
                        label={{
                          forceLabel: "growth",
                        }}
                      />
                    </span>
                  </label>
                </div>
              </div>
              <div className="col">
                {" "}
                {radioGrowth === true ? (
                  <div className="row">
                    <AlgaehFormGroup
                      div={{ className: "col form-group mandatory" }}
                      label={{
                        forceLabel: "Bacteria Name",
                        isImp: radioGrowth,
                      }}
                      textBox={{
                        value: bacteria_name,
                        className: "txt-fld",
                        name: "bacteria_name",

                        onChange: (e) => {
                          setBacteria_name(e.target.value);
                        },

                        others: {
                          disabled: data_exists,
                        },
                      }}
                    />

                    <AlgaehAutoComplete
                      div={{ className: "col form-group mandatory" }}
                      label={{
                        forceLabel: "Select Group",
                        isImp: radioGrowth,
                      }}
                      selector={{
                        name: "group_id",
                        className: "select-fld",
                        value: group_id,
                        dataSource: {
                          textField: "group_name",
                          valueField: "hims_d_micro_group_id",
                          data: microGroups,
                        },
                        onChange: (_, selected) => {
                          setGroupId(_, selected);
                        },
                        others: {
                          disabled: data_exists,
                        },
                      }}
                    />
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Organism Type",
                        }}
                      />
                      <h6>
                        {organism_type
                          ? organism_type === "F"
                            ? "Fastidious"
                            : "Non-Fastidious"
                          : "------"}
                      </h6>
                    </div>
                  </div>
                ) : null}{" "}
              </div>
              <div className="col-2">
                <label>Contaminated Culture</label>
                <div className="customRadio" style={{ borderBottom: 0 }}>
                  <label className="radio inline">
                    <input
                      type="radio"
                      value="N"
                      name="contaminated_culture"
                      checked={contaminated_culture === "N" ? true : false}
                      onChange={(e) => setContaminated_culture(e.target.value)}
                      disabled={data_exists}
                    />
                    <span>
                      <AlgaehLabel
                        label={{
                          forceLabel: "No",
                        }}
                      />
                    </span>
                  </label>

                  <label className="radio inline">
                    <input
                      type="radio"
                      value="Y"
                      name="contaminated_culture"
                      checked={contaminated_culture === "N" ? true : false}
                      onChange={(e) => setContaminated_culture(e.target.value)}
                      disabled={data_exists}
                    />
                    <span>
                      <AlgaehLabel
                        label={{
                          forceLabel: "Yes",
                        }}
                      />
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-9">
                {" "}
                <div
                  className="popLeftDiv"
                  style={{ padding: 0, paddingRight: 15, minHeight: "56vh " }}
                >
                  {" "}
                  <div className="row">
                    <div className="col-12">
                      {radioGrowth === true ? (
                        <div className="row">
                          <div
                            className="col-lg-12"
                            id="microLabResultGrid_Cntr"
                          >
                            <AlgaehDataGrid
                              columns={[
                                {
                                  fieldName: "antibiotic_name",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Antibiotic" }}
                                    />
                                  ),

                                  others: {
                                    resizable: false,
                                    style: { textAlign: "left" },
                                  },
                                  filterable: true,
                                },

                                {
                                  fieldName: "susceptible",
                                  label: (
                                    <AlgaehLabel
                                      label={{
                                        forceLabel: "S",
                                      }}
                                    />
                                  ),
                                  displayTemplate: (row) => {
                                    return (
                                      <label className="checkbox inline">
                                        <input
                                          type="checkbox"
                                          name="susceptible"
                                          checked={
                                            row.susceptible === "Y"
                                              ? true
                                              : false
                                          }
                                          disabled={
                                            status === "V" ? true : false
                                          }
                                          onChange={(e) => {
                                            row.susceptible = "Y";
                                            row.intermediate = "N";
                                            row.resistant = "N";

                                            forceUpdate(row);
                                          }}
                                        />
                                      </label>
                                    );
                                  },
                                  others: {
                                    maxWidth: 100,
                                    resizable: false,
                                    filterable: false,
                                    style: { textAlign: "center" },
                                  },
                                },

                                {
                                  fieldName: "intermediate",
                                  label: (
                                    <AlgaehLabel label={{ forceLabel: "I" }} />
                                  ),
                                  displayTemplate: (row) => {
                                    return (
                                      <label className="checkbox inline">
                                        <input
                                          type="checkbox"
                                          name="intermediate"
                                          checked={
                                            row.intermediate === "Y"
                                              ? true
                                              : false
                                          }
                                          disabled={
                                            status === "V" ? true : false
                                          }
                                          onChange={(e) => {
                                            row.susceptible = "N";
                                            row.intermediate = "Y";
                                            row.resistant = "N";
                                            forceUpdate(row);
                                          }}
                                        />
                                      </label>
                                    );
                                  },
                                  others: {
                                    maxWidth: 100,
                                    resizable: false,
                                    filterable: false,
                                    style: { textAlign: "center" },
                                  },
                                },
                                {
                                  fieldName: "resistant",
                                  label: (
                                    <AlgaehLabel label={{ forceLabel: "R" }} />
                                  ),
                                  displayTemplate: (row) => {
                                    return (
                                      <label className="checkbox inline">
                                        <input
                                          type="checkbox"
                                          name="resistant"
                                          checked={
                                            row.resistant === "Y" ? true : false
                                          }
                                          disabled={
                                            status === "V" ? true : false
                                          }
                                          onChange={(e) => {
                                            row.susceptible = "N";
                                            row.intermediate = "N";
                                            row.resistant = "Y";
                                            forceUpdate(row);
                                          }}
                                        />
                                      </label>
                                    );
                                  },
                                  others: {
                                    maxWidth: 100,
                                    resizable: false,
                                    filterable: false,
                                    style: { textAlign: "center" },
                                  },
                                },
                              ]}
                              keyId="microAntbiotic"
                              data={
                                microAntbiotic === undefined
                                  ? []
                                  : microAntbiotic
                              }
                              pagination={true}
                              pageOptions={{ rows: 50, page: 1 }}
                              isFilterable={true}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-4">
                  <div className="popRightDiv" style={{ padding: 0 }}>
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-12 form-group" }}
                        label={{
                          forceLabel: "Select Comment",
                        }}
                        selector={{
                          name: "group_comments_id",
                          className: "select-fld",
                          value: this.state.group_comments_id,
                          dataSource: {
                            textField: "commnet_name",
                            valueField: "hims_d_group_comment_id",
                            data: this.state.comments_data,
                          },
                          onChange: selectCommentEvent.bind(this, this),
                          onClear: () => {
                            this.setState({
                              group_comments_id: null,
                              selcted_comments: "",
                            });
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
                          value={this.state.selcted_comments}
                          name="selcted_comments"
                          onChange={this.textAreaEvent.bind(this)}
                        />
                      </div>
                      <div className="col-12" style={{ textAlign: "right" }}>
                        <button
                          onClick={addComments.bind(this, this)}
                          className="btn btn-default"
                        >
                          Add
                        </button>
                      </div>

                      <div
                        className="col-12 finalCommentsSection"
                        style={{ marginTop: 15, marginBottom: 15 }}
                      >
                        <h6>View Final Comments</h6>
                        <ol>
                          {this.state.comment_list.length > 0
                            ? this.state.comment_list.map((row, index) => {
                                if (row) {
                                  return (
                                    <React.Fragment key={index}>
                                      <li key={index}>
                                        <span>{row}</span>
                                        <i
                                          className="fas fa-times"
                                          onClick={deleteComment.bind(
                                            this,
                                            this,
                                            row
                                          )}
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


                </div> */}

              <div className="col-3">
                <div className="row">
                  <AlgaehAutoComplete
                    div={{ className: "col-12  form-group" }}
                    label={{
                      forceLabel: "Select Comment",
                    }}
                    selector={{
                      name: "group_comments_id",
                      className: "select-fld",
                      value: group_comments_id,
                      dataSource: {
                        textField: "commnet_name",
                        valueField: "hims_d_group_comment_id",
                        data: comments_data,
                      },
                      onChange: selectCommentEvent,
                      onClear: () => {
                        setGroup_comments_id(null);
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
      </AlgaehModal>
    </div>
  );
}

export default MicrobiologyResultEntry;
