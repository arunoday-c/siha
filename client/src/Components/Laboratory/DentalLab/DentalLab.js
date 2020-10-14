import React, { useEffect, useState } from "react";
import "./DentalLab.scss";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlgaehMessagePop,
  Spin,
  AlgaehSecurityComponent,
  // RawSecurityComponent,
} from "algaeh-react-components";
import { useQuery } from "react-query";
import ButtonType from "../../Wrapper/algaehButton";
import { newAlgaehApi } from "../../../hooks/";
// import GenericData from "../../../utils/GlobalVariables.json";
// import moment from "moment";
// import swal from "sweetalert2";
import { Controller, useForm } from "react-hook-form";
import { AddPatientDentalForm } from "./AddPatientmodal";
// import { useLangFieldName } from "../../PatientRegistrationNew/patientHooks";
// import AlgaehSearch from "../../Wrapper/globalSearch";
// import spotlightSearch from "../../../Search/spotlightSearch";
// import DentalImage from "../../../assets/images/dcaf_Dental_chart.png";
// import { swalMessage } from "../../../utils/algaehApiCall";
// const { confirm } = Modal;
const getDentalFormData = async () => {
  const result = await Promise.all([
    newAlgaehApi({
      uri: "/vendor/getVendorMaster",
      module: "masterSettings",
      method: "GET",
      data: { vendor_status: "A" },
    }),
    newAlgaehApi({
      uri: "/serviceType/getService",
      module: "masterSettings",
      data: {
        procedure_type: "DN",
      },
      method: "GET",
    }),
    // newAlgaehApi({
    //   uri: "/department/get/get_All_Doctors_DepartmentWise",
    //   module: "masterSettings",
    //   // data: {
    //   //   procedure_type: "DN",
    //   // },
    //   method: "GET",
    // }),
    newAlgaehApi({
      uri: "/department/selectDoctorByDepartment",
      module: "masterSettings",
      data: {
        department_type: "D",
      },
      method: "GET",
    }),
    newAlgaehApi({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "inventorylocations",
      },
    }),
  ]);
  return {
    povendors: result[0]?.data?.records,
    procedureList: result[1]?.data?.records,
    // subDepartment: result[2]?.data?.records,
    doctors: result[2]?.data?.records,
    location: result[3]?.data?.records,
  };
};
export default function DentalLab() {
  // const [OpenForm, setOpenForm] = useState(false);
  // const { userLanguage, titles = [] } = useContext(MainContext);
  // const { FORMAT_GENDER, REQUEST_STATUS, WORK_STATUS } = GenericData;

  const [openDentalModal, setOpenDentalModal] = useState(false);

  const [loading_request_list, setLoadingRequestList] = useState(false);
  const [request_list, setRequestList] = useState([]);
  const [current, setCurrent] = useState([]);
  // const [procedureList, setProcedureList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [patientName, setPatientName] = useState("");
  // const [povendors, setPovendors] = useState([]);
  // const [patientId, setPatientId] = useState("");
  // const [sub_department_id, setSub_department_id] = useState("");
  // const [doctor_id, setDoctor_id] = useState("");

  // const [subDepartment, setSubDepartment] = useState([]);

  // const [doctors, setDoctors] = useState([]);

  // const [viewDentalModal, setViewDentalModal] = useState(false);

  const { getValues, setValue, control, handleSubmit, errors } = useForm({
    shouldFocusError: true,
    // defaultValues: {
    //   // requesting_date: new Date(),
    //   from_request_date: moment().startOf("month").format("YYYY-MM-DD"),
    //   to_request_date: new Date(),
    // },
  });
  // const { date_of_birth } = useWatch({
  //   control,
  //   name: ["date_of_birth"],
  // });
  const { data: dropdownData } = useQuery("dropdown-data", getDentalFormData, {
    initialData: {
      povendors: [],
      procedureList: [],
      // subDepartment: [],
      doctors: [],
      location: [],
    },
    refetchOnMount: false,
    initialStale: true,
    cacheTime: Infinity,
  });
  useEffect(() => {
    Promise.all([
      // loadRequestList(getValues()),
      loadRequestListAll(),
      // // getDoctorData(),
      // vendorDetails(),
      // getProcedures(),
      // doctorsDeptWise(),
    ]).then(() => {
      setLoadingRequestList(false);
    });
    // eslint-disable-next-line
  }, []);

  const {
    povendors,
    procedureList,
    subDepartment,
    doctors,
    location,
  } = dropdownData;

  // const getDoctorData = async () => {
  //   try {
  //     const result = await newAlgaehApi({
  //       uri: "/frontDesk/getDoctorAndDepartment",
  //       module: "frontDesk",
  //       method: "GET",
  //     });
  //     if (result.data.success) {
  //       return {
  //         doctors: result.data.records,
  //       };
  //     }
  //   } catch (e) {
  //     AlgaehMessagePop({
  //       type: "warning",
  //       display: e.message,
  //     });
  //   }
  // };
  // const { fieldNameFn } = useLangFieldName();
  // const { data } = useQuery("doctors-data", getDoctorData, {
  //   cacheTime: Infinity,
  //   initialData: {
  //     doctors: [],
  //   },
  //   initialStale: true,
  //   onSuccess: (data) => {},
  // });
  const loadRequestList = async (data) => {
    setLoadingRequestList(true);

    try {
      const res = await newAlgaehApi({
        uri: "/dentalForm/getDentalLab",
        method: "GET",
        data: {
          from_request_date: data.from_request_date,
          to_request_date: data.to_request_date,
        },
      });
      if (res.data.success) {
        setRequestList(res.data.records);
        setLoadingRequestList(false);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  const loadRequestListAll = async () => {
    setLoadingRequestList(true);
    try {
      const res = await newAlgaehApi({
        uri: "/dentalForm/getDentalLabAll",
        method: "GET",
        // data: {
        //   from_request_date: data.from_request_date,
        //   to_request_date: data.to_request_date,
        // },
      });
      if (res.data.success) {
        setRequestList(res.data.records);
        setLoadingRequestList(false);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  // const vendorDetails = () => {
  //   newAlgaehApi({
  //     uri: "/vendor/getVendorMaster",
  //     module: "masterSettings",
  //     method: "GET",
  //     data: { vendor_status: "A" },
  //   })
  //     .then((res) => {
  //       if (res.data.success) {
  //         setPovendors(res.data.records);
  //       }
  //     })
  //     .catch((e) => {
  //       AlgaehMessagePop({
  //         type: "error",
  //         display: e.message,
  //       });
  //     });
  // };

  // const patientSearch = () => {
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
  //       setPatientName(row.full_name);
  //       setPatientId(row.hims_d_patient_id);
  //     },
  //   });
  // };
  const onEdit = (row) => {
    setOpenDentalModal(true);

    // setPatientId(row.patient_id);
    setCurrent(row);
  };
  const onEditStatus = (row) => {
    setOpenDentalModal(true);
    setCurrent(row);
    // setPatientId(row.patient_id);
    setDisabled(true);
  };

  // const getProcedures = async () => {
  //   try {
  //     const res = await newAlgaehApi({
  //       uri: "/serviceType/getService",
  //       module: "masterSettings",
  //       data: {
  //         procedure_type: "DN",
  //       },
  //       method: "GET",
  //     });
  //     if (res.data.success) {
  //       setProcedureList(res.data.records);
  //     }
  //   } catch (e) {
  //     setLoading(false);
  //     AlgaehMessagePop({
  //       type: "error",
  //       display: e.message,
  //     });
  //   }
  // };
  // const doctorsDeptWise = async () => {
  //   try {
  //     const res = await newAlgaehApi({
  //       uri: "/department/get/get_All_Doctors_DepartmentWise",
  //       module: "masterSettings",
  //       // data: {
  //       //   procedure_type: "DN",
  //       // },
  //       method: "GET",
  //     });
  //     if (res.data.success) {
  //       setSubDepartment(res.data.records.departmets);
  //       // setDoctors(res.data.records.doctors);

  //       // setProcedureList(res.data.records);
  //     }
  //   } catch (e) {
  //     setLoading(false);
  //     AlgaehMessagePop({
  //       type: "error",
  //       display: e.message,
  //     });
  //   }
  // };
  const onClose = () => {
    setOpenDentalModal(false);
    loadRequestListAll();
    setDisabled(false);
    setCurrent([]);
  };
  const openDentalModalHandler = (row) => {
    setOpenDentalModal(true);
  };
  const getFormRequest = (e) => {
    // console.log( e.to_request_date._d);
    console.log(errors);
    loadRequestList(getValues());
  };
  const onClear = () => {
    setValue("from_request_date", undefined);
    setValue("to_request_date", undefined);

    loadRequestListAll();
  };
  // componentDidMount() {

  //   RawSecurityComponent({ componentCode: "PUR_ORD_INVENTORY" }).then(
  //     (result) => {
  //       if (result === "show") {

  //       }
  //     }
  //   )

  // }

  return (
    <Spin spinning={loading}>
      <div className="DentalLabScreen">
        <div className="row inner-top-search">
          <AddPatientDentalForm
            povendors={povendors}
            procedureList={procedureList}
            subDepartment={subDepartment}
            current={current}
            onClose={onClose}
            visible={openDentalModal}
            disabled={disabled}
            getRequest={loadRequestListAll}
            doctors={doctors}
            location={location}
            // userLanguage={userLanguage}
            // titles={titles}
          />
          <Controller
            name="from_request_date"
            control={control}
            rules={{ required: "Please select date" }}
            render={({ value, onChange }) => (
              // <div className="col-2 algaeh-date-fld">
              <AlgaehDateHandler
                div={{
                  className: "col-3 algaeh-date-fld",
                }}
                label={{ forceLabel: "From Requested Date", isImp: false }}
                error={errors}
                textBox={{
                  className: "txt-fld",
                  name: "from_request_date",
                  value: value || undefined,
                }}
                // maxDate={new Date()}
                events={{
                  onChange: (mdate) => {
                    if (mdate) {
                      onChange(mdate._d);
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

          <Controller
            name="to_request_date"
            control={control}
            rules={{ required: "Please select date" }}
            render={({ value, onChange }) => (
              // <div className="col-6 algaeh-date-fld">
              <AlgaehDateHandler
                div={{
                  className: "col-3 algaeh-date-fld form-group",
                }}
                label={{ forceLabel: "From Requested Date", isImp: false }}
                error={errors}
                textBox={{
                  className: "txt-fld",
                  name: "to_request_date",
                  value: value || undefined,
                }}
                // maxDate={new Date()}
                events={{
                  onChange: (mdate) => {
                    if (mdate) {
                      onChange(mdate._d);
                    } else {
                      onChange(undefined);
                    }
                  },
                  onClear: () => {
                    onChange(undefined);
                  },
                }}
              />
              // </div>
            )}
          />
          <div className="col-2" style={{ marginTop: 21 }}>
            {" "}
            <ButtonType
              className="btn btn-default"
              label={{
                forceLabel: "Load",
                returnText: true,
              }}
              onClick={handleSubmit(getFormRequest)}
              loading={loading_request_list}
            />
            <ButtonType
              className="btn btn-primary"
              label={{
                forceLabel: "Clear",
                returnText: true,
              }}
              onClick={onClear}
              loading={loading_request_list}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 margin-top-15">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Dental Form Requests List</h3>
                </div>
                <div className="actions">
                  <AlgaehSecurityComponent componentCode="APP_REQ_USER">
                    <button
                      className="btn btn-primary btn-circle active"
                      onClick={openDentalModalHandler}
                    >
                      <i className="fas fa-plus" />
                    </button>
                  </AlgaehSecurityComponent>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="DentalFormGrid_Cntr">
                    <AlgaehDataGrid
                      className="DentalFormGrid"
                      columns={[
                        {
                          fieldName: "",
                          label: "Actions",
                          displayTemplate: (row) => {
                            return (
                              <>
                                <AlgaehSecurityComponent componentCode="APP_REQ_USER">
                                  <i
                                    className="fas fa-pen"
                                    onClick={() => onEdit(row)}
                                  ></i>
                                </AlgaehSecurityComponent>
                                <AlgaehSecurityComponent componentCode="APP_ACC_USER">
                                  <i
                                    className="fas fa-eye"
                                    onClick={() => onEditStatus(row)}
                                  ></i>{" "}
                                </AlgaehSecurityComponent>
                              </>
                            );
                          },
                          freezable: true,
                        },
                        {
                          fieldName: "request_status",
                          label: "Request status",
                          filterable: true,
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.request_status === "PEN" ? (
                                  <span className="badge badge-warning">
                                    Pending
                                  </span>
                                ) : row.request_status === "APR" ? (
                                  <span className="badge badge-success">
                                    Approved
                                  </span>
                                ) : row.request_status === "REJ" ? (
                                  <span className="badge badge-danger">
                                    Rejected
                                  </span>
                                ) : row.request_status === "RES" ? (
                                  <span className="badge badge-warning">
                                    Resend
                                  </span>
                                ) : (
                                  "------"
                                )}
                              </span>
                            );
                          },
                        },
                        {
                          fieldName: "work_status",
                          label: "Work Status",
                          filterable: true,
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.work_status === "PEN" ? (
                                  <span className="badge badge-warning">
                                    Pending
                                  </span>
                                ) : row.work_status === "WIP" ? (
                                  <span className="badge badge-info">
                                    Ordered
                                  </span>
                                ) : row.work_status === "COM" ? (
                                  <span className="badge badge-success">
                                    Arrived
                                  </span>
                                ) : (
                                  "------"
                                )}
                              </span>
                            );
                          },
                        },
                        {
                          fieldName: "ordered_type",
                          label: "Order Type",
                          filterable: true,
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.ordered_type === "NEW" ? (
                                  <span>NEW</span>
                                ) : row.ordered_type === "REF" ? (
                                  <span>Refine</span>
                                ) : row.ordered_type === "REM" ? (
                                  <span>Remake</span>
                                ) : row.ordered_type === "RIM" ? (
                                  <span>Reimpression</span>
                                ) : (
                                  "------"
                                )}
                              </span>
                            );
                          },
                        },
                        {
                          fieldName: "full_name",
                          label: "Patient Name",
                          filterable: true,
                        },
                        {
                          fieldName: "patient_code",
                          label: "MRN Number",
                          filterable: true,
                        },
                        {
                          fieldName: "employee_name",
                          label: "Requested By",
                          filterable: true,
                        },
                        {
                          fieldName: "vendor_name",
                          label: "Requesting to Vendor",
                          filterable: true,
                        },
                        {
                          fieldName: "service_name",
                          label: "For the Procedure",
                          filterable: true,
                        },
                        {
                          fieldName: "procedure_amt",
                          label: "Amount",
                          filterable: true,
                        },
                        {
                          fieldName: "requested_date",
                          label: "Request Date",
                        },
                        // {
                        //   fieldName: "due_date",
                        //   label: "Due Date",
                        // },
                        {
                          fieldName: "odered_date",
                          label: "Odered Date",
                        },
                        {
                          fieldName: "arrival_date",
                          label: "Received Date",
                        },
                        {
                          fieldName: "location_description",
                          label: "Arrived LOcation",
                          filterable: true,
                        },
                      ]}
                      loading={false}
                      data={request_list}
                      isFilterable={true}
                      pagination={true}
                      events={
                        {
                          // onSave: updatePrePayReq,
                          // onEdit:
                          // onEditShow:
                        }
                      }
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <DentelForm
//           show={this.state.OpenForm}
//           onClose={this.OpenDentalForm.bind(this)}
//           HeaderCaption={
//             <AlgaehLabel
//               label={{
//                 forceLabel: "Dental Form",
//                 align: "ltr"
//               }}
//             />
//           }
//         /> */}
      {/* //         </div> */}
    </Spin>
  );
}
