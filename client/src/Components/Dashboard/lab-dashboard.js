import React, { useState, useContext } from "react";
import { Bar, HorizontalBar } from "react-chartjs-2";
// import { swalMessage } from "../../../../../utils/algaehApiCall";
import "./dashboard.scss";
import moment from "moment";
import swal from "sweetalert2";
// import AlgaehFile from "../../../../Wrapper/algaehFileUpload";

import {
  AlgaehDateHandler,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehMessagePop,
  Spin,
  MainContext,
  DatePicker,
  Menu,
  Dropdown,
  AlgaehModal,
  AlgaehButton,
  AlgaehFormGroup,
  // Spin,
} from "algaeh-react-components";
import { algaehApiCall } from "../../utils/algaehApiCall";

import { useForm, Controller } from "react-hook-form";
// import Enumerable from "linq";
import { newAlgaehApi } from "../../hooks";
import { useQuery } from "react-query";
// import _ from "lodash";
// import { number } from "algaeh-react-components/node_modules/@types/prop-types";
import Options from "../../Options.json";
export default function Dashboard() {
  const { userToken } = useContext(MainContext);
  console.log("userToken", userToken);

  const [sendInAndOutData, setSendInAndSendOutData] = useState({
    send_in: [],
    send_out: [],
  });
  const [visible, setVisible] = useState(false);
  const [body_mail, setBody_mail] = useState("");
  const [reportParams, setReportParams] = useState({
    reportName: "",
    MailName: "",
    paramName1: "",
    paramValue1: "",
    paramName2: "",
    paramValue2: "",
  });
  const [loading, setLoading] = useState(false);
  const [axisForSendInAndSendOut, setAxisForSendInAndSendOut] = useState([]);

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
      today_date_orderStatus: new Date(),
      today_date_Top_10: new Date(),
      order_category: moment(new Date()),
      sendIn_sendOut: moment(new Date()),
    },
  });

  async function getSendInAndSendOutTestDetails(key) {
    let objData = getValues().sendIn_sendOut;
    var startOfWeek = objData.startOf("week").toDate();
    var endOfWeek = objData.endOf("week").toDate();

    const result = await newAlgaehApi({
      uri: "/laboratory/getSendInAndSendOutTestDetails",
      method: "GET",
      module: "laboratory",
      data: {
        from_date: moment(startOfWeek).format("YYYY-MM-DD"),
        to_date: moment(endOfWeek).format("YYYY-MM-DD"),
      },
    });
    return result?.data?.records;
  }
  const {
    // data: send,
    isLoading: sendInOutLoad,
    refetch: refetchForSendInAndSendOut,
  } = useQuery(
    "getSendInAndSendOutTestDetails",
    getSendInAndSendOutTestDetails,
    {
      onSuccess: (data) => {
        //

        let currentDate = getValues().sendIn_sendOut;
        let weekStart = currentDate.startOf("week").toDate();

        let days = [];
        let send_in = [];
        let send_out = [];
        for (var i = 0; i <= 6; i++) {
          let weeDay = moment(weekStart).add(i, "days");
          const patients = data.find(
            (f) =>
              moment(f.date).format("YYYYMMDD") ===
              weeDay.clone().format("YYYYMMDD")
          );
          if (patients) {
            const hasVisitPatient = patients.detailsOf.find(
              (f) => f.send_out_test === "Y"
            );
            if (hasVisitPatient) {
              send_out.push(hasVisitPatient.detail.length);
            } else {
              send_out.push(0);
            }
            const hasFollowPatient = patients.detailsOf.find(
              (f) => f.send_out_test === "N"
            );
            if (hasFollowPatient) {
              send_in.push(hasFollowPatient.detail.length);
            } else {
              send_in.push(0);
            }
          } else {
            send_out.push(0);
            send_in.push(0);
          }
          days.push(weeDay.clone().format("MMMM Do"));
        }
        setSendInAndSendOutData((prev) => {
          return { ...prev, send_in: send_in, send_out: send_out };
        });
        setAxisForSendInAndSendOut(days);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function top10LabOrders(key) {
    let objData = getValues().today_date_Top_10;

    const result = await newAlgaehApi({
      uri: "/laboratory/top10LabOrders",
      method: "GET",
      module: "laboratory",
      data: {
        from_date: moment(objData).format("YYYY-MM-DD"),
        to_date: moment(objData).format("YYYY-MM-DD"),
      },
    });
    return result?.data?.records;
  }
  const {
    data: orderByTestCatData,
    isLoading: loadingOrderCategory,
    refetch: refetchForPatCount,
  } = useQuery("getOrderByTestCategory", getOrderByTestCategory, {
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });
  const { data: labOrderServicesData } = useQuery(
    "getLabOrderedServices",
    getLabOrderedServices,
    {
      // onSuccess: (data) => {
      //
      // },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const {
    data: labOrderServicesDataForReportView,
    refetch: refetchForOrderStatus,
  } = useQuery(
    "getLabOrderServicesDataForReportView",
    getLabOrderServicesDataForReportView,
    {
      // onSuccess: (data) => {
      //
      // },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const { data: top10Orders, refetch: top10OrderRefetch } = useQuery(
    "top10LabOrders",
    top10LabOrders,
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

  async function getOrderByTestCategory(key) {
    let objData = getValues().order_category;
    var startOfWeek = objData.startOf("week").toDate();
    var endOfWeek = objData.endOf("week").toDate();

    const result = await newAlgaehApi({
      uri: "/laboratory/getOrderByTestCategory",
      method: "GET",
      module: "laboratory",
      data: {
        from_date: moment(startOfWeek).format("YYYY-MM-DD"),
        to_date: moment(endOfWeek).format("YYYY-MM-DD"),
      },
    });
    return result?.data?.records;
  }
  async function getLabOrderedServices(key) {
    const result = await newAlgaehApi({
      uri: "/laboratory/getLabOrderedServices",
      module: "laboratory",
      method: "GET",
    });
    return result?.data?.records;
  }

  async function getLabOrderServicesDataForReportView(key) {
    const date = getValues().today_date_orderStatus;
    const result = await newAlgaehApi({
      uri: "/laboratory/getLabOrderedServices",
      module: "laboratory",
      method: "GET",
      data: {
        from_date: moment(date).format("YYYY-MM-DD"),
        to_date: moment(date).format("YYYY-MM-DD"),
      },
    });
    return result?.data?.records;
  }
  const OrderBYTestCategory = {
    labels: orderByTestCatData?.map((item) => {
      return item.category_name;
    }),
    datasets: [
      {
        data: orderByTestCatData?.map((item) => {
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
    labels: top10Orders?.map((item) => {
      return item.service_name;
    }),
    datasets: [
      {
        data: top10Orders?.map((item) => {
          return item.service_count;
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
  // const patientIncomingHistory = {
  //   datasets: [
  //     {
  //       type: "line",
  //       label: "Patient Count",
  //       data: countOfIncoming,
  //       fill: false,
  //       backgroundColor: "#71B37C",
  //       borderColor: "#71B37C",
  //       hoverBackgroundColor: "#71B37C",
  //       hoverBorderColor: "#71B37C",
  //       yAxisID: "y-axis-1",
  //     },
  //   ],
  // };

  // const patientIncomingHistoryOptions = {
  //   responsive: true,
  //   legend: {
  //     position: "bottom",
  //     labels: {
  //       boxWidth: 10,
  //     },
  //   },
  //   tooltips: {
  //     mode: "label",
  //   },
  //   elements: {
  //     line: {
  //       fill: false,
  //     },
  //   },
  //   scales: {
  //     xAxes: [
  //       {
  //         display: true,
  //         gridLines: {
  //           display: false,
  //         },
  //         labels: xAxisOfIncoming,
  //       },
  //     ],
  //     yAxes: [
  //       {
  //         type: "linear",
  //         display: true,
  //         position: "left",
  //         id: "y-axis-1",
  //         gridLines: {
  //           display: false,
  //         },
  //         labels: {
  //           show: true,
  //         },
  //       },
  //     ],
  //   },
  // };

  // const patientIncomingcategory = {
  //   datasets: [
  //     {
  //       type: "bar",
  //       label: "New Patient",
  //       data: followupNewVisit.newVisit,
  //       fill: false,
  //       backgroundColor: "#71B37C",
  //       borderColor: "#71B37C",
  //       hoverBackgroundColor: "#71B37C",
  //       hoverBorderColor: "#71B37C",
  //       yAxisID: "y-axis-1",
  //     },
  //     {
  //       type: "bar",
  //       label: "Follow Up",
  //       data: followupNewVisit.followUp,
  //       fill: false,
  //       backgroundColor: "#EC932F",
  //       borderColor: "#EC932F",
  //       hoverBackgroundColor: "#EC932F",
  //       hoverBorderColor: "#EC932F",
  //       yAxisID: "y-axis-1",
  //     },
  //   ],
  // };

  // const patientIncomingcategoryOptions = {
  //   responsive: true,
  //   legend: {
  //     position: "bottom",
  //     labels: {
  //       boxWidth: 10,
  //     },
  //   },
  //   tooltips: {
  //     mode: "label",
  //   },
  //   elements: {
  //     line: {
  //       fill: false,
  //     },
  //   },
  //   scales: {
  //     xAxes: [
  //       {
  //         stacked: true,
  //         display: true,
  //         gridLines: {
  //           display: false,
  //         },
  //         labels: axisOfFollowUpAndIncome,
  //       },
  //     ],
  //     yAxes: [
  //       {
  //         stacked: true,
  //         type: "linear",
  //         display: true,
  //         position: "left",
  //         id: "y-axis-1",
  //         gridLines: {
  //           display: false,
  //         },
  //         labels: {
  //           show: true,
  //         },
  //       },
  //     ],
  //   },
  // };
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
          labels: axisForSendInAndSendOut,
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
  const AppoWalkInData = {
    datasets: [
      {
        type: "bar",
        label: "Send-In",
        data: sendInAndOutData.send_in,
        fill: false,
        backgroundColor: "#71B37C",
        borderColor: "#71B37C",
        // hoverBackgroundColor: "#71B37C",
        // hoverBorderColor: "#71B37C",
        yAxisID: "y-axis-1",
      },
      {
        type: "bar",
        label: "Send Out",
        data: sendInAndOutData.send_out,
        fill: false,
        backgroundColor: "#34b8bc",
        borderColor: "#34b8bc",
        // hoverBackgroundColor: "#34b8bc",
        // hoverBorderColor: "#34b8bc",
        yAxisID: "y-axis-1",
      },
    ],
  };
  // render() {

  const printLabDashboardReport = ({
    reportName,
    paramName1,
    paramValue1,
    paramName2,
    paramValue2,
  }) => {
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
          reportName: reportName,
          pageSize: "A4",
          pageOrentation: "portrait",
          reportParams: [
            {
              name: paramName1,
              value: paramValue1,
            },
            {
              name: paramName2,
              value: paramValue2,
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
    });
  };

  async function labDashBoardWithAttachment(reportParams) {
    // return new Promise((resolve, reject) => {
    setLoading(true);
    // try {
    const result = await newAlgaehApi({
      uri: "/laboratory/labDashBoardWithAttachment",
      module: "laboratory",
      method: "GET",
      data: {
        ...reportParams,
      },
      // onSuccess: (res) => {
      //   swal({
      //     title: "Successfully Sent",
      //     type: "success",
      //   });
      //   // resolve();
      // },
      // onCatch: (error) => {
      //   swal({
      //     title: error.message,
      //     type: "error",
      //   });
      //   reject();
      // },
    });
    return result?.data?.records;
    // } catch (e) {
    //   reject(e);
    // }
    // })
  }
  const menuTestCategory = (
    <Menu>
      <Menu.Item key="1">
        <span
          onClick={() => {
            let objDataOrderByTestCategory = getValues().order_category;
            const startOfWeekOrderByTestCategory = objDataOrderByTestCategory
              .startOf("week")
              .toDate();
            const endOfWeekOrderByTestCategory = objDataOrderByTestCategory
              .endOf("week")
              .toDate();
            printLabDashboardReport({
              reportName: "LabOrderTestCategory",
              MailName: "Lab Dashboard Lab Test Category Report",
              paramName1: "startOfWeekOrderByTestCategory",
              paramValue1: startOfWeekOrderByTestCategory,
              paramName2: "endOfWeekOrderByTestCategory",
              paramValue2: endOfWeekOrderByTestCategory,
            });
          }}
        >
          Print LabDashboard
        </span>
      </Menu.Item>
      <Menu.Item key="2">
        <span
          onClick={() => {
            let objDataOrderByTestCategory = getValues().order_category;
            const startOfWeekOrderByTestCategory = objDataOrderByTestCategory
              .startOf("week")
              .toDate();
            const endOfWeekOrderByTestCategory = objDataOrderByTestCategory
              .endOf("week")
              .toDate();
            setVisible(true);
            setReportParams({
              reportName: "LabOrderTestCategory",
              MailName: "Lab Dashboard Lab Test Category Report",
              paramName1: "startOfWeekOrderByTestCategory",
              paramValue1: startOfWeekOrderByTestCategory,
              paramName2: "endOfWeekOrderByTestCategory",
              paramValue2: endOfWeekOrderByTestCategory,
            });
          }}
        >
          Send Report Through Email
        </span>
      </Menu.Item>
    </Menu>
  );
  const menuSendInSendOut = (
    <Menu>
      <Menu.Item key="1">
        <span
          onClick={() => {
            let objDataSendInOut = getValues().sendIn_sendOut;
            const startOfWeekSendInOut = objDataSendInOut
              .startOf("week")
              .toDate();
            const endOfWeekSendInOut = objDataSendInOut.endOf("week").toDate();
            printLabDashboardReport({
              reportName: "labDashSendInSendOut",
              MailName: "Lab Dashboard Send-In send-Out Report",
              paramName1: "startOfWeekSendInOut",
              paramValue1: startOfWeekSendInOut,
              paramName2: "endOfWeekSendInOut",
              paramValue2: endOfWeekSendInOut,
            });
          }}
        >
          Print LabDashboard
        </span>
      </Menu.Item>
      <Menu.Item key="2">
        <span
          onClick={() => {
            let objDataSendInOut = getValues().sendIn_sendOut;
            const startOfWeekSendInOut = objDataSendInOut
              .startOf("week")
              .toDate();

            const endOfWeekSendInOut = objDataSendInOut.endOf("week").toDate();
            setVisible(true);
            setReportParams({
              reportName: "labDashSendInSendOut",
              MailName: "Lab Dashboard Send-In send-Out Report",
              paramName1: "startOfWeekSendInOut",
              paramValue1: startOfWeekSendInOut,
              paramName2: "endOfWeekSendInOut",
              paramValue2: endOfWeekSendInOut,
            });
          }}
        >
          Send Report Through Email
        </span>
      </Menu.Item>
    </Menu>
  );

  const menuTop10 = (
    <Menu>
      <Menu.Item key="1">
        <span
          onClick={() => {
            let objDataTop10Orders = getValues().today_date_Top_10;
            printLabDashboardReport({
              reportName: "labDashTop10Orders",
              MailName: "Lab Dashboard Top 10 Orders Report",
              paramName1: "objDataTop10OrdersFrom",
              paramValue1: moment(objDataTop10Orders).format("YYYY-MM-DD"),
              paramName2: "objDataTop10OrdersTo",
              paramValue2: moment(objDataTop10Orders).format("YYYY-MM-DD"),
            });
          }}
        >
          Print LabDashboard
        </span>
      </Menu.Item>
      <Menu.Item key="2">
        <span
          onClick={() => {
            let objDataTop10Orders = getValues().today_date_Top_10;
            setVisible(true);
            setReportParams({
              reportName: "labDashTop10Orders",
              MailName: "Lab Dashboard Top 10 Orders Report",
              paramName1: "objDataTop10OrdersFrom",
              paramValue1: moment(objDataTop10Orders).format("YYYY-MM-DD"),
              paramName2: "objDataTop10OrdersTo",
              paramValue2: moment(objDataTop10Orders).format("YYYY-MM-DD"),
            });
          }}
        >
          Send Report Through Email
        </span>
      </Menu.Item>
    </Menu>
  );
  const menuTodayOrderStatus = (
    <Menu>
      <Menu.Item key="1">
        <span
          onClick={() => {
            const dateGetLabOrderServices = getValues().today_date_orderStatus;
            printLabDashboardReport({
              reportName: "labDashTodayOrderStatus",
              MailName: "Lab Dashboard Today Order Status Report",
              paramName1: "dateGetLabOrderServicesStart",
              paramValue1: moment(dateGetLabOrderServices).format("YYYY-MM-DD"),
              paramName2: "dateGetLabOrderServicesEnd",
              paramValue2: moment(dateGetLabOrderServices).format("YYYY-MM-DD"),
            });
          }}
        >
          Print LabDashboard
        </span>
      </Menu.Item>
      <Menu.Item key="2">
        <span
          onClick={() => {
            const dateGetLabOrderServices = getValues().today_date_orderStatus;
            setVisible(true);
            setReportParams({
              reportName: "labDashTodayOrderStatus",
              MailName: "Lab Dashboard Today Order Status Report",
              paramName1: "dateGetLabOrderServicesStart",
              paramValue1: moment(dateGetLabOrderServices).format("YYYY-MM-DD"),
              paramName2: "dateGetLabOrderServicesEnd",
              paramValue2: moment(dateGetLabOrderServices).format("YYYY-MM-DD"),
            });
            // labDashBoardWithAttachment();
          }}
        >
          Send Report Through Email
        </span>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <AlgaehModal
        title={`Send mail`}
        visible={visible}
        destroyOnClose={true}
        // okText="Confirm"
        // onOk={() => {
        footer={[
          <AlgaehButton
            className="btn btn-other"
            onClick={() => {
              setVisible(false);
            }}
          >
            Cancel
          </AlgaehButton>,
          <AlgaehButton
            loading={loading}
            className="btn btn-primary"
            onClick={() => {
              labDashBoardWithAttachment({
                ...reportParams,
                to_mail_id: getValues().to_mail_id,
                body_mail: body_mail,
              })
                .then(() => {
                  setVisible(false);
                  swal({
                    title: "Successfully Sent",
                    type: "success",
                  });
                  setBody_mail("");
                  setLoading(false);
                })
                .catch((error) => {
                  swal({
                    title: error.message,
                    type: "error",
                  });
                  setVisible(false);
                  setBody_mail("");
                  setLoading(false);
                });
            }}
          >
            <AlgaehLabel
              label={{
                forceLabel: "Send Mail with Attachment",
                returnText: true,
              }}
            />
          </AlgaehButton>,
        ]}
        onCancel={() => {
          // finance_voucher_header_id = "";
          // rejectText = "";
          setVisible(false);
        }}
      >
        <div className="row">
          <form>
            <Controller
              name="to_mail_id"
              control={control}
              rules={{ required: "Required" }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col form-group mandatory" }}
                  error={errors}
                  label={{
                    forceLabel: "Enter To mail Id",
                    isImp: true,
                  }}
                  textBox={{
                    ...props,
                    className: "txt-fld",
                    name: "to_mail_id",
                  }}
                />
              )}
            />

            <div className="col-12">
              <AlgaehLabel
                label={{
                  forceLabel: "Enter Body of the mail",
                }}
              />

              <textarea
                value={body_mail}
                name="body_mail"
                onChange={(e) => {
                  setBody_mail(e.target.value);
                }}
              />
            </div>
          </form>
        </div>
      </AlgaehModal>
      <Spin spinning={loading}>
        <div className="dashboard lab-dash">
          <div className="row card-deck">
            <div className="card animated fadeInUp faster">
              <div className="content">
                <div className="row">
                  <div className="col-4">
                    {/* <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div> */}
                  </div>
                  <div className="col-8">
                    <div className="numbers">
                      <p>Total Ordered</p>
                      {labOrderServicesData?.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card animated fadeInUp faster">
              <div className="content">
                <div className="row">
                  <div className="col-4">
                    {/* <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div> */}
                  </div>
                  <div className="col-8">
                    <div className="numbers">
                      <p>Total Collected</p>
                      {
                        labOrderServicesData?.filter((f) => {
                          return f.status === "CL";
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
                    {/* <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div> */}
                  </div>
                  <div className="col-8">
                    <div className="numbers">
                      <p>Total Confirmed</p>
                      {
                        labOrderServicesData?.filter((f) => {
                          return f.status === "CF";
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
                    {/* <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div> */}
                  </div>
                  <div className="col-8">
                    <div className="numbers">
                      <p>Total Rejected</p>
                      {
                        labOrderServicesData?.filter((f) => {
                          return f.status === "CN";
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
                    {/* <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div> */}
                  </div>
                  <div className="col-8">
                    <div className="numbers">
                      <p>Total Validated</p>
                      {
                        labOrderServicesData?.filter((f) => {
                          return f.status === "V";
                        }).length
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="card animated fadeInUp faster">
                <h6>
                  Order by Test Category{" "}
                  <span className="portletTopAction">
                    <Controller
                      control={control}
                      name="order_category"
                      rules={{ required: "Please Select " }}
                      render={({ onChange, value }) => (
                        <div className="col mandatory " tabIndex="5">
                          <label
                            htmlFor="order_category"
                            className="style_Label "
                          />

                          <DatePicker
                            name="order_category"
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
                  <div className="row">
                    <Dropdown overlay={menuTestCategory}>
                      <button className="btn btn-default btn-circle active">
                        <i className="fas fa-print" />
                      </button>
                    </Dropdown>
                  </div>
                </h6>

                <div className="dashboardChartsCntr">
                  <Spin spinning={loadingOrderCategory}>
                    <HorizontalBar data={OrderBYTestCategory} />
                  </Spin>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card animated fadeInUp faster">
                <h6>
                  Send-In vs Send Out
                  <span className="portletTopAction">
                    <Controller
                      control={control}
                      name="sendIn_sendOut"
                      rules={{ required: "Please Select DOB" }}
                      render={({ onChange, value }) => (
                        <div className="col mandatory " tabIndex="5">
                          <label
                            htmlFor="sendIn_sendOut"
                            className="style_Label "
                          />

                          <DatePicker
                            name="sendIn_sendOut"
                            value={value}
                            onChange={(date) => {
                              if (date) {
                                onChange(date);
                                refetchForSendInAndSendOut();
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
                  <div className="row">
                    <Dropdown overlay={menuSendInSendOut}>
                      <button className="btn btn-default btn-circle active">
                        <i className="fas fa-print" />
                      </button>
                    </Dropdown>
                  </div>
                </h6>
                <div className="dashboardChartsCntr">
                  <Spin spinning={sendInOutLoad}>
                    <Bar
                      data={AppoWalkInData}
                      options={AppoWalkInDataOptions}
                    />
                  </Spin>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="card animated fadeInUp faster">
                <h6>
                  Today Top 10 Orders
                  <span className="portletTopAction">
                    <Controller
                      control={control}
                      name="today_date_Top_10"
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
                            name: "today_date_Top_10",
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
                                top10OrderRefetch();
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
                  <div className="col">
                    <Dropdown overlay={menuTop10}>
                      <button className="btn btn-default btn-circle active">
                        <i className="fas fa-print" />
                      </button>
                    </Dropdown>
                  </div>
                </h6>
                <div className="dashboardChartsCntr">
                  <Spin spinning={false}>
                    <HorizontalBar data={RevenuebyDoctor} />
                  </Spin>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card animated fadeInUp faster">
                <h6>
                  Today's Order Status{" "}
                  <span className="portletTopAction">
                    <Controller
                      control={control}
                      name="today_date_orderStatus"
                      rules={{ required: "Please Select" }}
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
                            name: "today_date_orderStatus",
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
                                refetchForOrderStatus();
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
                  <span className="portletTopAction">
                    <Dropdown overlay={menuTodayOrderStatus}>
                      <button className="btn btn-default btn-circle active">
                        <i className="fas fa-print" />
                      </button>
                    </Dropdown>
                  </span>
                </h6>
                <div className="portlet-body">
                  <div className="col-12" id="ResultViewForDocGrid">
                    <AlgaehDataGrid
                      columns={[
                        {
                          fieldName: "ordered_date",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "ordered_date" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            if (row.ordered_date != null) {
                              return moment(row.ordered_date).format(
                                Options.datetimeFormat
                              );
                            } else {
                              return "--";
                            }
                            // <span>
                            //   {this.changeDateFormat(row.ordered_date)}
                            // </span>
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
                          label: (
                            <AlgaehLabel label={{ fieldName: "proiorty" }} />
                          ),
                          displayTemplate: (row) => {
                            return row.test_type === "S" ? (
                              <span className="badge badge-danger">Stat</span>
                            ) : (
                              <span className="badge badge-secondary">
                                Routine
                              </span>
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
                          fieldName: "sample_status",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Specimen Status" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return row.sample_status === "N" ? (
                              <span className="badge badge-light">
                                Not Done
                              </span>
                            ) : row.sample_status === "A" ? (
                              <span className="badge badge-success">
                                Accepted
                              </span>
                            ) : row.sample_status === "R" ? (
                              <span className="badge badge-danger">
                                Rejected
                              </span>
                            ) : null;
                          },
                          disabled: true,
                          others: {
                            maxWidth: 150,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "lab_id_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Lab ID Number" }}
                            />
                          ),
                          disabled: true,
                          others: {
                            maxWidth: 130,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "patient_code",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "patient_code" }}
                            />
                          ),
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
                            <AlgaehLabel
                              label={{ fieldName: "patient_name" }}
                            />
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
                            <AlgaehLabel label={{ fieldName: "status" }} />
                          ),
                          displayTemplate: (row) => {
                            return row.status === "CL" ? (
                              <span className="badge badge-secondary">
                                Collected
                              </span>
                            ) : row.status === "CN" ? (
                              <span className="badge badge-danger">
                                Cancelled
                              </span>
                            ) : row.status === "CF" ? (
                              <span className="badge badge-primary">
                                Confirmed
                              </span>
                            ) : (
                              <span className="badge badge-success">
                                Validated
                              </span>
                            );
                          },
                          disabled: true,
                          others: {
                            maxWidth: 130,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        // {
                        //   fieldName: "critical_status",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "Critical Result" }}
                        //     />
                        //   ),
                        //   displayTemplate: (row) => {
                        //     return row.critical_status === "N" ? (
                        //       <span className="badge badge-primary">No</span>
                        //     ) : (
                        //       <span className="badge badge-danger">Yes</span>
                        //     );
                        //   },
                        //   disabled: true,
                        //   others: {
                        //     maxWidth: 130,
                        //     resizable: false,
                        //     style: { textAlign: "center" },
                        //   },
                        // },
                      ]}
                      keyId="patient_code"
                      data={labOrderServicesDataForReportView ?? []}
                      filterable={true}
                      pagination={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
}
