// import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";

// import "./SampleCollection.scss";
// import "./../../../styles/site.scss";

// import {
//   datehandle,
//   getTestDetails,
//   Refresh,
// } from "./SampleCollectionHandaler";

// import {
//   AlgaehDataGrid,
//   AlgaehLabel,
//   AlgaehDateHandler,
// } from "../../Wrapper/algaehWrapper";
// import { Tooltip } from "antd";

// import { AlgaehActions } from "../../../actions/algaehActions";
// import moment from "moment";
// import Options from "../../../Options.json";
// import SampleCollectionModal from "../SampleCollections/SampleCollections";
// import _ from "lodash";
// import sockets from "../../../sockets";
// class SampleCollection extends Component {
//   constructor(props) {
//     super(props);
//     this.socket = sockets;
//     this.state = {
//       to_date: new Date(),
//       // from_date: moment("01" + month + year, "DDMMYYYY")._d,
//       from_date: new Date(),
//       primary_id_no: null,
//       patient_code: null,
//       patient_name: null,
//       patient_id: null,
//       sample_collection: [],
//       selected_patient: null,
//       status: null,
//       isOpen: false,
//       proiorty: null,
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
//   CloseCollectionModel(e) {
//     this.setState(
//       {
//         isOpen: !this.state.isOpen,
//       },
//       () => {
//         getTestDetails(this, this);
//       }
//     );
//   }

//   componentDidMount() {
//     getTestDetails(this, this);
//     this.socket.on("reload_specimen_collection", (billData) => {
//       const { bill_date } = billData;
//       const date = new Date(moment(bill_date).format("YYYY-MM-DD"));
//       const start = new Date(moment(this.state.from_date).format("YYYY-MM-DD"));
//       const end = new Date(moment(this.state.to_date).format("YYYY-MM-DD"));

//       if (date >= start && date <= end) {
//         // if (window.location.pathname === "/RadOrderedList")
//         getTestDetails(this, this);
//       } else {
//         return;
//       }
//     });
//   }

//   render() {
//     let _Ordered = [];

//     let _Collected = [];

//     let _Confirmed = [];
//     let _Validated = [];
//     if (this.state.sample_collection !== undefined) {
//       _Ordered = _.filter(this.state.sample_collection, (f) => {
//         return f.status === "O";
//       });

//       _Collected = _.filter(this.state.sample_collection, (f) => {
//         return f.status === "CL";
//       });

//       _Validated = _.filter(this.state.sample_collection, (f) => {
//         return f.status === "V";
//       });
//       _Confirmed = _.filter(this.state.sample_collection, (f) => {
//         return f.status === "CF";
//       });

//       // _Cancelled = _.filter(this.state.sample_collection, f => {
//       //   return f.status === "CN";
//       // });
//     }

//     // let sampleCollection =
//     //   this.state.billdetails === null ? [{}] : this.state.billdetails;
//     return (
//       <React.Fragment>
//         <div className="hptl-phase1-speciman-collection-form">
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
//             />{" "}
//             <div className="col" style={{ marginTop: "21px" }}>
//               <button
//                 className="btn btn-default btn-sm"
//                 type="button"
//                 onClick={Refresh.bind(this, this)}
//               >
//                 Clear
//               </button>
//               <button
//                 className="btn btn-primary btn-sm"
//                 style={{ marginLeft: "10px" }}
//                 type="button"
//                 onClick={getTestDetails.bind(this, this)}
//               >
//                 Load
//               </button>
//             </div>
//             {/*<div className="col-2">
//               <div className="row">
//                 <AlagehFormGroup
//                   div={{ className: "col" }}
//                   label={{
//                     fieldName: "patient_code"
//                   }}
//                   textBox={{
//                     value: this.state.patient_code,
//                     className: "txt-fld",
//                     name: "patient_code",

