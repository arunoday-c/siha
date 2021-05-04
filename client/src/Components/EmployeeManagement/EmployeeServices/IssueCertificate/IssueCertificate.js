import React, { useState, useContext, useEffect } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import "./IssueCertificate.scss";
// import {
//   AlgaehLabel,
//   AlagehAutoComplete,
//   // AlgaehDataGrid,
// } from "../../../Wrapper/algaehWrapper";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
// import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
// import { MainContext } from "algaeh-react-components";
import AlgaehSearch from "../../../Wrapper/globalSearch";
// import { AlgaehButton } from "algaeh-react-components";
import {
  AlgaehDataGrid,
  MainContext,
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehMessagePop,
  Spin,
  Tooltip,
} from "algaeh-react-components";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "react-query";
import { newAlgaehApi } from "../../../../hooks";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

export default function IssueCertificate() {
  const { userToken } = useContext(MainContext);
  const [employee_data, setEmployee_data] = useState({
    employee_name: "",
    hims_d_employee_id: null,
    employee_code: "",
  });
  const [hospitals, setHospitals] = useState([]);
  const [certificate_data, setCertificateData] = useState({});
  const [loadingData, setLoadingData] = useState(false);

  const baseValue = {
    hospital_id: -1,
    certificate_type: "",
  };
  const { errors, control, handleSubmit, setValue, reset, getValues } = useForm(
    {
      defaultValues: baseValue,
    }
  );
  useEffect(() => {
    setValue("hospital_id", userToken.hims_d_hospital_id);
    return clearState();
  }, []);

  // const [addPromo, { isLoading: addLoading }] = useMutation(addPromotion, {
  //   onSuccess: (data) => {
  //     reset(baseValue);
  //     refetch();
  //   },
  // });
  const { data: allIssuedCertificates, refetch } = useQuery(
    "getAllIssuedCertificates",
    getAllIssuedCertificates,
    {
      onSuccess: (data) => {},
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );

  const { data: dropdownData, loading } = useQuery(
    ["dropdown-data"],
    getDropDownData,
    {
      initialData: {
        certificate_types: [],
        organizations: [],
      },
      // enabled: true,
      initialStale: true,
      cacheTime: Infinity,
      onSuccess: (data) => {
        data["organizations"].unshift({
          hims_d_hospital_id: -1,
          hospital_name: "All",
        });
        setHospitals(data["organizations"]);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getDropDownData() {
    const result = await Promise.all([
      newAlgaehApi({
        uri: "/hrsettings/getCertificateMaster",
        method: "GET",
        module: "hrManagement",
      }),
      newAlgaehApi({
        uri: "/organization/getOrganizationByUser",
        method: "GET",
      }),
    ]);

    return {
      certificate_types: result[0]?.data?.records,
      organizations: result[1]?.data.records,
    };
  }
  async function getAllIssuedCertificates() {
    const result = await newAlgaehApi({
      uri: "/employee/getRequestCertificate",
      method: "GET",
      module: "hrManagement",
    });
    return result?.data?.records;
  }
  const generateCertificate = (data) => {
    setLoadingData(true);
    algaehApiCall({
      uri: "/getDocsReports",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        kpi_parameter: " where hims_d_employee_id = " + data.employee_id,
        hims_d_certificate_master_id: data.certificate_id,
        rowData: data,
      },
      onSuccess: (response) => {
        setLoadingData(false);
        // setRow();
        AlgaehMessagePop({
          display:
            "Certificate Generate Successfully Please Click the Request Code",
          type: "success",
        });
        setEmployee_data({
          employee_name: "",
          hims_d_employee_id: null,
          employee_code: "",
        });
        reset({ hospital_id: -1, certificate_type: "" });
        refetch();
      },
      onCatch: (error) => {
        setLoadingData(false);

        AlgaehMessagePop({
          display: error.message,
          type: "error",
        });
      },

      // const files = res.data;
      // const formData = new FormData();
      // formData.append("nameOfTheFolder", "EmployeeCertificate");
      // files.forEach((file, index) => {
      //   formData.append(`file_${index}`, file, file.name);
      // });
      // formData.append("fileName", "EmployeeCertificate");

      // newAlgaehApi({
      //   uri: "/uploadDocumentCommon",
      //   data: formData,
      //   extraHeaders: { "Content-Type": "multipart/form-data" },
      //   method: "POST",
      //   module: "documentManagement",
      // })
      //   .then((res) => {
      //     // addDiagramFromMaster(contract_id, res.data.records);
      //     AlgaehMessagePop({
      //       type: "success",
      //       display: "Request Added successfully",
      //     });
      //     // return;
      //     // getDocuments(contract_no);
      //   })
      //   .catch((e) =>
      //     AlgaehMessagePop({
      //       type: "error",
      //       display: e.message,
      //     })
      //   );
    });
    // return;

    // this.setState({ loading: true }, () => {
    // newAlgaehApi({
    //   uri: "/reports",
    //   method: "GET",
    //   module: "reports",
    //   headers: {
    //     Accept: "blob",
    //   },
    //   others: { responseType: "blob" },
    //   data: {
    //     reportName: reportName,
    //     pageSize: "A4",
    //     pageOrentation: "portrait",
    //     reportParams: [
    //       {
    //         name: "hims_d_employee_id",
    //         value: employee_data.hims_d_employee_id,
    //       },
    //       {
    //         name: "certificate_type",
    //         value: getValues().certificate_type,
    //       },
    //     ],
    //     outputFileType: "PDF",
    //     // parameters: { hims_d_employee_id: this.state.hims_d_employee_id },
    //     // _id: this.state.certificate_type,
    //   }).then((response) => {
    //     this.saveToIssueCertificateList();
    //     const urlBlob = URL.createObjectURL(response.data);
    //     const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
    //     window.open(origin);
    //   }).catch((error)=>{
    //     swalMessage({
    //       title: error.message,
    //       type: "error",
    //     })
    //   })

    // });
    // });
  };

  const onSubmit = (data) => {
    generateCertificate({
      ...data,
      employee_id: employee_data.hims_d_employee_id,
      certificate_id: certificate_data.hims_d_certificate_master_id,
      employee_code: employee_data.employee_code,
    });
  };
  const clearState = () => {
    reset(baseValue);
    setEmployee_data({
      employee_name: "",
      hims_d_employee_id: null,
      employee_code: "",
    });
    // setRow({});
  };

  const employeeSearch = () => {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee,
      },
      searchName: "employee_branch_wise",
      uri: "/gloabelSearch/get",
      inputs:
        parseInt(getValues().hospital_id) === -1 || undefined
          ? null
          : "hospital_id = " + getValues().hospital_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        debugger;
        setEmployee_data({
          employee_name: row.full_name,
          hims_d_employee_id: row.hims_d_employee_id,
          employee_code: row.employee_code,
        });
        // setDisabled(false);
        // this.setState({
        //   employee_name: row.full_name,
        //   hims_d_employee_id: row.hims_d_employee_id,
        //   disabled: false,
        // });
      },
    });
  };

  const { certificate_types } = dropdownData;
  return (
    <React.Fragment>
      <Spin spinning={loadingData}>
        <div className="row apply_leave">
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Issue Certificate Direct</h3>
                </div>
              </div>
              <div className="portlet-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <Controller
                      name="hospital_id"
                      control={control}
                      rules={{ required: "Select Branch" }}
                      render={({ value, onChange }) => (
                        <AlgaehAutoComplete
                          div={{ className: "col-12 form-group mandatory" }}
                          label={{
                            forceLabel: "Select Branch",
                            isImp: true,
                          }}
                          error={errors}
                          selector={{
                            className: "form-control",
                            name: "hospital_id",
                            value,
                            onChange: (_, selected) => {
                              onChange(selected);

                              // setValue("service_amount", _.standard_fee);
                            },

                            dataSource: {
                              textField: "hospital_name",
                              valueField: "hims_d_hospital_id",
                              data: hospitals,
                            },
                            // others: {
                            //   disabled:
                            //     current.request_status === "APR" &&
                            //     current.work_status === "COM",
                            //   tabIndex: "4",
                            // },
                          }}
                        />
                      )}
                    />{" "}
                    <div className="col-12 globalSearchCntr form-group mandatory">
                      <AlgaehLabel label={{ fieldName: "searchEmployee" }} />
                      <h6 onClick={employeeSearch}>
                        {employee_data.employee_name
                          ? employee_data.employee_name
                          : "Search Employee"}
                        <i className="fas fa-search fa-lg" />
                      </h6>
                    </div>
                    {/* <AlagehAutoComplete
                        div={{ className: "col-12 form-group  mandatory" }}
                        label={{
                          forceLabel: "Select Branch",
                          isImp: true,
                        }}
                        selector={{
                          name: "hospital_id",
                          className: "select-fld",
                          value: this.state.hospital_id,
                          dataSource: {
                            textField: "hospital_name",
                            valueField: "hims_d_hospital_id",
                            data: this.props.organizations,
                          },
                          onChange: this.onChangeHandler.bind(this),
                          onClear: () => {
                            this.setState({
                              hospital_id: null,
                            });
                          },
                        }}
                      /> */}
                    <Controller
                      name="certificate_type"
                      control={control}
                      rules={{ required: "Select Certificate Type" }}
                      render={({ value, onChange }) => (
                        <AlgaehAutoComplete
                          div={{ className: "col-12 form-group mandatory" }}
                          label={{
                            forceLabel: "Select Certificate",
                            isImp: true,
                          }}
                          error={errors}
                          selector={{
                            className: "form-control",
                            name: "certificate_type",
                            value,
                            onChange: (_, selected) => {
                              onChange(selected);
                              setCertificateData(_);
                            },

                            dataSource: {
                              valueField: "hims_d_certificate_master_id",
                              textField: "certificate_name",
                              data: certificate_types,
                            },
                          }}
                        />
                      )}
                    />
                    {/* <AlagehAutoComplete
                        div={{ className: "col-12 form-group mandatory" }}
                        label={{
                          forceLabel: "Select Certificate Type",
                          isImp: true,
                        }}
                        selector={{
                          name: "certificate_type",
                          className: "select-fld",
                          value: this.state.certificate_type,
                          dataSource: {
                            valueField: "_id",
                            textField: "kpi_name",
                            data: this.state.certificate_types,
                          },
                          onChange: this.onChangeHandler.bind(this),
                          onClear: () => {
                            this.setState({
                              certificate_type: null,
                              kpi_parameters: [],
                            });
                          },
                        }}
                      /> */}
                    <div className="col-12" style={{ textAlign: "right" }}>
                      <button
                        onClick={clearState}
                        type="button"
                        className="btn btn-default"
                        style={{ marginRight: 15 }}
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        loading={loading}
                        className="btn btn-primary"
                        // disabled={disabled}
                      >
                        Generate Certificate
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Issue Certificate on request
                  </h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" style={{ minHeight: "55vh" }}>
                    <AlgaehDataGrid
                      id="employeeFormTemplate"
                      columns={[
                        {
                          fieldName: "Action",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Action" }} />
                          ),
                          others: {
                            width: 50,
                          },
                          displayTemplate: (row) => {
                            if (row.certification_number) {
                              return null;
                            } else {
                              return (
                                <>
                                  {" "}
                                  <Tooltip
                                    placement="right"
                                    title={"Generate Certificate"}
                                  >
                                    <span
                                      onClick={() => {
                                        generateCertificate(row);
                                      }}
                                    >
                                      <i className="fas fa-check"></i>
                                    </span>
                                  </Tooltip>
                                </>
                              );
                            }
                          },
                          filterable: true,
                        },
                        {
                          fieldName: "certification_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Certificate No." }}
                            />
                          ),
                          displayTemplate: (row) => {
                            const certificateType = certificate_types.filter(
                              (f) =>
                                f.hims_d_certificate_master_id ===
                                row.certificate_id
                            )[0]?.certificate_name;
                            return (
                              <Tooltip
                                placement="right"
                                title={"download Certificate"}
                              >
                                <span>
                                  <a
                                    href={`${window.location.protocol}//${
                                      window.location.hostname
                                    }${
                                      window.location.port === ""
                                        ? "/docserver"
                                        : `:3006`
                                    }/UPLOAD/${certificateType}/${
                                      row.certification_number
                                    }.pdf`}
                                    download
                                    target="_blank"
                                  >
                                    {row.certification_number}
                                  </a>
                                </span>
                              </Tooltip>
                            );
                          },
                          others: {
                            maxWidth: 150,
                          },
                          filterable: true,
                        },
                        {
                          fieldName: "employee_code",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Emp. ID" }} />
                          ),
                          others: {
                            maxWidth: 150,
                          },
                          filterable: true,
                        },
                        {
                          fieldName: "full_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          ),
                          filterable: true,
                          others: {
                            style: {
                              textAlign: "left",
                            },
                          },
                        },
                        {
                          fieldName: "cer_req_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Requested Date" }}
                            />
                          ),
                          filterable: true,
                          displayTemplate: (row) => (
                            <span>
                              {moment(row.cer_req_date, "YYYYMMDD").format(
                                "DD-MM-YYYY"
                              )}
                            </span>
                          ),
                          others: {
                            width: 100,
                          },
                        },
                        {
                          fieldName: "certificate_id",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Certificate Type" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return certificate_types.filter(
                              (f) =>
                                f.hims_d_certificate_master_id ===
                                row.certificate_id
                            )[0]?.certificate_name;
                          },
                          // others: {
                          //   style: {
                          //     textAlign: "left",
                          //   },
                          // },
                        },
                      ]}
                      // filter={true}

                      data={allIssuedCertificates ?? []}
                      pagination={true}
                      isFilterable={true}
                      // paging={{ page: 0, rowsPerPage: 10 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </React.Fragment>
  );
}

