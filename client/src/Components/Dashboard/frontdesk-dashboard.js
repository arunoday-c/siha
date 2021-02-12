import React, { useState, useContext } from "react";
import { Bar, HorizontalBar } from "react-chartjs-2";
// import { swalMessage } from "../../../../../utils/algaehApiCall";
import "./dashboard.scss";
import moment from "moment";

import { GetAmountFormart } from "../../utils/GlobalFunctions";
// import AlgaehFile from "../../../../Wrapper/algaehFileUpload";

import {
  AlgaehMessagePop,
  Spin,
  MainContext,
  DatePicker,
  AlgaehDateHandler,
} from "algaeh-react-components";

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

const getFrontDeskDataForEmployee = async (key, { created_by }) => {
  const result = await newAlgaehApi({
    uri: "/frontDesk/getFrontDeskDataForEmployee",
    data: {
      today_date: moment(new Date()).format("YYYY-MM-DD"),
      created_by: created_by,
    },
    method: "GET",
    module: "frontDesk",
  });
  return result?.data?.records;
};
// const getDoctorDashboardData = async (key, { employee_id }) => {
//   const result = await newAlgaehApi({
//     uri: "/doctorsWorkBench/getDoctorDashboardData",

//     method: "GET",
//     data: { doctor_id: employee_id },
//   });
//   return result?.data?.records;
// };
export default function Dashboard() {
  const { userToken } = useContext(MainContext);
  console.log("userToken", userToken);
  // const [income_range, setIncome_range] = useState([
  //   moment().startOf("week"),
  //   moment().endOf("week"),
  // ]);
  // const [subDeptData, setSubDeptData] = useState([]);
  // const [openAttachmentsModal, setOpenAttachmentsModal] = useState(false);
  const [appointmentWalkIn, setAppointmentWalkIN] = useState({
    walkIn: [],
    appointment: [],
  });

  const [axisOfFollowUpAndIncome, setaxisOffollowUpAndincome] = useState([]);

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
      appointment_walk: moment(new Date()),
      booking_dept: new Date(),
      today_date_doctor_visit: new Date(),
    },
  });
  // const {
  //   data: todayPatients,
  //   isLoading: pdLoading,
  //   refetch: refetchForPat,
  // } = useQuery("today_patient", getTodaysPatients, {
  //   onError: (err) => {
  //     AlgaehMessagePop({
  //       display: err?.message,
  //       type: "error",
  //     });
  //   },
  // });
  const { data: appointmentDetails } = useQuery(
    ["appointmentDetails", { created_by: userToken.employee_id }],
    getFrontDeskDataForEmployee,
    {
      // enabled: !!EmpMasterIOputs,
      // initialStale: true,
      refetch: false,
      onSuccess: (data) => {
        console.log("appointmentDetails0", appointmentDetails);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  // const { data: doctorData } = useQuery(
  //   ["doctorData", { employee_id: userToken.employee_id }],
  //   getDoctorDashboardData,
  //   {
  //     // enabled: !!EmpMasterIOputs,
  //     // initialStale: true,
  //     // refetch: false,

  //     onError: (err) => {
  //       AlgaehMessagePop({
  //         display: err?.message,
  //         type: "error",
  //       });
  //     },
  //   }
  // );
  async function getFrontDeskDashboardForSubdept(key) {
    const objData = getValues().booking_dept;
    const result = await newAlgaehApi({
      uri: "/frontDesk/getFrontDeskDashboardForSubdept",
      data: {
        today_date: moment(objData).format("YYYY-MM-DD"),

        created_by: userToken.employee_id,
      },
      method: "GET",
      module: "frontDesk",
    });
    return result?.data?.records;
  }
  const {
    data: subDeptData,
    isLoading: InvestigationLoad,
    refetch: refetchForBookingByDept,
  } = useQuery(
    "getFrontDeskDashboardForSubdept",
    getFrontDeskDashboardForSubdept,
    {
      // onSuccess: (data) => {
      //   setXAxisForSubDept(
      //     data.map((item) => {
      //       return item.sub_department_name;
      //     })
      //   );

      //   setSubDeptData(
      //     data.map((item) => {
      //       return item.detailsOf.length;
      //     })
      //   );
      // setBookingByDept(data.)
      // },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getFrontDeskDashboardDoctor(key) {
    const objData = getValues().today_date_doctor_visit;
    const result = await newAlgaehApi({
      uri: "/frontDesk/getFrontDeskDashboardDoctor",
      data: {
        today_date: moment(objData).format("YYYY-MM-DD"),

        created_by: userToken.employee_id,
      },
      method: "GET",
      module: "frontDesk",
    });
    return result?.data?.records;
  }
  const {
    data: doctorDataForVisits,
    isLoading: doctorDataLoad,
    refetch: refetchForDoctor,
  } = useQuery("getFrontDeskDashboardDoctor", getFrontDeskDashboardDoctor, {
    // onSuccess: (data) => {
    // setXAxisForDoctor(
    //   data.map((item) => {
    //     return item.full_name;
    //   })
    // );

    // setDoctorDataForVisits(
    //   data.map((item) => {
    //     return item.detailsOf.length;
    //   })
    // );
    //   // setBookingByDept(data.)
    // },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });
  // async function getFrontDeskDataForEmployee(key) {
  //   const objData = getValues();
  //   const result = await newAlgaehApi({
  //     uri: "/mrd/getFrontDeskDataForEmployee",
  //     module: "MRD",
  //     data: {
  //       from_date: moment(objData.services_date).format("YYYY-MM-DD"),
  //       to_date: moment(objData.services_date).format("YYYY-MM-DD"),
  //     },
  //     method: "GET",
  //   });
  //   return result?.data?.records;
  // }
  const {
    data: amountToPLot,
    isLoading: amountPlot,
    // refetch: refetchForPatCount,
  } = useQuery("getCashForDashBoard", getCashForDashBoard, {
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });
  const {
    data: followupAndNewPatient,
    // isLoading: followup,
    refetch: refetchForPatFollow,
  } = useQuery("getFrontDeskDataForWeek", getFrontDeskDataForWeek, {
    onSuccess: (data) => {
      console.log("datat", data);
      let currentDate = getValues().appointment_walk;
      let weekStart = currentDate.startOf("week").toDate();

      let days = [];
      let walkIn = [];
      let appointment = [];
      for (var i = 0; i <= 6; i++) {
        let weeDay = moment(weekStart).add(i, "days");
        const patients = data.find(
          (f) =>
            moment(f.date).format("YYYYMMDD") ===
            weeDay.clone().format("YYYYMMDD")
        );
        if (patients) {
          const hasVisitPatient = patients.detailsOf.find(
            (f) => f.appointment_patient === "N"
          );
          if (hasVisitPatient) {
            walkIn.push(hasVisitPatient.detail.length);
          } else {
            walkIn.push(0);
          }
          const hasFollowPatient = patients.detailsOf.find(
            (f) => f.appointment_patient === "Y"
          );
          if (hasFollowPatient) {
            appointment.push(hasFollowPatient.detail.length);
          } else {
            appointment.push(0);
          }
        } else {
          walkIn.push(0);
          appointment.push(0);
        }
        days.push(weeDay.clone().format("MMMM Do"));
      }
      setAppointmentWalkIN((prev) => {
        return { ...prev, appointment: appointment, walkIn: walkIn };
      });
      setaxisOffollowUpAndincome(days);

      console.log("patientCount", followupAndNewPatient);
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });

  async function getCashForDashBoard(key) {
    const result = await newAlgaehApi({
      uri: "/frontDesk/getCashForDashBoard",
      data: {
        today_date: moment(new Date()).format("YYYY-MM-DD"),
        casher_id: userToken.employee_id,
        hospital_id: userToken.hospital_id,
      },
      method: "GET",
      module: "frontDesk",
    });
    return result?.data?.records;
  }
  async function getFrontDeskDataForWeek(key) {
    let objData = getValues().appointment_walk;
    var startOfWeek = objData.startOf("week").toDate();
    var endOfWeek = objData.endOf("week").toDate();

    const result = await newAlgaehApi({
      uri: "/frontDesk/getFrontDeskDataForWeek",
      data: {
        from_date: moment(startOfWeek).format("YYYY-MM-DD"),
        to_date: moment(endOfWeek).format("YYYY-MM-DD"),
        created_by: userToken.employee_id,
      },
      method: "GET",
      module: "frontDesk",
    });
    return result?.data?.records;
  }

  const AppoWalkInData = {
    datasets: [
      {
        type: "bar",
        label: "Appointments",
        data: appointmentWalkIn.appointment,
        fill: false,
        backgroundColor: "#71B37C",
        borderColor: "#71B37C",
        // hoverBackgroundColor: "#71B37C",
        // hoverBorderColor: "#71B37C",
        yAxisID: "y-axis-1",
      },
      {
        type: "bar",
        label: "Walk-in",
        data: appointmentWalkIn.walkIn,
        fill: false,
        backgroundColor: "#34b8bc",
        borderColor: "#34b8bc",
        // hoverBackgroundColor: "#34b8bc",
        // hoverBorderColor: "#34b8bc",
        yAxisID: "y-axis-1",
      },
    ],
  };
  const AppoWalkInDataOptions = {
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

  const RevenuebyDepartment = {
    labels: subDeptData?.map((item) => {
      return item.sub_department_name;
    }),
    datasets: [
      {
        data: subDeptData?.map((item) => {
          return item.detailsOf.length;
        }),
        label: "Total Booking",

        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
      },
    ],
  };

  const RevenuebyDoctor = {
    labels: doctorDataForVisits?.map((item) => {
      return item.full_name;
    }),
    datasets: [
      {
        data: doctorDataForVisits?.map((item) => {
          return item.detailsOf.length;
        }),
        label: "Total Booking",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
      },
    ],
  };

  // render() {
  return (
    <div className="dashboard front-dash">
      <div className="row card-deck">
        <Spin spinning={amountPlot}>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-calendar-check" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Today's Appointments</p>
                    {
                      appointmentDetails?.filter((item) => {
                        return item.appointment_patient === "Y";
                      }).length
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-walking" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Today's Walk-In</p>
                    {
                      appointmentDetails?.filter((item) => {
                        return item.appointment_patient === "N";
                      }).length
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-hand-holding-usd" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Today Received by Cash</p>

                    {GetAmountFormart(
                      amountToPLot?.length > 0
                        ? amountToPLot[0].expected_cash
                        : 0
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-hand-holding-usd" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Today Received by Card</p>
                    {GetAmountFormart(
                      amountToPLot?.length > 0
                        ? amountToPLot[0].expected_card
                        : 0
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </div>

      <div className="row">
        <div className="col-4">
          <div className="card animated fadeInUp faster">
            <h6>
              Appointments vs Walk-In
              <span className="portletTopAction">
                <Controller
                  control={control}
                  name="appointment_walk"
                  rules={{ required: "Please Select " }}
                  render={({ onChange, value }) => (
                    <div className="col mandatory " tabIndex="5">
                      <label htmlFor="income_range" className="style_Label " />

                      <DatePicker
                        name="appointment_walk"
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
              <Spin spinning={InvestigationLoad}>
                <Bar data={AppoWalkInData} options={AppoWalkInDataOptions} />
              </Spin>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card animated fadeInUp faster">
            <h6>
              Patients Booking by Department
              <span className="portletTopAction">
                <Controller
                  control={control}
                  name="booking_dept"
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
                        name: "booking_dept",
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
                            refetchForBookingByDept();
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
              </span>
            </h6>
            <div className="dashboardChartsCntr">
              <HorizontalBar data={RevenuebyDepartment} />
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card animated fadeInUp faster">
            <h6>
              Patients Walk-In by Doctor
              <span className="portletTopAction">
                <Controller
                  control={control}
                  name="today_date_doctor_visit"
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
                        name: "today_date_doctor_visit",
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
                            refetchForDoctor();
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
              </span>
            </h6>
            <div className="dashboardChartsCntr">
              <Spin spinning={doctorDataLoad}>
                <HorizontalBar data={RevenuebyDoctor} />
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { Component } from "react";
// import "./dashboard.scss";
// import { Bar, HorizontalBar } from "react-chartjs-2";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import { AlgaehActions } from "../../actions/algaehActions";
// // import { getCookie } from "../../utils/algaehApiCall.js";
// import { GetAmountFormart } from "../../utils/GlobalFunctions";
