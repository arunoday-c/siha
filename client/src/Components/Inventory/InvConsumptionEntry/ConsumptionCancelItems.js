// import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import MyContext from "../../../../utils/MyContext";
// import "./ConsumptionItems.scss";
// import "./../../../../styles/site.scss";
// import {
//   AlgaehDataGrid,
//   AlgaehLabel,
// //   AlagehFormGroup,
// //   AlagehAutoComplete,
// //   AlgaehDateHandler,
// } from "../../../Wrapper/algaehWrapper";
// import ConsumptionItemsEvents from "./ConsumptionItemsEvents";
// import { AlgaehActions } from "../../../../actions/algaehActions";
import Options from "../../../Options.json";
import moment from "moment";
// // import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
// // import spotlightSearch from "../../../../Search/spotlightSearch.json";
// // import ItemBatchs from "../ItemBatchs/ItemBatchs";
// class ConsumptionItems extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       selectBatch: false,
//       selectBatchButton: true,
//     };
//   }

//   UNSAFE_componentWillMount() {
//     let InputOutput = this.props.ConsumptionIOputs;
//     this.setState({ ...this.state, ...InputOutput });
//   }

//   componentDidMount() {
//     if (
//       this.props.inventoryitemcategory === undefined ||
//       this.props.inventoryitemcategory.length === 0
//     ) {
//       this.props.getItemCategory({
//         uri: "/inventory/getItemCategory",
//         module: "inventory",
//         method: "GET",
//         redux: {
//           type: "ITEM_CATEGORY_GET_DATA",
//           mappingName: "inventoryitemcategory",
//         },
//       });
//     }

//     if (
//       this.props.inventoryitemgroup === undefined ||
//       this.props.inventoryitemgroup.length === 0
//     ) {
//       this.props.getItemGroup({
//         uri: "/inventory/getItemGroup",
//         module: "inventory",
//         method: "GET",
//         redux: {
//           type: "ITEM_GROUOP_GET_DATA",
//           mappingName: "inventoryitemgroup",
//         },
//       });
//     }

//     if (
//       this.props.inventoryitemuom === undefined ||
//       this.props.inventoryitemuom.length === 0
//     ) {
//       this.props.getItemUOM({
//         uri: "/inventory/getInventoryUom",
//         module: "inventory",
//         method: "GET",
//         redux: {
//           type: "ITEM_UOM_GET_DATA",
//           mappingName: "inventoryitemuom",
//         },
//       });
//     }
//   }

//   UNSAFE_componentWillReceiveProps(nextProps) {
//     this.setState(nextProps.ConsumptionIOputs);
//   }
//   itemchangeText(context, e, ctrl) {
//     ConsumptionItemsEvents().itemchangeText(this, context, e, ctrl);
//   }

//   UomchangeTexts(context, e) {
//     ConsumptionItemsEvents().UomchangeTexts(this, context, e);
//   }
//   numberchangeTexts(context, e) {
//     ConsumptionItemsEvents().numberchangeTexts(this, context, e);
//   }

//   AddItems(context) {
//     ConsumptionItemsEvents().AddItems(this, context);
//   }
//   dateFormater(date) {
//     if (date !== null) {
//       return String(moment(date).format(Options.dateFormat));
//     }
//   }
//   deleteConsumptionDetail(context, row) {
//     ConsumptionItemsEvents().deleteConsumptionDetail(this, context, row);
//   }
//   ShowItemBatch() {
//     ConsumptionItemsEvents().ShowItemBatch(this);
//   }
//   CloseItemBatch(context, e) {
//     ConsumptionItemsEvents().CloseItemBatch(this, context, e);
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <MyContext.Consumer>
//           {(context) => (
//             <div className="hptl-phase1-requisition-item-form">
//               <div className="row">
//                 {/* <div className="col-lg-12">
//                <div className="portlet portlet-bordered margin-bottom-15">
//                     <div className="row">

