import React, { useContext, useState } from "react";

// import Enumerable from "linq";
import swal from "sweetalert2";
import "./HassanNumber.scss";
import "./../../../styles/site.scss";
import {
  AlgaehDataGrid,
  // AlgaehModal,
  // AlgaehButton,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehMessagePop,
  MainContext,
  AlgaehFormGroup,
} from "algaeh-react-components";
import { useQuery, useMutation } from "react-query";
// import {
//   AlgaehDataGrid,
//   AlgaehLabel,
//   AlgaehDateHandler,
// } from "../../Wrapper/algaehWrapper";
import { newAlgaehApi } from "../../../hooks";
import { Controller, useForm } from "react-hook-form";
// import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
// import Options from "../../../Options.json";
// import ResultEntry from "../ResultEntry/ResultEntry";
// import MicrobiologyResultEntry from "../MicrobiologyResultEntry/MicrobiologyResultEntry";
// import _ from "lodash";
// import sockets from "../../../sockets";
// import { AlgaehMessagePop } from "algaeh-react-components";
// const { Dragger } = Upload;
// const { confirm } = Modal;

function HassanNumber() {
  const { userToken } = useContext(MainContext);
  console.log("userToken", userToken);

  const [hassanShow, setHassanShow] = useState("all");
  // const [avgMtdIncome, setAvgMtdIncome] = useState(null);
  // const [avgMtdExpense, setAvgMtdExpense] = useState(null);
  const {
    control,
    errors,
    // register,
    reset,
    // handleSubmit,
    // // setValue,
    getValues,
    // watch,
  } = useForm({
    defaultValues: {
      hospital_id: userToken.hims_d_hospital_id,
      start_date: [moment(new Date()), moment(new Date())],
    },
  });

  // async function getAccountHeads(key) {
  //   const result = await newAlgaehApi({
  //     uri: "/finance/getAccountHeads",
  //     module: "finance",
  //     data: { getAll: "Y" },
  //     method: "GET",
  //   });
  //   return result?.data?.result;
  // }

  const { data: labOrdersPCR, refetch } = useQuery(
    ["getLabOrderedServices", { hassanShow: hassanShow }],
    getLabOrderedServices,
    {
      onSuccess: (data) => {
        // debugger;
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getLabOrderedServices(key, { hassanShow }) {
    const date = getValues().start_date;
    const from_date = moment(date[0]).format("YYYY-MM-DD");
    const to_date = moment(date[1]).format("YYYY-MM-DD");

    const result = await newAlgaehApi({
      uri: "/laboratory/getLabOrderedServices",
      module: "laboratory",
      method: "GET",
      data: {
        from_date,
        to_date,
        // status: "V",
        hassanShow,
      },
    });
    return result?.data?.records;
  }

  const radioChangeEvent = (value) => {
    setHassanShow(value);
    refetch();
  };

  // useEffect(() => {
  //   if (accountsForDash?.length >= 4) {
  //     const expenseAccount = accountsForDash.filter((f) => f.root_id === 5);
  //     if (expenseAccount.length > 0) {
  //       const expense =
  //         parseFloat(
  //           expenseAccount[0].amount ? expenseAccount[0].amount : 0.0
  //         ) / parseInt(days);
  //       setAvgMtdExpense(expense);
  //     }
  //     const incomeAccount = accountsForDash.filter((f) => f.root_id === 4);
  //     if (incomeAccount.length) {
  //       const income =
  //         parseFloat(incomeAccount[0].amount ? incomeAccount[0].amount : 0.0) /
  //         parseInt(days);
  //       setAvgMtdIncome(income);
  //     }
  //   }
  // }, [days, accountsForDash]);
  // async function getOrganization(key) {
  //   const result = await newAlgaehApi({
  //     uri: "/organization/getOrganizationByUser",
  //     method: "GET",
  //   });
  //   return result?.data?.records;
  // }

  // const { data: organizations } = useQuery("getOrganization", getOrganization, {
  //   refetchOnWindowFocus: false,

  //   onSuccess: (data) => {},
  //   onError: (err) => {
  //     AlgaehMessagePop({
  //       display: err?.message,
  //       type: "error",
  //     });
  //   },
  // });

  async function update(input = {}) {
    const res = await newAlgaehApi({
      uri: "/laboratory/updateHassanNo",
      module: "laboratory",
      method: "PUT",
      data: input,
    });
    return res?.data?.records;
  }
  const [updateHassanNo] = useMutation(update, {
    onSuccess: (data) => {
      refetch();
      AlgaehMessagePop({
        type: "success",
        display: "HESN No Updated successfully",
      });
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });

  const isPCRRecords =
    labOrdersPCR?.length > 0 ? labOrdersPCR.filter((f) => f.isPCR === "Y") : [];
  return (
    <div className="hptl-phase1-result-entry-form">
      <div className="row inner-top-search" style={{ paddingBottom: "10px" }}>
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

                    refetch();
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

        <div className="col">
          <label>Filter By</label>
          <div className="customRadio">
            <label className="radio inline">
              <input
                type="radio"
                value="all"
                name="hassanShow"
                checked={hassanShow === "all" ? true : false}
                onChange={(e) => {
                  radioChangeEvent(e.target.value);
                }}
              />
              <span>All</span>
            </label>

            <label className="radio inline">
              <input
                type="radio"
                value="withhassan"
                checked={hassanShow === "withhassan" ? true : false}
                name="hassanShow"
                onChange={(e) => {
                  radioChangeEvent(e.target.value);
                }}
              />
              <span>with HESN No.</span>
            </label>
            <label className="radio inline">
              <input
                type="radio"
                value="withOuthassan"
                checked={hassanShow === "withOuthassan" ? true : false}
                name="hassanShow"
                onChange={(e) => {
                  radioChangeEvent(e.target.value);
                }}
              />
              <span>without HESN No.</span>
            </label>
          </div>
        </div>

        <div className="col" style={{ marginTop: "21px" }}>
          <button
            className="btn btn-default btn-sm"
            type="button"
            onClick={() => {
              reset({ start_date: [moment(new Date()), moment(new Date())] });
              radioChangeEvent("all");
            }}
          >
            Clear
          </button>
          {/* <button
            className="btn btn-primary btn-sm"
            style={{ marginLeft: "10px" }}
            type="button"
            // onClick={getSampleCollectionDetails.bind(this, this)}
          >
            Load
          </button> */}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">HESN PCR List</h3>
              </div>
            </div>

            <div className="portlet-body" id="resultListEntryCntr">
              <AlgaehDataGrid
                id="samplecollection_grid"
                columns={[
                  {
                    fieldName: "ordered_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "ordered_date" }} />
                    ),
                    // displayTemplate: (row) => {
                    //   return (
                    //     <span>{this.changeDateFormat(row.ordered_date)}</span>
                    //   );
                    // },
                    disabled: true,
                    sortable: true,
                    filterable: true,
                    others: {
                      maxWidth: 150,
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.ordered_date;
                    },
                  },

                  {
                    fieldName: "lab_id_number",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Lab ID Number" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      maxWidth: 130,
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.lab_id_number;
                    },
                  },
                  {
                    fieldName: "primary_id_no",
                    label: (
                      <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: false,
                    others: {
                      maxWidth: 150,
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.primary_id_no;
                    },
                  },
                  {
                    fieldName: "patient_code",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_code" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: false,
                    others: {
                      maxWidth: 150,
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.patient_code;
                    },
                  },
                  {
                    fieldName: "full_name",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_name" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      // resizable: false,
                      style: { textAlign: "left" },
                    },
                    editorTemplate: (row) => {
                      return row.full_name;
                    },
                  },

                  {
                    fieldName: "hassan_number",
                    label: <AlgaehLabel label={{ forceLabel: "HESN No." }} />,
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      // resizable: false,
                      style: { textAlign: "center" },
                      maxWidth: 150,
                    },
                    editorTemplate: (row) => {
                      return (
                        <AlgaehFormGroup
                          div={{ className: "col" }}
                          label={
                            {
                              // forceLabel: "BED NO.",
                              // isImp: true,
                            }
                          }
                          textBox={{
                            type: "text",
                            value: row.hassan_number,
                            className: "form-control",
                            name: "hassan_number",
                            updateInternally: true,
                            onChange: (e) => {
                              if (e.target.value) row["isDirty"] = true;
                              row.hassan_number = e.target.value;
                            },
                          }}
                        />
                      );
                    },
                  },
                  {
                    fieldName: "hesn_upload",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "File Updated in HESN" }}
                      />
                    ),
                    displayTemplate: (row) => {
                      return (
                        <span>{row.hesn_upload === "Y" ? "YES" : "NO"}</span>
                      );
                    },
                    editorTemplate: (row) => {
                      return (
                        <input
                          type="checkbox"
                          defaultChecked={
                            row.hesn_upload === "Y" ? true : false
                          }
                          onChange={(e) => {
                            const status = e.target.checked;
                            row["hesn_upload"] = status === true ? "Y" : "N";

                            // row.update();
                          }}
                        />
                      );
                    },
                    others: {
                      // minWidth: 130,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "haasan_updated_by_name",
                    label: <AlgaehLabel label={{ forceLabel: "Updated By" }} />,
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.haasan_updated_by_name;
                    },
                  },
                  {
                    fieldName: "hesn_upload_updated_date",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Updated Date" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.hesn_upload_updated_date;
                    },
                  },

                  {
                    fieldName: "hesn_upload_updated_by_name",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Uploaded By" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.hesn_upload_updated_by_name;
                    },
                  },
                  {
                    fieldName: "hassan_number_updated_date",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Updated Date" }} />
                    ),
                    sortable: true,
                    filterable: true,
                    disabled: true,
                    others: {
                      // resizable: false,
                      style: { textAlign: "center" },
                    },
                    editorTemplate: (row) => {
                      return row.hassan_number_updated_date;
                    },
                  },
                ]}
                keyId="patient_code"
                data={isPCRRecords ?? []}
                isEditable={"editOnly"}
                events={{
                  onSave: (row) => {
                    // if (row.hassan_number) {
                    swal({
                      title: "Are you sure?",
                      text: `Patient :  ${row.full_name} 
                     
                        HESN No: ${row.hassan_number ? row.hassan_number : ""}
                     
                        File Updated in HESN:  ${row.hesn_upload}
                        `,
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes",
                      confirmButtonColor: "#44b8bd",
                      cancelButtonColor: "#d33",
                      cancelButtonText: "No",
                    }).then((willProceed) => {
                      if (willProceed.value) {
                        updateHassanNo(row);
                        // } else {
                        //   AlgaehMessagePop({
                        //     type: "error",
                        //     display: "Please Enter HESN Number",
                        //   });
                        //   return;
                        // }
                      }
                    });
                  },
                }}
                isFilterable={true}
                pagination={true}
                noDataText="No data available for selected period"
                // paging={{ page: 0, rowsPerPage: 20 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HassanNumber;

