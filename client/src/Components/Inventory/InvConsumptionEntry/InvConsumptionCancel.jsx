// import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
// import moment from "moment";

// import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
// import ConsumptionItemsEvents from "./InvConsumptionEntryEvents";
import "./InvConsumptionEntry.scss";
import "../../../styles/site.scss";
// import { AlgaehActions } from "../../../actions/algaehActions";

import ConsumptionCancelItems from "./ConsumptionCancelItems";
// import MyContext from "../../../utils/MyContext";
import ConsumptionIOputs from "../../../Models/InventoryConsumptionCancel";
// import Options from "../../../Options.json";
// import { MainContext } from "algaeh-react-components";

// class InvConsumptionCancel extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {};
//   }

//   UNSAFE_componentWillMount() {
//     let IOputs = ConsumptionIOputs.inputParam();
//     this.setState(IOputs);
//   }
//   static contextType = MainContext;
//   componentDidMount() {
//     const userToken = this.context.userToken;
//     if (
//       this.props.inventoryitemlist === undefined ||
//       this.props.inventoryitemlist.length === 0
//     ) {
//       this.props.getItems({
//         uri: "/inventory/getItemMaster",
//         module: "inventory",
//         method: "GET",
//         data: { item_status: "A" },
//         redux: {
//           type: "ITEM_GET_DATA",
//           mappingName: "inventoryitemlist",
//         },
//       });
//     }
//     if (
//       this.props.inventoryreqlocations === undefined ||
//       this.props.inventoryreqlocations.length === 0
//     ) {
//       this.props.getLocation({
//         uri: "/inventory/getInventoryLocation",
//         module: "inventory",
//         method: "GET",
//         redux: {
//           type: "LOCATIOS_GET_DATA",
//           mappingName: "inventoryreqlocations",
//         },
//       });
//     }

//     this.props.getUserLocationPermission({
//       uri: "/inventoryGlobal/getUserLocationPermission",
//       module: "inventory",
//       method: "GET",
//       data: {
//         location_status: "A",
//         hospital_id: userToken.hims_d_hospital_id,
//       },
//       redux: {
//         type: "LOCATIOS_GET_DATA",
//         mappingName: "invuserwiselocations",
//       },
//     });

//     if (
//       this.props.consumption_number !== undefined &&
//       this.props.consumption_number.length !== 0
//     ) {
//       ConsumptionItemsEvents().getCtrlCode(this, this.props.consumption_number);
//     }
//     const queryParams = new URLSearchParams(this.props.location.search);
//     if (queryParams.get("consumption_number")) {
//       ConsumptionItemsEvents().getCtrlCode(
//         this,
//         queryParams.get("consumption_number")
//       );
//     }

//     if (queryParams.get("transaction_id")) {
//       ConsumptionItemsEvents().getDrilDownData(
//         this,
//         queryParams.get("transaction_id")
//       );
//     }
//   }

//   componentWillUnmount() {
//     ConsumptionItemsEvents().ClearData(this);
//   }

//   LocationchangeTexts(e) {
//     ConsumptionItemsEvents().LocationchangeTexts(this, e);
//   }
//   SaveConsumptionEntry() {
//     ConsumptionItemsEvents().SaveConsumptionEntry(this);
//   }
//   getCtrlCode(docNumber) {
//     ConsumptionItemsEvents().getCtrlCode(this, docNumber);
//   }
//   ClearData() {
//     ConsumptionItemsEvents().ClearData(this);
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <div>
//           <BreadCrumb
//             title={
//               <AlgaehLabel
//                 label={{ forceLabel: "Consumption Entry", align: "ltr" }}
//               />
//             }
//             breadStyle={this.props.breadStyle}
//             // pageNavPath={[
//             //   {
//             //     pageName: (
//             //       <AlgaehLabel
//             //         label={{
//             //           forceLabel: "Home",
//             //           align: "ltr",
//             //         }}
//             //       />
//             //     ),
//             //   },
//             //   {
//             //     pageName: (
//             //       <AlgaehLabel
//             //         label={{ forceLabel: "Consumption Entry", align: "ltr" }}
//             //       />
//             //     ),
//             //   },
//             // ]}
//             soptlightSearch={{
//               label: (
//                 <AlgaehLabel
//                   label={{ forceLabel: "Consumption Number", returnText: true }}
//                 />
//               ),
//               value: this.state.consumption_number,
//               selectValue: "consumption_number",
//               events: {
//                 onChange: this.getCtrlCode.bind(this),
//               },
//               jsonFile: {
//                 fileName: "spotlightSearch",
//                 fieldName: "ConsumptionEntry.InvConsEntry",
//               },
//               searchName: "InvConsEntry",
//             }}
//             userArea={
//               <div className="row">
//                 <div className="col">
//                   <AlgaehLabel
//                     label={{
//                       forceLabel: "Consumption Date",
//                     }}
//                   />
//                   <h6>
//                     {this.state.consumption_date
//                       ? moment(this.state.consumption_date).format(
//                         Options.dateFormat
//                       )
//                       : Options.dateFormat}
//                   </h6>
//                 </div>
//               </div>
//             }
//             printArea={
//               this.state.hims_f_inventory_consumption_header_id !== null
//                 ? {
//                   menuitems: [
//                     {
//                       label: "Print Receipt",
//                       events: {
//                         onClick: () => {
//                           ConsumptionItemsEvents().generateConsumptionRecpt(
//                             this.state.consumption_number
//                           );
//                         },
//                       },
//                     },
//                   ],
//                 }
//                 : ""
//             }
//             selectedLang={this.state.selectedLang}
//           />