//                       <AlgaehAutoSearch
//                         div={{
//                           className:
//                             "col-12 form-group mandatory AlgaehAutoSearch",
//                         }}
//                         label={{ forceLabel: "Item Name", isImp: true }}
//                         title="Search Items"
//                         id="item_id_search"
//                         template={(result) => {
//                           return (
//                             <section className="resultSecStyles">
//                               <div className="row">
//                                 <div className="col-12">
//                                   <h4 className="title">
//                                     {result.item_description}
//                                   </h4>
//                                   <small>{result.uom_description}</small>
//                                 </div>
//                               </div>
//                             </section>
//                           );
//                         }}
//                         name={"item_id"}
//                         columns={spotlightSearch.Items.Invitemmaster}
//                         displayField="item_description"
//                         value={this.state.item_description}
//                         searchName={"InventryForMaterialRequsition"}
//                         onClick={this.itemchangeText.bind(this, context)}
//                         onClear={() => {
//                           this.setState({
//                             item_description: "",
//                             item_code: null,
//                             item_category_id: null,
//                             uom_id: null,
//                             sales_uom: null,
//                             item_group_id: null,
//                             quantity: null,
//                             addItemButton: true,
//                             expiry_date: null,
//                             batchno: null,
//                             grn_no: null,
//                             qtyhand: null,
//                             barcode: null,
//                             ItemUOM: [],
//                             Batch_Items: [],
//                           });
//                           context.updateState({
//                             item_description: "",
//                             item_code: null,
//                             item_category_id: null,
//                             uom_id: null,
//                             sales_uom: null,
//                             item_group_id: null,
//                             quantity: null,
//                             addItemButton: true,
//                             expiry_date: null,
//                             batchno: null,
//                             grn_no: null,
//                             qtyhand: null,
//                             barcode: null,
//                             ItemUOM: [],
//                             Batch_Items: [],
//                           });
//                         }}
//                         others={{
//                           disabled: this.state.ItemDisable,
//                         }}
//                       />
//                       <AlagehAutoComplete
//                         div={{ className: "col" }}
//                         label={{ forceLabel: "UOM", isImp: true }}
//                         selector={{
//                           name: "uom_id",
//                           className: "select-fld",
//                           value: this.state.uom_id,
//                           dataSource: {
//                             textField: "uom_description",
//                             valueField: "uom_id",
//                             data: this.state.ItemUOM,
//                           },
//                           others: {
//                             disabled: true,
//                           },

//                           onChange: this.UomchangeTexts.bind(this, context),
//                         }}
//                       />

//                       <AlagehFormGroup
//                         div={{ className: "col" }}
//                         label={{
//                           forceLabel: "Batch No.",
//                         }}
//                         textBox={{
//                           className: "txt-fld",
//                           name: "batchno",
//                           value: this.state.batchno,
//                           events: {
//                             onChange: null,
//                           },
//                           others: {
//                             disabled: true,
//                           },
//                         }}
//                       />
//                       <AlgaehDateHandler
//                         div={{ className: "col" }}
//                         label={{ forceLabel: "Expiry Date" }}
//                         textBox={{
//                           className: "txt-fld",
//                           name: "expiry_date",
//                         }}
//                         minDate={new Date()}
//                         disabled={true}
//                         events={{
//                           onChange: null,
//                         }}
//                         value={this.state.expiry_date}
//                       />

//                       <AlagehFormGroup
//                         div={{ className: "col" }}
//                         label={{
//                           forceLabel: "Quantity",
//                         }}
//                         textBox={{
//                           number: {
//                             allowNegative: false,
//                             thousandSeparator: ",",
//                           },
//                           dontAllowKeys: ["-", "e", "."],
//                           className: "txt-fld",
//                           name: "quantity",
//                           value: this.state.quantity,
//                           events: {
//                             onChange: this.numberchangeTexts.bind(
//                               this,
//                               context
//                             ),
//                           },
//                           others: {
//                             disabled: this.state.ItemDisable,
//                           },
//                         }}
//                       />

