import moment from "moment";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import swal from "sweetalert2";
import Options from "../../../../Options.json";
import _ from "lodash";
import extend from "extend";

let texthandlerInterval = null;

const UomchangeTexts = ($this, context, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let unit_cost = e.selected.conversion_factor * $this.state.unit_cost;
  $this.setState({
    [name]: value,
    conversion_factor: e.selected.conversion_factor,
    unit_cost: unit_cost
  });
  context.updateState({
    [name]: value,
    conversion_factor: e.selected.conversion_factor,
    unit_cost: unit_cost
  });
};

const numberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (name === "quantity") {
    if (parseFloat(value) < 0) {
      swalMessage({
        title: "Quantity cannot be less than or equal to Zero",
        type: "warning"
      });
    } else if (parseFloat(value) > parseFloat($this.state.qtyhand)) {
      swalMessage({
        title: "Quantity cannot be greater than Quantity in hand",
        type: "warning"
      });
    } else {
      $this.setState({ [name]: value });

      clearInterval(texthandlerInterval);
      texthandlerInterval = setInterval(() => {
        if (context !== undefined) {
          context.updateState({
            [name]: value
          });
        }
        clearInterval(texthandlerInterval);
      }, 500);
    }
  } else {
    $this.setState({ [name]: value });

    clearInterval(texthandlerInterval);
    texthandlerInterval = setInterval(() => {
      if (context !== undefined) {
        context.updateState({
          [name]: value
        });
      }
      clearInterval(texthandlerInterval);
    }, 500);
  }
};