// class IssueCertificate extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       hospital_id: null,
//       employee_name: null,
//       certificate_type: null,
//       certificate_name: "",
//       certificate_types: [],
//       kpi_parameters: [],
//       allIssuedCertificates: [],
//       hims_d_employee_id: null,
//       disabled: true,
//       loading: false,
//     };
//   }

//   componentWillUnmount() {
//     this.clearState();
//   }

//   static contextType = MainContext;
//   componentDidMount() {
//     const userToken = this.context.userToken;

//     this.setState({
//       hospital_id: userToken.hims_d_hospital_id,
//     });
//     if (
//       this.props.organizations === undefined ||
//       this.props.organizations.length === 0
//     ) {
//       this.props.getOrganizations({
//         uri: "/organization/getOrganizationByUser",
//         method: "GET",
//         redux: {
//           type: "ORGS_GET_DATA",
//           mappingName: "organizations",
//         },
//       });
//     }
//     algaehApiCall({
//       uri: "/Document/getKPI",
//       method: "GET",
//       module: "documentManagement",
//       onSuccess: (response) => {
//         const { data } = response;
//         let dataKpi = data.result.map((item) => item !== null && item);
//         this.setState({ certificate_types: dataKpi });
//       },
//       onCatch: (error) => {
//         swalMessage({
//           title: error.message,
//           type: "error",
//         });
//       },
//     });
//     this.getAllIssuedCertificates();
//   }
//   // getAllIssuedCertificates() {
//   //   algaehApiCall({
//   //     uri: "/Document/getIssuedCertificates",
//   //     method: "GET",
//   //     module: "documentManagement",
//   //     onSuccess: (response) => {
//   //       const { data } = response;
//   //       this.setState({
//   //         allIssuedCertificates: data["result"],
//   //         loading: false,
//   //       });
//   //     },
//   //     onCatch: (error) => {
//   //       swalMessage({
//   //         title: error.message,
//   //         type: "error",
//   //       });
//   //     },
//   //   });
//   // }
//   getAllIssuedCertificates() {
//     algaehApiCall({
//       uri: "/employee/getRequestCertificate",
//       method: "GET",
//       module: "hrManagement",
//       onSuccess: (response) => {
//         const { data } = response;
//         this.setState({
//           allIssuedCertificates: data.records,
//           loading: false,
//         });
//       },
//       onCatch: (error) => {
//         swalMessage({
//           title: error.message,
//           type: "error",
//         });
//       },
//     });
//   }
//   employeeSearch() {
//     AlgaehSearch({
//       searchGrid: {
//         columns: spotlightSearch.Employee_details.employee,
//       },
//       searchName: "employee_branch_wise",
//       uri: "/gloabelSearch/get",
//       inputs: "hospital_id = " + this.state.hospital_id,
//       onContainsChange: (text, serchBy, callBack) => {
//         callBack(text);
//       },
//       onRowSelect: (row) => {
//         this.setState({
//           employee_name: row.full_name,
//           hims_d_employee_id: row.hims_d_employee_id,
//           disabled: false,
//         });
//       },
//     });
//   }

