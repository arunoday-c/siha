// import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import ModalMedicalRecord from "../../DoctorsWorkbench/ModalForMedicalRecordPat";
// import RadResultEntry from "../RadResultEntry/RadResultEntry";
// import { setGlobal } from "../../../utils/GlobalFunctions";

// import "./RadScheduledList.scss";
// import "./../../../styles/site.scss";

// import {
//   datehandle,
//   getRadTestList,
//   openResultEntry,
//   closeResultEntry,
//   Refresh,
// } from "./RadScheduledListEvents";

// import {
//   AlgaehDataGrid,
//   AlgaehLabel,
//   AlgaehDateHandler,
// } from "../../Wrapper/algaehWrapper";
// // import { newAlgaehApi } from "../../../hooks";
// // import { swalMessage } from "../../../utils/algaehApiCall";
// import { algaehApiCall } from "../../../utils/algaehApiCall";
// // import { AlgaehModal } from "algaeh-react-components";
// import { AlgaehActions } from "../../../actions/algaehActions";
// import { Tooltip } from "antd";
// import moment from "moment";
// import Options from "../../../Options.json";
// import _ from "lodash";
// import RadAttachDocument from "./RadAttachDocument";
// // const { Dragger } = Upload;
// // const { confirm } = Modal;
// class RadScheduledList extends Component {
//   constructor(props) {
//     super(props);
//     let month = moment().format("MM");
//     let year = moment().format("YYYY");
//     this.state = {
//       to_date: new Date(),
//       from_date: moment("01" + month + year, "DDMMYYYY")._d,
//       patient_code: null,
//       patient_name: null,
//       patient_id: null,
//       category_id: null,
//       test_status: null,
//       rad_test_list: [],
//       selected_patient: null,
//       isOpen: false,
//       resultEntry: false,
//       selectedPatient: {},
//       proiorty: null,
//       status: null,
//       radtestlist: [],
//       openModal: false,
//       attached_files: [],
//       attached_docs: [],
//       hims_f_rad_order_id: null,
//       visit_id: null,
//       openMrdModal: false,
//       activeRow: [],
//     };
//   }

//   componentDidMount() {
//     getRadTestList(this, this);
//   }
//   changeDateFormat = (date) => {
//     if (date != null) {
//       return moment(date).format(Options.datetimeFormat);
//     }
//   };
//   CloseModal(e) {
//     this.setState({
//       openModal: !this.state.openModal,
//     });
//   }
//   generateReport(row) {
//     algaehApiCall({
//       uri: "/report",
//       method: "GET",
//       module: "reports",
//       headers: {
//         Accept: "blob",
//       },
//       others: { responseType: "blob" },
//       data: {
//         report: {
//           reportName: "radiologyReport",
//           reportParams: [
//             {
//               name: "hims_f_rad_order_id",
//               value: row.hims_f_rad_order_id,
//             },
//           ],
//           outputFileType: "PDF",
//         },
//       },
//       onSuccess: (res) => {
//         const urlBlob = URL.createObjectURL(res.data);
//         const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Radiology Report`;
//         window.open(origin);
//         // window.document.title = "Radiology Report";
//       },
//     });
//   }
//   // getDocuments(e) {
//   //   newAlgaehApi({
//   //     uri: "/getRadiologyDoc",
//   //     module: "documentManagement",
//   //     method: "GET",
//   //     data: {
//   //       hims_f_rad_order_id: this.state.hims_f_rad_order_id,
//   //     },
//   //   })
//   //     .then((res) => {
//   //       if (res.data.success) {
//   //         let { data } = res.data;
//   //         this.setState({
//   //           attached_docs: data,
//   //           attached_files: [],
//   //           // saveEnable: $this.state.saveEnable,
//   //           // docChanged: false,
//   //         });
//   //       }
//   //     })
//   //     .catch((e) => {
//   //       // AlgaehLoader({ show: false });
//   //       swalMessage({
//   //         title: e.message,
//   //         type: "error",
//   //       });
//   //     });
//   // }
//   // saveDocument = (files = [], number, id) => {
//   //   if (this.state.hims_f_rad_order_id) {
//   //     const formData = new FormData();
//   //     formData.append(
//   //       "hims_f_rad_order_id",
//   //       number || this.state.hims_f_rad_order_id
//   //     );
//   //     formData.append("visit_id", id || this.state.visit_id);
//   //     if (files.length) {
//   //       files.forEach((file, index) => {
//   //         formData.append(`file_${index}`, file, file.name);
//   //       });
//   //     } else {
//   //       this.state.attached_files.forEach((file, index) => {
//   //         formData.append(`file_${index}`, file, file.name);
//   //       });
//   //     }
//   //     newAlgaehApi({
//   //       uri: "/saveRdiologyDoc",
//   //       data: formData,
//   //       extraHeaders: { "Content-Type": "multipart/form-data" },
//   //       method: "POST",
//   //       module: "documentManagement",
//   //     })
//   //       .then((value) => this.getDocuments(this))
//   //       .catch((e) => console.log(e));
//   //   } else {
//   //     swalMessage({
//   //       title: "Can't upload attachments for unsaved Receipt Entry",
//   //       type: "error",
//   //     });
//   //   }
//   // };
//   // downloadDoc(doc, isPreview) {
//   //   const fileUrl = `data:${doc.filetype};base64,${doc.document}`;
//   //   const link = document.createElement("a");
//   //   if (!isPreview) {
//   //     link.download = doc.filename;
//   //     link.href = fileUrl;
//   //     document.body.appendChild(link);
//   //     link.click();
//   //     document.body.removeChild(link);
//   //   } else {
//   //     fetch(fileUrl)
//   //       .then((res) => res.blob())
//   //       .then((fblob) => {
//   //         const newUrl = URL.createObjectURL(fblob);
//   //         window.open(newUrl);
//   //       });
//   //   }
//   // }