//           <div
//             className="row  inner-top-search"
//             style={{ marginTop: 76, paddingBottom: 10 }}
//           >
//             {/* Patient code */}
//             <div className="col-lg-8">
//               <div className="row">
//                 <AlagehAutoComplete
//                   div={{ className: "col-lg-4" }}
//                   label={{ forceLabel: "Location" }}
//                   selector={{
//                     name: "location_id",
//                     className: "select-fld",
//                     value: this.state.location_id,
//                     dataSource: {
//                       textField: "location_description",
//                       valueField: "hims_d_inventory_location_id",
//                       data: this.props.invuserwiselocations,
//                     },
//                     others: {
//                       disabled: this.state.addedItem,
//                     },
//                     onChange: this.LocationchangeTexts.bind(this),
//                   }}
//                 />

//                 <div className="col-lg-4">
//                   <AlgaehLabel
//                     label={{
//                       forceLabel: "Location Type",
//                     }}
//                   />
//                   <h6>
//                     {this.state.location_type
//                       ? this.state.location_type === "WH"
//                         ? "Warehouse"
//                         : this.state.location_type === "MS"
//                           ? "Main Store"
//                           : "Sub Store"
//                       : "Location Type"}
//                   </h6>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="hptl-phase1-Consumption-form">
//             <MyContext.Provider
//               value={{
//                 state: this.state,
//                 updateState: (obj) => {
//                   this.setState({ ...obj });
//                 },
//               }}
//             >
//               <ConsumptionItems ConsumptionIOputs={this.state} />
//             </MyContext.Provider>

//             <div className="hptl-phase1-footer">
//               <div className="row">
//                 <div className="col-lg-12">
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={this.SaveConsumptionEntry.bind(this)}
//                     disabled={this.state.saveEnable}
//                   >
//                     <AlgaehLabel
//                       label={{ forceLabel: "Save", returnText: true }}
//                     />
//                   </button>

//                   <button
//                     type="button"
//                     className="btn btn-default"
//                     onClick={this.ClearData.bind(this)}
//                     disabled={this.state.ClearDisable}
//                   >
//                     <AlgaehLabel
//                       label={{ forceLabel: "Clear", returnText: true }}
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     inventoryitemlist: state.inventoryitemlist,
//     inventoryreqlocations: state.inventoryreqlocations,
//     inventoryrequisitionentry: state.inventoryrequisitionentry,
//     invuserwiselocations: state.invuserwiselocations,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getItems: AlgaehActions,
//       getLocation: AlgaehActions,
//       getRequisitionEntry: AlgaehActions,
//       getUserLocationPermission: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(InvConsumptionEntry)
// );
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
          // pageNavPath={[
          //   {
          //     pageName: (
          //       <AlgaehLabel
          //         label={{
          //           forceLabel: "Home",
          //           align: "ltr",
          //         }}
          //       />
          //     ),
          //   },
          //   {
          //     pageName: (
          //       <AlgaehLabel
          //         label={{ forceLabel: "Consumption Entry", align: "ltr" }}
          //       />
          //     ),
          //   },
          // ]}
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
              onChange: (can_consumption_number) => {
                debugger;
                setMegaState({ ...megaState, can_consumption_number });
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
                          // ConsumptionItemsEvents().generateConsumptionRecpt(
                          //   megaState.consumption_number
                          // );
                        },
                      },
                    },
                  ],
                }
              : ""
          }
          // selectedLang={this.state.selectedLang}
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
