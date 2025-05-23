import React, { useEffect, useState, useContext } from "react";
import "./dashboard.scss";
import moment from "moment";
// import { Bar } from "react-chartjs-2";
// import { HorizontalBar } from "react-chartjs-2";
// import { Doughnut } from "react-chartjs-2";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import { AlgaehActions } from "../../actions/algaehActions";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlgaehMessagePop,
  AlgaehAutoComplete,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../hooks";
import { useStateWithCallbackLazy } from "use-state-with-callback";

// import { getCookie } from "../../utils/algaehApiCall.js";
// import { GetAmountFormart } from "../../utils/GlobalFunctions";

// const AdmissionsReadmissionData = {
//   datasets: [
//     {
//       type: "line",
//       label: "Total Sales",
//       data: [10486, 9866, 11343, 11634, 10134, 8334],
//       fill: false,
//       backgroundColor: "#71B37C",
//       borderColor: "#71B37C",
//       hoverBackgroundColor: "#71B37C",
//       hoverBorderColor: "#71B37C",
//       yAxisID: "y-axis-1"
//     }
//   ]
// };

// const AdmissionsReadmissionDataOptions = {
//   responsive: true,
//   legend: {
//     position: "bottom",
//     labels: {
//       boxWidth: 10
//     }
//   },
//   tooltips: {
//     mode: "label"
//   },
//   elements: {
//     line: {
//       fill: false
//     }
//   },
//   scales: {
//     xAxes: [
//       {
//         display: true,
//         gridLines: {
//           display: false
//         },
//         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
//       }
//     ],
//     yAxes: [
//       {
//         type: "linear",
//         display: true,
//         position: "left",
//         id: "y-axis-1",
//         gridLines: {
//           display: false
//         },
//         labels: {
//           show: true
//         }
//       }
//     ]
//   }
// };

// const OutpatientsInpatientsData = {
//   datasets: [
//     {
//       type: "bar",
//       label: "Inpatients",
//       data: [2712, 1334, 2465, 2232],
//       fill: false,
//       backgroundColor: "#71B37C",
//       borderColor: "#71B37C",
//       // hoverBackgroundColor: "#71B37C",
//       // hoverBorderColor: "#71B37C",
//       yAxisID: "y-axis-1"
//     },
//     {
//       type: "bar",
//       label: "Outpatients",
//       data: [1712, 1134, 1965, 1832],
//       fill: false,
//       backgroundColor: "#34b8bc",
//       borderColor: "#34b8bc",
//       // hoverBackgroundColor: "#34b8bc",
//       // hoverBorderColor: "#34b8bc",
//       yAxisID: "y-axis-1"
//     }
//   ]
// };

// const OutpatientsInpatientsDataOptions = {
//   responsive: true,
//   legend: {
//     position: "bottom",
//     labels: {
//       boxWidth: 10
//     }
//   },
//   tooltips: {
//     mode: "label"
//   },
//   elements: {
//     line: {
//       fill: false
//     }
//   },
//   scales: {
//     xAxes: [
//       {
//         display: true,
//         gridLines: {
//           display: false
//         },
//         labels: ["Week 42 2018", "Week 43 2018", "Week 44 2018", "Week 45 2018"]
//       }
//     ],
//     yAxes: [
//       {
//         type: "linear",
//         display: true,
//         position: "left",
//         id: "y-axis-1",
//         gridLines: {
//           display: false
//         },
//         labels: {
//           show: true
//         }
//       }
//     ]
//   }
// };

// const AvgWaitingTimeDep = {
//   labels: [
//     "Surgery",
//     "Gynaecology",
//     "Dermatology",
//     "Neurology",
//     "Oncology",
//     "Orthopedics",
//     "Cardiology"
//   ],
//   datasets: [
//     {
//       data: [65, 59, 80, 81, 56, 55, 45],
//       label: "Waiting Time",
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)"
//     }
//   ]
// };

// const RevenuebyDepartment = {
//   labels: [
//     "Surgery",
//     "Gynaecology",
//     "Dermatology",
//     "Neurology",
//     "Oncology",
//     "Orthopedics",
//     "Cardiology"
//   ],
//   datasets: [
//     {
//       data: [95, 80, 73, 64, 56, 50, 48],
//       label: "Revenue",
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)"
//     }
//   ]
// };

// const DistributionbySales = {
//   labels: ["Suhail", "Fathima", "Khalid", "Tony", "Ridhwan"],
//   datasets: [
//     {
//       data: [81, 80, 65, 59, 56],
//       label: "Sales Distribution",
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)"
//     }
//   ]
// };

