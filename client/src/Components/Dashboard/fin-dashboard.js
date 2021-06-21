import React, { useContext, useState, useEffect } from "react";
// import { Bar, HorizontalBar } from "react-chartjs-2";
// import { AlgaehActions } from "../../actions/algaehActions";
// import { swalMessage } from "../../../../../utils/algaehApiCall";
import "./dashboard.scss";
// import DashBoardEvents, {
//   chartLegends,
//   chartOptionsHorizontal,
// } from "./DashBoardEvents";
// import moment from "moment";
// import swal from "sweetalert2";
// import AlgaehFile from "../../../../Wrapper/algaehFileUpload";
import { GetAmountFormart } from "../../utils/GlobalFunctions";
import {
  AlgaehDateHandler,
  // AlgaehDataGrid,
  // AlgaehLabel,
  AlgaehMessagePop,
  AlgaehAutoComplete,
  // Spin,
  MainContext,
  // DatePicker,
  // Menu,
  // Dropdown,
  // AlgaehModal,
  // AlgaehButton,
  // AlgaehFormGroup,
  // Spin,
} from "algaeh-react-components";
// import { algaehApiCall } from "../../utils/algaehApiCall";

import { useForm, Controller } from "react-hook-form";
// import Enumerable from "linq";
import { newAlgaehApi } from "../../hooks";
import { useQuery } from "react-query";
import moment from "moment";
// import _ from "lodash";
// import { number } from "algaeh-react-components/node_modules/@types/prop-types";
// import Options from "../../Options.json";
export default function Dashboard() {
  const { userToken } = useContext(MainContext);
  console.log("userToken", userToken);

  // const [sendInAndOutData, setSendInAndSendOutData] = useState({
  //   send_in: [],
  //   send_out: [],
  // });
  // const [visible, setVisible] = useState(false);
  // const [body_mail, setBody_mail] = useState("");
  // const [reportParams, setReportParams] = useState({
  //   reportName: "",
  //   MailName: "",
  //   paramName1: "",
  //   paramValue1: "",
  //   paramName2: "",
  //   paramValue2: "",
  // });
  // const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(null);
  const [avgMtdIncome, setAvgMtdIncome] = useState(null);
  const [avgMtdExpense, setAvgMtdExpense] = useState(null);
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
      hospital_id: userToken.hims_d_hospital_id,
      start_date: [
        moment(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          "YYYY-MM-DD"
        ),
        moment(new Date()),
      ],
    },
  });

  async function getAccountHeads(key) {
    const result = await newAlgaehApi({
      uri: "/finance/getAccountHeads",
      module: "finance",
      data: { getAll: "Y" },
      method: "GET",
    });
    return result?.data?.result;
  }
  const { data: totalAmountByAccounts } = useQuery(
    "getAccountHeads",
    getAccountHeads,
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

  async function getAccountForDashBoard(key) {
    debugger;
    const date = getValues().start_date;
    const from_date = moment(date[0]).format("YYYY-MM-DD");
    const to_date = moment(date[1]).format("YYYY-MM-DD");

    console.log("date", date);
    const result = await newAlgaehApi({
      uri: "/finance/getAccountForDashBoard",
      module: "finance",
      data: {
        from_date: from_date,
        to_date: to_date,
      },
      method: "GET",
    });
    return result?.data?.result;
  }
  const { data: accountsForDash, refetch } = useQuery(
    "getAccountForDashBoard",
    getAccountForDashBoard,
    {
      onSuccess: (data) => {
        debugger;
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  useEffect(() => {
    const mdate = getValues().start_date;
    setDays(new Date(mdate[0] - mdate[1]).getDate() - 1);
  }, []);
  useEffect(() => {
    if (accountsForDash?.length >= 4) {
      debugger;
      const expenseAccount = accountsForDash.filter((f) => f.root_id === 5);
      if (expenseAccount.length > 0) {
        const expense =
          parseFloat(
            expenseAccount[0].amount ? expenseAccount[0].amount : 0.0
          ) / parseInt(days);
        setAvgMtdExpense(expense);
      }
      const incomeAccount = accountsForDash.filter((f) => f.root_id === 4);
      if (incomeAccount.length) {
        const income =
          parseFloat(incomeAccount[0].amount ? incomeAccount[0].amount : 0.0) /
          parseInt(days);
        setAvgMtdIncome(income);
      }
    }
  }, [days, accountsForDash]);
  async function getOrganization(key) {
    const result = await newAlgaehApi({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
    });
    return result?.data?.records;
  }

  const { data: organizations } = useQuery("getOrganization", getOrganization, {
    refetchOnWindowFocus: false,

    onSuccess: (data) => {},
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });

  // const OrderBYTestCategory = {
  //   labels: orderByTestCatData?.map((item) => {
  //     return item.category_name;
  //   }),
  //   datasets: [
  //     {
  //       data: orderByTestCatData?.map((item) => {
  //         return item.detailsOf.length;
  //       }),
  //       label: "Total Booking",

  //       backgroundColor: "rgba(255,99,132,0.2)",
  //       borderColor: "rgba(255,99,132,1)",
  //       borderWidth: 1,
  //       hoverBackgroundColor: "rgba(255,99,132,0.4)",
  //       hoverBorderColor: "rgba(255,99,132,1)",
  //     },
  //   ],
  // };
  // const RevenuebyDoctor = {
  //   labels: top10Orders?.map((item) => {
  //     return item.service_name;
  //   }),
  //   datasets: [
  //     {
  //       data: top10Orders?.map((item) => {
  //         return item.service_count;
  //       }),
  //       label: "Total Booking",

  //       backgroundColor: "rgba(255,99,132,0.2)",
  //       borderColor: "rgba(255,99,132,1)",
  //       borderWidth: 1,
  //       hoverBackgroundColor: "rgba(255,99,132,0.4)",
  //       hoverBorderColor: "rgba(255,99,132,1)",
  //     },
  //   ],
  // };
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
  // const AppoWalkInDataOptions = {
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
  //         labels: axisForSendInAndSendOut,
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
  // const AppoWalkInData = {
  //   datasets: [
  //     {
  //       type: "bar",
  //       label: "Send-In",
  //       data: sendInAndOutData.send_in,
  //       fill: false,
  //       backgroundColor: "#71B37C",
  //       borderColor: "#71B37C",
  //       // hoverBackgroundColor: "#71B37C",
  //       // hoverBorderColor: "#71B37C",
  //       yAxisID: "y-axis-1",
  //     },
  //     {
  //       type: "bar",
  //       label: "Send Out",
  //       data: sendInAndOutData.send_out,
  //       fill: false,
  //       backgroundColor: "#34b8bc",
  //       borderColor: "#34b8bc",
  //       // hoverBackgroundColor: "#34b8bc",
  //       // hoverBorderColor: "#34b8bc",
  //       yAxisID: "y-axis-1",
  //     },
  //   ],
  // };
  // render() {

  // const printLabDashboardReport = ({
  //   reportName,
  //   paramName1,
  //   paramValue1,
  //   paramName2,
  //   paramValue2,
  // }) => {
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
  //         reportName: reportName,
  //         pageSize: "A4",
  //         pageOrentation: "portrait",
  //         reportParams: [
  //           {
  //             name: paramName1,
  //             value: paramValue1,
  //           },
  //           {
  //             name: paramName2,
  //             value: paramValue2,
  //           },
  //         ],
  //         outputFileType: "PDF",
  //       },
  //     },
  //     onSuccess: (res) => {
  //       const urlBlob = URL.createObjectURL(res.data);
  //       const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
  //       window.open(origin);
  //     },
  //   });
  // };

  // async function labDashBoardWithAttachment(reportParams) {
  //   // return new Promise((resolve, reject) => {
  //   setLoading(true);
  //   // try {
  //   const result = await newAlgaehApi({
  //     uri: "/laboratory/labDashBoardWithAttachment",
  //     module: "laboratory",
  //     method: "GET",
  //     data: {
  //       ...reportParams,
  //     },
  //     // onSuccess: (res) => {
  //     //   swal({
  //     //     title: "Successfully Sent",
  //     //     type: "success",
  //     //   });
  //     //   // resolve();
  //     // },
  //     // onCatch: (error) => {
  //     //   swal({
  //     //     title: error.message,
  //     //     type: "error",
  //     //   });
  //     //   reject();
  //     // },
  //   });
  //   return result?.data?.records;
  //   // } catch (e) {
  //   //   reject(e);
  //   // }
  //   // })
  // }
  // const menuTestCategory = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <span
  //         onClick={() => {
  //           let objDataOrderByTestCategory = getValues().order_category;
  //           const startOfWeekOrderByTestCategory = objDataOrderByTestCategory
  //             .startOf("week")
  //             .toDate();
  //           const endOfWeekOrderByTestCategory = objDataOrderByTestCategory
  //             .endOf("week")
  //             .toDate();
  //           printLabDashboardReport({
  //             reportName: "LabOrderTestCategory",
  //             MailName: "Lab Dashboard Lab Test Category Report",
  //             paramName1: "startOfWeekOrderByTestCategory",
  //             paramValue1: startOfWeekOrderByTestCategory,
  //             paramName2: "endOfWeekOrderByTestCategory",
  //             paramValue2: endOfWeekOrderByTestCategory,
  //           });
  //         }}
  //       >
  //         Export Data as PDF
  //       </span>
  //     </Menu.Item>
  //     <Menu.Item key="2">
  //       <span
  //         onClick={() => {
  //           let objDataOrderByTestCategory = getValues().order_category;
  //           const startOfWeekOrderByTestCategory = objDataOrderByTestCategory
  //             .startOf("week")
  //             .toDate();
  //           const endOfWeekOrderByTestCategory = objDataOrderByTestCategory
  //             .endOf("week")
  //             .toDate();
  //           setVisible(true);
  //           setReportParams({
  //             reportName: "LabOrderTestCategory",
  //             MailName: "Lab Dashboard Lab Test Category Report",
  //             paramName1: "startOfWeekOrderByTestCategory",
  //             paramValue1: startOfWeekOrderByTestCategory,
  //             paramName2: "endOfWeekOrderByTestCategory",
  //             paramValue2: endOfWeekOrderByTestCategory,
  //           });
  //         }}
  //       >
  //         Send as an E-mail
  //       </span>
  //     </Menu.Item>
  //   </Menu>
  // );
  // const menuSendInSendOut = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <span
  //         onClick={() => {
  //           let objDataSendInOut = getValues().sendIn_sendOut;
  //           const startOfWeekSendInOut = objDataSendInOut
  //             .startOf("week")
  //             .toDate();
  //           const endOfWeekSendInOut = objDataSendInOut.endOf("week").toDate();
  //           printLabDashboardReport({
  //             reportName: "labDashSendInSendOut",
  //             MailName: "Lab Dashboard Send-In send-Out Report",
  //             paramName1: "startOfWeekSendInOut",
  //             paramValue1: startOfWeekSendInOut,
  //             paramName2: "endOfWeekSendInOut",
  //             paramValue2: endOfWeekSendInOut,
  //           });
  //         }}
  //       >
  //         Export Data as PDF
  //       </span>
  //     </Menu.Item>
  //     <Menu.Item key="2">
  //       <span
  //         onClick={() => {
  //           let objDataSendInOut = getValues().sendIn_sendOut;
  //           const startOfWeekSendInOut = objDataSendInOut
  //             .startOf("week")
  //             .toDate();

  //           const endOfWeekSendInOut = objDataSendInOut.endOf("week").toDate();
  //           setVisible(true);
  //           setReportParams({
  //             reportName: "labDashSendInSendOut",
  //             MailName: "Lab Dashboard Send-In send-Out Report",
  //             paramName1: "startOfWeekSendInOut",
  //             paramValue1: startOfWeekSendInOut,
  //             paramName2: "endOfWeekSendInOut",
  //             paramValue2: endOfWeekSendInOut,
  //           });
  //         }}
  //       >
  //         Send as an E-mail
  //       </span>
  //     </Menu.Item>
  //   </Menu>
  // );

  // const menuTop10 = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <span
  //         onClick={() => {
  //           let objDataTop10Orders = getValues().today_date_Top_10;
  //           printLabDashboardReport({
  //             reportName: "labDashTop10Orders",
  //             MailName: "Lab Dashboard Top 10 Orders Report",
  //             paramName1: "objDataTop10OrdersFrom",
  //             paramValue1: moment(objDataTop10Orders).format("YYYY-MM-DD"),
  //             paramName2: "objDataTop10OrdersTo",
  //             paramValue2: moment(objDataTop10Orders).format("YYYY-MM-DD"),
  //           });
  //         }}
  //       >
  //         Export Data as PDF
  //       </span>
  //     </Menu.Item>
  //     <Menu.Item key="2">
  //       <span
  //         onClick={() => {
  //           let objDataTop10Orders = getValues().today_date_Top_10;
  //           setVisible(true);
  //           setReportParams({
  //             reportName: "labDashTop10Orders",
  //             MailName: "Lab Dashboard Top 10 Orders Report",
  //             paramName1: "objDataTop10OrdersFrom",
  //             paramValue1: moment(objDataTop10Orders).format("YYYY-MM-DD"),
  //             paramName2: "objDataTop10OrdersTo",
  //             paramValue2: moment(objDataTop10Orders).format("YYYY-MM-DD"),
  //           });
  //         }}
  //       >
  //         Send as an E-mail
  //       </span>
  //     </Menu.Item>
  //   </Menu>
  // );
  // const menuTodayOrderStatus = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <span
  //         onClick={() => {
  //           const dateGetLabOrderServices = getValues().today_date_orderStatus;
  //           printLabDashboardReport({
  //             reportName: "labDashTodayOrderStatus",
  //             MailName: "Lab Dashboard Today Order Status Report",
  //             paramName1: "dateGetLabOrderServicesStart",
  //             paramValue1: moment(dateGetLabOrderServices).format("YYYY-MM-DD"),
  //             paramName2: "dateGetLabOrderServicesEnd",
  //             paramValue2: moment(dateGetLabOrderServices).format("YYYY-MM-DD"),
  //           });
  //         }}
  //       >
  //         Export Data as PDF
  //       </span>
  //     </Menu.Item>
  //     <Menu.Item key="2">
  //       <span
  //         onClick={() => {
  //           const dateGetLabOrderServices = getValues().today_date_orderStatus;
  //           setVisible(true);
  //           setReportParams({
  //             reportName: "labDashTodayOrderStatus",
  //             MailName: "Lab Dashboard Today Order Status Report",
  //             paramName1: "dateGetLabOrderServicesStart",
  //             paramValue1: moment(dateGetLabOrderServices).format("YYYY-MM-DD"),
  //             paramName2: "dateGetLabOrderServicesEnd",
  //             paramValue2: moment(dateGetLabOrderServices).format("YYYY-MM-DD"),
  //           });
  //           // labDashBoardWithAttachment();
  //         }}
  //       >
  //         Send as an E-mail
  //       </span>
  //     </Menu.Item>
  //   </Menu>
  // );
  const expenseAccount =
    accountsForDash?.length >= 4
      ? accountsForDash.filter((f) => f.root_id === 5)
      : [];
  const incomeAccount =
    accountsForDash?.length >= 4
      ? accountsForDash.filter((f) => f.root_id === 4)
      : [];
  return (
    <>
      {/* <AlgaehModal
        title={`Send as an E-mail`}
        visible={visible}
        destroyOnClose={true}
        // okText="Confirm"
        // onOk={() => {
        footer={[
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
                forceLabel: "Send",
                returnText: true,
              }}
            />
          </AlgaehButton>,
          <AlgaehButton
            className="btn btn-default"
            onClick={() => {
              setVisible(false);
            }}
          >
            Cancel
          </AlgaehButton>,
          ,
        ]}
        onCancel={() => {
          // finance_voucher_header_id = "";
          // rejectText = "";
          setVisible(false);
        }}
        className={`row algaehNewModal dashboardEmailSend`}
      >
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
                  forceLabel: "To Email Address",
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
                forceLabel: "Message",
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
          <div className="col-12">
            <small style={{ float: "right" }}>
              Attention! Mail will send with an attachment
            </small>
          </div>
        </form>
      </AlgaehModal> */}
      <div className="dashboard ">
        <div className="row">
          <Controller
            name="hospital_id"
            control={control}
            rules={{ required: "Select hospital" }}
            render={({ value, onChange }) => (
              <AlgaehAutoComplete
                div={{ className: "col-4 form-group mandatory" }}
                label={{
                  forceLabel: "select Hospital ",
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
                    data: organizations,
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
          />
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
                  fieldName: "effective_start_date",
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
                      debugger;

                      setDays(
                        Math.ceil(
                          Math.abs(mdate[0] - mdate[1]) / (1000 * 60 * 60 * 24)
                        )
                      );
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
          {/* <Spin spinning={loading}> */}
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
                        <p>Operational Cost</p>

                        {GetAmountFormart(
                          expenseAccount.length > 0
                            ? expenseAccount[0].amount
                            : 0.0
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="footer">
                  {" "}
                  <hr />
                  <div className="stats">
                    Avg. Cost per Patient -
                    <span>{GetAmountFormart(avgMtdExpense)} </span>
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
                        <p>Revenue by MTD</p>
                        {GetAmountFormart(
                          incomeAccount.length > 0
                            ? incomeAccount[0].amount
                            : 0.0
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="footer">
                    <hr />
                    <div className="stats">
                      Avg. Revenue per day-
                      <span>{GetAmountFormart(avgMtdIncome)} </span>
                      {/* <b onClick={this.showDetailHandler.bind(this)}>
//                     {this.state.showDetails === "d-block" ? "Hide" : "Show"}
//                   </b> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row card-deck">
                {/* <div className="col-4">
     //                   <div className="icon-big text-center">
     //                     <i className="fas fa-building" />
     //                   </div>
     //                 </div> */}
                <div className="col-12">
                  <div className="text">
                    {totalAmountByAccounts?.map((item) => {
                      return (
                        <>
                          <div className="card animated fadeInUp faster">
                            <div className="content">
                              <div className="row">
                                <p>{item.title}</p>: &nbsp;
                                {`${item.subtitle} ${item.trans_symbol}`}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>

                {/* <div className="row">
            <div className="col-4">
              <div className="card animated fadeInUp faster">
                <h6>
                  Order by Test Category{" "}
                  <span className="portletTopAction">
                    <div className="row">
                      <Controller
                        control={control}
                        name="order_category"
                        rules={{ required: "Please Select " }}
                        render={({ onChange, value }) => (
                          <div className="mandatory" tabIndex="5">
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
                      <Dropdown overlay={menuTestCategory}>
                        <i className="fas fa-bars dashPortletDrop" />
                      </Dropdown>
                    </div>
                  </span>
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
                    <div className="row">
                      <Controller
                        control={control}
                        name="sendIn_sendOut"
                        rules={{ required: "Please Select DOB" }}
                        render={({ onChange, value }) => (
                          <div className="mandatory" tabIndex="5">
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
                      />{" "}
                      <Dropdown overlay={menuSendInSendOut}>
                        <i className="fas fa-bars dashPortletDrop" />
                      </Dropdown>
                    </div>
                  </span>
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
                    <div className="row">
                      <Controller
                        control={control}
                        name="today_date_Top_10"
                        rules={{ required: "Please Select DOB" }}
                        render={({ onChange, value }) => (
                          <AlgaehDateHandler
                            size={"small"}
                            div={{
                              className: "mandatory",
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
                      <Dropdown overlay={menuTop10}>
                        <i className="fas fa-bars dashPortletDrop" />
                      </Dropdown>
                    </div>
                  </span>
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
                    <div className="row">
                      <Controller
                        control={control}
                        name="today_date_orderStatus"
                        rules={{ required: "Please Select" }}
                        render={({ onChange, value }) => (
                          <AlgaehDateHandler
                            size={"small"}
                            div={{
                              className: "mandatory",
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
                      <Dropdown overlay={menuTodayOrderStatus}>
                        <i className="fas fa-bars dashPortletDrop" />
                      </Dropdown>
                    </div>
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
              </div>*/}
              </div>
            </div>
          </div>
          {/* </Spin> */}
        </div>
      </div>
    </>
  );
}

// import React, { Component } from "react";
// import "./dashboard.scss";
// import { HorizontalBar } from "react-chartjs-2";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import { AlgaehActions } from "../../actions/algaehActions";
// import { GetAmountFormart } from "../../utils/GlobalFunctions";
// import DashBoardEvents, {
//   chartLegends,
//   chartOptionsHorizontal,
// } from "./DashBoardEvents";
// import { MainContext } from "algaeh-react-components";
// import { AlagehAutoComplete } from "../Wrapper/algaehWrapper";
// // import { getSelectedAccountDetails } from "../../../../algaeh-finance/src/models/finance_year_ending";

// const dashEvents = DashBoardEvents();

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       sidBarOpen: true,
//       showDetails: "d-none",
//       no_of_employees: 0,
//       total_company_salary: 0,
//       total_staff_count: 0,
//       total_labour_count: 0,
//       total_staff_salary: 0,
//       total_labor_salary: 0,
//       total_localite_count: 0,
//       total_expatriate_count: 0,
//       projectEmployee: {},
//       Dept_Employee: {},
//       Desig_Employee: {},
//       no_of_emp_join: [],
//       avg_salary: 0,
//       no_of_projects: 0,
//       hospital_id: "",
//     };
//   }
//   static contextType = MainContext;
//   componentDidMount() {
//     const userToken = this.context.userToken;
//     this.props.getOrganizations({
//       uri: "/organization/getOrganizationByUser",
//       method: "GET",
//       redux: {
//         type: "ORGS_GET_DATA",
//         mappingName: "organizations",
//       },
//     });

//     this.setState(
//       {
//         hospital_id: userToken.hims_d_hospital_id,
//       },
//       () => {
//         dashEvents.getEmployeeList(this);
//         dashEvents.getEmployeeDepartmentsWise(this);
//         dashEvents.getEmployeeDesignationWise(this);
//         dashEvents.getProjectList(this);
//         dashEvents.getEmployeeProjectWise(this);
//         dashEvents.getAccountDetails(this);
//       }
//     );
//   }

//   showDetailHandler(event) {
//     this.setState({
//       showDetails: this.state.showDetails === "d-block" ? "d-none" : "d-block",
//     });
//   }

//   SideMenuBarOpen(sidOpen) {
//     this.setState({
//       sidBarOpen: sidOpen,
//     });
//   }

//   eventHandaler(e) {
//     console.log(e, "eventObj");
//     let name = e.name || e.target.name;
//     let value = e.value || e.target.value;

//     this.setState(
//       {
//         [name]: value,
//       },
//       () => {
//         dashEvents.getEmployeeList(this);
//         dashEvents.getEmployeeDepartmentsWise(this);
//         dashEvents.getEmployeeDesignationWise(this);
//         dashEvents.getProjectList(this);
//         dashEvents.getEmployeeProjectWise(this);
//       }
//     );
//   }

//   render() {
//     return (
//       <div className="dashboard ">
//         <div className="row">
//           <AlagehAutoComplete
//             div={{ className: "col-3  form-group" }}
//             label={{
//               fieldName: "branch",
//               isImp: true,
//             }}
//             selector={{
//               name: "hospital_id",
//               className: "select-fld",
//               value: this.state.hospital_id,
//               dataSource: {
//                 textField: "hospital_name",
//                 valueField: "hims_d_hospital_id",
//                 data: this.props.organizations,
//               },
//               onChange: this.eventHandaler.bind(this),
//               onClear: () => {
//                 this.setState({
//                   hospital_id: null,
//                 });
//               },
//               autoComplete: "off",
//             }}
//           />
//         </div>
//         <div className="row card-deck">
//           <div className="card animated fadeInUp faster">
//             <div className="content">
//               <div className="row">
//                 <div className="col-4">
//                   <div className="icon-big text-center">
//                     <i className="fas fa-hospital" />
//                   </div>
//                 </div>
//                 <div className="col-8">
//                   <div className="numbers">
//                     <p>Operational Cost</p>

//                     {GetAmountFormart("150378.00")}
//                   </div>
//                 </div>
//               </div>
//               <div className="footer">
//                 <hr />
//                 <div className="stats">
//                   Avg. Cost per Patient -
//                   <span>{GetAmountFormart("500.00")} </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="card animated fadeInUp faster">
//             <div className="content">
//               <div className="row">
//                 <div className="col-4">
//                   <div className="icon-big text-center">
//                     <i className="fas fa-hand-holding-usd" />
//                   </div>
//                 </div>
//                 <div className="col-8">
//                   <div className="numbers">
//                     <p>Revenue by MTD</p>
//                     {GetAmountFormart("124128.75")}
//                   </div>
//                 </div>
//               </div>
//               <div className="footer">
//                 <hr />
//                 <div className="stats">
//                   Avg. Revenue per day-
//                   <span>{GetAmountFormart("4128.75")} </span>
//                   {/* <b onClick={this.showDetailHandler.bind(this)}>
//                     {this.state.showDetails === "d-block" ? "Hide" : "Show"}
//                   </b> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* <div className="card animated fadeInUp faster">
//             <div className="content">
//               <div className="row">
//                 <div className="col-4">
//                   <div className="icon-big text-center">
//                     <i className="fas fa-users" />
//                   </div>
//                 </div>
//                 <div className="col-8">
//                   <div className="numbers">
//                     <p>Total Patients</p>
//                     61,938
//                   </div>
//                 </div>
//               </div>
//               <div className="footer">
//                 <hr />
//                 <div className="stats">
//                   Patients Admitted - <span>31,374</span>
//                 </div>
//               </div>
//             </div>
//           </div> */}

//           <div className="card animated fadeInUp faster">
//             <div className="content">
//               <div className="row">
//                 <div className="col-4">
//                   <div className="icon-big text-center">
//                     <i className="fas fa-user-md" />
//                   </div>
//                 </div>
//                 <div className="col-8">
//                   <div className="numbers">
//                     <p>Avg. Patient per Dr. (MTD)</p>
//                     26.79
//                   </div>
//                 </div>
//               </div>
//               <div className="footer">
//                 <hr />
//                 <div className="stats">
//                   Today Available Dr. - <span>190</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="card animated fadeInUp faster">
//             <div className="content">
//               <div className="row">
//                 <div className="col-4">
//                   <div className="icon-big text-center">
//                     <i className="fas fa-walking" />
//                   </div>
//                 </div>
//                 <div className="col-8">
//                   <div className="numbers">
//                     <p>Patient footfall (MTD)</p>
//                     58%
//                   </div>
//                 </div>
//               </div>
//               <div className="footer">
//                 <hr />
//                 <div className="stats">
//                   Today Patient Fall - <span>18%</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row card-deck">
//           <div className="card animated fadeInUp faster">
//             <div className="content">
//               <div className="row">
//                 {/* <div className="col-4">
//                   <div className="icon-big text-center">
//                     <i className="fas fa-building" />
//                   </div>
//                 </div> */}
//                 <div className="col-12">
//                   <div className="text">
//                     <p>Total Project</p>
//                     {this.state.no_of_projects}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="card animated fadeInUp faster">
//             <div className="content">
//               <div className="row">
//                 {/* <div className="col-4">
//                   <div className="icon-big text-center">
//                     <i className="fas fa-building" />
//                   </div>
//                 </div> */}
//                 <div className="col-12">
//                   <div className="text">
//                     <p>Total Staff</p>
//                     {this.state.total_staff_count}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="card animated fadeInUp faster">
//             <div className="content">
//               <div className="row">
//                 {/* <div className="col-4">
//                   <div className="icon-big text-center">
//                     <i className="fas fa-building" />
//                   </div>
//                 </div> */}
//                 <div className="col-12">
//                   <div className="text">
//                     <p>Total Localite</p>
//                     {this.state.total_localite_count}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="card animated fadeInUp faster">
//             <div className="content">
//               <div className="row">
//                 {/* <div className="col-4">
//                   <div className="icon-big text-center">
//                     <i className="fas fa-building" />
//                   </div>
//                 </div> */}
//                 <div className="col-12">
//                   <div className="text">
//                     <p>Total Expatriate</p>
//                     {this.state.total_expatriate_count}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="card animated fadeInUp faster">
//             <div className="content">
//               <div className="row">
//                 {/* <div className="col-4">
//                   <div className="icon-big text-center">
//                     <i className="fas fa-building" />
//                   </div>
//                 </div> */}
//                 <div className="col-12">
//                   <div className="text">
//                     <p>Staff Cost</p>
//                     {GetAmountFormart(this.state.total_staff_salary)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-12">
//             <div className="row">
//               {" "}
//               <div className="col-sm-12 col-md-4 col-lg-4">
//                 <div className="card animated fadeInUp faster">
//                   <h6>No. of Employee by Projects</h6>
//                   <div className="dashboardChartsCntr">
//                     <HorizontalBar
//                       data={this.state.projectEmployee}
//                       legend={chartLegends}
//                       options={chartOptionsHorizontal}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="col-sm-12 col-md-4 col-lg-4">
//                 <div className="card animated fadeInUp faster">
//                   <h6>No. of Employee by Department</h6>
//                   <div className="dashboardChartsCntr">
//                     <HorizontalBar
//                       data={this.state.Dept_Employee}
//                       legend={chartLegends}
//                       options={chartOptionsHorizontal}
//                     />
//                   </div>
//                 </div>
//               </div>{" "}
//               <div className="col-sm-12 col-md-4 col-lg-4">
//                 <div className="card animated fadeInUp faster">
//                   <h6>No. of Employee by Designation</h6>
//                   <div className="dashboardChartsCntr">
//                     <HorizontalBar
//                       data={this.state.Desig_Employee}
//                       legend={chartLegends}
//                       options={chartOptionsHorizontal}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     hospitaldetails: state.hospitaldetails,
//     organizations: state.organizations,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getHospitalDetails: AlgaehActions,
//       getOrganizations: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(Dashboard)
// );
