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
  Spin,
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

const initialAccountValue = [
  {
    title: "Assets",
  },
  {
    title: "Liabilities",
  },
  {
    title: "Capital",
  },
  {
    title: "Income",
  },
  {
    title: "Expense",
  },
];

export default function Dashboard() {
  const { userToken } = useContext(MainContext);
  console.log("userToken", userToken);
  const [days, setDays] = useState(null);
  const [avgMtdIncome, setAvgMtdIncome] = useState(null);
  const [avgMtdExpense, setAvgMtdExpense] = useState(null);
  const { control, errors, getValues } = useForm({
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
  const { data: totalAmountByAccounts, isLoading } = useQuery(
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

  const expenseAccount =
    accountsForDash?.length >= 4
      ? accountsForDash.filter((f) => f.root_id === 5)
      : [];
  const incomeAccount =
    accountsForDash?.length >= 4
      ? accountsForDash.filter((f) => f.root_id === 4)
      : [];
  return (
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
      </div>
      {/* <Spin spinning={loading}> */}{" "}
      <div className="dashboard fin-dash">
        <div className="row card-deck">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Operational Cost</p>
                    {GetAmountFormart(
                      expenseAccount.length > 0 ? expenseAccount[0].amount : 0.0
                    )}
                  </div>
                </div>
              </div>
              <div className="footer">
                <hr />
                <div className="stats">
                  Avg. Revenue per day -
                  <span>{GetAmountFormart(avgMtdExpense)} </span>
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
                    <p>Revenue by MTD</p>
                    {GetAmountFormart(
                      incomeAccount.length > 0 ? incomeAccount[0].amount : 0.0
                    )}
                  </div>
                </div>
              </div>
              <div className="footer">
                <hr />
                <div className="stats">
                  Avg. Revenue per day -
                  <span>{GetAmountFormart(avgMtdIncome)} </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row card-deck">
          {totalAmountByAccounts?.length > 0
            ? totalAmountByAccounts?.map((item) => {
                return (
                  <div className="card animated fadeInUp faster">
                    <div className="content">
                      <div className="row">
                        <div className="col-12">
                          <div className="numbers">
                            <p>Total {item.title}</p>
                            {`${item.subtitle} ${item.trans_symbol}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : initialAccountValue.map((item) => (
                <div className="card animated fadeInUp faster">
                  <div className="content">
                    <div className="row">
                      <div className="col-12">
                        <div className="numbers">
                          <p>Total {item.title}</p>
                          {/* <i class="fas fa-spinner"></i> */}
                          <Spin spinning={isLoading}></Spin>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