//                     events: {
//                       onChange: texthandle.bind(this, this)
//                     },
//                     others: {
//                       disabled: true
//                     }
//                   }}
//                 />
//                 <div className="col form-group">
//                   <span
//                     className="fas fa-search fa-2x"
//                     style={{
//                       fontSize: " 1.2rem",
//                       marginTop: "6px",
//                       paddingBottom: "10px"
//                     }}
//                     onClick={PatientSearch.bind(this, this)}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="col-lg-6">
//               <div className="row">
//                 <AlagehAutoComplete
//                   div={{ className: "col" }}
//                   label={{
//                     fieldName: "proiorty",
//                     isImp: false
//                   }}
//                   selector={{
//                     name: "proiorty",
//                     className: "select-fld",
//                     value: this.state.proiorty,
//                     dataSource: {
//                       textField: "name",
//                       valueField: "value",
//                       data: FORMAT_PRIORITY
//                     },
//                     onChange: texthandle.bind(this, this),
//                     onClear: () => {
//                       this.setState(
//                         {
//                           proiorty: null
//                         },
//                         () => {
//                           getSampleCollectionDetails(this, this);
//                         }
//                       );
//                     }
//                   }}
//                 />
//                 <AlagehAutoComplete
//                   div={{ className: "col" }}
//                   label={{
//                     fieldName: "status",
//                     isImp: false
//                   }}
//                   selector={{
//                     name: "status",
//                     className: "select-fld",
//                     value: this.state.status,
//                     dataSource: {
//                       textField: "name",
//                       valueField: "value",
//                       data: FORMAT_TEST_STATUS
//                     },
//                     onChange: texthandle.bind(this, this),
//                     onClear: () => {
//                       this.setState(
//                         {
//                           status: null
//                         },
//                         () => {
//                           getSampleCollectionDetails(this, this);
//                         }
//                       );
//                     }
//                   }}
//                 />
//                 <AlagehAutoComplete
//                   div={{ className: "col" }}
//                   label={{
//                     fieldName: "location_id",
//                     isImp: false
//                   }}
//                   selector={{
//                     name: "location_id",
//                     className: "select-fld",
//                     value: this.state.location_id,
//                     dataSource: {
//                       textField: "name",
//                       valueField: "value",
//                       data: FORMAT_TEST_STATUS
//                     },
//                     onChange: texthandle.bind(this, this)
//                   }}
//                 />

//               </div>
//             </div> */}
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
//                     <h5 className="card-title">{_Collected.length}</h5>{" "}
//                     <p className="card-text">
//                       <span className="badge badge-secondary">Collected</span>
//                     </p>
//                   </div>
//                 </div>
//                 <div className="card">
//                   <div className="card-body">
//                     <h5 className="card-title">{_Confirmed.length}</h5>{" "}
//                     <p className="card-text">
//                       <span className="badge badge-primary">Confirmed</span>
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
//                     <h3 className="caption-subject">
//                       Specimen Collection List
//                     </h3>
//                   </div>
//                 </div>

//                 <div className="portlet-body" id="samplecollectionGrid_cntr">
//                   <AlgaehDataGrid
//                     id="samplecollection_grid"
//                     columns={[
//                       {
//                         fieldName: "action",
//                         label: <AlgaehLabel label={{ fieldName: "action" }} />,
//                         displayTemplate: (row) => {
//                           return (
//                             <Tooltip title="Collect Specimen">
//                               <span>
//                                 <i
//                                   className="fas fa-flask"
//                                   onClick={this.ShowCollectionModel.bind(
//                                     this,
//                                     row
//                                   )}
//                                 />
//                               </span>
//                             </Tooltip>
//                           );
//                         },
//                         others: {
//                           maxWidth: 70,
//                           resizable: false,
//                           filterable: false,
//                           style: { textAlign: "center" },
//                         },
//                       },
//                       {
//                         fieldName: "ordered_date",
//                         label: (
//                           <AlgaehLabel label={{ fieldName: "ordered_date" }} />
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
//                         fieldName: "number_of_tests",
//                         label: (
//                           <AlgaehLabel label={{ forceLabel: "No. of Tests" }} />
//                         ),
//                         others: {
//                           maxWidth: 90,
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
//                           maxWidth: 80,
//                           resizable: false,
//                           style: { textAlign: "center" },
//                         },
//                       },