//                       <AlagehFormGroup
//                         div={{ className: "col" }}
//                         label={{
//                           forceLabel: "Qty In Hand",
//                         }}
//                         textBox={{
//                           number: {
//                             allowNegative: false,
//                             thousandSeparator: ",",
//                           },
//                           className: "txt-fld",
//                           name: "qtyhand",
//                           value: this.state.qtyhand,
//                           events: {
//                             onChange: null,
//                           },
//                           others: {
//                             disabled: true,
//                           },
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <div className="row">
//                     <ItemBatchs
//                       show={this.state.selectBatch}
//                       onClose={this.CloseItemBatch.bind(this, context)}
//                       selectedLang={this.state.selectedLang}
//                       inputsparameters={{
//                         item_id: this.state.item_id,
//                         location_id: this.state.location_id,
//                         Batch_Items: this.state.Batch_Items,
//                       }}
//                     />
//                     <div className="col-lg-12 subFooter-btn">
//                       <button
//                         className="btn btn-primary"
//                         onClick={this.AddItems.bind(this, context)}
//                         disabled={this.state.addItemButton}
//                       >
//                         Add Item
//                       </button>
//                       <button
//                         className="btn btn-default"
//                         onClick={this.ShowItemBatch.bind(this)}
//                         disabled={this.state.addItemButton}
//                       >
//                         Select Batch
//                       </button>
//                       {this.state.Batch_Items.length > 1 ? (
//                         <span
//                           className="badge badge-warning animated flash slower"
//                           style={{ marginTop: 9, float: "right" }}
//                         >
//                           More Batch Available
//                         </span>
//                       ) : null}
//                     </div>
//                   </div>
//                 </div>  */}

//                 <div className="col-lg-12">
//                   <div className="portlet portlet-bordered margin-bottom-15">
//                     <div className="row">
//                       <div className="col-lg-12">
//                         <AlgaehDataGrid
//                           id="COMSUMPTIONGrid"
//                           columns={[

//                             {
//                               fieldName: "action",

//                               label: (
//                                 <AlgaehLabel label={{ forceLabel: "action" }} />
//                               ),
//                               displayTemplate: (row) => {
//                                 return (
//                                   <span>
//                                     <i
//                                       className="fas fa-trash-alt"
//                                       style={{
//                                         pointerEvents:
//                                           this.state.ItemDisable === true
//                                             ? "none"
//                                             : "",
//                                         opacity:
//                                           this.state.ItemDisable === true
//                                             ? "0.1"
//                                             : "",
//                                       }}
//                                       onClick={this.deleteConsumptionDetail.bind(
//                                         this,
//                                         context,
//                                         row
//                                       )}
//                                     />
//                                   </span>
//                                 );
//                               },
//                               others: {
//                                 maxWidth: 65,
//                                 resizable: false,
//                                 filterable: false,
//                                 style: { textAlign: "center" },
//                               },
//                             },
//                             {
//                               fieldName: "item_id",
//                               label: (
//                                 <AlgaehLabel
//                                   label={{ forceLabel: "Item Name" }}
//                                 />
//                               ),
//                               displayTemplate: (row) => {
//                                 let display =
//                                   this.props.inventoryitemlist === undefined
//                                     ? []
//                                     : this.props.inventoryitemlist.filter(
//                                         (f) =>
//                                           f.hims_d_inventory_item_master_id ===
//                                           row.item_id
//                                       );

//                                 return (
//                                   <span>
//                                     {display !== undefined &&
//                                     display.length !== 0
//                                       ? display[0].item_description
//                                       : ""}
//                                   </span>
//                                 );
//                               },
//                             },

//                             {
//                               fieldName: "item_category_id",
//                               label: (
//                                 <AlgaehLabel
//                                   label={{ forceLabel: "Item Category" }}
//                                 />
//                               ),
//                               displayTemplate: (row) => {
//                                 let display =
//                                   this.props.inventoryitemcategory === undefined
//                                     ? []
//                                     : this.props.inventoryitemcategory.filter(
//                                         (f) =>
//                                           f.hims_d_inventory_tem_category_id ===
//                                           row.item_category_id
//                                       );

