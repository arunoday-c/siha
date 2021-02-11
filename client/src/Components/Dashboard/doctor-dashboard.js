import React, { useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
// import { swalMessage } from "../../../../../utils/algaehApiCall";
import "./dashboard.scss";
import moment from "moment";
import AlgaehFile from "../Wrapper/algaehFileUpload";

// import AlgaehFile from "../../../../Wrapper/algaehFileUpload";

import {
  AlgaehDateHandler,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehMessagePop,
  Spin,
  MainContext,
  DatePicker,
} from "algaeh-react-components";
import { algaehApiCall } from "../../utils/algaehApiCall";
// import AlgaehLoader from "../../../../Wrapper/fullPageLoader";
// import { RawSecurityElement } from "algaeh-react-components";
import { ViewAttachmentsModal } from "../MRD/PatientMRD/Encounters/viewAttachmentsModal";
import { useForm, Controller } from "react-hook-form";

import { newAlgaehApi } from "../../hooks";
import { useQuery } from "react-query";
// import _ from "lodash";
// import { number } from "algaeh-react-components/node_modules/@types/prop-types";

// const patientIncomingHistory = {
//   datasets: [
//     {
//       type: "line",
//       label: "Patient Count",
//       data: [12, 8, 17, 21, 20, 28],
//       fill: false,
//       backgroundColor: "#71B37C",
//       borderColor: "#71B37C",
//       hoverBackgroundColor: "#71B37C",
//       hoverBorderColor: "#71B37C",
//       yAxisID: "y-axis-1",
//     },
//   ],
// };

const getEmployeeSubDeptName = async (key, { sub_dept_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getEmployeeSubDeptName",
    module: "hrManagement",
    method: "GET",
    data: { sub_department_id: sub_dept_id },
  });
  return result?.data?.records;
};
const getDoctorDashboardData = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/doctorsWorkBench/getDoctorDashboardData",

    method: "GET",
    data: { doctor_id: employee_id },
  });
  return result?.data?.records;
};
export default function Dashboard() {
  const { userToken } = useContext(MainContext);
  console.log("userToken", userToken);
  // const [income_range, setIncome_range] = useState([
  //   moment().startOf("week"),
  //   moment().endOf("week"),
  // ]);
  // const { todayPatients, setTodaysPatients } = useState([]);
  const [openAttachmentsModal, setOpenAttachmentsModal] = useState(false);
  // const [idDetails, setIdDetails] = useState([]);
  const [countOfIncoming, setCountOfIncoming] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  const [xAxisOfIncoming, setXAxisOfIncoming] = useState([]);
  const [axisOfFollowUpAndIncome, setaxisOffollowUpAndincome] = useState([]);
  const [newPatientVsFollowUPData, setNewPatientVsFollowUPData] = useState([]);
  const [newPatient, setNewPatient] = useState([]);
  // const [dependentDetails, setDependentDetails] = useState([]);

  const {
    control,
    errors,
    // register,
    // reset,
    // handleSubmit,
    // // setValue,
    getValues,
    // watch,
  } = useForm({
    defaultValues: {
      today_date_patients: new Date(),
      services_date: new Date(),
      income_range: moment(new Date()),
      new_followup_range: moment(new Date()),
    },
  });
  const {
    data: todayPatients,
    isLoading: pdLoading,
    refetch: refetchForPat,
  } = useQuery("today_patient", getTodaysPatients, {
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });
  const { data: subDeptName } = useQuery(
    ["subDeptName", { sub_dept_id: userToken.sub_department_id }],
    getEmployeeSubDeptName,
    {
      // enabled: !!EmpMasterIOputs,
      // initialStale: true,
      refetch: false,

      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const { data: doctorData } = useQuery(
    ["doctorData", { employee_id: userToken.employee_id }],
    getDoctorDashboardData,
    {
      // enabled: !!EmpMasterIOputs,
      // initialStale: true,
      // refetch: false,

      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getTodaysPatients(key) {
    const objData = getValues();
    const result = await newAlgaehApi({
      uri: "/doctorsWorkBench/getMyDay",
      data: {
        fromDate: moment(objData.today_date_patients).format("YYYY-MM-DD"),
        toDate: moment(objData.today_date_patients).format("YYYY-MM-DD"),
      },
      method: "GET",
    });
    return result?.data?.records;
  }
  const {
    data: patientInvestigations,
    isLoading: InvestigationLoad,
    refetch: refetchForService,
  } = useQuery(
    "getPatientInvestigationForDashBoard",
    getPatientInvestigationForDashBoard,
    {
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getPatientInvestigationForDashBoard(key) {
    const objData = getValues();
    const result = await newAlgaehApi({
      uri: "/mrd/getPatientInvestigationForDashBoard",
      module: "MRD",
      data: {
        from_date: moment(objData.services_date).format("YYYY-MM-DD"),
        to_date: moment(objData.services_date).format("YYYY-MM-DD"),
      },
      method: "GET",
    });
    return result?.data?.records;
  }
  const {
    data: patientCount,
    isLoading: patCount,
    refetch: refetchForPatCount,
  } = useQuery("getPatientCount", getPatientCount, {
    onSuccess: (data) => {
      setCountOfIncoming(
        data.map((item) => {
          return item.detailsOfPatient.length;
        })
      );
      console.log("patientCount", patientCount);
      let currentDate = getValues().income_range;
      let weekStart = currentDate.clone().startOf("isoWeek");

      // var weekEnd = currentDate.clone().endOf('isoWeek');

      let days = [];

      for (var i = 0; i <= 6; i++) {
        days.push(moment(weekStart).add(i, "days").format("MMMM Do"));
      }
      setXAxisOfIncoming(days);
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });
  const {
    data: followupAndNewPatient,
    isLoading: followup,
    refetch: refetchForPatFollow,
  } = useQuery("getAllPatientFollowUp", getAllPatientFollowUp, {
    onSuccess: (data) => {
      setNewPatientVsFollowUPData(
        data.map((item) => {
          let newPatient = item.detailsOf.filter((newP) => {
            return newP.visit_type === "Y";
          });

          return newPatient[0]?.detail.length ? newPatient[0].detail.length : 0;
        })
      );
      setNewPatient(
        data.map((item) => {
          let newPatient = item.detailsOf.filter((newP) => {
            return newP.visit_type === "N";
          });
          return newPatient[0]?.detail.length ? newPatient[0].detail.length : 0;
        })
      );
      let currentDate = getValues().new_followup_range;
      let weekStart = currentDate.clone().startOf("isoWeek");

      // var weekEnd = currentDate.clone().endOf('isoWeek');

      let days = [];

      for (var i = 0; i <= 6; i++) {
        days.push(moment(weekStart).add(i, "days").format("MMMM Do"));
      }
      setaxisOffollowUpAndincome(days);
      // setCountOfIncoming(
      //   data.map((item) => {
      //     return item.detailsOfPatient.length;
      //   })
      // );
      console.log("patientCount", followupAndNewPatient);
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });

  async function getPatientCount(key) {
    let objData = getValues().income_range;
    var startOfWeek = objData.startOf("week").toDate();
    var endOfWeek = objData.endOf("week").toDate();

    const result = await newAlgaehApi({
      uri: "/doctorsWorkBench/getPatientCount",
      data: {
        from_date: moment(startOfWeek).format("YYYY-MM-DD"),
        to_date: moment(endOfWeek).format("YYYY-MM-DD"),
      },
      method: "GET",
    });
    return result?.data?.records;
  }
  async function getAllPatientFollowUp(key) {
    let objData = getValues().new_followup_range;
    var startOfWeek = objData.startOf("week").toDate();
    var endOfWeek = objData.endOf("week").toDate();

    const result = await newAlgaehApi({
      uri: "/doctorsWorkBench/getAllPatientFollowUpDash",
      data: {
        from_date: moment(startOfWeek).format("YYYY-MM-DD"),
        to_date: moment(endOfWeek).format("YYYY-MM-DD"),
      },
      method: "GET",
    });
    return result?.data?.records;
  }
  const generateReport = (row, report_type) => {
    let inputObj = {};
    if (report_type === "RAD") {
      inputObj = {
        tab_name: "Radiology Report",
        reportName: "radiologyReport",
        data: [
          {
            name: "hims_f_rad_order_id",
            value: row.hims_f_rad_order_id,
          },
        ],
      };
    } else {
      inputObj = {
        tab_name: "Lab Report",
        reportName: "hematologyTestReport",
        data: [
          {
            name: "hims_d_patient_id",
            value: row.patient_id,
          },
          {
            name: "visit_id",
            value: row.visit_id,
          },
          {
            name: "hims_f_lab_order_id",
            value: row.hims_f_lab_order_id,
          },
        ],
      };
    }
    // let tab_name = report_type === "RAD" ? "Radiology Report" : "Lab Report";
    let tab_name = inputObj.tab_name;
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
          reportName: inputObj.reportName,
          reportParams: inputObj.data,
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${tab_name}`;
        window.open(origin);
        // window.document.title = tab_name;
      },
    });
  };

  const patientIncomingHistory = {
    datasets: [
      {
        type: "line",
        label: "Patient Count",
        data: countOfIncoming,
        fill: false,
        backgroundColor: "#71B37C",
        borderColor: "#71B37C",
        hoverBackgroundColor: "#71B37C",
        hoverBorderColor: "#71B37C",
        yAxisID: "y-axis-1",
      },
    ],
  };

  const patientIncomingHistoryOptions = {
    responsive: true,
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 10,
      },
    },
    tooltips: {
      mode: "label",
    },
    elements: {
      line: {
        fill: false,
      },
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: false,
          },
          labels: xAxisOfIncoming,
        },
      ],
      yAxes: [
        {
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-1",
          gridLines: {
            display: false,
          },
          labels: {
            show: true,
          },
        },
      ],
    },
  };

  const patientIncomingcategory = {
    datasets: [
      {
        type: "bar",
        label: "New Patient",
        data: newPatientVsFollowUPData,
        fill: false,
        backgroundColor: "#71B37C",
        borderColor: "#71B37C",
        hoverBackgroundColor: "#71B37C",
        hoverBorderColor: "#71B37C",
        yAxisID: "y-axis-1",
      },
      {
        type: "bar",
        label: "Follow Up",
        data: newPatient,
        fill: false,
        backgroundColor: "#EC932F",
        borderColor: "#EC932F",
        hoverBackgroundColor: "#EC932F",
        hoverBorderColor: "#EC932F",
        yAxisID: "y-axis-1",
      },
    ],
  };

  const patientIncomingcategoryOptions = {
    responsive: true,
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 10,
      },
    },
    tooltips: {
      mode: "label",
    },
    elements: {
      line: {
        fill: false,
      },
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          display: true,
          gridLines: {
            display: false,
          },
          labels: axisOfFollowUpAndIncome,
        },
      ],
      yAxes: [
        {
          stacked: true,
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-1",
          gridLines: {
            display: false,
          },
          labels: {
            show: true,
          },
        },
      ],
    },
  };
  const showAttachmentsOfServices = (row, attachment_type) => {
    setOpenAttachmentsModal((pre) => !pre);
    setCurrentRow({ ...row, attach_type: attachment_type });
  };
  console.log("todayPatients", todayPatients);
  // render() {
  return (
    <>
      <div className="dashboard doc-dash">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <div className="row card-deck">
              <div className="card animated fadeInUp faster hedrName">
                <div className="content">
                  <div className="row">
                    <div className="col-12">
                      <h2>Hello, Dr.{userToken.full_name}</h2>
                      <p>Here your important tasks and reports.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="card animated fadeInUp faster">
                  <h6>
                    Patient Incoming History{" "}
                    <span className="portletTopAction">
                      <Controller
                        control={control}
                        name="income_range"
                        rules={{ required: "Please Select DOB" }}
                        render={({ onChange, value }) => (
                          <div className="col mandatory " tabIndex="5">
                            <label
                              htmlFor="income_range"
                              className="style_Label "
                            />

                            <DatePicker
                              name="income_range"
                              value={value}
                              onChange={(date) => {
                                if (date) {
                                  onChange(date);
                                  refetchForPatCount();
                                } else {
                                  onChange(undefined);
                                }
                              }}
                              onClear={() => {
                                onChange(undefined);
                              }}
                              picker="week"
                              size={"small"}
                              maxDate={new Date()}
                            />
                          </div>
                        )}
                      />
                    </span>
                  </h6>

                  <div className="dashboardChartsCntr">
                    <Spin spinning={patCount}>
                      <Bar
                        data={patientIncomingHistory}
                        options={patientIncomingHistoryOptions}
                      />
                    </Spin>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card animated fadeInUp faster">
                  <h6>
                    New Patient vs Follow Up
                    <span className="portletTopAction">
                      <Controller
                        control={control}
                        name="new_followup_range"
                        rules={{ required: "Please Select DOB" }}
                        render={({ onChange, value }) => (
                          <div className="col mandatory " tabIndex="5">
                            <label
                              htmlFor="new_followup_range"
                              className="style_Label "
                            />

                            <DatePicker
                              name="new_followup_range"
                              value={value}
                              onChange={(date) => {
                                if (date) {
                                  onChange(date);
                                  refetchForPatFollow();
                                } else {
                                  onChange(undefined);
                                }
                              }}
                              onClear={() => {
                                onChange(undefined);
                              }}
                              picker="week"
                              size={"small"}
                              maxDate={new Date()}
                            />
                          </div>
                        )}
                      />
                    </span>
                  </h6>

                  <div className="dashboardChartsCntr">
                    <Spin spinning={followup}>
                      <Bar
                        data={patientIncomingcategory}
                        options={patientIncomingcategoryOptions}
                      />
                    </Spin>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card animated fadeInUp faster">
                  <Controller
                    control={control}
                    name="today_date_patients"
                    rules={{ required: "Please Select DOB" }}
                    render={({ onChange, value }) => (
                      <AlgaehDateHandler
                        size={"small"}
                        div={{
                          className: "col mandatory",
                          tabIndex: "5",
                        }}
                        error={errors}
                        label={{}}
                        textBox={{
                          className: "txt-fld",
                          name: "today_date_patients",
                          value,
                          others: {
                            tabIndex: "4",
                          },
                        }}
                        // others={{ disabled }}
                        maxDate={new Date()}
                        events={{
                          onChange: (mdate) => {
                            if (mdate) {
                              onChange(mdate._d);
                              refetchForPat();
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
                  <h6>Todays Patients</h6>

                  <div className="col-12" id="patientIncomingcategoryCntr">
                    <Spin spinning={pdLoading}>
                      <AlgaehDataGrid
                        className="dashboardGrd"
                        columns={[
                          {
                            fieldName: "row_num",
                            label: (
                              <AlgaehLabel label={{ fieldName: "Sl No." }} />
                            ),
                            others: {
                              width: 80,
                            },
                          },
                          {
                            fieldName: "patient_code",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "Patient Code" }}
                              />
                            ),
                            others: {
                              width: 80,
                            },
                          },
                          {
                            fieldName: "full_name",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "Patient Name" }}
                              />
                            ),
                            // others: {
                            //   minWidth: 150,
                            // },
                          },
                          {
                            fieldName: "gender",
                            label: (
                              <AlgaehLabel label={{ fieldName: "Gender" }} />
                            ),
                            others: {
                              width: 80,
                            },
                          },
                          {
                            fieldName: "age",
                            label: <AlgaehLabel label={{ fieldName: "Age" }} />,
                            others: {
                              width: 80,
                            },
                          },
                          {
                            fieldName: "visit_type_desc",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "Appointment Type" }}
                              />
                            ),
                            others: {
                              width: 110,
                            },
                          },
                          {
                            fieldName: "visit_type_desc",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "Visit Type" }}
                              />
                            ),
                            // displayTemplate: (row) => {
                            //   return row.new_visit_patient === "Y"
                            //     ? "New Visit"
                            //     : "FollowUP Visit";
                            // },
                            others: {
                              width: 80,
                            },
                          },
                        ]}
                        // height="40vh"
                        pagination={true}
                        key="index"
                        data={todayPatients?.length > 0 ? todayPatients : []}
                      />
                    </Spin>

                    {/* <table className="table table-bordered table-sm table-striped">
                      <thead>
                        <tr>
                          <th>Patient Code</th>
                          <th>Patient Name</th>
                          <th>Gender</th>
                          <th>Age</th>
                          <th>Appointment Type</th>
                          <th>Visit Type</th>
                        </tr>
                      </thead>
                      <tbody>

                        {this.state.today_list.map((patient_data, index) => (
                          <tr key={index}>
                            <td>{patient_data.patient_code}</td>
                            <td>{patient_data.full_name}</td>
                            <td>{patient_data.gender}</td>
                            <td>{patient_data.age}</td>
                            <td>
                              {patient_data.appointment_patient === "N"
                                ? "Walk In"
                                : "Appoinment"}
                            </td>
                            <td>
                              {patient_data.new_visit_patient === "Y"
                                ? "New Visit"
                                : "Follow Up"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table> */}
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card animated fadeInUp faster">
                  <Controller
                    control={control}
                    name="services_date"
                    rules={{ required: "Please Select DOB" }}
                    render={({ onChange, value }) => (
                      <AlgaehDateHandler
                        size={"small"}
                        div={{
                          className: "col mandatory",
                          tabIndex: "5",
                        }}
                        error={errors}
                        label={{}}
                        textBox={{
                          className: "txt-fld",
                          name: "services_date",
                          value,
                          others: {
                            tabIndex: "4",
                          },
                        }}
                        // others={{ disabled }}
                        maxDate={new Date()}
                        events={{
                          onChange: (mdate) => {
                            if (mdate) {
                              onChange(mdate._d);
                              refetchForService();
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
                  />{" "}
                  <h6>Ordered Service Status</h6>
                  <div className="dashboardGridCntr table-responsive">
                    <Spin spinning={InvestigationLoad}>
                      <AlgaehDataGrid
                        id="investigation-grid"
                        columns={[
                          {
                            fieldName: "service_type_id",
                            label: "Service Type",
                            displayTemplate: (row) => {
                              return row.service_type_id === 5 ? (
                                <span>Lab</span>
                              ) : row.service_type_id === 11 ? (
                                <span>Radiology</span>
                              ) : null;
                            },
                          },
                          {
                            fieldName: "service_name",
                            label: "Service Name",
                          },
                          // {
                          //   fieldName: "lab_ord_status",
                          //   label: "Lab Order Status",
                          //   displayTemplate: (row) => {
                          //     return (
                          //       <span>
                          //         {row.lab_ord_status === "O"
                          //           ? "Ordered"
                          //           : row.lab_ord_status === "CL"
                          //           ? "Specimen Collected"
                          //           : row.lab_ord_status === "CN"
                          //           ? "Test Cancelled"
                          //           : row.lab_ord_status === "CF"
                          //           ? "Result Confirmed "
                          //           : row.lab_ord_status === "V"
                          //           ? "Result Validated"
                          //           : "----"}
                          //       </span>
                          //     );
                          //   },
                          // },
                          // {
                          //   fieldName: "lab_billed",
                          //   label: "Lab Billed",
                          //   displayTemplate: (row) => {
                          //     return (
                          //       <span>
                          //         {row.lab_billed === "Y" ? "Yes" : "----"}
                          //       </span>
                          //     );
                          //   },
                          // },

                          {
                            fieldName: "hims_f_ordered_services_id",
                            label: "Status",
                            displayTemplate: (row) => {
                              return row.service_type_id === 5 ? (
                                <span>
                                  {row.lab_ord_status === "O"
                                    ? "Ordered"
                                    : row.lab_ord_status === "CL"
                                    ? "Specimen Collected"
                                    : row.lab_ord_status === "CN"
                                    ? "Test Cancelled"
                                    : row.lab_ord_status === "CF"
                                    ? "Result Confirmed "
                                    : row.lab_ord_status === "V"
                                    ? "Result Validated"
                                    : "----"}
                                </span>
                              ) : row.service_type_id === 11 ? (
                                <span>
                                  {row.rad_ord_status === "O"
                                    ? "Ordered"
                                    : row.rad_ord_status === "S"
                                    ? "Scheduled"
                                    : row.rad_ord_status === "UP"
                                    ? "Under Process"
                                    : row.rad_ord_status === "CN"
                                    ? "Cancelled"
                                    : row.rad_ord_status === "RC"
                                    ? "Result Confirmed"
                                    : row.rad_ord_status === "RA"
                                    ? "Result Available"
                                    : "----"}
                                </span>
                              ) : null;
                            },
                          },

                          // {
                          //   fieldName: "rad_ord_status",
                          //   label: "Radiology Order Status",
                          //   displayTemplate: (row) => {
                          //     return (
                          //       <span>
                          //         {row.rad_ord_status === "O"
                          //           ? "Ordered"
                          //           : row.rad_ord_status === "S"
                          //           ? "Scheduled"
                          //           : row.rad_ord_status === "UP"
                          //           ? "Under Process"
                          //           : row.rad_ord_status === "CN"
                          //           ? "Cancelled"
                          //           : row.rad_ord_status === "RC"
                          //           ? "Result Confirmed"
                          //           : row.rad_ord_status === "RA"
                          //           ? "Result Available"
                          //           : "----"}
                          //       </span>
                          //     );
                          //   },
                          // },
                          // {
                          //   fieldName: "rad_billed",
                          //   label: "Radiology Billed",
                          //   displayTemplate: (row) => {
                          //     return (
                          //       <span>
                          //         {row.rad_billed === "Y" ? "Yes" : "----"}
                          //       </span>
                          //     );
                          //   },
                          // },
                          {
                            fieldName: "hims_f_ordered_services_id",
                            label: "Internal Report",
                            displayTemplate: (row) => {
                              return row.service_type_id === 5 &&
                                row.lab_ord_status === "V" ? (
                                <span
                                  className="pat-code"
                                  style={{ color: "#006699" }}
                                  onClick={() => {
                                    generateReport(row, "LAB");
                                  }}
                                >
                                  View Report
                                </span>
                              ) : row.service_type_id === 11 &&
                                row.rad_ord_status === "RA" ? (
                                <span
                                  className="pat-code"
                                  style={{ color: "#006699" }}
                                  onClick={() => {
                                    generateReport(row, "RAD");
                                  }}
                                >
                                  View Report
                                </span>
                              ) : null;
                            },
                          },

                          {
                            fieldName: "hims_f_ordered_services_id",
                            label: "External Report",
                            displayTemplate: (row) => {
                              return row.service_type_id === 5 &&
                                row.lab_ord_status === "V" ? (
                                <span>
                                  <i
                                    className="fas fa-paperclip"
                                    aria-hidden="true"
                                    onClick={() => {
                                      showAttachmentsOfServices(row, "LAB");
                                    }}
                                  />
                                </span>
                              ) : row.service_type_id === 11 &&
                                row.rad_ord_status === "RA" ? (
                                <span>
                                  <i
                                    className="fas fa-paperclip"
                                    aria-hidden="true"
                                    onClick={(e) => {
                                      showAttachmentsOfServices(row, "RAD");
                                    }}
                                  />
                                </span>
                              ) : null;
                            },
                          },
                          // {
                          //   fieldName: "action",
                          //   label: "Attachments",
                          //   displayTemplate: (row) => {
                          //     return row.lab_billed === "Y" ? (
                          //       <span>
                          //         <i
                          //           className="fas fa-paperclip"
                          //           aria-hidden="true"
                          //           onClick={() => {
                          //             this.setState(
                          //               {
                          //                 openAttachmentsModal: true,
                          //                 // currentRow: row,
                          //                 // lab_id_number: row.lab_id_number,
                          //               },

                          //               this.getSavedDocument.bind(
                          //                 this,
                          //                 row
                          //               )
                          //             );
                          //           }}
                          //         />
                          //       </span>
                          //     ) : (
                          //       "----"
                          //     );
                          //   },
                          // },
                          // {
                          //   fieldName: "radiology_attachments",
                          //   label: (
                          //     <AlgaehLabel
                          //       label={{
                          //         forceLabel: "Radiology Attachments",
                          //       }}
                          //     />
                          //   ),
                          //   displayTemplate: (row) => {
                          //     return row.rad_billed === "Y" ? (
                          //       <span>
                          //         <i
                          //           // style={{
                          //           //   pointerEvents:
                          //           //     row.status === "O"
                          //           //       ? ""
                          //           //       : row.sample_status === "N"
                          //           //       ? "none"
                          //           //       : "",
                          //           // }}
                          //           className="fas fa-paperclip"
                          //           aria-hidden="true"
                          //           onClick={(e) => {
                          //             this.setState(
                          //               {
                          //                 openAttachmentsModal: true,
                          //               },

                          //               this.getDocuments.bind(this, row)
                          //             );
                          //           }}
                          //         />
                          //       </span>
                          //     ) : (
                          //       "----"
                          //     );
                          //   },
                          // },
                        ]}
                        keyId="index"
                        data={
                          patientInvestigations ? patientInvestigations : []
                        }
                        // isEditable={false}
                        pagination={true}
                        // paging={{ page: 0, rowsPerPage: 5 }}
                        events={{
                          onDelete: (row) => {},
                          onEdit: (row) => {},
                          onDone: (row) => {},
                        }}
                      />
                    </Spin>
                    {openAttachmentsModal ? (
                      <ViewAttachmentsModal
                        rowData={currentRow}
                        visible={openAttachmentsModal}
                        onClose={showAttachmentsOfServices}
                      />
                    ) : null}
                    {/* <table className="table table-bordered table-sm table-striped">
                    <thead>
                      <tr>
                        <th>Patient Code</th>
                        <th>Patient Name</th>
                        <th>Service Ordered</th>
                        <th>Ordered Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>PAT-A-0000693</td>
                        <td>Gulam Mustafa</td>
                        <td>Acetylcholine receptor antibody</td>
                        <td>19-04-2018</td>
                        <td>Pending</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>PAT-A-0000691</td>
                        <td>Kamalnath Singh</td>
                        <td>CBC</td>
                        <td>19-04-2018</td>
                        <td>Pending</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>PAT-A-0000682</td>
                        <td>Rehmat Fatima</td>
                        <td>Activated Protein C Resistance (APCR)</td>
                        <td>19-04-2018</td>
                        <td>Pending</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>PAT-A-0000654</td>
                        <td>Syed Al-Hameed</td>
                        <td>Acute Hepatitis Panel</td>
                        <td>19-04-2018</td>
                        <td>Pending</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>PAT-A-0000682</td>
                        <td>Rehmat Fatima</td>
                        <td>Acid Fast Bacilli (AFB) Smear</td>
                        <td>19-04-2018</td>
                        <td>Pending</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>PAT-A-0000682</td>
                        <td>Hakeem Usmani</td>
                        <td>17-Ketosteroids</td>
                        <td>19-04-2018</td>
                        <td>Pending</td>
                        <td>-</td>
                      </tr>
                    </tbody>
                  </table> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="row">
              <div className="col-12">
                <div className="card animated fadeInUp faster">
                  <div className="doc-section">
                    <AlgaehFile
                      name="attach_photo"
                      accept="image/*"
                      textAltMessage={userToken.full_name}
                      showActions={false}
                      serviceParameters={{
                        uniqueID: userToken.employee_code,
                        destinationName: userToken.employee_code,
                        fileType: "Employees",
                      }}
                    />
                    {/* <img className="docImg"></img> */}
                    <h5>Dr.{userToken.full_name}</h5>

                    <small>
                      {userToken.role_name},
                      {subDeptName?.length > 0
                        ? subDeptName[0].sub_department_name
                        : ""}{" "}
                    </small>
                  </div>
                  <hr />
                  <div className="pat-info-section">
                    <div className="row">
                      <div className="col-6">
                        <h5>
                          {doctorData
                            ? doctorData.filter((item) => {
                                return item.appointment_patient === "Y";
                              })?.length
                            : 0}
                        </h5>
                        <small>Appoinment</small>
                      </div>
                      <div className="col-6">
                        <h5>
                          {doctorData
                            ? doctorData.filter((item) => {
                                return item.appointment_patient === "N";
                              })?.length
                            : 0}
                        </h5>
                        <small>Walk-In</small>
                      </div>
                      <div className="col-6">
                        <h5>
                          {doctorData
                            ? doctorData.filter((item) => {
                                return item.new_visit_patient === "Y";
                              })?.length
                            : 0}
                        </h5>
                        <small>New Patients</small>
                      </div>
                      <div className="col-6">
                        <h5>
                          {doctorData
                            ? doctorData.filter((item) => {
                                return item.new_visit_patient === "N";
                              })?.length
                            : 0}
                        </h5>
                        <small>Follow Up</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