//                       {
//                         fieldName: "primary_id_no",
//                         label: (
//                           <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
//                         ),
//                         disabled: false,
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
//                       // {
//                       //   fieldName: "visit_code",
//                       //   label: (
//                       //     <AlgaehLabel label={{ fieldName: "visit_code" }} />
//                       //   ),
//                       //   disabled: false,
//                       //   others: {
//                       //     maxWidth: 150,
//                       //     resizable: false,
//                       //     style: { textAlign: "center" }
//                       //   }
//                       // },
//                       // {
//                       //   fieldName: "status",
//                       //   label: <AlgaehLabel label={{ fieldName: "status" }} />,
//                       //   displayTemplate: (row) => {
//                       //     return row.status === "O" ? (
//                       //       <span className="badge badge-light">Ordered</span>
//                       //     ) : row.status === "CL" ? (
//                       //       <span className="badge badge-secondary">
//                       //         Collected
//                       //       </span>
//                       //     ) : row.status === "CN" ? (
//                       //       <span className="badge badge-danger">
//                       //         Cancelled
//                       //       </span>
//                       //     ) : row.status === "CF" ? (
//                       //       <span className="badge badge-primary">
//                       //         Confirmed
//                       //       </span>
//                       //     ) : (
//                       //       <span className="badge badge-success">
//                       //         Validated
//                       //       </span>
//                       //     );
//                       //   },
//                       //   disabled: true,
//                       //   others: {
//                       //     maxWidth: 90,
//                       //     resizable: false,
//                       //     style: { textAlign: "center" },
//                       //   },
//                       // },
//                     ]}
//                     keyId="patient_code"
//                     dataSource={{
//                       data: this.state.sample_collection,
//                     }}
//                     filter={true}
//                     noDataText="No data available for selected period"
//                     paging={{ page: 0, rowsPerPage: 20 }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* {this.state.isOpen ? ( */}
//           <SampleCollectionModal
//             HeaderCaption={
//               <AlgaehLabel
//                 label={{
//                   fieldName: "sample_collection",
//                   align: "ltr",
//                 }}
//               />
//             }
//             open={this.state.isOpen}
//             onClose={this.CloseCollectionModel.bind(this)}
//             selected_patient={this.state.selected_patient}
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
//   connect(mapStateToProps, mapDispatchToProps)(SampleCollection)
// );