const AddItems = ($this, context) => {
  if (
    $this.state.from_location_id === null ||
    $this.state.to_location_id === null
  ) {
    swalMessage({
      title: "Please select From and To Location.",
      type: "warning"
    });

    return;
  }

  if (parseFloat($this.state.quantity) <= 0) {
    swalMessage({
      title: "Enter the Quantity",
      type: "warning"
    });
    return;
  }

  let stock_detail = $this.state.stock_detail;
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  let _pharmacy_stock_detail = [];
  let BatchExists = _.filter(
    pharmacy_stock_detail,
    f => f.batchno === $this.state.batchno
  );

  if (BatchExists.length > 0) {
    swalMessage({
      title: "Selected Batch Already Exists",
      type: "warning"
    });
    return;
  }

  let Item_Exists = _.find(
    stock_detail,
    f => f.item_id === $this.state.item_id
  );

  let ItemBatchInput = {
    item_id: $this.state.item_id,
    item_category_id: $this.state.item_category,
    item_group_id: $this.state.item_group_id,
    batchno: $this.state.batchno,
    grnno: $this.state.grn_no,
    expiry_date: $this.state.expiry_date,
    barcode: $this.state.barcode,
    sales_uom: $this.state.sales_uom_id,
    unit_cost: $this.state.unit_cost,
    quantity_transfer: $this.state.quantity,
    uom_transferred_id: $this.state.uom_id,
    sales_price: $this.state.sales_price
  };
  if (Item_Exists !== undefined) {
    let item_index = stock_detail.indexOf(Item_Exists);

    let pharmacy_stock_length =
      stock_detail[item_index].pharmacy_stock_detail.length;

    ItemBatchInput.pharmacy_stock_index = pharmacy_stock_length;
    stock_detail[item_index].pharmacy_stock_detail.push(ItemBatchInput);
    pharmacy_stock_detail.push(ItemBatchInput);
  } else {
    let ItemInput = {
      item_description: $this.state.item_description,
      item_id: $this.state.item_id,
      item_category_id: $this.state.item_category,
      item_group_id: $this.state.item_group_id,

      quantity_transferred: $this.state.quantity,
      uom_transferred_id: $this.state.uom_id,
      removed: "N"
    };

    ItemBatchInput.pharmacy_stock_index = 0;
    _pharmacy_stock_detail.push(ItemBatchInput);
    pharmacy_stock_detail.push(ItemBatchInput);
    ItemInput.pharmacy_stock_detail = _pharmacy_stock_detail;
    stock_detail.push(ItemInput);
  }
  debugger;

  $this.setState({
    stock_detail: stock_detail,
    pharmacy_stock_detail: pharmacy_stock_detail,
    item_id: null,
    item_category: null,
    uom_id: null,
    item_group_id: null,
    quantity: 0,

    expiry_date: null,
    batchno: null,
    grn_no: null,
    qtyhand: null,
    barcode: null,
    ItemUOM: [],
    Batch_Items: [],
    addItemButton: true,
    item_description: "",
    saveEnable: false,
    uom_description: null
  });
  if (context !== undefined) {
    context.updateState({
      stock_detail: stock_detail,
      pharmacy_stock_detail: pharmacy_stock_detail,
      item_id: null,
      item_category: null,
      uom_id: null,
      item_group_id: null,
      quantity: 0,

      expiry_date: null,
      batchno: null,
      grn_no: null,
      qtyhand: null,
      barcode: null,
      ItemUOM: [],
      Batch_Items: [],
      addItemButton: true,
      item_description: "",
      saveEnable: false,
      uom_description: null
    });
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const deleteTransEntryDetail = ($this, context, row, rowId) => {
  let display =
    $this.props.itemlist === undefined
      ? []
      : $this.props.itemlist.filter(
          f => f.hims_d_item_master_id === row.item_id
        );

  swal({
    title: "Are you sure want to delete ?" + display[0].item_description + "?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      debugger;
      let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
      let stock_detail = $this.state.stock_detail;

      let getDeleteRowData = _.find(
        stock_detail,
        f => f.item_id === row.item_id
      );

      let _index = stock_detail.indexOf(getDeleteRowData);

      let getPharStockToDelete = _.find(
        stock_detail[_index].pharmacy_stock_detail,
        f => f.pharmacy_stock_index === row.pharmacy_stock_index
      );

      let _pharmacy_stock_index = stock_detail[
        _index
      ].pharmacy_stock_detail.indexOf(getPharStockToDelete);

      stock_detail[_index].pharmacy_stock_detail.splice(
        _pharmacy_stock_index,
        1
      );

      if (stock_detail[_index].pharmacy_stock_detail.length === 0) {
        stock_detail.splice(_index, 1);
      }

      let _phar_index = pharmacy_stock_detail.indexOf(row);
      pharmacy_stock_detail.splice(_phar_index, 1);

      if (pharmacy_stock_detail.length === 0) {
        if (context !== undefined) {
          context.updateState({
            pharmacy_stock_detail: pharmacy_stock_detail,
            stock_detail: stock_detail,
            saveEnable: true
          });
        }
      } else {
        if (context !== undefined) {
          context.updateState({
            pharmacy_stock_detail: pharmacy_stock_detail,
            stock_detail: stock_detail
          });
        }
      }
    }
  });
};

const updateTransEntryDetail = ($this, context) => {
  if (context !== null) {
    context.updateState({
      saveEnable: false
    });
  }
};

const onchangegridcol = ($this, context, row, e) => {
  let name = e.target.name;
  let value = e.target.value === "" ? null : e.target.value;

  if (parseFloat(value) > parseFloat(row.qtyhand)) {
    swalMessage({
      title: "Cannot be greater than Quantity in Hand.",
      type: "warning"
    });
  } else if (parseFloat(value) < 0) {
    swalMessage({
      title: "Cannot be less than Zero.",
      type: "warning"
    });
  } else {
    let item_details = $this.state.item_details;

    row[name] = value;
    // row["quantity_outstanding"] =
    //   row.quantity_authorized - row.transfer_to_date - value;
    let quantity_transferred = _.sumBy(item_details.batches, s => {
      return s.quantity_transfer !== null ? parseFloat(s.quantity_transfer) : 0;
    });

    const _index = item_details.batches.indexOf(row);
    item_details.batches[_index] = row;

    item_details.quantity_transferred = quantity_transferred;

    item_details.quantity_outstanding =
      item_details.quantity_authorized -
      item_details.transfer_to_date -
      quantity_transferred;

    if (item_details.quantity_outstanding < 0) {
      swalMessage({
        title: "Quantity cannot be greater than requested quantity.",
        type: "warning"
      });
      row[name] = 0;
      quantity_transferred = _.sumBy(item_details.batches, s =>
        parseFloat(s.quantity_transfer)
      );
      item_details.quantity_transferred = quantity_transferred;

      item_details.quantity_outstanding =
        item_details.quantity_authorized -
        item_details.transfer_to_date -
        quantity_transferred;
    }
    $this.setState({
      item_details: item_details,
      quantity_transferred: quantity_transferred
    });

    if (context !== undefined) {
      context.updateState({
        item_details: item_details,
        quantity_transferred: quantity_transferred
      });
    }
  }
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const getItemLocationStock = ($this, value) => {
  $this.props.getItemLocationStock({
    uri: "/pharmacyGlobal/getItemLocationStock",
    module: "pharmacy",
    method: "GET",
    data: {
      pharmacy_location_id: $this.state.from_location_id,
      item_id: value.item_id
    },
    redux: {
      type: "ITEMS_BATCH_GET_DATA",
      mappingName: "itemBatch"
    },
    afterSuccess: data => {
      if (data.length !== 0) {
        let total_quantity = 0;
        for (let i = 0; i < data.length; i++) {
          let qtyhand = data[i].qtyhand;
          total_quantity = total_quantity + qtyhand;
        }
        $this.setState({
          total_quantity: total_quantity
        });
      }
    }
  });
};

const EditGrid = ($this, context, cancelRow) => {
  if (context !== null) {
    let _pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
    if (cancelRow !== undefined) {
      _pharmacy_stock_detail[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: !$this.state.saveEnable,
      pharmacy_stock_detail: _pharmacy_stock_detail
    });
  }
};

const AddSelectedBatches = ($this, context) => {
  if (
    parseFloat($this.state.item_details.quantity_transferred) >
    parseFloat($this.state.item_details.quantity_authorized)
  ) {
    swalMessage({
      title: "Transfer Qty cannot be greater than Request Qty.",
      type: "warning"
    });
  } else {
    if (context !== null) {
      let saveEnable = true;
      let _pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
      let _stock_detail = $this.state.stock_detail;
      let details = extend({}, $this.state.item_details);
      let batches = _.filter($this.state.item_details.batches, f => {
        return parseFloat(f.quantity_transfer) !== 0;
      });

      const _index = _stock_detail.indexOf($this.state.item_details);
      _stock_detail[_index] = $this.state.item_details;

      delete details.batches;

      _stock_detail[_index].pharmacy_stock_detail = batches.map(
        (item, index) => {
          return { ...item, ...details };
        }
      );

      let remove_item = _.filter(_pharmacy_stock_detail, f => {
        return f.item_id === details.item_id;
      });

      for (let i = 0; i < remove_item.length; i++) {
        if (remove_item[i].item_id === details.item_id) {
          _pharmacy_stock_detail.splice(remove_item[i], 1);
        }
      }

      _pharmacy_stock_detail.push(
        ...batches.map((item, index) => {
          item.sales_price = item.sale_price;
          return { ...item, ...details };
        })
      );
      saveEnable = _pharmacy_stock_detail.length > 0 ? false : true;
      context.updateState({
        stock_detail: _stock_detail,
        pharmacy_stock_detail: _pharmacy_stock_detail,
        batch_detail_view: false,
        saveEnable: saveEnable,
        quantity_transferred: 0
      });
    }
  }
};

const itemchangeText = ($this, context, e, ctrl) => {
  let name = ctrl;
  if (
    $this.state.from_location_id !== null &&
    $this.state.to_location_id !== null
  ) {
    let value = e.hims_d_item_master_id;

    algaehApiCall({
      uri: "/pharmacyGlobal/getUomLocationStock",
      module: "pharmacy",
      method: "GET",
      data: {
        location_id: $this.state.from_location_id,
        item_id: value
      },
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records;
          if (data.locationResult.length > 0) {
            const sales_conversion_factor = _.find(
              data.uomResult,
              f => f.uom_id === e.sales_uom_id
            );
            const qtyhand =
              parseFloat(data.locationResult[0].qtyhand) /
              parseFloat(sales_conversion_factor.conversion_factor);

            const sales_qtyhand =
              parseFloat(data.locationResult[0].qtyhand) /
              parseFloat(sales_conversion_factor.conversion_factor);

            for (var i = 0; i < data.locationResult.length; i++) {
              let qtyhand_batch =
                parseFloat(data.locationResult[i].qtyhand) /
                parseFloat(sales_conversion_factor.conversion_factor);
              data.locationResult[i].qtyhand = qtyhand_batch;
            }

            $this.setState({
              [name]: value,
              item_category: e.category_id,
              uom_id: e.sales_uom_id,
              service_id: e.service_id,
              item_group_id: e.group_id,
              quantity: 0,
              expiry_date: data.locationResult[0].expirydt,
              batchno: data.locationResult[0].batchno,
              grn_no: data.locationResult[0].grnno,
              qtyhand: qtyhand,
              barcode: data.locationResult[0].barcode,
              ItemUOM: data.uomResult,
              Batch_Items: data.locationResult,
              addItemButton: false,
              item_description: e.item_description,
              sales_uom_id: e.sales_uom_id,
              sales_conversion_factor:
                sales_conversion_factor.conversion_factor,
              uom_description: e.uom_description,
              stocking_uom: e.stocking_uom,
              conversion_factor: sales_conversion_factor.conversion_factor,
              sales_qtyhand: sales_qtyhand
            });

            if (context !== undefined) {
              context.updateState({
                [name]: value,
                item_category: e.category_id,
                uom_id: e.sales_uom_id,
                service_id: e.service_id,
                item_group_id: e.group_id,
                quantity: 0,

                expiry_date: data.locationResult[0].expirydt,
                batchno: data.locationResult[0].batchno,
                grn_no: data.locationResult[0].grnno,
                qtyhand: qtyhand,
                barcode: data.locationResult[0].barcode,
                ItemUOM: data.uomResult,
                Batch_Items: data.locationResult,
                addItemButton: false,
                item_description: e.item_description,
                sales_uom_id: e.sales_uom_id,
                sales_conversion_factor:
                  sales_conversion_factor.conversion_factor,
                uom_description: e.uom_description,
                stocking_uom: e.stocking_uom,
                conversion_factor: sales_conversion_factor.conversion_factor,
                sales_qtyhand: sales_qtyhand
              });
            }
          } else {
            swalMessage({
              title: "No stock available for selected Item.",
              type: "warning"
            });
            $this.setState({
              item_description: $this.state.item_description,
              item_id: $this.state.item_id
            });
            if (context !== undefined) {
              context.updateState({
                item_description: $this.state.item_description,
                item_id: $this.state.item_id
              });
            }
          }
        } else {
          swalMessage({
            title: response.data.message,
            type: "error"
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  } else {
    $this.setState(
      {
        [name]: null
      },
      () => {
        swalMessage({
          title: "Please select From Location and To Location.",
          type: "warning"
        });
      }
    );
  }
};

const ShowItemBatch = ($this, e) => {
  $this.setState({
    selectBatch: !$this.state.selectBatch
  });
};

const CloseItemBatch = ($this, context, e) => {
  let batchno =
    e !== undefined
      ? e.selected === true
        ? e.batchno
        : $this.state.batchno
      : $this.state.batchno;
  let expiry_date =
    e !== undefined
      ? e.selected === true
        ? moment(e.expirydt)._d
        : $this.state.expiry_date
      : $this.state.expiry_date;

  let grn_no =
    e !== undefined
      ? e.selected === true
        ? e.grnno
        : $this.state.grn_no
      : $this.state.grn_no;
  let qtyhand =
    e !== undefined
      ? e.selected === true
        ? e.qtyhand
        : $this.state.qtyhand
      : $this.state.qtyhand;

  let unit_cost =
    e !== undefined
      ? e.selected === true
        ? e.avgcost
        : $this.state.unit_cost
      : $this.state.unit_cost;

  let sale_price =
    e !== undefined
      ? e.selected === true
        ? e.sale_price
        : $this.state.sales_price
      : $this.state.sales_price;

  $this.setState({
    ...$this.state,
    selectBatch: !$this.state.selectBatch,
    batchno: batchno,
    expiry_date: expiry_date,
    grn_no: grn_no,
    qtyhand: qtyhand,
    unit_cost: unit_cost,
    sales_price: sale_price
  });

  if (context !== null) {
    context.updateState({
      batchno: batchno,
      expiry_date: expiry_date,
      grn_no: grn_no,
      qtyhand: qtyhand,
      unit_cost: unit_cost,
      sales_price: sale_price
    });
  }
};

export {
  UomchangeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  deleteTransEntryDetail,
  updateTransEntryDetail,
  onchangegridcol,
  dateFormater,
  getItemLocationStock,
  EditGrid,
  AddSelectedBatches,
  ShowItemBatch,
  CloseItemBatch
};
