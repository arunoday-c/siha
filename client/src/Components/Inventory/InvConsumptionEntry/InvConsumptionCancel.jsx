import "./InvConsumptionEntry.scss";
import "../../../styles/site.scss";

import ConsumptionCancelItems from "./ConsumptionCancelItems";
import ConsumptionIOputs from "../../../Models/InventoryConsumptionCancel";

import React, { useState, useContext, useEffect } from "react";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import "./InvConsumptionEntry.scss";
import "../../../styles/site.scss";
import { useQuery } from "react-query";
import moment from "moment";
import Options from "../../../Options.json";
import { useLocation, useHistory } from "react-router-dom";
// import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import { newAlgaehApi } from "../../../hooks";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import {
  MainContext,
  AlgaehLabel,
  // Spin,
  AlgaehAutoComplete,
  AlgaehMessagePop,
  // AlgaehSecurityComponent,
} from "algaeh-react-components";
export default function InvConsumptionCancel({ breadStyle }) {
  const [megaState, setMegaState] = useState(ConsumptionIOputs.inputParam());
  const [enable, setEnable] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const {
    // userLanguage,
    userToken,

    // userPreferences,
  } = useContext(MainContext);
  useEffect(() => {
    const params = new URLSearchParams(location?.search);
    if (params?.get("can_consumption_number")) {
      setMegaState({
        ...megaState,
        can_consumption_number: params?.get("can_consumption_number"),
      });
      setEnable(true);
    }
  }, []);
  const {} = useQuery(
    ["getInventoryConsumptionCancel"],
    getInventoryConsumptionCancel,
    {
      enabled: !!enable,
      initialStale: true,
      onSuccess: (data) => {
        setMegaState(data);
        setEnable(false);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getInventoryConsumptionCancel(key) {
    debugger;
    const result = await newAlgaehApi({
      uri: "/inventoryconsumption/getInventoryConsumptionCancel",
      module: "inventory",
      method: "GET",
      data: { can_consumption_number: megaState.can_consumption_number },
    });
    return result?.data?.records;
  }

  const { data: invuserwiselocations } = useQuery(
    "dropdown-data",
    getInvWiseLocations,
    {
      refetchOnMount: false,
      initialStale: true,
      cacheTime: Infinity,
      onSuccess: (data) => {
        debugger;
      },
    }
  );
  async function getInvWiseLocations() {
    const result = await newAlgaehApi({
      uri: "/inventoryGlobal/getUserLocationPermission",
      module: "inventory",
      method: "GET",
      data: {
        location_status: "A",
        hospital_id: userToken.hims_d_hospital_id,
      },
    });
    debugger;
    return result?.data?.records;
  }

  const generateConCancelReceipt = () => {
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
          reportName: "consumptionCancelReceiptInventory",
          pageSize: "A4",
          pageOrentation: "portrait",
          reportParams: [
            {
              name: "hims_f_inventory_can_consumption_header_id",
              value: megaState.hims_f_inventory_can_consumption_header_id,
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

  return (
    <React.Fragment>
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Consumption Cancel Entry", align: "ltr" }}
            />
          }
          breadStyle={breadStyle}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{
                  forceLabel: "Consumption Cancel Number",
                  returnText: true,
                }}
              />
            ),
            value: megaState.can_consumption_number,
            selectValue: "can_consumption_number",
            events: {
              onChange: (can_consumption_number, e) => {
                debugger;
                setMegaState({
                  ...megaState,
                  can_consumption_number,
                  hims_f_inventory_can_consumption_header_id:
                    e.hims_f_inventory_can_consumption_header_id,
                });
                setEnable(true);
                history.push(
                  `${location.pathname}?can_consumption_number=${can_consumption_number}`
                );
              },
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "ConsumptionEntry.InvConsCancelEntry",
            },
            searchName: "InvConsCancelEntry",
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Consumption Cancel Date",
                  }}
                />
                <h6>
                  {megaState.can_consumption_date
                    ? moment(megaState.can_consumption_date).format(
                        Options.dateFormat
                      )
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          printArea={
            megaState.hims_f_inventory_can_consumption_header_id !== null
              ? {
                  menuitems: [
                    {
                      label: "Print Receipt",
                      events: {
                        onClick: () => {
                          generateConCancelReceipt();
                        },
                      },
                    },
                    // {
                    //   label: "Print Receipt Small",
                    //   events: {
                    //     onClick: () => {
                    //       generateReceiptSmall(this, this);
                    //     },
                    //   },
                    // },
                  ],
                }
              : ""
          }
        />

        <div
          className="row  inner-top-search"
          style={{ marginTop: 76, paddingBottom: 10 }}
        >
          {/* Patient code */}
          <div className="col-lg-8">
            <div className="row">
              <AlgaehAutoComplete
                div={{ className: "col-lg-4" }}
                label={{ forceLabel: "Location" }}
                selector={{
                  // multiselect: "multiple",
                  name: "location_id",
                  className: "select-fld",
                  value: megaState.location_id,
                  dataSource: {
                    textField: "location_description",
                    valueField: "hims_d_inventory_location_id",
                    data: invuserwiselocations,
                  },
                  others: {
                    disabled: true,
                  },
                  // onChange: onChangeHandler,
                  // onClear: onClearHandler,
                }}
              />{" "}
              {/* <AlgaehAutoComplete
                div={{ className: "col-lg-4" }}
                label={{ forceLabel: "Location" }}
                selector={{
                  name: "location_id",
                  className: "select-fld",
                  value: megaState.location_id,
                  dataSource: {
                    textField: "location_description",
                    valueField: "hims_d_inventory_location_id",
                    data: invuserwiselocations,
                  },
                  others: {
                    // disabled: this.state.addedItem,
                  },
                  onChange: (e, value) => {
                    debugger;

                    // onchangegridcol(row, e);
                  },
                }}
              /> */}
              <div className="col-lg-4">
                <AlgaehLabel
                  label={{
                    forceLabel: "Location Type",
                  }}
                />
                <h6>
                  {megaState.location_type
                    ? megaState.location_type === "WH"
                      ? "Warehouse"
                      : megaState.location_type === "MS"
                      ? "Main Store"
                      : "Sub Store"
                    : "Location Type"}
                </h6>
              </div>
            </div>
          </div>
        </div>

        <div className="hptl-phase1-Consumption-form">
          {/* <MyContext.Provider
              value={{
                state: this.state,
                updateState: (obj) => {
                  this.setState({ ...obj });
                },
              }}
            > */}
          <ConsumptionCancelItems ConsumptionIOputs={megaState} />
          {/* </MyContext.Provider> */}

          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                {/* <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.SaveConsumptionEntry.bind(this)}
                    disabled={this.state.saveEnable}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Save", returnText: true }}
                    />
                  </button> */}

                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => {
                    setMegaState(ConsumptionIOputs.inputParam());
                    history.push(`${location.pathname}`);
                  }}
                  // disabled={}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Clear", returnText: true }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