// class HassanNumber extends Component {
//   constructor(props) {
//     super(props);
//     this.socket = sockets;
//     this.state = {
//       to_date: new Date(),
//       from_date: new Date(),
//       patient_code: null,
//       patient_name: null,
//       patient_id: null,
//       sample_collection: [],
//       selected_patient: null,
//       isOpen: false,
//       proiorty: null,
//       status: null,
//       isMicroOpen: false,
//       comments_data: [],
//       openUploadModal: false,
//       attached_files: [],
//       attached_docs: [],
//       saveEnable: true,
//       // currentRow: [],
//       lab_id_number: "",
//       investigation_test_id: null,
//       disableUploadButton: true,
//     };
//   }

//   changeDateFormat = (date) => {
//     if (date != null) {
//       return moment(date).format(Options.datetimeFormat);
//     }
//   };

//   changeTimeFormat = (date) => {
//     if (date != null) {
//       return moment(date).format(Options.timeFormat);
//     }
//   };

//   ShowCollectionModel(row, e) {
//     this.setState({
//       isOpen: !this.state.isOpen,
//       selected_patient: row,
//     });
//   }

//   componentDidMount() {
//     getSampleCollectionDetails(this, this);
//     this.socket.on("reload_result_entry", (specimenData) => {
//       const { collected_date } = specimenData;
//       const date = new Date(moment(collected_date).format("YYYY-MM-DD"));