//   clearState() {
//     this.setState({
//       employee_name: null,
//       certificate_type: null,
//       certificate_types: [],
//       kpi_parameters: [],
//       hims_d_employee_id: null,
//       disabled: true,
//       loading: false,
//     });
//   }

//   searchSelect(data) {
//     this.setState({
//       employee_id: data.hims_d_employee_id,
//       full_name: data.full_name,
//       display_name: data.full_name,
//       sub_department_id: data.sub_department_id,
//     });
//   }
//   onChangeHandler(e) {
//     const { name, value } = e;
//     let certificate = {};
//     if (name === "certificate_type") {
//       certificate = {
//         kpi_parameters: e.selected.kpi_parameters,
//         certificate_name: e.selected.kpi_name,
//       };
//     }
//     this.setState({ [name]: value, ...certificate });
//   }
//   generateCertificate() {
//     this.setState({ loading: true }, () => {
//       algaehApiCall({
//         uri: "/getDocsReports",
//         method: "GET",
//         module: "reports",
//         headers: {
//           Accept: "blob",
//         },
//         others: { responseType: "blob" },
//         data: {
//           parameters: { hims_d_employee_id: this.state.hims_d_employee_id },
//           _id: this.state.certificate_type,
//         },
//         onSuccess: (response) => {
//           this.saveToIssueCertificateList();
//           const urlBlob = URL.createObjectURL(response.data);
//           const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
//           window.open(origin);
//         },
//         onCatch: (error) => {
//           swalMessage({
//             title: error.message,
//             type: "error",
//           });
//         },
//       });
//     });
//   }