//   // deleteDoc = (doc) => {
//   //   const self = this;
//   //   confirm({
//   //     title: `Are you sure you want to delete this file?`,
//   //     content: `${doc.filename}`,
//   //     icon: "",
//   //     okText: "Yes",
//   //     okType: "danger",
//   //     cancelText: "No",
//   //     onOk() {
//   //       self.onDelete(doc);
//   //     },
//   //     onCancel() {
//   //       console.log("Cancel");
//   //     },
//   //   });
//   // };

//   // onDelete = (doc) => {
//   //   newAlgaehApi({
//   //     uri: "/deleteRadiologyDoc",
//   //     method: "DELETE",
//   //     module: "documentManagement",
//   //     data: { id: doc._id },
//   //   }).then((res) => {
//   //     if (res.data.success) {
//   //       this.setState((state) => {
//   //         const attached_docs = state.attached_docs.filter(
//   //           (item) => item._id !== doc._id
//   //         );
//   //         return { attached_docs };
//   //       });
//   //     }
//   //   });
//   // };
//   ShowCollectionModel(row, e) {
//     this.setState({
//       isOpen: !this.state.isOpen,
//       selected_patient: row,
//     });
//   }
//   CloseCollectionModel(e) {
//     this.setState({
//       isOpen: !this.state.isOpen,
//     });
//   }
//   onClose(e) {
//     this.setState({
//       openMrdModal: !this.state.openMrdModal,
//     });
//   }

//   render() {
//     let _Ordered = [];
//     let _Sheduled = [];

//     let _Under_Process = [];

//     let _Completed = [];

//     let _Validated = [];

//     let _Cancelled = [];
//     if (this.state.radtestlist !== undefined) {
//       _Ordered = _.filter(this.state.radtestlist, (f) => {
//         return f.status === "O";
//       });

//       _Sheduled = _.filter(this.state.radtestlist, (f) => {
//         return f.status === "S";
//       });

//       _Under_Process = _.filter(this.state.radtestlist, (f) => {
//         return f.status === "UP";
//       });

//       _Completed = _.filter(this.state.radtestlist, (f) => {
//         return f.status === "RC";
//       });

//       _Validated = _.filter(this.state.radtestlist, (f) => {
//         return f.status === "RA";
//       });

//       _Cancelled = _.filter(this.state.radtestlist, (f) => {
//         return f.status === "CN";
//       });
//     }