//                                 return (
//                                   <span>
//                                     {display !== null && display.length !== 0
//                                       ? display[0].category_desc
//                                       : ""}
//                                   </span>
//                                 );
//                               },
//                             },

//                             {
//                               fieldName: "item_group_id",
//                               label: (
//                                 <AlgaehLabel
//                                   label={{ forceLabel: "Item Group" }}
//                                 />
//                               ),
//                               displayTemplate: (row) => {
//                                 let display =
//                                   this.props.inventoryitemgroup === undefined
//                                     ? []
//                                     : this.props.inventoryitemgroup.filter(
//                                         (f) =>
//                                           f.hims_d_inventory_item_group_id ===
//                                           row.item_group_id
//                                       );

//                                 return (
//                                   <span>
//                                     {display !== null && display.length !== 0
//                                       ? display[0].group_description
//                                       : ""}
//                                   </span>
//                                 );
//                               },
//                             },

//                             {
//                               fieldName: "uom_id",
//                               label: (
//                                 <AlgaehLabel label={{ forceLabel: "UOM" }} />
//                               ),
//                               displayTemplate: (row) => {
//                                 let display =
//                                   this.props.inventoryitemuom === undefined
//                                     ? []
//                                     : this.props.inventoryitemuom.filter(
//                                         (f) =>
//                                           f.hims_d_inventory_uom_id ===
//                                           row.uom_id
//                                       );

//                                 return (
//                                   <span>
//                                     {display !== null && display.length !== 0
//                                       ? display[0].uom_description
//                                       : ""}
//                                   </span>
//                                 );
//                               },
//                             },

//                             {
//                               fieldName: "batchno",
//                               label: (
//                                 <AlgaehLabel
//                                   label={{ forceLabel: "Batch No." }}
//                                 />
//                               ),
//                               disabled: true,
//                             },
//                             {
//                               fieldName: "expiry_date",
//                               label: (
//                                 <AlgaehLabel
//                                   label={{ forceLabel: "Expiry Date" }}
//                                 />
//                               ),
//                               displayTemplate: (row) => {
//                                 return (
//                                   <span>
//                                     {this.dateFormater(row.expiry_date)}
//                                   </span>
//                                 );
//                               },
//                               disabled: true,
//                             },
//                             {
//                               fieldName: "quantity",
//                               label: (
//                                 <AlgaehLabel
//                                   label={{ forceLabel: "Quantity" }}
//                                 />
//                               ),
//                               disabled: true,
//                             },
//                             {
//                               fieldName: "qtyhand",
//                               label: (
//                                 <AlgaehLabel
//                                   label={{ forceLabel: "Qty in Hand" }}
//                                 />
//                               ),
//                               disabled: true,
//                             },
//                           ]}
//                           keyId="consumption_id"
//                           dataSource={{
//                             data: this.state.inventory_stock_detail,
//                           }}
//                           isEditable={false}
//                           paging={{ page: 0, rowsPerPage: 10 }}
//                           events={{}}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </MyContext.Consumer>
//       </React.Fragment>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     inventoryitemlist: state.inventoryitemlist,
//     inventoryitemcategory: state.inventoryitemcategory,
//     inventoryitemuom: state.inventoryitemuom,
//     inventoryitemgroup: state.inventoryitemgroup,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getItemCategory: AlgaehActions,
//       getItemGroup: AlgaehActions,
//       getItemUOM: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(ConsumptionItems)
// );

import React from "react";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  //   MainContext,
  //   AlgaehModal,
  //   // RawSecurityComponent,
  //   AlgaehAutoComplete,
  //   AlgaehMessagePop,
  //   AlgaehSecurityComponent,
  //   AlgaehButton,
  //   // AlgaehFormGroup,
  //   AlgaehFormGroup,
} from "algaeh-react-components";