//   saveToIssueCertificateList() {
//     const {
//       certificate_type,
//       hims_d_employee_id,
//       employee_name,
//       certificate_name,
//     } = this.state;
//     algaehApiCall({
//       uri: "/Document/saveCertificateIssued",
//       method: "POST",
//       module: "documentManagement",
//       data: {
//         kpi_id: certificate_type,
//         employee_id: hims_d_employee_id,
//         employee_name: employee_name,
//         requested_for: certificate_name,
//       },
//       onSuccess: () => {
//         this.getAllIssuedCertificates();
//       },
//       onCatch: (error) => {
//         swalMessage({
//           title: error.message,
//           type: "error",
//         });
//       },
//     });
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <div className="row apply_leave">
//           <div className="col-3">
//             <div className="portlet portlet-bordered margin-bottom-15">
//               <div className="portlet-title">
//                 <div className="caption">
//                   <h3 className="caption-subject">Issue Certificate Direct</h3>
//                 </div>
//               </div>
//               <div className="portlet-body">
//                 <div className="row">
//                   <AlagehAutoComplete
//                     div={{ className: "col-12 form-group  mandatory" }}
//                     label={{
//                       forceLabel: "Select Branch",
//                       isImp: true,
//                     }}
//                     selector={{
//                       name: "hospital_id",
//                       className: "select-fld",
//                       value: this.state.hospital_id,
//                       dataSource: {
//                         textField: "hospital_name",
//                         valueField: "hims_d_hospital_id",
//                         data: this.props.organizations,
//                       },
//                       onChange: this.onChangeHandler.bind(this),
//                       onClear: () => {
//                         this.setState({
//                           hospital_id: null,
//                         });
//                       },
//                     }}
//                   />
//                   <AlagehAutoComplete
//                     div={{ className: "col-12 form-group mandatory" }}
//                     label={{
//                       forceLabel: "Select Certificate Type",
//                       isImp: true,
//                     }}
//                     selector={{
//                       name: "certificate_type",
//                       className: "select-fld",
//                       value: this.state.certificate_type,
//                       dataSource: {
//                         valueField: "_id",
//                         textField: "kpi_name",
//                         data: this.state.certificate_types,
//                       },
//                       onChange: this.onChangeHandler.bind(this),
//                       onClear: () => {
//                         this.setState({
//                           certificate_type: null,
//                           kpi_parameters: [],
//                         });
//                       },
//                     }}
//                   />
//                   <div className="col-12 globalSearchCntr form-group mandatory">
//                     <AlgaehLabel label={{ fieldName: "searchEmployee" }} />
//                     <h6 onClick={this.employeeSearch.bind(this)}>
//                       {this.state.employee_name
//                         ? this.state.employee_name
//                         : "Search Employee"}
//                       <i className="fas fa-search fa-lg" />
//                     </h6>
//                   </div>
//                   <div className="col-12" style={{ textAlign: "right" }}>
//                     <button
//                       onClick={this.clearState.bind(this)}
//                       type="button"
//                       className="btn btn-default"
//                       style={{ marginRight: 15 }}
//                     >
//                       Clear
//                     </button>
//                     <AlgaehButton
//                       onClick={this.generateCertificate.bind(this)}
//                       loading={this.state.loading}
//                       className="btn btn-primary"
//                       disabled={this.state.disabled}
//                     >
//                       Generate Certificate
//                     </AlgaehButton>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-9">
//             <div className="portlet portlet-bordered margin-bottom-15">
//               <div className="portlet-title">
//                 <div className="caption">
//                   <h3 className="caption-subject">
//                     Issue Certificate on request
//                   </h3>
//                 </div>
//               </div>
//               <div className="portlet-body">
//                 <div className="row">
//                   <div className="col-12" style={{ minHeight: "55vh" }}>
//                     <AlgaehDataGrid
//                       id="employeeFormTemplate"
//                       columns={[
//                         {
//                           fieldName: "Action",
//                           label: (
//                             <AlgaehLabel label={{ forceLabel: "Action" }} />
//                           ),