//     // let sampleCollection =
//     //   this.state.billdetails === null ? [{}] : this.state.billdetails;
//     return (
//       <React.Fragment>
//         {this.state.openModal ? (
//           <RadAttachDocument
//             openModal={this.state.openModal}
//             row={this.state.activeRow}
//             CloseModal={() => this.CloseModal()}
//           />
//         ) : null}
//         {/* <AlgaehModal
//           title="Attach Report"
//           visible={this.state.openUploadModal}
//           mask={true}
//           maskClosable={false}
//           onCancel={() => {
//             this.setState({
//               openUploadModal: false,
//               attached_files: [],
//               attached_docs: [],
//               hims_f_rad_order_id: null,
//               visit_id: null,
//             });
//           }}
//           footer={[
//             <div className="col-12">
//               <button
//                 onClick={this.saveDocument.bind(this)}
//                 className="btn btn-primary btn-sm"
//               >
//                 Attach Document
//               </button>
//               <button
//                 onClick={() => {
//                   this.setState({
//                     openUploadModal: false,
//                     attached_files: [],
//                     attached_docs: [],
//                   });
//                 }}
//                 className="btn btn-default btn-sm"
//               >
//                 Cancel
//               </button>
//             </div>,
//           ]}
//           className={`algaehNewModal radInvestigationAttachmentModal`}
//         >
//           <div className="portlet-body">
//             <div className="col-12">
//               <div className="row">
//                 <div className="col-3 investigationAttachmentDrag">
//                   <Dragger
//                     accept=".doc,.docx,application/msword,.jpg,.png,.pdf"
//                     name="attached_files"
//                     onRemove={(file) => {
//                       this.setState((state) => {
//                         const index = state.attached_files.indexOf(file);
//                         const newFileList = [...state.attached_files];
//                         newFileList.splice(index, 1);
//                         return {
//                           attached_files: newFileList,
//                           // saveEnable: state.dataExists && !newFileList.length,
//                         };
//                       });
//                     }}
//                     beforeUpload={(file) => {
//                       this.setState((state) => ({
//                         attached_files: [...state.attached_files, file],
//                         // saveEnable: false,
//                       }));
//                       return false;
//                     }}
//                     // disabled={this.state.dataExists && !this.state.editMode}
//                     fileList={this.state.attached_files}
//                   >
//                     <p className="upload-drag-icon">
//                       <i className="fas fa-file-upload"></i>
//                     </p>
//                     <p className="ant-upload-text">
//                       {this.state.attached_files
//                         ? `Click or Drag a file to replace the current file`
//                         : `Click or Drag a file to this area to upload`}
//                     </p>
//                   </Dragger>
//                 </div>
//                 <div className="col-3"></div>
//                 <div className="col-6">
//                   <div className="row">
//                     <div className="col-12">
//                       <ul className="investigationAttachmentList">
//                         {this.state.attached_docs.length ? (
//                           this.state.attached_docs.map((doc) => (
//                             <li>
//                               <b> {doc.filename} </b>
//                               <span>
//                                 <i
//                                   className="fas fa-download"
//                                   onClick={() => this.downloadDoc(doc)}
//                                 ></i>
//                                 <i
//                                   className="fas fa-eye"
//                                   onClick={() => this.downloadDoc(doc, true)}
//                                 ></i>
//                                 <i
//                                   className="fas fa-trash"
//                                   onClick={() => this.deleteDoc(doc)}
//                                 ></i>
//                               </span>
//                             </li>
//                           ))
//                         ) : (
//                           <div className="col-12 noAttachment" key={1}>
//                             <p>No Attachments Available</p>
//                           </div>
//                         )}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </AlgaehModal> */}
//         <div className="hptl-phase1-rad-work-list-form">
//           <div
//             className="row inner-top-search"
//             style={{ paddingBottom: "10px" }}
//           >
//             <AlgaehDateHandler
//               div={{ className: "col-2" }}
//               label={{ fieldName: "from_date" }}
//               textBox={{ className: "txt-fld", name: "from_date" }}
//               events={{
//                 onChange: datehandle.bind(this, this),
//               }}
//               value={this.state.from_date}
//             />

//             <AlgaehDateHandler
//               div={{ className: "col-2" }}
//               label={{ fieldName: "to_date" }}
//               textBox={{ className: "txt-fld", name: "to_date" }}
//               events={{
//                 onChange: datehandle.bind(this, this),
//               }}
//               value={this.state.to_date}
//             />
//             <div className="col" style={{ paddingTop: "19px" }}>
//               {" "}
//               <button
//                 className="btn btn-default btn-sm"
//                 style={{ marginRight: "10px" }}
//                 type="button"
//                 onClick={Refresh.bind(this, this)}
//               >
//                 Clear
//               </button>
//               <button
//                 className="btn btn-primary btn-sm"
//                 type="button"
//                 onClick={getRadTestList.bind(this, this)}
//               >
//                 Load{" "}
//               </button>
//             </div>
//           </div>

//           <div className="row  margin-bottom-15 topResultCard">
//             <div className="col-12">
//               {" "}
//               <div className="card-group">
//                 <div className="card">
//                   <div className="card-body">
//                     <h5 className="card-title">{_Ordered.length}</h5>
//                     <p className="card-text">
//                       <span className="badge badge-light">Ordered</span>
//                     </p>
//                   </div>
//                 </div>
//                 <div className="card">
//                   <div className="card-body">
//                     <h5 className="card-title">{_Sheduled.length}</h5>
//                     <p className="card-text">
//                       <span className="badge badge-secondary">Scheduled</span>
//                     </p>
//                   </div>
//                 </div>
//                 <div className="card">
//                   <div className="card-body">
//                     <h5 className="card-title">{_Under_Process.length}</h5>
//                     <p className="card-text">
//                       <span className="badge badge-warning">
//                         Process on going
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//                 <div className="card">
//                   <div className="card-body">
//                     <h5 className="card-title">{_Completed.length}</h5>{" "}
//                     <p className="card-text">
//                       <span className="badge badge-primary">Completed</span>
//                     </p>
//                   </div>
//                 </div>
//                 <div className="card">
//                   <div className="card-body">
//                     <h5 className="card-title">{_Cancelled.length}</h5>
//                     <p className="card-text">
//                       <span className="badge badge-danger">Cancelled</span>
//                     </p>
//                   </div>
//                 </div>
//                 <div className="card">
//                   <div className="card-body">
//                     <h5 className="card-title">{_Validated.length}</h5>
//                     <p className="card-text">
//                       <span className="badge badge-success">Validated</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="portlet portlet-bordered margin-bottom-15">
//                 <div className="portlet-title">
//                   <div className="caption">
//                     <h3 className="caption-subject">Radiology Work List</h3>
//                   </div>

