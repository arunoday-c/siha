import React, { Component } from "react";
import "./DNItemList.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { debounce } from "lodash";
import { newAlgaehApi } from "../../../../hooks";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
} from "../../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../../utils/algaehApiCall";
// import {
//   AlgaehSecurityComponent,
//   // Modal,
//   // AlgaehButton,
//   // MainContext,
// } from "algaeh-react-components";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";
import {
  deleteDNDetail,
  updateDNDetail,
  onchhangegriddiscount,
  GridAssignData,
  onchangegridcol,
  EditGrid,
  CancelGrid,
  onchangegridcoldatehandle,
  changeDateFormat,
  printBarcode,
  onchhangeNumber,
  onChangeTextEventHandaler,
  onDateTextEventHandaler,
  OnChangeDeliveryQty,
  AddtoList,
  numberEventHandaler,
  dateValidate,
  discounthandle,
  AssignData,
} from "./DNItemListEvents";
import { getDocuments } from "../DeliveryNoteEntryEvent";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import extend from "extend";
import { Upload, Modal } from "antd";
import { Input, Popover } from "algaeh-react-components";
const { Dragger } = Upload;
const { confirm } = Modal;
class DNItemList extends Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "", filterList: [], po_entry_detail: [] };
    this.searchTextRef = undefined;
    this.handleSearch = debounce(() => {
      const value = this.searchTextRef.state.value;
      let filterd = [];
      if (value !== "") {
        filterd = this.state.po_entry_detail.filter((f) =>
          f.item_description.toLowerCase().includes(value.toLowerCase())
        );
      }
      this.setState({ searchText: value, filterList: filterd });
    }, 500);
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.DNEntry;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.DNEntry);
  }

  AddItemDelivered(context, item, index) {
    debugger;
    let item_details = extend({}, item);
    let dn_quantity =
      parseFloat(item.po_quantity) -
      parseFloat(item.dn_quantity) -
      parseFloat(item.quantity_recieved_todate);

    item_details.actual_unit_cost = item_details.unit_price;
    item_details.purchase_cost = item_details.unit_price;
    let extended_price = (
      parseFloat(item_details.unit_price) * parseFloat(dn_quantity)
    ).toFixed(this.state.decimal_places);
    let discount_amount = (
      (parseFloat(extended_price) *
        parseFloat(item_details.discount_percentage)) /
      100
    ).toFixed(this.state.decimal_places);

    let extended_cost =
      parseFloat(extended_price) - parseFloat(discount_amount);
    let tax_amount = (
      (parseFloat(extended_cost) * parseFloat(item_details.tax_percentage)) /
      100
    ).toFixed(this.state.decimal_places);

    item_details["extended_price"] = parseFloat(extended_price);
    item_details["extended_cost"] = parseFloat(extended_cost);
    item_details["unit_cost"] = (
      parseFloat(extended_cost) / parseFloat(dn_quantity)
    ).toFixed(this.state.decimal_places);

    item_details["tax_amount"] = parseFloat(tax_amount);
    item_details["total_amount"] =
      parseFloat(tax_amount) + parseFloat(extended_cost);

    item_details["discount_amount"] = parseFloat(discount_amount);
    item_details["net_extended_cost"] = parseFloat(extended_cost);

    item_details.free_qty = 0;
    item_details.dn_quantity = dn_quantity;
    item_details.unit_price = parseFloat(item_details.unit_price).toFixed(
      this.state.decimal_places
    );
    this.setState({
      selected_row_index: index,
      item_details: item_details,
      dn_quantity: dn_quantity,
      free_qty: 0,
      addItemButton: false,
      itemEnter: false,
    });

    context.updateState({
      item_details: item_details,
      dn_quantity: dn_quantity,
      free_qty: 0,
      addItemButton: false,
      itemEnter: false,
      expiry_date: null,
    });
  }
  saveDocument = (files = [], number, id) => {
    if (this.state.delivery_note_number) {
      // const formData = new FormData();
      // formData.append("grn_number", number || this.state.delivery_note_number);
      // formData.append(
      //   "hims_f_procurement_grn_header_id",
      //   id || this.state.hims_f_procurement_dn_header_id
      // );
      // if (files.length) {
      //   files.forEach((file, index) => {
      //     formData.append(`file_${index}`, file, file.name);
      //   });
      // } else {
      //   this.state.delivery_files.forEach((file, index) => {
      //     formData.append(`file_${index}`, file, file.name);
      //   });
      // }
      // newAlgaehApi({
      //   uri: "/saveReceiptEntryDoc",
      //   data: formData,
      //   extraHeaders: { "Content-Type": "multipart/form-data" },
      //   method: "POST",
      //   module: "documentManagement",
      // })
      const formData = new FormData();
      formData.append("doc_number", this.state.delivery_note_number);
      formData.append("mainFolderName", "DeliveryNoteEntryDocuments");
      if (files.length) {
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file, file.name);
        });
      } else {
        this.state.delivery_files.forEach((file, index) => {
          formData.append(`file_${index}`, file, file.name);
        });
      }

      // files.forEach((file, index) => {
      //   formData.append(`file_${index}`, file, file.name);
      //   formData.append("fileName", file.name);
      // });

      newAlgaehApi({
        uri: "/uploadDocument",
        data: formData,
        extraHeaders: { "Content-Type": "multipart/form-data" },
        method: "POST",
        module: "documentManagement",
      })
        .then((value) => getDocuments(this))
        .catch((e) => console.log(e));
    } else {
      swalMessage({
        title: "Can't upload attachments for unsaved sales Invoice",
        type: "error",
      });
    }
  };
  downloadDoc(doc, isPreview) {
    // const fileUrl = `data:${doc.filetype};base64,${doc.document}`;
    // const link = document.createElement("a");
    // if (!isPreview) {
    //   link.download = doc.filename;
    //   link.href = fileUrl;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // } else {
    //   fetch(fileUrl)
    //     .then((res) => res.blob())
    //     .then((fblob) => {
    //       const newUrl = URL.createObjectURL(fblob);
    //       window.open(newUrl);
    //     });
    // }
    newAlgaehApi({
      uri: "/downloadFromPath",
      module: "documentManagement",
      method: "GET",
      extraHeaders: {
        Accept: "blob",
      },
      others: {
        responseType: "blob",
      },
      data: {
        fileName: doc.value,
      },
    })
      .then((resp) => {
        const urlBlob = URL.createObjectURL(resp.data);
        if (isPreview) {
          window.open(urlBlob);
        } else {
          const link = document.createElement("a");
          link.download = doc.name;
          link.href = urlBlob;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        // setPDFLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // setPDFLoading(false);
      });
  }

  deleteDoc = (doc) => {
    const self = this;
    confirm({
      title: `Are you sure you want to delete this file?`,
      content: `${doc.filename}`,
      icon: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        self.onDelete(doc);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  onDelete = (doc) => {
    // newAlgaehApi({
    //   uri: "/deleteReceiptEntryDoc",
    //   method: "DELETE",
    //   module: "documentManagement",
    //   data: { id: doc._id },
    // }).then((res) => {
    //   if (res.data.success) {
    //     this.setState((state) => {
    //       const delivery_docs = state.delivery_docs.filter(
    //         (item) => item._id !== doc._id
    //       );
    //       return { delivery_docs };
    //     });
    //   }
    // });
    newAlgaehApi({
      uri: "/deleteDocs",
      method: "DELETE",
      module: "documentManagement",
      data: { completePath: doc.value },
    }).then((res) => {
      if (res.data.success) {
        this.setState((state) => {
          const receipt_docs = state.receipt_docs.filter(
            (item) => item.name !== doc.name
          );
          return { receipt_docs };
        });
      }
    });
  };
  render() {
    let item_name =
      this.state.item_details === null
        ? null
        : this.state.item_details.item_description;
    let uom_description =
      this.state.item_details === null
        ? null
        : this.state.item_details.uom_description;

    let qty_auth =
      this.state.item_details === null
        ? null
        : this.state.item_details.po_quantity;
    // let unit_cost =
    //   this.state.item_details === null
    //     ? null
    //     : this.state.item_details.unit_cost;
    let required_batchno =
      this.state.item_details === null
        ? "Y"
        : this.state.item_details.exp_date_required;

    let stock_uom_description =
      this.state.item_details === null
        ? ""
        : this.state.item_details.stock_uom_description === undefined
        ? "-----"
        : this.state.item_details.stock_uom_description;
    const itemListArray =
      this.state.searchText === ""
        ? this.state.po_entry_detail
        : this.state.filterList;
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {(context) => (
            <div className="hims-delivery-note-entry">
              <div className="row">
                <div className="col-3">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Requested Items</h3>
                      </div>
                      <div className="actions">
                        <small>
                          {" "}
                          Records {this.state.filterList.length}/
                          {this.state.po_entry_detail.length}
                        </small>
                      </div>
                    </div>
                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-12">
                          {" "}
                          <Input
                            placeholder="Search"
                            defaultValue={this.state.searchText}
                            onChange={this.handleSearch.bind(this)}
                            ref={(c) => {
                              this.searchTextRef = c;
                            }}
                          />
                        </div>
                        <div className="col-12">
                          {" "}
                          <ul className="reqTransList">
                            {itemListArray.map((item, index) => {
                              return (
                                <li>
                                  <div className="itemReq">
                                    <h6>
                                      {item.item_description} (
                                      {item.uom_description})
                                    </h6>
                                    <Popover
                                      content={
                                        <div>
                                          {" "}
                                          <small>
                                            Purchased Qty :
                                            <strong>
                                              {parseFloat(item.po_quantity)}
                                            </strong>{" "}
                                          </small>
                                          <br />
                                          <small>
                                            Deliverd Qty :
                                            <strong>
                                              {parseFloat(item.dn_quantity)}
                                            </strong>
                                          </small>
                                          <br />
                                          <small>
                                            Pending Qty :
                                            <strong>
                                              {parseFloat(
                                                item.quantity_outstanding
                                              )}
                                            </strong>
                                          </small>{" "}
                                          <br />
                                          <small>
                                            Qty Pending to Receive:
                                            <strong>
                                              {parseFloat(
                                                item.quantity_outstanding
                                              )}
                                            </strong>
                                          </small>{" "}
                                          <br />
                                          <small>
                                            Qty. Received Till Date:
                                            <strong>
                                              {parseFloat(
                                                item.quantity_recieved_todate
                                              )}
                                            </strong>
                                          </small>
                                        </div>
                                      }
                                    >
                                      <div className="progressCntr">
                                        <p
                                          style={{
                                            width: `${
                                              ((parseFloat(item.dn_quantity) +
                                                parseFloat(
                                                  item.quantity_recieved_todate
                                                )) /
                                                parseFloat(item.po_quantity)) *
                                              100
                                            }%`,
                                          }}
                                        >
                                          Pending Qty -
                                          {parseFloat(item.po_quantity) -
                                            (parseFloat(item.dn_quantity) +
                                              parseFloat(
                                                item.quantity_recieved_todate
                                              ))}
                                        </p>
                                      </div>
                                    </Popover>
                                    <div className="progressLegend">
                                      <small>
                                        Purchased Qty:
                                        <span>
                                          {parseFloat(item.po_quantity)}
                                        </span>
                                      </small>
                                      <small>
                                        Deliverd Qty:
                                        <span>
                                          {parseFloat(item.dn_quantity) +
                                            parseFloat(
                                              item.quantity_recieved_todate
                                            )}
                                        </span>
                                      </small>
                                    </div>
                                    {/* <span>
                                      Purchased Qty:
                                      <span>
                                        {parseFloat(item.po_quantity)}
                                      </span>
                                    </span> */}

                                    {/* <span>
                                      Deliverd Qty:
                                      <span>
                                        {parseFloat(item.dn_quantity)}
                                      </span>
                                    </span>
                                    <span>
                                      Qty Pending to Receive:
                                      <span>
                                        {parseFloat(item.quantity_outstanding)}
                                      </span>
                                    </span>

                                    <span>
                                      Qty. Received Till Date:
                                      <span>
                                        {parseFloat(
                                          item.quantity_recieved_todate
                                        )}
                                      </span>
                                    </span> */}
                                  </div>
                                  <div className="itemAction">
                                    <button
                                      className="btn btn-sm btn-edit-list"
                                      style={{
                                        pointerEvents:
                                          this.state.cannotEdit === true
                                            ? "none"
                                            : "",
                                        opacity:
                                          this.state.cannotEdit === true
                                            ? "0.1"
                                            : "",
                                      }}
                                      onClick={this.AddItemDelivered.bind(
                                        this,
                                        context,
                                        item,
                                        index
                                      )}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-9" style={{ marginBottom: 50 }}>
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="row">
                      <div className="col-5">
                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                        <h6>
                          {item_name ? item_name : "----------"} (
                          {uom_description ? uom_description : "----------"})
                        </h6>
                      </div>

                      <div className="col-2">
                        <AlgaehLabel label={{ forceLabel: "Required Qty" }} />
                        <h6>{qty_auth ? qty_auth : "----------"}</h6>
                      </div>

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Purchase Cost",
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value:
                            this.state.item_details === null
                              ? null
                              : this.state.item_details.unit_price,
                          className: "txt-fld",
                          name: "unit_price",
                          events: {
                            onChange: onChangeTextEventHandaler.bind(
                              this,
                              this,
                              context
                            ),
                          },
                          others: {
                            disabled:
                              this.state.posted === "Y"
                                ? true
                                : this.state.itemEnter,
                          },
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Vendor Batch No",
                        }}
                        textBox={{
                          value: this.state.vendor_batchno,
                          className: "txt-fld",
                          name: "vendor_batchno",
                          events: {
                            onChange: onChangeTextEventHandaler.bind(
                              this,
                              this,
                              context
                            ),
                          },
                          others: {
                            disabled:
                              this.state.posted === "Y"
                                ? true
                                : this.state.itemEnter,
                          },
                        }}
                      />
                    </div>
                    <div className="row" style={{ marginTop: 15 }}>
                      <AlgaehDateHandler
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Expiry Date",
                          isImp: required_batchno === "Y" ? true : false,
                        }}
                        textBox={{
                          className: "txt-fld hidden",
                          name: "expiry_date",
                        }}
                        minDate={new Date()}
                        disabled={
                          this.state.posted === "Y"
                            ? true
                            : this.state.itemEnter
                        }
                        events={{
                          onChange: onDateTextEventHandaler.bind(
                            this,
                            this,
                            context
                          ),
                          onBlur: dateValidate.bind(this, this, context),
                        }}
                        value={this.state.expiry_date}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel:
                            "Sales Price " +
                            "(" +
                            stock_uom_description.toString() +
                            ")",
                          isImp: true,
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value:
                            this.state.item_details === null
                              ? null
                              : this.state.item_details.sales_price,
                          className: "txt-fld",
                          name: "sales_price",
                          events: {
                            onChange: onChangeTextEventHandaler.bind(
                              this,
                              this,
                              context
                            ),
                          },
                          others: {
                            disabled:
                              this.state.posted === "Y"
                                ? true
                                : this.state.itemEnter,
                          },
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Delivery Qty.",
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ",",
                          },
                          value: this.state.dn_quantity,
                          className: "txt-fld",
                          name: "dn_quantity",
                          dontAllowKeys: ["-", "e", "."],
                          events: {
                            onChange: OnChangeDeliveryQty.bind(
                              this,
                              this,
                              context
                            ),
                          },
                          others: {
                            disabled:
                              this.state.posted === "Y"
                                ? true
                                : this.state.itemEnter,
                          },
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Discount %",
                        }}
                        textBox={{
                          decimal: { allowNegative: false, decimalScale: 6 },
                          value:
                            this.state.item_details === null
                              ? null
                              : this.state.item_details.discount_percentage,
                          className: "txt-fld",
                          name: "discount_percentage",
                          events: {
                            onChange: discounthandle.bind(this, this, context),
                          },
                          others: {
                            disabled:
                              this.state.posted === "Y"
                                ? true
                                : this.state.itemEnter,
                            onBlur: AssignData.bind(this, this),
                          },
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Bonus Qty.",
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ",",
                          },
                          value: this.state.free_qty,
                          className: "txt-fld",
                          name: "free_qty",
                          dontAllowKeys: ["-", "e", "."],
                          events: {
                            onChange: numberEventHandaler.bind(
                              this,
                              this,
                              context
                            ),
                          },
                          others: {
                            disabled:
                              this.state.posted === "Y"
                                ? true
                                : this.state.itemEnter,
                          },
                        }}
                      />

                      <div className="col">
                        <button
                          className="btn btn-default"
                          style={{
                            marginTop: 20,
                          }}
                          onClick={AddtoList.bind(this, this, context)}
                          disabled={this.state.addItemButton}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-12 margin-bottom-15" id="DNGrid">
                          <AlgaehDataGrid
                            id="DN_details"
                            columns={[
                              {
                                fieldName: "action",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Action" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return this.state.saveEnable === true ? (
                                    <span
                                      onClick={printBarcode.bind(
                                        this,
                                        this,
                                        row
                                      )}
                                    >
                                      <i className="fas fa-barcode" />
                                    </span>
                                  ) : (
                                    <span
                                      onClick={deleteDNDetail.bind(
                                        this,
                                        this,
                                        row,
                                        context
                                      )}
                                    >
                                      <i className="fas fa-trash-alt" />
                                    </span>
                                  );
                                },

                                disabled: true,
                                others: {
                                  maxWidth: 70,
                                  resizable: false,
                                  filterable: false,
                                  style: { textAlign: "center" },
                                  fixed: "left",
                                },
                              },
                              {
                                fieldName:
                                  this.state.dn_from === "PHR"
                                    ? "phar_item_id"
                                    : "inv_item_id",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Item Name" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemlist === undefined
                                          ? []
                                          : this.props.dnitemlist.filter(
                                              (f) =>
                                                f.hims_d_item_master_id ===
                                                row.phar_item_id
                                            ))
                                    : (display =
                                        this.props.dnitemlist === undefined
                                          ? []
                                          : this.props.dnitemlist.filter(
                                              (f) =>
                                                f.hims_d_inventory_item_master_id ===
                                                row.inv_item_id
                                            ));

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].item_description
                                        : ""}
                                    </span>
                                  );
                                },
                                editorTemplate: (row) => {
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemlist === undefined
                                          ? []
                                          : this.props.dnitemlist.filter(
                                              (f) =>
                                                f.hims_d_item_master_id ===
                                                row.phar_item_id
                                            ))
                                    : (display =
                                        this.props.dnitemlist === undefined
                                          ? []
                                          : this.props.dnitemlist.filter(
                                              (f) =>
                                                f.hims_d_inventory_item_master_id ===
                                                row.inv_item_id
                                            ));

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].item_description
                                        : ""}
                                    </span>
                                  );
                                },
                                others: { minWidth: 150 },
                              },

                              {
                                fieldName:
                                  this.state.dn_from === "PHR"
                                    ? "phar_item_category"
                                    : "inv_item_category_id",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Item Category" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemcategory === undefined
                                          ? []
                                          : this.props.dnitemcategory.filter(
                                              (f) =>
                                                f.hims_d_item_category_id ===
                                                row.phar_item_category
                                            ))
                                    : (display =
                                        this.props.dnitemcategory === undefined
                                          ? []
                                          : this.props.dnitemcategory.filter(
                                              (f) =>
                                                f.hims_d_inventory_tem_category_id ===
                                                row.inv_item_category_id
                                            ));

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].category_desc
                                        : ""}
                                    </span>
                                  );
                                },
                                editorTemplate: (row) => {
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemcategory === undefined
                                          ? []
                                          : this.props.dnitemcategory.filter(
                                              (f) =>
                                                f.hims_d_item_category_id ===
                                                row.phar_item_category
                                            ))
                                    : (display =
                                        this.props.dnitemcategory === undefined
                                          ? []
                                          : this.props.dnitemcategory.filter(
                                              (f) =>
                                                f.hims_d_inventory_tem_category_id ===
                                                row.inv_item_category_id
                                            ));

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].category_desc
                                        : ""}
                                    </span>
                                  );
                                },
                                others: { minWidth: 250 },
                              },
                              {
                                fieldName:
                                  this.state.dn_from === "PHR"
                                    ? "phar_item_group"
                                    : "inv_item_group_id",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Item Group" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemgroup === undefined
                                          ? []
                                          : this.props.dnitemgroup.filter(
                                              (f) =>
                                                f.hims_d_item_group_id ===
                                                row.phar_item_group
                                            ))
                                    : (display =
                                        this.props.dnitemgroup === undefined
                                          ? []
                                          : this.props.dnitemgroup.filter(
                                              (f) =>
                                                f.hims_d_inventory_item_group_id ===
                                                row.inv_item_group_id
                                            ));

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].group_description
                                        : ""}
                                    </span>
                                  );
                                },
                                editorTemplate: (row) => {
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemgroup === undefined
                                          ? []
                                          : this.props.dnitemgroup.filter(
                                              (f) =>
                                                f.hims_d_item_group_id ===
                                                row.phar_item_group
                                            ))
                                    : (display =
                                        this.props.dnitemgroup === undefined
                                          ? []
                                          : this.props.dnitemgroup.filter(
                                              (f) =>
                                                f.hims_d_inventory_item_group_id ===
                                                row.inv_item_group_id
                                            ));

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].group_description
                                        : ""}
                                    </span>
                                  );
                                },
                                others: { minWidth: 150 },
                              },

                              {
                                fieldName: "vendor_batchno",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Vend. Batch  No." }}
                                  />
                                ),
                                editorTemplate: (row) => {
                                  return (
                                    <AlagehFormGroup
                                      div={{}}
                                      textBox={{
                                        value: row.vendor_batchno,
                                        className: "txt-fld",
                                        name: "vendor_batchno",
                                        events: {
                                          onChange: onchangegridcol.bind(
                                            this,
                                            this,
                                            row
                                          ),
                                        },
                                        others: {
                                          disabled:
                                            this.state.posted === "Y"
                                              ? true
                                              : false,
                                        },
                                      }}
                                    />
                                  );
                                },
                                others: {
                                  minWidth: 150,
                                  resizable: false,
                                },
                              },
                              {
                                fieldName: "expiry_date",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Expiry Date" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {changeDateFormat(row.expiry_date)}
                                    </span>
                                  );
                                },
                                editorTemplate: (row) => {
                                  return (
                                    <AlgaehDateHandler
                                      div={{}}
                                      textBox={{
                                        className: "txt-fld hidden",
                                        name: "expiry_date",
                                      }}
                                      minDate={new Date()}
                                      disabled={
                                        this.state.posted === "Y" ? true : false
                                      }
                                      events={{
                                        onChange:
                                          onchangegridcoldatehandle.bind(
                                            this,
                                            this,
                                            row
                                          ),
                                      }}
                                      value={row.expiry_date}
                                    />
                                  );
                                },
                                others: {
                                  minWidth: 150,
                                  resizable: false,
                                },
                              },

                              {
                                fieldName: "sales_price",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Sales Price" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {GetAmountFormart(row.sales_price, {
                                        appendSymbol: false,
                                      })}
                                    </span>
                                  );
                                },
                                editorTemplate: (row) => {
                                  return (
                                    <AlagehFormGroup
                                      div={{}}
                                      textBox={{
                                        number: {
                                          allowNegative: false,
                                          thousandSeparator: ",",
                                        },
                                        value: row.sales_price,
                                        className: "txt-fld",
                                        name: "sales_price",
                                        events: {
                                          onChange: onchhangeNumber.bind(
                                            this,
                                            this,
                                            row
                                          ),
                                        },
                                      }}
                                    />
                                  );
                                },
                              },

                              {
                                fieldName: "dn_quantity",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Delivery Qty" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>{parseFloat(row.dn_quantity)}</span>
                                  );
                                },
                                editorTemplate: (row) => {
                                  return (
                                    <AlagehFormGroup
                                      div={{}}
                                      textBox={{
                                        number: {
                                          allowNegative: false,
                                          thousandSeparator: ",",
                                        },
                                        value: row.dn_quantity,
                                        className: "txt-fld",
                                        name: "dn_quantity",
                                        events: {
                                          onChange: onchhangegriddiscount.bind(
                                            this,
                                            this,
                                            row
                                          ),
                                        },
                                        others: {
                                          disabled: !this.state.authorizeEnable,
                                          onBlur: GridAssignData.bind(
                                            this,
                                            this,
                                            row
                                          ),
                                          onFocus: (e) => {
                                            e.target.oldvalue = e.target.value;
                                          },
                                        },
                                      }}
                                    />
                                  );
                                },
                              },
                              {
                                fieldName: "free_qty",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Free Qty" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>{parseFloat(row.free_qty)}</span>
                                  );
                                },
                              },

                              {
                                fieldName: "discount_percentage",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Discount %" }}
                                  />
                                ),
                                disabled: true,
                              },
                              {
                                fieldName: "discount_amount",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Discount Amt" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {GetAmountFormart(row.discount_amount, {
                                        appendSymbol: false,
                                      })}
                                    </span>
                                  );
                                },
                                disabled: true,
                              },
                              {
                                fieldName: "net_extended_cost",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Net Ext Cost" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {GetAmountFormart(row.net_extended_cost, {
                                        appendSymbol: false,
                                      })}
                                    </span>
                                  );
                                },
                                disabled: true,
                              },
                              {
                                fieldName: "unit_cost",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Unit Cost" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {GetAmountFormart(row.unit_cost, {
                                        appendSymbol: false,
                                      })}
                                    </span>
                                  );
                                },

                                disabled: true,
                              },

                              {
                                fieldName: "tax_amount",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Tax Amt" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {GetAmountFormart(row.tax_amount, {
                                        appendSymbol: false,
                                      })}
                                    </span>
                                  );
                                },
                                disabled: true,
                              },

                              {
                                fieldName: "total_amount",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Total Amt" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {GetAmountFormart(row.total_amount, {
                                        appendSymbol: false,
                                      })}
                                    </span>
                                  );
                                },
                                disabled: true,
                              },
                            ]}
                            keyId="hims_f_procurement_dn_detail_id"
                            dataSource={{
                              data: this.state.dn_entry_detail,
                            }}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            byForceEvents={true}
                            events={{
                              onDelete: deleteDNDetail.bind(
                                this,
                                this,
                                context
                              ),
                              onEdit: EditGrid.bind(this, this, context),
                              onCancel: CancelGrid.bind(this, this, context),
                              onDone: updateDNDetail.bind(this, this, context),
                            }}
                          />
                        </div>
                        <div className="col-12">
                          <div className="row">
                            <div className="col" style={{ textAlign: "right" }}>
                              <div className="row">
                                <div className="col-3">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Sub Total",
                                    }}
                                  />
                                  <h6>
                                    {GetAmountFormart(this.state.sub_total)}
                                  </h6>
                                </div>

                                <div className="col-lg-3">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Tax",
                                    }}
                                  />
                                  <h6>
                                    {GetAmountFormart(this.state.total_tax)}
                                  </h6>
                                </div>
                                <div className="col-3">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Discount Amount",
                                    }}
                                  />
                                  <h6>
                                    {GetAmountFormart(
                                      this.state.detail_discount
                                    )}
                                  </h6>
                                </div>

                                <div className="col-3">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Net Payable",
                                    }}
                                  />
                                  <h6>
                                    {GetAmountFormart(this.state.net_payable)}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="portlet portlet-bordered"
                    style={{ marginBottom: 60 }}
                  >
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Attachments</h3>
                      </div>
                    </div>
                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-12 deliveryNoteAttachmentDragger">
                          {" "}
                          <Dragger
                            disabled={!this.state.saveEnable}
                            accept=".doc,.docx,application/msword,.pdf"
                            name="delivery_files"
                            multiple={false}
                            onRemove={() => {
                              this.setState((state) => {
                                return {
                                  delivery_files: [],
                                  docChanged: false,
                                  // saveEnable: state.dataExists && !newFileList.length,
                                };
                              });
                            }}
                            beforeUpload={(file) => {
                              this.setState((state) => ({
                                delivery_files: [file],
                                docChanged: true,

                                // saveEnable: false,
                              }));
                              return false;
                            }}
                            fileList={this.state.delivery_files}
                          >
                            <p className="upload-drag-icon">
                              <i className="fas fa-file-upload"></i>
                            </p>
                            <p className="ant-upload-text">
                              {this.state.delivery_files
                                ? `Click to Attach File`
                                : `Click to Attach File`}
                            </p>
                          </Dragger>
                        </div>

                        <div className="col-12">
                          <div className="row">
                            <div className="col-12">
                              <ul className="deliveryNoteAttachmentList">
                                {this.state.delivery_docs?.length ? (
                                  this.state.delivery_docs.map((doc) => (
                                    <li>
                                      <b> {doc.name} </b>
                                      <span>
                                        <i
                                          className="fas fa-download"
                                          onClick={() => this.downloadDoc(doc)}
                                        ></i>
                                        <i
                                          className="fas fa-eye"
                                          onClick={() =>
                                            this.downloadDoc(doc, true)
                                          }
                                        ></i>
                                        {!this.state.postEnable ? (
                                          <i
                                            className="fas fa-trash"
                                            onClick={() => this.deleteDoc(doc)}
                                          ></i>
                                        ) : null}
                                      </span>
                                    </li>
                                  ))
                                ) : (
                                  <div className="col-12 noAttachment" key={1}>
                                    <p>No Attachments Available</p>
                                  </div>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* <AlgaehSecurityComponent componentCode="SALES_INV_MAIN"> */}

                        {/* </AlgaehSecurityComponent> */}
                      </div>
                    </div>
                  </div>
                  {this.state.docChanged && this.state.delivery_note_number ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.saveDocument}
                      disabled={!this.state.docChanged}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Upload Documents",
                          returnText: true,
                        }}
                      />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    dnitemlist: state.dnitemlist,
    dnitemcategory: state.dnitemcategory,
    dnitemgroup: state.dnitemgroup,
    dnitemuom: state.dnitemuom,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DNItemList)
);

/*{
  fieldName: "po_quantity",
  label: (
    <AlgaehLabel
      label={{ forceLabel: "PO Quantity" }}
    />
  ),
  disabled: true
},
{
  fieldName: "quantity_outstanding",
  label: (
    <AlgaehLabel
      label={{
        forceLabel: "Qty Outstanding"
      }}
    />
  ),
  disabled: true,
  others: { minWidth: 140 }
},
{
  fieldName: "quantity_recieved_todate",
  label: (
    <AlgaehLabel
      label={{
        forceLabel: "Qty Received till date"
      }}
    />
  ),
  disabled: true,
  others: { minWidth: 150 }
},*/