import React, { useContext, useState, useEffect } from "react";
import Options from "../../../Options.json";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehMessagePop,
  MainContext,
  Tooltip,
  // AlgaehFormGroup,
} from "algaeh-react-components";
import "./SampleCollection.scss";
import SampleCollectionModal from "../SampleCollections/SampleCollections";
import "./../../../styles/site.scss";
import Enumerable from "linq";
import { useQuery } from "react-query";
import { newAlgaehApi } from "../../../hooks";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import sockets from "../../../sockets";
// import _ from "moment";
function SampleCollection() {
  const { userToken } = useContext(MainContext);
  const [currentPage, setCurrentPage] = useState(1);
  const { control, errors, reset, getValues } = useForm({
    defaultValues: {
      hospital_id: userToken.hims_d_hospital_id,
      start_date: [moment(new Date()), moment(new Date())],
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [sample_collection, setSample_collection] = useState([]);
  const [selected_patient, setSelected_patient] = useState([]);
  const ShowCollectionModel = (row, e) => {
    setIsOpen(!isOpen);
    setSelected_patient(row);
  };
  const CloseCollectionModel = (e) => {
    setIsOpen(!isOpen);
    setSelected_patient([]);
    refetch();
  };
  useEffect(() => {
    sockets.on("reload_specimen_collection", (billData) => {
      const { bill_date } = billData;
      const date = new Date(moment(bill_date).format("YYYY-MM-DD"));
      const start = new Date(
        moment(getValues().from_date).format("YYYY-MM-DD")
      );
      const end = new Date(moment(getValues().to_date).format("YYYY-MM-DD"));

      if (date >= start && date <= end) {
        // if (window.location.pathname === "/RadOrderedList")
        refetch();
      } else {
        return;
      }
    });
  }, []);
  const { refetch } = useQuery(
    ["getLabOrderedServices", {}],
    getLabOrderedServices,
    {
      // initialStale: true,
      // cacheTime: Infinity,
      // enabled: enabledHESN,
      onSuccess: (data) => {
        // setEnabledHESN(false);
        let sampleCollection = Enumerable.from(data)
          .groupBy("$.visit_id", null, (k, g) => {
            let firstRecordSet = Enumerable.from(g).firstOrDefault();
            return {
              patient_id: firstRecordSet.patient_id,
              visit_id: firstRecordSet.visit_id,
              primary_id_no: firstRecordSet.primary_id_no,
              patient_code: firstRecordSet.patient_code,
              full_name: firstRecordSet.full_name,
              ordered_date: firstRecordSet.ordered_date,
              number_of_tests: g.getSource().length,
              status: firstRecordSet.status,
              test_type: firstRecordSet.test_type,
              // doctor_name: firstRecordSet.doctor_name,
            };
          })
          .toArray();
        setSample_collection(sampleCollection);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getLabOrderedServices(key) {
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
      },
    });
    return result?.data?.records;
  }
  // const texthandle = ($this, e) => {
  //   let name = e.name || e.target.name;
  //   let value = e.value || e.target.value;

  //   $this.setState(
  //     {
  //       [name]: value,
  //     },
  //     () => {
  //       getTestDetails($this);
  //     }
  //   );
  //   if ((name = "location_id")) {
  //     //TODO chnge based on location --Added by nowshad
  //     // setLocaion(value.LabLocation);
  //   }
  // };

  // const PatientSearch = ($this, e) => {
  //   AlgaehSearch({
  //     searchGrid: {
  //       columns: spotlightSearch.frontDesk.patients,
  //     },
  //     searchName: "patients",
  //     uri: "/gloabelSearch/get",
  //     onContainsChange: (text, serchBy, callBack) => {
  //       callBack(text);
  //     },
  //     onRowSelect: (row) => {
  //       $this.setState(
  //         {
  //           patient_code: row.patient_code,
  //           patient_id: row.hims_d_patient_id,
  //         },
  //         () => {
  //           getTestDetails($this);
  //         }
  //       );
  //     },
  //   });
  // };

  // const datehandle = ($this, ctrl, e) => {
  //   let intFailure = false;
  //   if (e === "from_date") {
  //     if (Date.parse($this.state.to_date) < Date.parse(moment(ctrl)._d)) {
  //       intFailure = true;
  //       swalMessage({
  //         title: "From Date cannot be grater than To Date.",
  //         type: "warning",
  //       });
  //     }
  //   } else if (e === "to_date") {
  //     if (Date.parse(moment(ctrl)._d) < Date.parse($this.state.from_date)) {
  //       intFailure = true;
  //       swalMessage({
  //         title: "To Date cannot be less than From Date.",
  //         type: "warning",
  //       });
  //     }
  //   }

  //   if (intFailure === false) {
  //     $this.setState(
  //       {
  //         [e]: moment(ctrl)._d,
  //       },
  //       () => {
  //         getTestDetails($this);
  //       }
  //     );
  //   }
  // };

  // let _Ordered = [];

  // let _Collected = [];

  // let _Confirmed = [];
  // let _Validated = [];
  // if (sample_collection?.length > 0 && sample_collection !== undefined) {
  //   _Ordered = sample_collection.filter((f) => {
  //     return f.status === "O";
  //   });

  //   _Collected = sample_collection.filter((f) => {
  //     return f.status === "CL";
  //   });

  //   _Validated = sample_collection.filter((f) => {
  //     return f.status === "V";
  //   });
  //   _Confirmed = sample_collection.filter((f) => {
  //     return f.status === "CF";
  //   });

  //   _Cancelled = _.filter(this.state.sample_collection, f => {
  //     return f.status === "CN";
  //   });
  // }
  const changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.datetimeFormat);
    }
  };
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

        <div className="col-2" style={{ marginTop: "21px" }}>
          <button
            className="btn btn-default btn-sm"
            type="button"
            onClick={() => {
              reset({ start_date: [moment(new Date()), moment(new Date())] });
            }}
          >
            Clear
          </button>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginLeft: "10px" }}
            type="button"
            onClick={() => {
              // setEnabledHESN(true)
              refetch();
            }}
          >
            Load
          </button>
        </div>
        {/* <div className="col topResultCard" style={{ marginTop: 10 }}>
          <div className="card-group">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{_Ordered.length}</h5>
                <p className="card-text">
                  <span className="badge badge-light">Ordered</span>
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{_Collected.length}</h5>{" "}
                <p className="card-text">
                  <span className="badge badge-secondary">Collected</span>
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{_Confirmed.length}</h5>{" "}
                <p className="card-text">
                  <span className="badge badge-primary">Confirmed</span>
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{_Validated.length}</h5>
                <p className="card-text">
                  <span className="badge badge-success">Validated</span>
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* <div className="row  margin-bottom-15 topResultCard">
       
      </div> */}
      <div className="row">
        <div className="col-lg-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Specimen Collection List</h3>
              </div>
            </div>
            <div className="portlet-body" id="samplecollectionListGrid">
              <AlgaehDataGrid
                columns={[
                  {
                    fieldName: "action",
                    label: <AlgaehLabel label={{ fieldName: "action" }} />,
                    displayTemplate: (row) => {
                      return (
                        <Tooltip title="View Ordered Test" placement={"right"}>
                          <span className="tooltopBagde">
                            <i
                              className="fas fa-eye"
                              onClick={() => ShowCollectionModel(row)}
                            />
                            <small>{row.number_of_tests}</small>
                          </span>
                        </Tooltip>
                      );
                    },
                    others: {
                      width: 50,
                      resizable: false,
                      filterable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "ordered_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "ordered_date" }} />
                    ),
                    displayTemplate: (row) => {
                      return <span>{changeDateFormat(row.ordered_date)}</span>;
                    },
                    disabled: true,
                    others: {
                      width: 180,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                    sortable: true,
                    filterable: true,
                    filterType: "date",
                    // choices: [
                    //   {
                    //     name: "Stat",
                    //     value: "S",
                    //   },
                    //   {
                    //     name: "Routine",
                    //     value: "R",
                    //   },
                    // ],
                  },
                  // {
                  //   fieldName: "number_of_tests",
                  //   label: (
                  //     <AlgaehLabel label={{ forceLabel: "Tests Count" }} />
                  //   ),
                  //   filterable: true,
                  //   others: {
                  //     width: 110,
                  //     resizable: false,
                  //     style: { textAlign: "center" },
                  //   },
                  // },
                  {
                    fieldName: "test_type",
                    label: <AlgaehLabel label={{ fieldName: "priority" }} />,
                    displayTemplate: (row) => {
                      return row.test_type === "S" ? (
                        <span className="badge badge-danger">Stat</span>
                      ) : (
                        <span className="badge badge-secondary">Routine</span>
                      );
                    },
                    disabled: true,
                    others: {
                      width: 100,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
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
                  },
                  {
                    fieldName: "status",
                    label: <AlgaehLabel label={{ fieldName: "status" }} />,
                    displayTemplate: (row) => {
                      return row.status === "O" ? (
                        <span className="badge badge-light">Ordered</span>
                      ) : row.status === "CL" ? (
                        <span className="badge badge-secondary">Collected</span>
                      ) : row.status === "CN" ? (
                        <span className="badge badge-danger">Cancelled</span>
                      ) : row.status === "CF" ? (
                        <span className="badge badge-primary">Confirmed</span>
                      ) : (
                        <span className="badge badge-success">Validated</span>
                      );
                    },
                    disabled: true,
                    others: {
                      width: 100,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                    filterable: true,
                    filterType: "choices",
                    choices: [
                      {
                        name: "Ordered",
                        value: "O",
                      },
                      {
                        name: "Collected",
                        value: "CL",
                      },
                      {
                        name: "Confirmed",
                        value: "CF",
                      },
                      {
                        name: "Validated",
                        value: "V",
                      },
                      {
                        name: "Cancelled",
                        value: "CN",
                      },
                    ],
                  },

                  {
                    fieldName: "primary_id_no",
                    label: (
                      <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
                    ),
                    disabled: false,
                    filterable: true,
                    sortable: true,
                    others: {
                      width: 120,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "patient_code",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_code" }} />
                    ),
                    disabled: false,
                    filterable: true,
                    sortable: true,
                    others: {
                      width: 120,
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
                    filterable: true,
                    sortable: true,
                    others: {
                      resizable: false,
                      style: { textAlign: "left" },
                    },
                  },
                  // {
                  //   fieldName: "visit_code",
                  //   label: (
                  //     <AlgaehLabel label={{ fieldName: "visit_code" }} />
                  //   ),
                  //   disabled: false,
                  //   others: {
                  //     maxWidth: 150,
                  //     resizable: false,
                  //     style: { textAlign: "center" }
                  //   }
                  // },
                ]}
                keyId="patient_code"
                data={sample_collection}
                // filter={true}
                pagination={true}
                pageOptions={{ rows: 50, page: currentPage }}
                pageEvent={(page) => {
                  setCurrentPage(page);
                }}
                isFilterable={true}
                noDataText="No data available for selected period"
                // paging={{ page: 0, rowsPerPage: 100 }}
              />
            </div>
          </div>
        </div>
      </div>
      {isOpen ? (
        <SampleCollectionModal
          HeaderCaption={
            <AlgaehLabel
              label={{
                fieldName: "sample_collection",
                align: "ltr",
              }}
            />
          }
          isOpen={isOpen}
          onClose={CloseCollectionModel}
          selected_patient={selected_patient}
        />
      ) : null}
    </div>
  );
}

export default SampleCollection;