//                   <div className="actions">
//                     {/* <span> Status: </span> */}
//                     {/* <ul className="ul-legend">
//                       {FORMAT_RAD_STATUS.map((data, index) => (
//                         <li key={index}>
//                           <span
//                             style={{
//                               backgroundColor: data.color
//                             }}
//                           />
//                           {data.name}
//                         </li>
//                       ))}
//                     </ul> */}
//                   </div>
//                 </div>
//                 <div className="portlet-body" id="RadWorkGridCntr">
//                   <AlgaehDataGrid
//                     id="Scheduled_list_grid"
//                     columns={[
//                       {
//                         fieldName: "actions",
//                         label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
//                         displayTemplate: (row) => {
//                           return (
//                             <>
//                               <Tooltip title="View MRD">
//                                 <i
//                                   className="fas fa-eye"
//                                   aria-hidden="true"
//                                   onClick={(e) => {
//                                     setGlobal({
//                                       mrd_patient: row.patient_id,
//                                       patient_code: row.patient_code,
//                                     });
//                                     this.setState({
//                                       openMrdModal: true,
//                                       visit_id: row.visit_id,
//                                       patient_id: row.patient_id,
//                                       patient_code: row.patient_code,
//                                     });
//                                   }}
//                                 />
//                               </Tooltip>
//                               <Tooltip title="Enter Result">
//                                 <i
//                                   style={{
//                                     pointerEvents:
//                                       row.status !== "O" ? "" : "none",
//                                     opacity: row.status !== "O" ? "" : "0.1",
//                                   }}
//                                   className="fas fa-file-signature"
//                                   onClick={
//                                     row.status !== "O"
//                                       ? openResultEntry.bind(this, this, row)
//                                       : null
//                                   }
//                                 />
//                               </Tooltip>
//                               <Tooltip title="Attach External Files">
//                                 <i
//                                   style={{
//                                     pointerEvents:
//                                       row.status !== "O" ? "" : "none",
//                                     opacity: row.status !== "O" ? "" : "0.1",
//                                   }}
//                                   className="fas fa-paperclip"
//                                   aria-hidden="true"
//                                   onClick={(e) => {
//                                     this.setState({
//                                       openModal: true,
//                                       activeRow: row,
//                                     });
//                                     // this.setState(
//                                     //   {
//                                     //     openUploadModal: true,
//                                     //     visit_id: row.visit_id,
//                                     //     hims_f_rad_order_id:
//                                     //       row.hims_f_rad_order_id,
//                                     //   },

//                                     //   () => {
//                                     //     this.getDocuments();
//                                     //   }
//                                     // );
//                                   }}
//                                 />
//                               </Tooltip>

//                               <Tooltip title="Print Result">
//                                 <i
//                                   style={{
//                                     pointerEvents:
//                                       row.status === "RA" ? "" : "none",
//                                     opacity: row.status === "RA" ? "" : "0.1",
//                                   }}
//                                   className="fas fa-print"
//                                   onClick={this.generateReport.bind(this, row)}
//                                 />
//                               </Tooltip>
//                             </>
//                           );
//                         },
//                         others: {
//                           fixed: "left",
//                           maxWidth: 170,
//                           resizable: false,
//                           filterable: false,
//                         },
//                       },
//                       {
//                         fieldName: "ordered_date",
//                         label: (
//                           <AlgaehLabel
//                             label={{ forceLabel: "Ordered Date & Time" }}
//                           />
//                         ),
//                         displayTemplate: (row) => {
//                           return (
//                             <span>
//                               {this.changeDateFormat(row.ordered_date)}
//                             </span>
//                           );
//                         },
//                         disabled: true,
//                         others: {
//                           maxWidth: 150,
//                           resizable: false,
//                           style: { textAlign: "center" },
//                         },
//                       },
//                       {
//                         fieldName: "scheduled_date_time",
//                         label: (
//                           <AlgaehLabel
//                             label={{ forceLabel: "Scheduled Date & Time" }}
//                           />
//                         ),
//                         displayTemplate: (row) => {
//                           return (
//                             <span>
//                               {this.changeDateFormat(row.scheduled_date_time)}
//                             </span>
//                           );
//                         },
//                         disabled: true,
//                         others: {
//                           maxWidth: 150,
//                           resizable: false,
//                           style: { textAlign: "center" },
//                         },
//                       },
//                       {
//                         fieldName: "test_type",
//                         label: (
//                           <AlgaehLabel label={{ fieldName: "proiorty" }} />
//                         ),
//                         displayTemplate: (row) => {
//                           return row.test_type === "S" ? (
//                             <span className="badge badge-danger">Stat</span>
//                           ) : (
//                             <span className="badge badge-secondary">
//                               Routine
//                             </span>
//                           );
//                         },
//                         disabled: true,
//                         others: {
//                           maxWidth: 90,
//                           resizable: false,
//                           style: { textAlign: "center" },
//                         },
//                       },
//                       {
//                         fieldName: "primary_id_no",
//                         label: (
//                           <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
//                         ),
//                         disabled: true,
//                         others: {
//                           maxWidth: 150,
//                           resizable: false,
//                           style: { textAlign: "center" },
//                         },
//                       },
//                       {
//                         fieldName: "patient_code",
//                         label: (
//                           <AlgaehLabel label={{ fieldName: "patient_code" }} />
//                         ),
//                         displayTemplate: (row) => {
//                           return (
//                             <span
//                             // className={row.status !== "O" ? "pat-code" : ""}
//                             >
//                               {row.patient_code}
//                             </span>
//                           );
//                         },
//                         // className: (drow) => {
//                         //   return drow.status !== "O" ? "greenCell" : null;
//                         // },
//                         disabled: false,
//                         others: {
//                           maxWidth: 150,
//                           resizable: false,
//                           style: { textAlign: "center" },
//                         },
//                       },
//                       {
//                         fieldName: "full_name",
//                         label: (
//                           <AlgaehLabel label={{ fieldName: "patient_name" }} />
//                         ),
//                         disabled: true,
//                         others: {
//                           resizable: false,
//                           style: { textAlign: "left" },
//                         },
//                       },
//                       {
//                         fieldName: "service_name",
//                         label: (
//                           <AlgaehLabel label={{ forceLabel: "Test Name" }} />
//                         ),

