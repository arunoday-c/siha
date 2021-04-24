import React, { useState } from "react";
import { HorizontalBar } from "react-chartjs-2";
import "./dashboard.scss";
import moment from "moment";
import swal from "sweetalert2";
import { chartLegends, chartOptionsHorizontal } from "./DashBoardEvents";

import {
  AlgaehLabel,
  AlgaehMessagePop,
  Spin,
  // MainContext,
  DatePicker,
  // Menu,
  // Dropdown,
  AlgaehModal,
  AlgaehButton,
  AlgaehFormGroup,
  // Spin,
} from "algaeh-react-components";
// import { algaehApiCall } from "../../utils/algaehApiCall";

import { useForm, Controller } from "react-hook-form";
import { newAlgaehApi } from "../../hooks";
import { useQuery } from "react-query";
export default function Dashboard() {
  // const { userToken } = useContext(MainContext);

  const [visible, setVisible] = useState(false);
  const [body_mail, setBody_mail] = useState("");
  const [
    reportParams,
    // , setReportParams
  ] = useState({
    reportName: "",
    MailName: "",
    paramName1: "",
    paramValue1: "",
    paramName2: "",
    paramValue2: "",
  });
  const [loading, setLoading] = useState(false);

  const { control, errors, getValues } = useForm({
    defaultValues: {
      today_date_Top_10_item: moment(),
      today_date_Top_10_Services: moment(),
      today_date_Top_10_CostCenter: moment(),
    },
  });

  async function top10SalesIncomebyItem(key) {
    let date = getValues().today_date_Top_10_item;
    const startOfMonth = moment(date).startOf("month");
    const endOfMonth = moment(date).endOf("month");

    const result = await newAlgaehApi({
      uri: "/SalesDashboard/top10SalesIncomebyItem",
      method: "GET",
      module: "sales",
      data: {
        from_date: moment(startOfMonth).format("YYYY-MM-DD"),
        to_date: moment(endOfMonth).format("YYYY-MM-DD"),
      },
    });
    return result?.data?.records;
  }
  async function top10SalesIncomebyServices(key) {
    let date = getValues().today_date_Top_10_Services;
    const startOfMonth = moment(date).startOf("month");
    const endOfMonth = moment(date).endOf("month");
    const result = await newAlgaehApi({
      uri: "/SalesDashboard/top10SalesIncomebyServices",
      method: "GET",
      module: "sales",
      data: {
        from_date: moment(startOfMonth).format("YYYY-MM-DD"),
        to_date: moment(endOfMonth).format("YYYY-MM-DD"),
      },
    });
    return result?.data?.records;
  }
  async function top10SalesIncomebyCostCenter(key) {
    let date = getValues().today_date_Top_10_CostCenter;
    const startOfMonth = moment(date).startOf("month");
    const endOfMonth = moment(date).endOf("month");
    const result = await newAlgaehApi({
      uri: "/SalesDashboard/top10SalesIncomebyCostCenter",
      method: "GET",
      module: "sales",
      data: {
        from_date: moment(startOfMonth).format("YYYY-MM-DD"),
        to_date: moment(endOfMonth).format("YYYY-MM-DD"),
      },
    });
    return result?.data?.records;
  }

  const { data: top10OrdersItem, refetch: top10OrderRefetchItem } = useQuery(
    "top10SalesIncomebyItem",
    top10SalesIncomebyItem,
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
  const {
    data: top10OrdersService,
    refetch: top10OrderRefetchService,
  } = useQuery("top10SalesIncomebyServices", top10SalesIncomebyServices, {
    onSuccess: (data) => {},
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });
  const {
    data: top10OrdersCostCenter,
    refetch: top10OrderRefetchCostCenter,
  } = useQuery("top10SalesIncomebyCostCenter", top10SalesIncomebyCostCenter, {
    onSuccess: (data) => {},
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });

  const itemSoldByMonth = {
    labels: top10OrdersItem?.map((item) => {
      return item.item_description;
    }),
    datasets: [
      {
        data: top10OrdersItem?.map((item) => {
          return item.dispatch_quantity;
        }),
        label: "Total Sold",

        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
      },
    ],
  };
  const serviceSoldByMonth = {
    labels: top10OrdersService?.map((item) => {
      return item.service_name;
    }),
    datasets: [
      {
        data: top10OrdersService?.map((item) => {
          return item.quantity;
        }),
        label: "Total Sold",

        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
      },
    ],
  };
  const costCenterSoldByMonth = {
    labels: top10OrdersCostCenter?.map((item) => {
      return item.project_desc;
    }),
    datasets: [
      {
        data: top10OrdersCostCenter?.map((item) => {
          return item.net_extended_cost;
        }),
        label: "Total Cost",

        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
      },
    ],
  };

  // const printSalesDashboardReport = ({
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

  async function salesDashBoardWithAttachment(reportParams) {
    setLoading(true);

    const result = await newAlgaehApi({
      uri: "/SalesDashboard/salesDashBoardWithAttachment",
      module: "sales",
      method: "GET",
      data: {
        ...reportParams,
      },
    });
    return result?.data?.records;
  }

  const disabledDate = (current) => {
    return current > moment().endOf("day");
  };

  // const menuTop10Item = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <span
  //         onClick={() => {
  //           let objDatatop10OrdersItem = getValues().today_date_Top_10_item;
  //           printSalesDashboardReport({
  //             reportName: "salesDashtop10OrdersItem",
  //             MailName: "Sales Dashboard Top 10 Orders Report",
  //             paramName1: "objDatatop10OrdersItemFrom",
  //             paramValue1: moment(objDatatop10OrdersItem).format("YYYY-MM-DD"),
  //             paramName2: "objDatatop10OrdersItemTo",
  //             paramValue2: moment(objDatatop10OrdersItem).format("YYYY-MM-DD"),
  //           });
  //         }}
  //       >
  //         Export Data as PDF
  //       </span>
  //     </Menu.Item>
  //     <Menu.Item key="2">
  //       <span
  //         onClick={() => {
  //           let objDatatop10OrdersService = getValues().today_date_Top_10_item;
  //           setVisible(true);
  //           setReportParams({
  //             reportName: "salesDashtop10OrdersItem",
  //             MailName: "Sales Dashboard Top 10 Orders Report",
  //             paramName1: "objDatatop10OrdersServiceFrom",
  //             paramValue1: moment(objDatatop10OrdersService).format(
  //               "YYYY-MM-DD"
  //             ),
  //             paramName2: "objDatatop10OrdersServiceTo",
  //             paramValue2: moment(objDatatop10OrdersService).format(
  //               "YYYY-MM-DD"
  //             ),
  //           });
  //         }}
  //       >
  //         Send as an E-mail
  //       </span>
  //     </Menu.Item>
  //   </Menu>
  // );

  // const menuTop10Service = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <span
  //         onClick={() => {
  //           let objDatatop10OrdersItem = getValues().today_date_Top_10_item;
  //           printSalesDashboardReport({
  //             reportName: "salesDashtop10OrdersItem",
  //             MailName: "Sales Dashboard Top 10 Orders Report",
  //             paramName1: "objDatatop10OrdersItemFrom",
  //             paramValue1: moment(objDatatop10OrdersItem).format("YYYY-MM-DD"),
  //             paramName2: "objDatatop10OrdersItemTo",
  //             paramValue2: moment(objDatatop10OrdersItem).format("YYYY-MM-DD"),
  //           });
  //         }}
  //       >
  //         Export Data as PDF
  //       </span>
  //     </Menu.Item>
  //     <Menu.Item key="2">
  //       <span
  //         onClick={() => {
  //           let objDatatop10OrdersItem = getValues().today_date_Top_10_Services;
  //           setVisible(true);
  //           setReportParams({
  //             reportName: "salesDashtop10OrdersItem",
  //             MailName: "Sales Dashboard Top 10 Orders Report",
  //             paramName1: "objDatatop10OrdersItemFrom",
  //             paramValue1: moment(objDatatop10OrdersItem).format("YYYY-MM-DD"),
  //             paramName2: "objDatatop10OrdersItemTo",
  //             paramValue2: moment(objDatatop10OrdersItem).format("YYYY-MM-DD"),
  //           });
  //         }}
  //       >
  //         Send as an E-mail
  //       </span>
  //     </Menu.Item>
  //   </Menu>
  // );

  // const menuTop10CostCenter = (
  //   <Menu>
  //     <Menu.Item key="1">
  //       <span
  //         onClick={() => {
  //           let objDatatop10OrdersItem = getValues()
  //             .today_date_Top_10_CostCenter;
  //           printSalesDashboardReport({
  //             reportName: "salesDashtop10OrdersItem",
  //             MailName: "Sales Dashboard Top 10 Orders Report",
  //             paramName1: "objDatatop10OrdersItemFrom",
  //             paramValue1: moment(objDatatop10OrdersItem).format("YYYY-MM-DD"),
  //             paramName2: "objDatatop10OrdersItemTo",
  //             paramValue2: moment(objDatatop10OrdersItem).format("YYYY-MM-DD"),
  //           });
  //         }}
  //       >
  //         Export Data as PDF
  //       </span>
  //     </Menu.Item>
  //     <Menu.Item key="2">
  //       <span
  //         onClick={() => {
  //           let objDatatop10OrdersItem = getValues().today_date_Top_10_item;
  //           setVisible(true);
  //           setReportParams({
  //             reportName: "salesDashtop10OrdersItem",
  //             MailName: "Sales Dashboard Top 10 Orders Report",
  //             paramName1: "objDatatop10OrdersItemFrom",
  //             paramValue1: moment(objDatatop10OrdersItem).format("YYYY-MM-DD"),
  //             paramName2: "objDatatop10OrdersItemTo",
  //             paramValue2: moment(objDatatop10OrdersItem).format("YYYY-MM-DD"),
  //           });
  //         }}
  //       >
  //         Send as an E-mail
  //       </span>
  //     </Menu.Item>
  //   </Menu>
  // );
  return (
    <>
      <AlgaehModal
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
              salesDashBoardWithAttachment({
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
      </AlgaehModal>
      <Spin spinning={loading}>
        <div className="dashboard sales-dash">
          <div className="row">
            <div className="col-4">
              <div className="card animated fadeInUp faster">
                <h6>
                  Top 10 fast moving items by MTD
                  <span className="portletTopAction">
                    <div className="row">
                      <Controller
                        control={control}
                        name="today_date_Top_10_item"
                        rules={{ required: "Please Select " }}
                        render={({ onChange, value }) => (
                          <div className="mandatory" tabIndex="5">
                            <label
                              htmlFor="today_date_Top_10_item"
                              className="style_Label "
                            />
                            <DatePicker
                              name="today_date_Top_10_item"
                              value={value}
                              onChange={(date) => {
                                if (date) {
                                  onChange(date);
                                  top10OrderRefetchItem();
                                } else {
                                  onChange(undefined);
                                }
                              }}
                              onClear={() => {
                                onChange(undefined);
                              }}
                              picker="month"
                              size={"small"}
                              disabledDate={disabledDate}
                            />
                          </div>
                        )}
                      />

                      {/* <Dropdown overlay={menuTop10Item}>
                        <i className="fas fa-bars dashPortletDrop" />
                      </Dropdown> */}
                    </div>
                  </span>
                </h6>
                <div className="dashboardChartsCntr">
                  <Spin spinning={false}>
                    <HorizontalBar
                      data={itemSoldByMonth}
                      legend={chartLegends}
                      options={chartOptionsHorizontal}
                    />
                  </Spin>
                </div>
              </div>
            </div>{" "}
            <div className="col-4">
              <div className="card animated fadeInUp faster">
                <h6>
                  Top 10 fast moving services by MTD
                  <span className="portletTopAction">
                    <div className="row">
                      <Controller
                        control={control}
                        name="today_date_Top_10_Services"
                        rules={{ required: "Please Select " }}
                        render={({ onChange, value }) => (
                          <div className="mandatory" tabIndex="5">
                            <label
                              htmlFor="today_date_Top_10_Services"
                              className="style_Label "
                            />
                            <DatePicker
                              name="today_date_Top_10_Services"
                              value={value}
                              onChange={(date) => {
                                if (date) {
                                  onChange(date);
                                  top10OrderRefetchService();
                                } else {
                                  onChange(undefined);
                                }
                              }}
                              onClear={() => {
                                onChange(undefined);
                              }}
                              picker="month"
                              size={"small"}
                              disabledDate={disabledDate}
                            />
                          </div>
                        )}
                      />

                      {/* <Dropdown overlay={menuTop10Service}>
                        <i className="fas fa-bars dashPortletDrop" />
                      </Dropdown> */}
                    </div>
                  </span>
                </h6>
                <div className="dashboardChartsCntr">
                  <Spin spinning={false}>
                    <HorizontalBar
                      data={serviceSoldByMonth}
                      legend={chartLegends}
                      options={chartOptionsHorizontal}
                    />
                  </Spin>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card animated fadeInUp faster">
                <h6>
                  Top 10 cost center by MTD
                  <span className="portletTopAction">
                    <div className="row">
                      <Controller
                        control={control}
                        name="today_date_Top_10_CostCenter"
                        rules={{ required: "Please Select " }}
                        render={({ onChange, value }) => (
                          <div className="mandatory" tabIndex="5">
                            <label
                              htmlFor="today_date_Top_10_CostCenter"
                              className="style_Label "
                            />
                            <DatePicker
                              name="today_date_Top_10_CostCenter"
                              value={value}
                              onChange={(date) => {
                                if (date) {
                                  onChange(date);
                                  top10OrderRefetchCostCenter();
                                } else {
                                  onChange(undefined);
                                }
                              }}
                              onClear={() => {
                                onChange(undefined);
                              }}
                              picker="month"
                              size={"small"}
                              disabledDate={disabledDate}
                            />
                          </div>
                        )}
                      />

                      {/* <Dropdown overlay={menuTop10CostCenter}>
                        <i className="fas fa-bars dashPortletDrop" />
                      </Dropdown> */}
                    </div>
                  </span>
                </h6>
                <div className="dashboardChartsCntr">
                  <Spin spinning={false}>
                    <HorizontalBar
                      data={costCenterSoldByMonth}
                      legend={chartLegends}
                      options={chartOptionsHorizontal}
                    />
                  </Spin>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
}