//                           // others: {
//                           //   maxWidth: 150,
//                           // },
//                           filterable: true,
//                         },
//                         {
//                           fieldName: "employee_id",
//                           label: (
//                             <AlgaehLabel label={{ forceLabel: "Emp. ID" }} />
//                           ),
//                           others: {
//                             maxWidth: 150,
//                           },
//                           filterable: true,
//                         },
//                         {
//                           fieldName: "full_name",
//                           label: (
//                             <AlgaehLabel
//                               label={{ forceLabel: "Employee Name" }}
//                             />
//                           ),
//                           filterable: true,
//                           others: {
//                             style: {
//                               textAlign: "left",
//                             },
//                           },
//                         },
//                         {
//                           fieldName: "cer_req_date",
//                           label: (
//                             <AlgaehLabel
//                               label={{ forceLabel: "Requested Date" }}
//                             />
//                           ),
//                           filterable: true,
//                           displayTemplate: (row) => (
//                             <spna>
//                               {moment(row.cer_req_date, "YYYYMMDD").format(
//                                 "DD-MM-YYYY"
//                               )}
//                             </spna>
//                           ),
//                           others: {
//                             maxWidth: 150,
//                           },
//                         },
//                         {
//                           fieldName: "requested_for",
//                           label: (
//                             <AlgaehLabel
//                               label={{ forceLabel: "Requested For" }}
//                             />
//                           ),
//                           filterable: true,
//                         },
//                       ]}
//                       // filter={true}

//                       data={this.state.allIssuedCertificates}
//                       pagination={true}
//                       isFilterable={true}
//                       // paging={{ page: 0, rowsPerPage: 10 }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     organizations: state.organizations,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getOrganizations: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(IssueCertificate)
// );