//                         disabled: true,
//                         others: {
//                           resizable: false,
//                           style: { textAlign: "center" },
//                         },
//                       },
//                       {
//                         fieldName: "status",
//                         label: (
//                           <AlgaehLabel label={{ fieldName: "test_status" }} />
//                         ),
//                         displayTemplate: (row) => {
//                           return row.status === "O" ? (
//                             <span className="badge badge-light">Ordered</span>
//                           ) : row.status === "S" ? (
//                             <span className="badge badge-secondary">
//                               Scheduled
//                             </span>
//                           ) : row.status === "UP" ? (
//                             <span className="badge badge-warning">
//                               Process On Going
//                             </span>
//                           ) : row.status === "CN" ? (
//                             <span className="badge badge-danger">
//                               Cancelled
//                             </span>
//                           ) : row.status === "RC" ? (
//                             <span className="badge badge-primary">
//                               Confirmed
//                             </span>
//                           ) : (
//                             <span className="badge badge-success">
//                               Validated
//                             </span>
//                           );
//                         },
//                         others: {
//                           maxWidth: 130,
//                           resizable: false,
//                           style: { textAlign: "center" },
//                         },
//                       },
//                     ]}
//                     // rowClassName={row => {
//                     //   return row.status === "S"
//                     //     ? "scheduledClass"
//                     //     : row.status === "CN"
//                     //     ? "cancelledClass"
//                     //     : row.status === "RC"
//                     //     ? "confirmedClass"
//                     //     : row.status === "RA"
//                     //     ? "availableClass"
//                     //     : row.status === "UP"
//                     //     ? "underProcessClass"
//                     //     : null;
//                     // }}
//                     keyId="patient_code"
//                     dataSource={{
//                       data:
//                         this.state.radtestlist === undefined
//                           ? []
//                           : this.state.radtestlist,
//                     }}
//                     noDataText="No data available for selected period"
//                     filter={true}
//                     paging={{ page: 0, rowsPerPage: 20 }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {this.state.patient_id ? (
//             <ModalMedicalRecord
//               visit_id={this.state.visit_id}
//               patient_id={this.state.patient_id}
//               patient_code={this.state.patient_code}
//               openMrdModal={this.state.openMrdModal}
//               onClose={(e) => this.onClose(e)}
//             />
//           ) : null}
//           <RadResultEntry
//             open={this.state.resultEntry}
//             onClose={closeResultEntry.bind(this, this)}
//             selectedPatient={this.state.selectedPatient}
//             user_id={this.state.user_id}
//           />
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     templatelist: state.templatelist,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getTemplateList: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(RadScheduledList)
// );
import React, { useState } from "react";

import ModalMedicalRecord from "../../DoctorsWorkbench/ModalForMedicalRecordPat";
import RadResultEntry from "../RadResultEntry/RadResultEntry";
import { setGlobal } from "../../../utils/GlobalFunctions";

import "./RadScheduledList.scss";
import "./../../../styles/site.scss";

// import { newAlgaehApi } from "../../../hooks";
import { swalMessage } from "../../../utils/algaehApiCall";
import { algaehApiCall } from "../../../utils/algaehApiCall";
// import { AlgaehModal } from "algaeh-react-components";

import moment from "moment";
import Options from "../../../Options.json";
import _ from "lodash";
import RadAttachDocument from "./RadAttachDocument";
import { useQuery } from "react-query";
import { Controller, useForm } from "react-hook-form";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehMessagePop,
  Tooltip,
  // AlgaehModal,
  // AlgaehFormGroup,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";