// import { useQuery } from "react-query";
// import { newAlgaehApi } from "../../../hooks";

// import _ from "lodash";

import "../../../styles/site.scss";

function ConsumptionCancelItems({ ConsumptionIOputs }) {
  debugger;
  //   async function getDemoData() {
  //     debugger;
  //     const result = await Promise.all([
  //       newAlgaehApi({
  //         uri: "/inventory/getItemMaster",
  //         module: "inventory",
  //         method: "GET",
  //         data: { item_status: "A" },
  //       }),
  //       newAlgaehApi({
  //         uri: "/inventory/getItemGroup",
  //         module: "inventory",
  //         method: "GET",
  //       }),
  //       newAlgaehApi({
  //         uri: "/inventory/getInventoryUom",
  //         module: "inventory",
  //         method: "GET",
  //       }),
  //       newAlgaehApi({
  //         uri: "/inventory/getItemCategory",
  //         module: "inventory",
  //         method: "GET",
  //       }),
  //     ]);
  //     debugger;
  //     return {
  //       inventoryitemlist: result[0]?.data?.records,
  //       inventoryitemgroup: result[1]?.data?.records,

  //       inventoryitemuom: result[2]?.data?.records,
  //       inventoryitemcategory: result[3]?.data?.records,
  //     };
  //   }
  //   const { data: dropdownData } = useQuery("dropdown-data", getDemoData, {
  //     initialData: {
  //       inventoryitemlist: [],
  //       inventoryitemgroup: [],
  //       inventoryitemuom: [],
  //       inventoryitemcategory: [],
  //     },
  //     // refetchOnMount: true,
  //     // initialStale: true,
  //     // cacheTime: Infinity,
  //   });

  //   const {
  //     inventoryitemlist,
  //     inventoryitemgroup,
  //     inventoryitemcategory,
  //     inventoryitemuom,
  //   } = dropdownData;
  function dateFormater(date) {
    if (date !== null) {
      return String(moment(date).format(Options.dateFormat));
    }
  }
  return (
    <React.Fragment>
      {/* <MyContext.Consumer>
        {(context) => ( */}
      <div className="hptl-phase1-requisition-item-form">
        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="row">
                <div className="col-lg-12">
                  <AlgaehDataGrid
                    id="COMSUMPTIONGrid"
                    columns={[
                      {
                        fieldName: "item_description",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                        ),
                        filterable: true,
                        sortable: true,
                        // displayTemplate: (row) => {
                        //   let display =
                        //     inventoryitemlist === undefined
                        //       ? []
                        //       : inventoryitemlist.filter(
                        //           (f) =>
                        //             f.hims_d_inventory_item_master_id ===
                        //             row.item_id
                        //         );

                        //   return (
                        //     <span>
                        //       {display !== undefined && display.length !== 0
                        //         ? display[0].item_description
                        //         : ""}
                        //     </span>
                        //   );
                        // },
                      },

                      {
                        fieldName: "uom_description",
                        label: <AlgaehLabel label={{ forceLabel: "UOM" }} />,
                        filterable: true,
                        sortable: true,
                      },

                      {
                        fieldName: "batchno",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                        ),
                        filterable: true,
                        sortable: true,
                        disabled: true,
                      },
                      {
                        fieldName: "expiry_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                        ),
                        displayTemplate: (row) => {
                          return <span>{dateFormater(row.expiry_date)}</span>;
                        },
                        disabled: true,
                      },
                      {
                        fieldName: "quantity",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                        ),

                        disabled: true,
                      },
                      {
                        fieldName: "qtyhand",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Qty in Hand" }} />
                        ),
                        disabled: true,
                      },
                    ]}
                    keyId="consumption_id"
                    data={ConsumptionIOputs.inventory_stock_detail}
                    // isEditable={false}
                    // paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    isFilterable={true}
                    pagination={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* )}
      </MyContext.Consumer> */}
    </React.Fragment>
  );
}

export default ConsumptionCancelItems;