//       const start = new Date(moment(this.state.from_date).format("YYYY-MM-DD"));
//       const end = new Date(moment(this.state.to_date).format("YYYY-MM-DD"));

//       if (date >= start && date <= end) {
//         getSampleCollectionDetails(this, this);
//       } else {
//         return;
//       }
//     });
//   }
//   downloadDoc(doc, isPreview) {
//     if (doc.fromPath === true) {
//       this.setState({ pdfLoading: true }, () => {
//         newAlgaehApi({
//           uri: "/getContractDoc",
//           module: "documentManagement",
//           method: "GET",
//           extraHeaders: {
//             Accept: "blon",
//           },
//           others: {
//             responseType: "blob",
//           },
//           data: {
//             contract_no: doc.contract_no,
//             filename: doc.filename,
//             download: true,
//           },
//         })
//           .then((resp) => {
//             const urlBlob = URL.createObjectURL(resp.data);
//             if (isPreview) {
//               window.open(urlBlob);
//             } else {
//               const link = document.createElement("a");
//               link.download = doc.filename;
//               link.href = urlBlob;
//               document.body.appendChild(link);
//               link.click();
//               document.body.removeChild(link);
//             }
//             this.setState({ pdfLoading: false });
//           })
//           .catch((error) => {
//             console.log(error);
//             this.setState({ pdfLoading: false });
//           });
//       });
//     } else {
//       const fileUrl = `data:${doc.filetype};base64,${doc.document}`;
//       const link = document.createElement("a");
//       if (!isPreview) {
//         link.download = doc.filename;
//         link.href = fileUrl;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       } else {
//         fetch(fileUrl)
//           .then((res) => res.blob())
//           .then((fblob) => {
//             const newUrl = URL.createObjectURL(fblob);
//             window.open(newUrl);
//           });
//       }
//     }
//   }
//   deleteDoc = (doc) => {
//     const self = this;
//     confirm({
//       title: `Are you sure you want to delete this file?`,
//       content: `${doc.filename}`,
//       icon: "",
//       okText: "Yes",
//       okType: "danger",
//       cancelText: "No",
//       onOk() {
//         self.onDelete(doc);
//       },
//       onCancel() {
//         console.log("Cancel");
//       },
//     });
//   };