export default function RadScheduledList() {
  const [openModal, setOpenModal] = useState(false);
  const [activeRow, setActiveRow] = useState([]);
  const [openMrdModal, setOpenMrdModal] = useState(false);
  const [resultEntry, setResultEntry] = useState(false);
  const [patientData, setPatientData] = useState({});
  const [selectedPatient, setSelectedPatient] = useState({});
  // const [radtestlist, setRadtestlist] = useState([])
  const [user_id, setUser_id] = useState(null);
  // let month = moment().format("MM");
  // let year = moment().format("YYYY");

  const { control, errors, getValues, setValue } = useForm({
    defaultValues: {
      start_date: [moment(new Date()), moment(new Date())],
    },
  });
  const CloseModal = () => {
    setOpenModal(!openModal);
  };
  const closeResultEntry = () => {
    setResultEntry(!resultEntry);
    refecthRadList();

    // $this.setState(
    //   {
    //     resultEntry: !$this.state.resultEntry,
    //   },
    //   () => {
    //     getRadTestList($this);
    //   }
    // );
  };

  const openResultEntry = (row) => {
    
    if (row.billed === "Y") {
      algaehApiCall({
        uri: "/radiology/getRadTemplateList",
        module: "radiology",
        method: "GET",
        data: { services_id: row.service_id },
        onSuccess: (response) => {
          if (response.data.success === true) {
            let template = response.data.records;
            algaehApiCall({
              uri: "/radiology/getRadOrderedBy",
              module: "radiology",
              method: "GET",
              data: { hims_f_rad_order_id: row.hims_f_rad_order_id },
              onSuccess: (response) => {
                let Template = { ...row, ...response.data.records };
                Template.technician_id =
                  Template.technician_id === null
                    ? user_id
                    : Template.technician_id;

                row.exam_start_date_time = row.exam_start_date_time
                  ? new Date(row.exam_start_date_time)
                  : null;
                Template.Templatelist = template;
                setResultEntry(!resultEntry);
                setSelectedPatient(Template);
                // $this.setState({
                //   resultEntry: !$this.state.resultEntry,
                //   selectedPatient: Template,
                // });
              },
              onFailure: (error) => {
                swalMessage({
                  title: error.message,
                  type: "error",
                });
              },
            });
          }
        },
        onFailure: (error) => {
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
    } else {
      swalMessage({
        title: "Please make the payment.",
        type: "warning",
      });
    }
  };
  const Refresh = () => {
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    setValue("star_date", [
      moment("01" + month + year, "DDMMYYYY")._d,
      moment(new Date()),
    ]);
    setPatientData({});
    refecthRadList();
    // $this.setState(
    //   {
    //     from_date: moment("01" + month + year, "DDMMYYYY")._d,
    //     to_date: new Date(),
    //     patient_id: null,
    //     patient_code: null,
    //     status: null,
    //     proiorty: null,
    //   },
    //   () => {
    //     getRadTestList($this);
    //   }
    // );
  };
  const getRadTestList = async () => {
    let inputobj = {};

    if (getValues().start_date.length > 0) {
      inputobj.from_date = moment(getValues().start_date[0]).format(
        Options.dateFormatYear
      );
    }
    if (getValues().start_date.length > 1) {
      inputobj.to_date = moment(getValues().start_date[1]).format(
        Options.dateFormatYear
      );
    }

    // if (selectedPatient.patient_id !== null) {
    //   inputobj.patient_id = selectedPatient.patient_id;
    // }

    // if (status !== null) {
    //   inputobj.status = status;
    // }

    // if ($this.state.proiorty !== null) {
    //   inputobj.test_type = $this.state.proiorty;
    // }
    let result = await newAlgaehApi({
      uri: "/radiology/getRadOrderedServices",
      module: "radiology",
      method: "GET",
      data: inputobj,
    });
    return {
      data: result?.data?.records,

      user_id: result?.data.user_id,
    };
    // algaehApiCall({
    //   uri: "/radiology/getRadOrderedServices",
    //   module: "radiology",
    //   method: "GET",
    //   data: inputobj,

    //   onSuccess: (response) => {
    //     if (response.data.success === true) {
    //       setRadtestlist(response.data.records)
    //       setUser_id(response.data.user_id)
    //       // $this.setState({
    //       //   radtestlist: response.data.records,
    //       //   user_id: response.data.user_id,
    //       // });
    //     }
    //   },
    //   onFailure: (error) => {
    //     swalMessage({
    //       title: error.message,
    //       type: "error",
    //     });
    //   },
    // });

    // $this.props.getRadiologyTestList({
    //   uri: "/radiology/getRadOrderedServices",
    //   module: "radiology",
    //   method: "GET",
    //   data: inputobj,
    //   redux: {
    //     type: "RAD_LIST_GET_DATA",
    //     mappingName: "radtestlist"
    //   }
    // });
  };

  const { data: radtestlist, refetch: refecthRadList } = useQuery(
    "Rad-list",
    getRadTestList,
    {
      onSuccess: (data) => {
        setUser_id(data.user_id);
      },
      onFailure: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  // const generateReport = (row) => {
  //   algaehApiCall({
  //     uri: "/report",
  //     method: "GET",
  //     module: "reports",
  //     headers: {
  //       Accept: "blob",
  //     },
  //     others: { responseType: "blob" },
  //     data: {
  //       report: {
  //         reportName: "radiologyReport",
  //         reportParams: [
  //           {
  //             name: "hims_f_rad_order_id",
  //             value: row.hims_f_rad_order_id,
  //           },
  //         ],
  //         outputFileType: "PDF",
  //       },
  //     },
  //     onSuccess: (res) => {
  //       const urlBlob = URL.createObjectURL(res.data);
  //       const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Radiology Report`;
  //       window.open(origin);
  //       // window.document.title = "Radiology Report";
  //     },
  //   });
  // };
  const changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.datetimeFormat);
    }
  };
  let _Ordered;
  let _Sheduled;

  let _Under_Process;

  let _Completed;

  let _Validated;

  let _Cancelled;

  if (radtestlist?.data.length > 0) {
    _Ordered = _.filter(radtestlist.data, (f) => {
      return f.status === "O";
    }).length;

    _Sheduled = _.filter(radtestlist.data, (f) => {
      return f.status === "S";
    }).length;

    _Under_Process = _.filter(radtestlist.data, (f) => {
      return f.status === "UP";
    }).length;

    _Completed = _.filter(radtestlist.data, (f) => {
      return f.status === "RC";
    }).length;

    _Validated = _.filter(radtestlist.data, (f) => {
      return f.status === "RA";
    }).length;

    _Cancelled = _.filter(radtestlist.data, (f) => {
      return f.status === "CN";
    }).length;
  } else {
    
    console.log("radtestlist", radtestlist);
  }

  return (
    <React.Fragment>
      {openModal ? (
        <RadAttachDocument
          openModal={openModal}
          row={activeRow}
          uniqueId={activeRow.hims_f_rad_order_id}
          nameOfTheFolder="RadiologyDocuments"
          CloseModal={CloseModal}
        />
      ) : null}

      <div className="hptl-phase1-rad-work-list-form">
        <div className="row inner-top-search" style={{ paddingBottom: "10px" }}>
          {/* <AlgaehDateHandler
            div={{ className: "col-2" }}
            label={{ fieldName: "from_date" }}
            textBox={{ className: "txt-fld", name: "from_date" }}
            events={{
              onChange: datehandle.bind(this, this),
            }}
            value={this.state.from_date}
          />

          <AlgaehDateHandler
            div={{ className: "col-2" }}
            label={{ fieldName: "to_date" }}
            textBox={{ className: "txt-fld", name: "to_date" }}
            events={{
              onChange: datehandle.bind(this, this),
            }}
            value={this.state.to_date}
          /> */}
          <Controller
            control={control}
            name="start_date"
            rules={{
              required: {
                message: "Field is Required",
              },
            }}
            render={({ onChange, value }) => (
              <AlgaehDateHandler
                div={{ className: "col-3" }}
                label={{
                  forceLabel: "ORDERED DATE & TIME",
                  isImp: true,
                }}
                error={errors}
                textBox={{
                  className: "txt-fld",
                  name: "start_date",
                  value,
                }}
                type="range"
                // others={{ disabled }}
                events={{
                  onChange: (mdate) => {
                    if (mdate) {
                      onChange(mdate);
                    } else {
                      onChange(undefined);
                    }
                  },
                  onClear: () => {
                    onChange(undefined);
                  },
                }}
              />
            )}
          />
          <div className="col" style={{ paddingTop: "19px" }}>
            {" "}
            <button
              className="btn btn-default btn-sm"
              style={{ marginRight: "10px" }}
              type="button"
              onClick={Refresh}
            >
              Clear
            </button>
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={() => refecthRadList()}
            >
              Load{" "}
            </button>
          </div>
        </div>

        <div className="row  margin-bottom-15 topResultCard">
          <div className="col-12">
            {" "}
            <div className="card-group">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Ordered ? _Ordered : 0}</h5>
                  <p className="card-text">
                    <span className="badge badge-light">Ordered</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Sheduled ? _Sheduled : 0}</h5>
                  <p className="card-text">
                    <span className="badge badge-secondary">Scheduled</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {_Under_Process ? _Under_Process : 0}
                  </h5>
                  <p className="card-text">
                    <span className="badge badge-warning">
                      Process on going
                    </span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Completed ? _Completed : 0}</h5>{" "}
                  <p className="card-text">
                    <span className="badge badge-primary">Completed</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Cancelled ? _Cancelled : 0}</h5>
                  <p className="card-text">
                    <span className="badge badge-danger">Cancelled</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{_Validated ? _Validated : 0}</h5>
                  <p className="card-text">
                    <span className="badge badge-success">Validated</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Radiology Work List</h3>
                </div>

                <div className="actions">
                  {/* <span> Status: </span> */}
                  {/* <ul className="ul-legend">
                    {FORMAT_RAD_STATUS.map((data, index) => (
                      <li key={index}>
                        <span
                          style={{
                            backgroundColor: data.color
                          }}
                        />
                        {data.name}
                      </li>
                    ))}
                  </ul> */}
                </div>
              </div>
              <div className="portlet-body" id="RadWorkGridCntr">
                <AlgaehDataGrid
                  id="Scheduled_list_grid"
                  columns={[
                    {
                      fieldName: "actions",
                      label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                      displayTemplate: (row) => {
                        return (
                          <>
                            <Tooltip title="View MRD">
                              <i
                                className="fas fa-eye"
                                aria-hidden="true"
                                onClick={(e) => {
                                  setGlobal({
                                    mrd_patient: row.patient_id,
                                    patient_code: row.patient_code,
                                  });
                                  setPatientData({
                                    visit_id: row.visit_id,
                                    patient_id: row.patient_id,
                                    patient_code: row.patient_code,
                                  });
                                  setOpenMrdModal(true);
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Enter Result">
                              <i
                                style={{
                                  pointerEvents:
                                    row.status !== "O" ? "" : "none",
                                  opacity: row.status !== "O" ? "" : "0.1",
                                }}
                                className="fas fa-file-signature"
                                onClick={() => {
                                  if (row.status !== "O") {
                                    openResultEntry(row);
                                  }
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Attach External Files">
                              <i
                                style={{
                                  pointerEvents:
                                    row.status !== "O" ? "" : "none",
                                  opacity: row.status !== "O" ? "" : "0.1",
                                }}
                                className="fas fa-paperclip"
                                aria-hidden="true"
                                onClick={(e) => {
                                  setActiveRow(row);
                                  setOpenModal(true);
                                  // this.setState({
                                  //   openModal: true,
                                  //   activeRow: row,
                                  // });
                                  // this.setState(
                                  //   {
                                  //     openUploadModal: true,
                                  //     visit_id: row.visit_id,
                                  //     hims_f_rad_order_id:
                                  //       row.hims_f_rad_order_id,
                                  //   },

                                  //   () => {
                                  //     this.getDocuments();
                                  //   }
                                  // );
                                }}
                              />
                            </Tooltip>

                            {/* <Tooltip title="Print Result">
                              <i
                                style={{
                                  pointerEvents:
                                    row.status === "RA" ? "" : "none",
                                  opacity: row.status === "RA" ? "" : "0.1",
                                }}
                                className="fas fa-print"
                                onClick={() => generateReport(row)}
                              />
                            </Tooltip> */}
                          </>
                        );
                      },
                      others: {
                        fixed: "left",
                        maxWidth: 170,
                        resizable: false,
                        filterable: false,
                      },
                    },
                    {
                      fieldName: "ordered_date",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Ordered Date & Time" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>{changeDateFormat(row.ordered_date)}</span>
                        );
                      },
                      disabled: true,
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "scheduled_date_time",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Scheduled Date & Time" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {changeDateFormat(row.scheduled_date_time)}
                          </span>
                        );
                      },
                      disabled: true,
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "test_type",
                      label: <AlgaehLabel label={{ fieldName: "proiorty" }} />,
                      displayTemplate: (row) => {
                        return row.test_type === "S" ? (
                          <span className="badge badge-danger">Stat</span>
                        ) : (
                          <span className="badge badge-secondary">Routine</span>
                        );
                      },
                      disabled: true,
                      others: {
                        maxWidth: 90,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "primary_id_no",
                      label: (
                        <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
                      ),
                      disabled: true,
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "patient_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_code" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span
                          // className={row.status !== "O" ? "pat-code" : ""}
                          >
                            {row.patient_code}
                          </span>
                        );
                      },
                      // className: (drow) => {
                      //   return drow.status !== "O" ? "greenCell" : null;
                      // },
                      disabled: false,
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_name" }} />
                      ),
                      disabled: true,
                      others: {
                        resizable: false,
                        style: { textAlign: "left" },
                      },
                    },
                    {
                      fieldName: "service_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Test Name" }} />
                      ),

                      disabled: true,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "test_status" }} />
                      ),
                      displayTemplate: (row) => {
                        return row.status === "O" ? (
                          <span className="badge badge-light">Ordered</span>
                        ) : row.status === "S" ? (
                          <span className="badge badge-secondary">
                            Scheduled
                          </span>
                        ) : row.status === "UP" ? (
                          <span className="badge badge-warning">
                            Process On Going
                          </span>
                        ) : row.status === "CN" ? (
                          <span className="badge badge-danger">Cancelled</span>
                        ) : row.status === "RC" ? (
                          <span className="badge badge-primary">Confirmed</span>
                        ) : (
                          <span className="badge badge-success">Validated</span>
                        );
                      },
                      others: {
                        maxWidth: 130,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                  ]}
                  keyId="patient_code"
                  data={radtestlist?.data ?? []}
                  noDataText="No data available for selected period"
                  paging={{ page: 0, rowsPerPage: 20 }}
                  isFilterable={true}
                  pagination={true}
                />
              </div>
            </div>
          </div>
        </div>

        {openMrdModal ? (
          <ModalMedicalRecord
            visit_id={patientData.visit_id}
            patient_id={patientData.patient_id}
            patient_code={patientData.patient_code}
            openMrdModal={openMrdModal}
            onClose={(e) => setOpenMrdModal(!openMrdModal)}
          />
        ) : null}
        {resultEntry ? (
          <RadResultEntry
            open={resultEntry}
            onClose={closeResultEntry}
            selectedPatient={selectedPatient}
            user_id={user_id}
          />
        ) : null}
      </div>
    </React.Fragment>
  );
}
