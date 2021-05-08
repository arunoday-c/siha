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
        kpi_parameter: " where E.hims_d_employee_id = " + data.employee_id,
        hims_d_certificate_master_id: data.certificate_id,
        rowData: data,
      },
      onSuccess: (response) => {
        setLoadingData(false);
        // setRow();
        AlgaehMessagePop({
          display:
            "Certificate Generate Successfully. Please Click on Certificate No. to Preview.",
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
    if (employee_data.employee_name) {
      generateCertificate({
        ...data,
        employee_id: employee_data.hims_d_employee_id,
        certificate_id: certificate_data.hims_d_certificate_master_id,
        employee_code: employee_data.employee_code,
      });
    } else {
      AlgaehMessagePop({
        display: "Please Select Employee",
        type: "error",
      });
      return;
    }
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
                            onClear: () => {
                              onChange("");
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
                            onClear: () => {
                              onChange("");
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
                                title={"Preview & Download Certificate"}
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
                          fieldName: "identity_no",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Primary ID" }} />
                          ),
                          others: {
                            maxWidth: 150,
                          },
                          filterable: true,
                        },
                        {
                          fieldName: "code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
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