// const RevenuebyService = {
//   labels: [
//     "Pharmacy",
//     "Radiology",
//     "OT",
//     "Bed",
//     "Anesthesia",
//     "Nursing Care",
//     "Lab"
//   ],
//   datasets: [
//     {
//       data: [81, 80, 65, 59, 56, 55, 45],
//       label: "Revenue",
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)"
//     }
//   ]
// };

// const DoctorExplained = {
//   labels: [
//     "Fully Agree",
//     "Rather Agree",
//     "Rather Disagree",
//     "Fully Disagree",
//     "Don't Know"
//   ],
//   datasets: [
//     {
//       data: [65, 59, 80, 81, 56, 55, 45],
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)"
//     }
//   ]
// };

// const DoctorExplainedDataOptions = {
//   responsive: true,
//   legend: {
//     display: false
//   }
// };

// const TreatingPhysician = {
//   labels: [
//     "Fully Agree",
//     "Rather Agree",
//     "Rather Disagree",
//     "Fully Disagree",
//     "Don't Know"
//   ],
//   datasets: [
//     {
//       data: [65, 59, 80, 81, 56, 55, 45],
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)"
//     }
//   ]
// };

// const TreatingPhysicianDataOptions = {
//   responsive: true,
//   legend: {
//     display: false
//   }
// };
// const plugins = [
//   {
//     afterDraw: (chartInstance, easing) => {
//       const ctx = chartInstance.chart.ctx;
//       ctx.fillText("This text drawn by a plugin", 100, 100);
//     }
//   }
// ];

// const PieData = {
//   labels: [
//     "Innohep 10,000 IU/0.5 ml Prefilled Syringe 2's ",
//     "Livial 2.5 mg Tablets 28's",
//     "Nevanac 0.1% Eye Drops 5 ml",
//     "Pholcodine 5 mg/5 ml Linctus (200 ml)",
//     "Pyrazinamide 500 mg Tablets 20'S (10'S X 2)"
//   ],
//   datasets: [
//     {
//       data: [24, 40, 35, 45, 19],
//       backgroundColor: ["#34b8bc", "#DCAC66", "#EC932F", "#673ab7", "#009688"],
//       hoverBackgroundColor: [
//         "#34b8bc",
//         "#DCAC66",
//         "#EC932F",
//         "#673ab7",
//         "#009688"
//       ]
//     }
//   ]
// };

// const CostPayerTypeData = {
//   labels: ["Medicare", "Medicaid", "Private Insurance", "Uninsured"],
//   datasets: [
//     {
//       data: [65, 69, 90, 61],
//       backgroundColor: ["#34b8bc", "#34b8bc", "#34b8bc", "#34b8bc"],
//       label: "Surgical Stays"
//     },
//     {
//       data: [315, 89, 101, 81],
//       backgroundColor: ["#EC932F", "#EC932F", "#EC932F", "#EC932F"],
//       label: "Medical Stays"
//     },
//     {
//       data: [415, 109, 131, 101],
//       backgroundColor: ["#DCAC66", "#DCAC66", "#DCAC66", "#DCAC66"],
//       label: "Maternal and Neonatal Stays"
//     }
//   ]
// };

// const CostPayerTypeDataOption = {
//   tooltips: {
//     mode: "point",
//     intersect: false
//   },

//   responsive: true,
//   scales: {
//     xAxes: [
//       {
//         stacked: true
//       }
//     ],
//     yAxes: [
//       {
//         ticks: {
//           beginAtZero: true
//         },
//         stacked: false
//       }
//     ]
//   }
// };

// const AreaData = {
//   labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
//   datasets: [
//     {
//       fill: true,
//       lineTension: 0.1,
//       backgroundColor: "#34b8bc",
//       borderColor: "#DCAC66",
//       borderCapStyle: "butt",
//       borderDash: [],
//       borderDashOffset: 0.0,
//       borderJoinStyle: "miter",
//       pointBorderColor: "#34b8bc",
//       pointBackgroundColor: "#34b8bc",
//       pointBorderWidth: 1,
//       pointHoverRadius: 5,
//       pointRadius: 4,
//       pointHitRadius: 50,
//       data: [10, 5, 8, 3, 5]
//     }
//   ]
// };

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       sidBarOpen: true,
//       showDetails: "d-none",

//     };
//   }
import { useQuery } from "react-query";

import { MainContext } from "algaeh-react-components";