//   onDelete = (doc) => {
//     newAlgaehApi({
//       uri: "/deleteContractDoc",
//       method: "DELETE",
//       module: "documentManagement",
//       data: { id: doc._id },
//     }).then((res) => {
//       if (res.data.success) {
//         this.setState((state) => {
//           const attached_docs = state.attached_docs.filter(
//             (item) => item._id !== doc._id
//           );
//           return { attached_docs };
//         });
//       }
//     });
//   };

//   render() {
//     let _Collected = [];

//     let _Confirmed = [];
//     let _Validated = [];

//     let _Cancelled = [];
//     if (this.state.sample_collection !== undefined) {
//       _Collected = _.filter(this.state.sample_collection, (f) => {
//         return f.status === "CL";
//       });

//       _Validated = _.filter(this.state.sample_collection, (f) => {
//         return f.status === "V";
//       });
//       _Confirmed = _.filter(this.state.sample_collection, (f) => {
//         return f.status === "CF";
//       });

//       _Cancelled = _.filter(this.state.sample_collection, (f) => {
//         return f.status === "CN";
//       });
//     }

//     return (
//       <React.Fragment>
//         <AlgaehModal
//           title="Attach Report"
//           visible={this.state.openUploadModal}
//           mask={true}
//           maskClosable={false}
//           onCancel={() => {
//             this.setState({
//               openUploadModal: false,
//               attached_files: [],
//               attached_docs: [],
//             });
//           }}
//           footer={[
//             <div className="col-12">
//               <button
//                 onClick={saveDocumentCheck.bind(this, this)}
//                 className="btn btn-primary btn-sm"
//                 // disabled={this.state.disableUploadButton}
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
//           className={`algaehNewModal investigationAttachmentModal`}
//         >
//           <div className="portlet-body">
//             <div className="col-12">
//               <div className="row">
//                 <div className="col-3 investigationAttachmentDrag">
//                   {" "}
//                   <Dragger
//                     accept=".doc,.docx,application/msword,.jpg,.png,.pdf"
//                     name="attached_files"
//                     onRemove={(file) => {
//                       this.setState((state) => {
//                         const index = state.attached_filess.indexOf(file);
//                         const newFileList = [...state.attached_files];
//                         newFileList.splice(index, 1);
//                         return {
//                           attached_files: newFileList,
//                           // saveEnable: state.dataExists && !newFileList.length,
//                         };
//                       });
//                     }}
//                     // disabled={this.state.disableUploadButton}
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
//                               </span>

//                               <span>
//                                 <i
//                                   className="fas fa-eye"
//                                   onClick={() => this.downloadDoc(doc, true)}
//                                 ></i>
//                               </span>
//                               <span>
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
//         </AlgaehModal>
//
//           <ResultEntry
//             open={this.state.isOpen}
//             onClose={closeResultEntry.bind(this, this)}
//             selectedPatient={this.state.selectedPatient}
//             comments_data={this.state.comments_data}
//           />

//           <MicrobiologyResultEntry
//             open={this.state.isMicroOpen}
//             onClose={closeMicroResultEntry.bind(this, this)}
//             selectedPatient={this.state.selectedPatient}
//           />
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     samplecollection: state.samplecollection,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getSampleCollection: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(ResultEntryList)
// );