// import { Controller } from "react-hook-form";
const getDashboardData = async () => {
  const result = await Promise.all([
    newAlgaehApi({
      uri: "/inventory/getInventoryUom",
      module: "inventory",
      method: "GET",
    }),
  ]);
  return {
    // inventoryLocations: result[0]?.data?.records,
    invUom: result[0]?.data?.records,
  };
};
export default function Dashboard() {
  const [inventoryLocations, setInventoryLocations] = useStateWithCallbackLazy(
    []
  );
  const [itemLOcationStock, setItemLOcationStock] = useState([]);
  const [location_id, setLocation_id] = useStateWithCallbackLazy(null);
  // const [dataTotal, setDataTotal] = useState([]);
  const [dateRange, setDateRange] = useStateWithCallbackLazy([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const [stock_value, setStock_value] = useState("");
  const [expiredItemsCount, setExpiredItemsCount] = useState("");
  const [lowStockItemsCount, setLowStockItemsCount] = useState("");
  const [invExpItem, setInvExpItem] = useState([]);
  const { data } = useQuery("dashboard-data", getDashboardData, {
    initialData: {
      inventoryLocations: [],
      // itemLOcationStock: [],
      invUom: [],
    },
    refetchOnMount: false,
    initialStale: true,
    cacheTime: Infinity,
  });
  const { invUom } = data;
  const { userToken } = useContext(MainContext);
  const { currency_symbol } = userToken;
  // showDetailHandler(event) {
  //   this.setState({
  //     showDetails: this.state.showDetails === "d-block" ? "d-none" : "d-block"
  //   });
  // }
  useEffect(() => {
    newAlgaehApi({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
    })
      .then((res) => {
        setInventoryLocations(res.data.records, () => {
          loadInvStockDetail(res.data.records[0].hims_d_inventory_location_id);
        });

        setLocation_id(res.data.records[0].hims_d_inventory_location_id);
      })
      .catch((e) => AlgaehMessagePop({ type: "error", display: e.message }));
    getInvExpItemsDash(dateRange);
    getDashboardDataNumber(dateRange);
    // eslint-disable-next-line
  }, []);
  const loadInvStockDetail = async (data) => {
    try {
      const res = await newAlgaehApi({
        uri: "/inventoryGlobal/getItemLocationStock",
        module: "inventory",
        method: "GET",
        data: {
          inventory_location_id: data,
          reorder_qty: "Y",
        },
      });
      if (res.data.success) {
        setItemLOcationStock(res.data.records);
      }
    } catch (e) {
      // setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  const getInvExpItemsDash = async (data) => {
    let from_date = moment(data[0]._d).format("YYYY-MM-DD");
    let to_date = moment(data[1]._d).format("YYYY-MM-DD");
    try {
      const res = await newAlgaehApi({
        uri: "/inventoryGlobal/getInvExpItemsDash",
        module: "inventory",
        method: "GET",
        data: {
          from_date: from_date,
          to_date: to_date,
        },
      });
      if (res.data.success) {
        setInvExpItem(res.data.records);
      }
    } catch (e) {
      // setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  const getDashboardDataNumber = async (data) => {
    let from_date = moment(data[0]._d).format("YYYY-MM-DD");
    let to_date = moment(data[1]._d).format("YYYY-MM-DD");
    try {
      const res = await newAlgaehApi({
        uri: "/inventoryGlobal/getDashboardData",
        module: "inventory",
        method: "GET",
        data: {
          from_date: from_date,
          to_date: to_date,
        },
      });
      if (res.data.success) {
        // setDataTotal(res.data.records);
        setStock_value(parseInt(res.data.records[0][0].stock_value).toFixed(2));
        setExpiredItemsCount(res.data.records[1][0].total);
        setLowStockItemsCount(res.data.records[2][0].total);
      }
    } catch (e) {
      // setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  //   const onChangeInvLocation=(e)=>{
  // setLocation_id(e.value)
  //   }
  // componentDidMount() {

  // }
  // SideMenuBarOpen(sidOpen) {
  //   this.setState({
  //     sidBarOpen: sidOpen
  //   });
  // }

  // render() {
  // let margin = this.state.sidBarOpen ? "" : "";

  return (
    <div className="dashboard inv-dash">
      <div className="row card-deck">
        <div className="card animated fadeInUp faster">
          <div className="content">
            <div className="row">
              <div className="col-3">
                <div className="icon-big text-center">
                  <i className="fas fa-users" />
                </div>
              </div>
              <div className="col-8">
                <div className="numbers">
                  <p>Expired Items</p>
                  {expiredItemsCount}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card animated fadeInUp faster">
          <div className="content">
            <div className="row">
              <div className="col-3">
                <div className="icon-big text-center">
                  <i className="fas fa-coins" />
                </div>
              </div>
              <div className="col-8">
                <div className="numbers">
                  <p>Inventory Total Value</p>
                  {`${currency_symbol} ${stock_value}`}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card animated fadeInUp faster">
          <div className="content">
            <div className="row">
              <div className="col-3">
                <div className="icon-big text-center">
                  <i className="fas fa-hand-holding-usd" />
                </div>
              </div>
              <div className="col-8">
                <div className="numbers">
                  <p>Low Stock Items</p>
                  {lowStockItemsCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-6">
              <div className="card animated fadeInUp faster">
                <h6>Item Expiry</h6>
                <div className="row dashboardGridCntr">
                  <div className="col">
                    {" "}
                    <div className="col">
                      <div className="row">
                        {" "}
                        <AlgaehDateHandler
                          type={"range"}
                          div={{
                            className: "col-6 form-group",
                          }}
                          label={{
                            forceLabel: "Select Date Range",
                          }}
                          textBox={{
                            name: "selectRange",
                            value: dateRange,
                          }}
                          // maxDate={new date()}
                          events={{
                            onChange: (dateSelected) => {
                              setDateRange(dateSelected, () => {
                                getInvExpItemsDash(dateSelected);
                              });
                            },
                          }}
                          // others={{
                          //   ...format,
                          // }}
                        />
                        <div className="col-12">
                          <AlgaehDataGrid
                            className="dashboardGrd"
                            columns={[
                              {
                                fieldName: "item_description",
                                label: "Item Description",
                              },
                              {
                                fieldName: "batchno",
                                label: "Batch No",
                              },
                              {
                                fieldName: "expirydt",
                                label: "Expiry Date",
                              },
                              {
                                fieldName: "inventory_location",
                                label: "Inventory Location",
                              },
                              {
                                fieldName: "item_code",
                                label: "Item Code",
                              },

                              {
                                fieldName: "qtyhand",
                                label: "Quantity In Hand",
                              },
                            ]}
                            // height="40vh"
                            rowUnique="finance_voucher_id"
                            data={invExpItem ? invExpItem : []}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="card animated fadeInUp faster">
                <h6>Order Soon Items</h6>
                <div className="row dashboardGridCntr">
                  <div className="col">
                    {" "}
                    <div className="col">
                      <div className="row">
                        {" "}
                        <AlgaehAutoComplete
                          div={{ className: "col form-group" }}
                          label={{ forceLabel: "By Location" }}
                          selector={{
                            name: "location_id",
                            className: "select-fld",
                            value: location_id,
                            dataSource: {
                              textField: "location_description",
                              valueField: "hims_d_inventory_location_id",
                              data: inventoryLocations,
                            },

                            onChange: (e) => {
                              //
                              setLocation_id(
                                e.hims_d_inventory_location_id,
                                (currentLocation) => {
                                  loadInvStockDetail(currentLocation);
                                }
                              );
                            },
                            // onClear: () => {

                            // },
                            autoComplete: "off",
                          }}
                        />
                        <div className="col-12">
                          <AlgaehDataGrid
                            className="dashboardGrd"
                            columns={[
                              {
                                fieldName: "location_description",
                                label: "Location",
                                others: { filterable: true },
                              },
                              {
                                fieldName: "item_code",
                                label: "Item Code",
                                others: { filterable: true },
                              },

                              {
                                fieldName: "item_description",
                                label: "Item Name",
                              },
                              {
                                fieldName: "stocking_uom_id",
                                label: "Stocking UOM",

                                displayTemplate: (row) => {
                                  let display =
                                    invUom === undefined
                                      ? []
                                      : invUom.filter(
                                          (f) =>
                                            f.hims_d_inventory_uom_id ===
                                            row.stocking_uom_id
                                        );

                                  return (
                                    <span>
                                      {display !== null && display.length !== 0
                                        ? display[0].uom_description
                                        : ""}
                                    </span>
                                  );
                                },
                                others: { filterable: false },
                              },
                              {
                                fieldName: "sales_uom",
                                label: "Sales UOM",
                                displayTemplate: (row) => {
                                  let display =
                                    invUom === undefined
                                      ? []
                                      : invUom.filter(
                                          (f) =>
                                            f.hims_d_inventory_uom_id ===
                                            row.sales_uom
                                        );

                                  return (
                                    <span>
                                      {display !== null && display.length !== 0
                                        ? display[0].uom_description
                                        : ""}
                                    </span>
                                  );
                                },
                                others: { filterable: false },
                              },

                              {
                                fieldName: "qtyhand",
                                label: "Quantity",
                                displayTemplate: (row) => {
                                  return row.reorder === "R" ? (
                                    <div className="orderNow">
                                      <span>{parseFloat(row.qtyhand)}</span>
                                      <span className="orderSoon">
                                        Order Soon
                                      </span>
                                    </div>
                                  ) : (
                                    parseFloat(row.qtyhand)
                                  );
                                },
                                disabled: true,
                                others: { filterable: true },
                              },
                              {
                                fieldName: "reorder_qty",
                                label: "Reorder Quantity",
                                disabled: true,
                                others: { filterable: false },
                              },
                            ]}
                            // height="40vh"
                            rowUnique="finance_voucher_id"
                            data={itemLOcationStock ? itemLOcationStock : []}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
