import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import extend from "extend";
import Options from "../../../../Options.json";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import _ from "lodash";

let texthandlerInterval = null;

const discounthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let sheet_discount_percentage = 0;
  let sheet_discount_amount = 0;

  if (e.target.name === "sheet_discount_percentage") {
    sheet_discount_percentage =
      e.target.value === "" ? "" : parseFloat(e.target.value);
    sheet_discount_amount = 0;
  } else {
    sheet_discount_amount =
      e.target.value === "" ? "" : parseFloat(e.target.value);
    sheet_discount_percentage = 0;
  }
  if (sheet_discount_percentage > 100) {
    swalMessage({
      title: "Discount % cannot be greater than 100.",
      type: "Warning"
    });
    $this.setState({
      sheet_discount_percentage: $this.state.sheet_discount_percentage
    });

    if (context !== null) {
      context.updateState({
        sheet_discount_percentage: $this.state.sheet_discount_percentage
      });
    }
  } else if (sheet_discount_amount > $this.state.patient_payable) {
    swalMessage({
      title: "Discount Amount cannot be greater than Patient Share.",
      type: "Warning"
    });
    $this.setState({
      sheet_discount_amount: $this.state.sheet_discount_amount
    });

    if (context !== null) {
      context.updateState({
        sheet_discount_amount: $this.state.sheet_discount_amount
      });
    }
  } else {
    $this.setState(
      {
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      },
      () => {
        PosheaderCalculation($this, context);
      }
    );

    if (context !== null) {
      context.updateState({
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      });
    }
  }
};

const UomchangeTexts = ($this, context, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if ($this.state.uom_id !== value) {
    let qtyhand = 0;
    let unit_cost = 0;

    if ($this.state.sales_uom_id === $this.state.stocking_uom_id) {
      if (
        parseFloat($this.state.sales_conversion_factor) ===
        parseFloat(e.selected.conversion_factor)
      ) {
        unit_cost = $this.state.Real_unit_cost;
        qtyhand = parseFloat($this.state.sales_qtyhand);
      } else if (
        parseFloat($this.state.sales_conversion_factor) >
        parseFloat(e.selected.conversion_factor)
      ) {
        unit_cost =
          parseFloat($this.state.Real_unit_cost) /
          parseFloat($this.state.sales_conversion_factor);
        qtyhand =
          parseFloat($this.state.sales_qtyhand) *
          parseFloat(e.selected.conversion_factor);
      } else {
        qtyhand =
          parseFloat($this.state.sales_qtyhand) /
          parseFloat(e.selected.conversion_factor);
        unit_cost =
          parseFloat(e.selected.conversion_factor) *
          parseFloat($this.state.Real_unit_cost);
      }
    } else {
      if (
        parseFloat($this.state.sales_conversion_factor) ===
        parseFloat(e.selected.conversion_factor)
      ) {
        unit_cost = $this.state.Real_unit_cost;
        qtyhand = parseFloat($this.state.sales_qtyhand);
      } else if (
        parseFloat($this.state.sales_conversion_factor) >
        parseFloat(e.selected.conversion_factor)
      ) {
        unit_cost =
          parseFloat($this.state.Real_unit_cost) /
          parseFloat($this.state.sales_conversion_factor);
        qtyhand =
          parseFloat($this.state.sales_qtyhand) *
          parseFloat($this.state.sales_conversion_factor);
      } else {
        qtyhand =
          parseFloat($this.state.sales_qtyhand) /
          parseFloat($this.state.sales_conversion_factor);
        unit_cost =
          parseFloat(e.selected.conversion_factor) *
          parseFloat($this.state.Real_unit_cost);
      }
    }

    $this.setState({
      [name]: value,
      conversion_factor: e.selected.conversion_factor,
      unit_cost: unit_cost,
      qtyhand: qtyhand,
      uom_description: e.selected.text,
      quantity: 0
    });

    clearInterval(texthandlerInterval);
    texthandlerInterval = setInterval(() => {
      if (context !== undefined) {
        context.updateState({
          [name]: value,
          conversion_factor: e.selected.conversion_factor,
          unit_cost: unit_cost,
          qtyhand: qtyhand,
          uom_description: e.selected.text,
          quantity: 0
        });
      }
      clearInterval(texthandlerInterval);
    }, 500);
  }
};

const numberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (name === "quantity") {
    let required_qty_stock =
      parseFloat(value) * parseFloat($this.state.conversion_factor);
    if (parseFloat(value) < 0) {
      swalMessage({
        title: "Quantity cannot be less than or equal to Zero",
        type: "warning"
      });
      return;
    } else if (parseFloat(value) > parseFloat($this.state.qtyhand)) {
      swalMessage({
        title: "Quantity cannot be greater than Quantity in hand.",
        type: "warning"
      });
      return;
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
  }
  if (name === "discount_percentage") {
    if (parseFloat(value) < 0) {
      swalMessage({
        title: "Discount % cannot be less than Zero",
        type: "warning"
      });
      return;
    } else if (parseFloat(value) > 100) {
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "warning"
      });
      return;
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

const itemchangeText = ($this, context, e, ctrl) => {
  let name = ctrl;
  if ($this.state.location_id !== null) {
    if (e.service_id !== null) {
      let value = e.hims_d_item_master_id;

      algaehApiCall({
        uri: "/pharmacyGlobal/getUomLocationStock",
        module: "pharmacy",
        method: "GET",
        data: {
          location_id: $this.state.location_id,
          item_id: value
        },
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;
            if (data.locationResult.length > 0) {
              getUnitCost($this, context, e.service_id, e.sale_price);

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
                sales_qtyhand: sales_qtyhand,
                stocking_uom_id: e.stocking_uom_id,
                average_cost: data.locationResult[0].avgcost
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
                  sales_qtyhand: sales_qtyhand,
                  stocking_uom_id: e.stocking_uom_id,
                  average_cost: data.locationResult[0].avgcost
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
          AlgaehLoader({ show: false });
        },
        onFailure: error => {
          AlgaehLoader({ show: false });
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
            title: "Hospital service not linked to this item, contact Admin.",
            type: "warning"
          });
        }
      );
    }
  } else {
    $this.setState(
      {
        [name]: null
      },
      () => {
        swalMessage({
          title: "Please select Location.",
          type: "warning"
        });
      }
    );
  }
};

const getUnitCost = ($this, context, serviceid, sales_price) => {
  if ($this.state.insured === "N") {
    // if (sales_price > 0) {
    $this.setState({
      unit_cost: sales_price,
      Real_unit_cost: sales_price
    });

    if (context !== undefined) {
      context.updateState({
        unit_cost: sales_price,
        Real_unit_cost: sales_price
      });
    }
    // } else {
    //   $this.props.getServicesCost({
    //     uri: "/serviceType/getService",
    //     module: "masterSettings",
    //     method: "GET",
    //     data: { hims_d_services_id: serviceid },
    //     redux: {
    //       type: "SERVICES_GET_DATA",
    //       mappingName: "hospitalservices"
    //     },
    //     afterSuccess: data => {
    //       let servdata = Enumerable.from(data)
    //         .where(w => w.hims_d_services_id === parseInt(serviceid, 10))
    //         .firstOrDefault();
    //       if (servdata !== undefined || servdata !== null) {
    //         $this.setState({
    //           unit_cost: servdata.standard_fee,
    //           Real_unit_cost: servdata.standard_fee
    //         });
    //
    //         if (context !== undefined) {
    //           context.updateState({
    //             unit_cost: servdata.standard_fee,
    //             Real_unit_cost: servdata.standard_fee
    //           });
    //         }
    //       } else {
    //         swalMessage({
    //           title: "No Service for the selected item.",
    //           type: "warning"
    //         });
    //       }
    //     }
    //   });
    // }
  } else {
    $this.props.getInsuranceServicesCost({
      uri: "/insurance/getPriceList",
      method: "GET",
      data: {
        services_id: serviceid,
        insurance_id: $this.state.insurance_provider_id
      },
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "hospitalservices"
      },
      afterSuccess: data => {
        if (data.length > 0) {
          $this.setState({
            unit_cost: data[0].gross_amt,
            Real_unit_cost: data[0].gross_amt
          });

          if (context !== undefined) {
            context.updateState({
              unit_cost: data[0].gross_amt,
              Real_unit_cost: data[0].gross_amt
            });
          }
        } else {
          $this.setState({
            unit_cost: sales_price,
            Real_unit_cost: sales_price
          });

          if (context !== undefined) {
            context.updateState({
              unit_cost: sales_price,
              Real_unit_cost: sales_price
            });
          }
          swalMessage({
            title: "Insurance Not Covered.",
            type: "warning"
          });
        }
      }
    });
  }
};
const AddItems = ($this, context) => {
  if ($this.state.pos_customer_type === "OT") {
    if ($this.state.nationality_id === null) {
      swalMessage({
        title: "Select Nationality.",
        type: "warning"
      });
      return;
    } else if ($this.state.mobile_number === null) {
      swalMessage({
        title: "Enter Mobile Number.",
        type: "warning"
      });
      return;
    } else if ($this.state.patient_name === null) {
      swalMessage({
        title: "Enter Patient Name.",
        type: "warning"
      });
      return;
    }
  } else if ($this.state.pos_customer_type === "OP") {
    if ($this.state.visit_id === null) {
      swalMessage({
        title: "Select the Patient.",
        type: "warning"
      });
      return;
    }
  }

  if ($this.state.insurance_yesno === "Y") {
    if (
      $this.state.insurance_provider_id === null ||
      $this.state.sub_insurance_provider_id === null ||
      $this.state.network_type === null ||
      $this.state.policy_number === null ||
      $this.state.card_number === null
    ) {
      swalMessage({
        title: "Please provide insurance details properly.",
        type: "warning"
      });
      return;
    }
  }
  if ($this.state.uom_id === null) {
    swalMessage({
      title: "Select the UOM.",
      type: "warning"
    });
    return;
  }
  let itemData = Enumerable.from($this.state.pharmacy_stock_detail)
    .where(
      w =>
        w.item_id === $this.state.item_id && w.batchno === $this.state.batchno
    )
    .toArray();
  if (itemData.length > 0) {
    swalMessage({
      title: "Selected Item already added in the list.",
      type: "warning"
    });
  } else {
    if ($this.state.item_id === null) {
      swalMessage({
        title: "Please Select Item.",
        type: "warning"
      });
    } else if (
      parseFloat($this.state.quantity) === 0 ||
      $this.state.quantity === ""
    ) {
      swalMessage({
        title: "Enter the Quantity.",
        type: "warning"
      });
    } else {
      let ItemInput = [
        {
          discount_percentage: $this.state.discount_percentage,
          insured: $this.state.insured,
          conversion_factor: $this.state.conversion_factor,
          unit_cost: $this.state.unit_cost,
          vat_applicable: $this.state.vat_applicable,
          hims_d_services_id: $this.state.service_id,
          quantity: $this.state.quantity,
          primary_insurance_provider_id: $this.state.insurance_provider_id,
          primary_network_office_id:
            $this.state.hims_d_insurance_network_office_id,
          primary_network_id: $this.state.network_id,
          sec_insured: $this.state.sec_insured,
          secondary_insurance_provider_id:
            $this.state.secondary_insurance_provider_id,
          secondary_network_id: $this.state.secondary_network_id,
          secondary_network_office_id: $this.state.secondary_network_office_id,
          from_pos: "Y"
        }
      ];

      algaehApiCall({
        uri: "/billing/getBillDetails",
        module: "billing",
        method: "POST",
        data: ItemInput,
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;
            if (data.billdetails[0].pre_approval === "Y") {
              swalMessage({
                title: "Selected Item is Pre-Approval required.",
                type: "warning"
              });
            }
            // } else {
            let existingservices = $this.state.pharmacy_stock_detail;

            if (data.billdetails.length !== 0) {
              data.billdetails[0].pre_approval =
                data.billdetails[0].pre_approval === undefined
                  ? "N"
                  : data.billdetails[0].pre_approval;

              data.billdetails[0].insured = data.billdetails[0].insurance_yesno;
              data.billdetails[0].extended_cost =
                data.billdetails[0].gross_amount;
              data.billdetails[0].net_extended_cost =
                data.billdetails[0].net_amout;

              data.billdetails[0].item_id = $this.state.item_id;
              data.billdetails[0].average_cost = $this.state.average_cost;
              data.billdetails[0].item_category = $this.state.item_category;
              data.billdetails[0].item_group_id = $this.state.item_group_id;
              data.billdetails[0].expiry_date = $this.state.expiry_date;
              data.billdetails[0].batchno = $this.state.batchno;
              data.billdetails[0].uom_id = $this.state.uom_id;
              data.billdetails[0].operation = "-";
              data.billdetails[0].grn_no = $this.state.grn_no;
              data.billdetails[0].qtyhand = $this.state.qtyhand;
              data.billdetails[0].barcode = $this.state.barcode;
              data.billdetails[0].service_id = data.billdetails[0].services_id;
              data.billdetails[0].discount_amount =
                data.billdetails[0].discount_amout;

              data.billdetails[0].batches = [
                {
                  batchno: $this.state.batchno,
                  expiry_date: $this.state.expiry_date,
                  grn_no: $this.state.grn_no,
                  grnno: $this.state.grn_no,
                  barcode: $this.state.barcode,
                  qtyhand: $this.state.qtyhand,
                  sale_price: $this.state.unit_cost,
                  uom_id: $this.state.uom_id,
                  conversion_factor: $this.state.conversion_factor,
                  non_prec_Item: true,
                  avgcost: $this.state.average_cost
                }
              ];

              data.billdetails[0].patient_responsibility =
                data.billdetails[0].patient_resp;

              data.billdetails[0].company_responsibility =
                data.billdetails[0].comapany_resp;

              data.billdetails[0].company_payable =
                data.billdetails[0].company_payble;
              data.billdetails[0].hims_f_pharmacy_pos_detail_id = null;

              data.billdetails[0].prescribed_qty = 0;
              existingservices.splice(0, 0, data.billdetails[0]);
            }
            let insert_pharmacy_stock = $this.state.insert_pharmacy_stock;
            if ($this.state.hims_f_pharmacy_pos_header_id !== null) {
              insert_pharmacy_stock = data.billdetails;
            }
            if (context !== null) {
              context.updateState({
                insert_pharmacy_stock: insert_pharmacy_stock,
                pharmacy_stock_detail: existingservices,
                item_description: "",
                item_id: null,
                uom_id: null,
                batchno: null,
                expiry_date: null,
                quantity: 0,
                unit_cost: 0,
                Batch_Items: [],
                service_id: null,
                conversion_factor: 1,
                grn_no: null,
                item_group_id: null,
                item_category: null,
                qtyhand: 0,
                barcode: null,
                discount_percentage: 0,
                OTItemAddDis: true
              });
            }

            $this.setState({
              item_description: "",
              item_id: null,
              uom_id: null,
              batchno: null,
              expiry_date: null,
              quantity: 0,
              unit_cost: 0,
              Batch_Items: [],
              service_id: null,
              conversion_factor: 1,
              grn_no: null,
              item_group_id: null,
              selectBatchButton: false,
              qtyhand: 0,
              barcode: null,
              discount_percentage: 0,
              OTItemAddDis: true
            });

            algaehApiCall({
              uri: "/billing/billingCalculations",
              module: "billing",
              method: "POST",
              data: { billdetails: existingservices },
              onSuccess: response => {
                if (response.data.success) {
                  let sum_data = response.data.records;

                  sum_data.patient_payable_h =
                    sum_data.patient_payable || $this.state.patient_payable;
                  sum_data.sub_total =
                    sum_data.sub_total_amount || $this.state.sub_total;
                  sum_data.patient_responsibility =
                    sum_data.patient_res || $this.state.patient_responsibility;
                  sum_data.company_responsibility =
                    sum_data.company_res || $this.state.company_responsibility;

                  sum_data.company_payable =
                    sum_data.company_payble || $this.state.company_payable;
                  sum_data.sec_company_responsibility =
                    sum_data.sec_company_res ||
                    $this.state.sec_company_responsibility;
                  sum_data.sec_company_payable =
                    sum_data.sec_company_paybale ||
                    $this.state.sec_company_payable;

                  sum_data.copay_amount =
                    sum_data.copay_amount || $this.state.copay_amount;
                  sum_data.sec_copay_amount =
                    sum_data.sec_copay_amount || $this.state.sec_copay_amount;
                  sum_data.addItemButton = false;
                  sum_data.saveEnable = true;
                  sum_data.postEnable = false;
                  sum_data.hims_f_pharmacy_pos_detail_id = null;
                  if (context !== null) {
                    context.updateState({ ...sum_data });
                  }
                } else {
                  swalMessage({
                    title: response.data.message,
                    type: "error"
                  });
                }
                AlgaehLoader({ show: false });
              },
              onFailure: error => {
                AlgaehLoader({ show: false });
                swalMessage({
                  title: error.message,
                  type: "error"
                });
              }
            });
            // }
          }
        },
        onFailure: error => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const deletePosDetail = ($this, context, row) => {
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  let update_pharmacy_stock = $this.state.update_pharmacy_stock;
  let delete_pharmacy_stock = $this.state.delete_pharmacy_stock;
  let insert_pharmacy_stock = $this.state.insert_pharmacy_stock;

  const _index = pharmacy_stock_detail.indexOf(row);
  if (row.hims_f_pharmacy_pos_detail_id !== null) {
    for (var i = 0; i < update_pharmacy_stock.length; i++) {
      if (
        update_pharmacy_stock[i].item_id === row["item_id"] &&
        update_pharmacy_stock[i].batchno === row["batchno"]
      ) {
        update_pharmacy_stock.splice(i, 1);
      }
    }
    let Updateobj = {
      hims_f_pharmacy_pos_detail_id: row.hims_f_pharmacy_pos_detail_id
    };
    delete_pharmacy_stock.push(Updateobj);
  } else {
    if (insert_pharmacy_stock.length > 0) {
      for (let k = 0; k < insert_pharmacy_stock.length; k++) {
        if (
          insert_pharmacy_stock[i].item_id === row["item_id"] &&
          insert_pharmacy_stock[i].batchno === row["batchno"]
        ) {
          insert_pharmacy_stock.splice(k, 1);
        }
      }
    }
  }

  pharmacy_stock_detail.splice(_index, 1);

  if (pharmacy_stock_detail.length === 0) {
    if (context !== undefined) {
      context.updateState({
        update_pharmacy_stock: update_pharmacy_stock,
        delete_pharmacy_stock: delete_pharmacy_stock,
        insert_pharmacy_stock: insert_pharmacy_stock,
        pharmacy_stock_detail: pharmacy_stock_detail,
        advance_amount: 0,
        discount_amount: 0,
        sub_total: 0,
        total_tax: 0,
        net_total: 0,
        copay_amount: 0,
        sec_copay_amount: 0,
        deductable_amount: 0,
        sec_deductable_amount: 0,
        gross_total: 0,
        sheet_discount_amount: 0,
        sheet_discount_percentage: 0,
        net_amount: 0,
        patient_res: 0,
        company_res: 0,
        sec_company_res: 0,
        patient_payable: 0,
        patient_payable_h: 0,
        company_payable: 0,
        sec_company_payable: 0,
        patient_tax: 0,
        company_tax: 0,
        sec_company_tax: 0,
        net_tax: 0,
        credit_amount: 0,
        receiveable_amount: 0,
        patient_responsibility: 0,
        company_responsibility: 0,
        sec_company_responsibility: 0,

        cash_amount: 0,
        card_number: "",
        card_date: null,
        card_amount: 0,
        cheque_number: "",
        cheque_date: null,
        cheque_amount: 0,
        total_amount: 0,
        saveEnable: true,
        postEnable: true,
        unbalanced_amount: 0,
        balance_credit: 0
      });
    }
  } else {
    // PosheaderCalculation($this, context);
    // calculateAmount($this, context, row, e);
    algaehApiCall({
      uri: "/billing/billingCalculations",
      module: "billing",
      method: "POST",
      data: { billdetails: pharmacy_stock_detail },
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records;

          data.patient_payable_h =
            data.patient_payable || $this.state.patient_payable;
          data.sub_total = data.sub_total_amount || $this.state.sub_total;
          data.patient_responsibility =
            data.patient_res || $this.state.patient_responsibility;
          data.company_responsibility =
            data.company_res || $this.state.company_responsibility;

          data.company_payable =
            data.company_payble || $this.state.company_payable;
          data.sec_company_responsibility =
            data.sec_company_res || $this.state.sec_company_responsibility;
          data.sec_company_payable =
            data.sec_company_paybale || $this.state.sec_company_payable;

          data.copay_amount = data.copay_amount || $this.state.copay_amount;
          data.sec_copay_amount =
            data.sec_copay_amount || $this.state.sec_copay_amount;
          data.addItemButton = false;
          data.saveEnable = false;
          data.postEnable = false;

          if (context !== null) {
            context.updateState({ ...data });
          }
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: pharmacy_stock_detail
      });
    }
  }
};

const updatePosDetail = ($this, context) => {
  // PosheaderCalculation($this, context);

  algaehApiCall({
    uri: "/billing/billingCalculations",
    module: "billing",
    method: "POST",
    data: { billdetails: $this.state.pharmacy_stock_detail },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        data.patient_payable_h =
          data.patient_payable || $this.state.patient_payable;
        data.sub_total = data.sub_total_amount || $this.state.sub_total;
        data.patient_responsibility =
          data.patient_res || $this.state.patient_responsibility;
        data.company_responsibility =
          data.company_res || $this.state.company_responsibility;

        data.company_payable =
          data.company_payble || $this.state.company_payable;
        data.sec_company_responsibility =
          data.sec_company_res || $this.state.sec_company_responsibility;
        data.sec_company_payable =
          data.sec_company_paybale || $this.state.sec_company_payable;

        data.copay_amount = data.copay_amount || $this.state.copay_amount;
        data.sec_copay_amount =
          data.sec_copay_amount || $this.state.sec_copay_amount;
        data.addItemButton = false;
        data.saveEnable = false;

        if (context !== null) {
          context.updateState({ ...data });
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

//Calculate Row Detail
const calculateAmount = ($this, context, row, ctrl, e) => {
  //

  e = e || ctrl;
  // if (e.target.value !== e.target.oldvalue) {
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

  row[e.target.name] = parseFloat(e.target.value);

  let inputParam = [
    {
      hims_d_services_id: row.service_id,
      vat_applicable: $this.state.vat_applicable,
      unit_cost: row.unit_cost,
      pharmacy_item: "Y",
      quantity: row.quantity === null ? 0 : row.quantity,
      discount_amout:
        e.target.name === "discount_percentage" || e.target.name === "quantity"
          ? 0
          : row.discount_amount,
      discount_percentage:
        e.target.name === "discount_amount" ? 0 : row.discount_percentage,

      insured: row.insurance_yesno,
      primary_insurance_provider_id: $this.state.insurance_provider_id,
      primary_network_office_id: $this.state.hims_d_insurance_network_office_id,
      primary_network_id: $this.state.network_id,
      sec_insured: $this.state.sec_insured,
      secondary_insurance_provider_id:
        $this.state.secondary_insurance_provider_id,
      secondary_network_id: $this.state.secondary_network_id,
      secondary_network_office_id: $this.state.secondary_network_office_id,
      from_pos: "Y"
    }
  ];

  algaehApiCall({
    uri: "/billing/getBillDetails",
    module: "billing",
    method: "POST",
    cancelRequestId: "getPosDetails",
    data: inputParam,
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        data.billdetails[0].extended_cost = data.billdetails[0].gross_amount;
        data.billdetails[0].net_extended_cost = data.billdetails[0].net_amout;

        data.billdetails[0].item_id = row.item_id;
        data.billdetails[0].item_category = row.item_category;
        data.billdetails[0].expiry_date = row.expiry_date;
        data.billdetails[0].batchno = row.batchno;
        data.billdetails[0].uom_id = row.uom_id;
        data.billdetails[0].discount_amount =
          data.billdetails[0].discount_amout;
        data.billdetails[0].pre_approval =
          row.pre_approval === "N" ? "N" : data.billdetails[0].pre_approval;
        data.billdetails[0].insurance_yesno = data.billdetails[0].insured;

        data.billdetails[0].insurance_yesno = data.billdetails[0].insured;
        data.billdetails[0].insurance_yesno = data.billdetails[0].insured;

        data.billdetails[0].patient_responsibility =
          data.billdetails[0].patient_resp;
        data.billdetails[0].company_responsibility =
          data.billdetails[0].comapany_resp;
        data.billdetails[0].company_payable =
          data.billdetails[0].company_payble;

        extend(row, data.billdetails[0]);

        const _index = pharmacy_stock_detail.indexOf(row);
        pharmacy_stock_detail[_index] = row;
        // pharmacy_stock_detail[row.rowIdx] = row;

        $this.setState({ pharmacy_stock_detail: pharmacy_stock_detail });

        algaehApiCall({
          uri: "/billing/billingCalculations",
          module: "billing",
          method: "POST",
          data: { billdetails: pharmacy_stock_detail },
          onSuccess: response => {
            if (response.data.success) {
              let data_billing = response.data.records;

              // data_billing.patient_payable_h = data_billing.patient_payable;
              // data_billing.sub_total =
              //   data_billing.sub_total_amount || $this.state.sub_total;
              // data_billing.patient_responsibility = data_billing.patient_res;
              // data_billing.company_responsibility =
              //   data_billing.company_res || $this.state.company_responsibility;
              //
              // data_billing.company_payable =
              //   data_billing.company_payble || $this.state.company_payable;
              // data_billing.sec_company_responsibility =
              //   data_billing.sec_company_res ||
              //   $this.state.sec_company_responsibility;
              // data_billing.sec_company_payable =
              //   data_billing.sec_company_paybale ||
              //   $this.state.sec_company_payable;
              //
              // data_billing.copay_amount =
              //   data_billing.copay_amount || $this.state.copay_amount;
              // data_billing.sec_copay_amount =
              //   data_billing.sec_copay_amount || $this.state.sec_copay_amount;
              data_billing.patient_payable_h = data_billing.patient_payable;
              data_billing.sub_total = data_billing.sub_total_amount;
              data_billing.patient_responsibility = data_billing.patient_res;
              data_billing.company_responsibility = data_billing.company_res;

              data_billing.company_payable = data_billing.company_payble;
              data_billing.sec_company_responsibility =
                data_billing.sec_company_res;
              data_billing.sec_company_payable =
                data_billing.sec_company_paybale;

              data_billing.copay_amount = data_billing.copay_amount;
              data_billing.sec_copay_amount = data_billing.sec_copay_amount;
              data_billing.addItemButton = false;
              // data_billing.saveEnable = false;
              if (context !== null) {
                context.updateState({
                  ...data_billing,
                  pharmacy_stock_detail: pharmacy_stock_detail
                });
              }
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
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
  // }
};

const adjustadvance = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value > $this.state.advance_amount) {
    swalMessage({
      title: "Adjusted amount cannot be greater than Advance amount",
      type: "warning"
    });
  } else {
    $this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        PosheaderCalculation($this, context);
      }
    );

    if (context !== null) {
      context.updateState({
        [e.target.name]: e.target.value
      });
    }
  }
};

const PosheaderCalculation = ($this, context) => {
  // if (e.target.value !== e.target.oldvalue) {
  let ItemInput = {
    isReceipt: false,
    intCalculateall: false,

    sheet_discount_percentage:
      $this.state.sheet_discount_percentage === ""
        ? 0
        : parseFloat($this.state.sheet_discount_percentage),
    sheet_discount_amount:
      $this.state.sheet_discount_amount === ""
        ? 0
        : parseFloat($this.state.sheet_discount_amount),
    advance_adjust:
      $this.state.advance_adjust === undefined
        ? 0
        : parseFloat($this.state.advance_adjust),
    gross_total: parseFloat($this.state.gross_total),
    credit_amount:
      $this.state.credit_amount === undefined
        ? 0
        : parseFloat($this.state.credit_amount)
  };

  algaehApiCall({
    uri: "/billing/billingCalculations",
    module: "billing",
    method: "POST",
    data: ItemInput,
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        data.patient_payable_h =
          data.patient_payable || $this.state.patient_payable;
        data.sub_total = data.sub_total_amount || $this.state.sub_total;
        data.patient_responsibility =
          data.patient_res || $this.state.patient_responsibility;
        data.company_responsibility =
          data.company_res || $this.state.company_responsibility;

        data.company_payable =
          data.company_payble || $this.state.company_payable;
        data.sec_company_responsibility =
          data.sec_company_res || $this.state.sec_company_responsibility;
        data.sec_company_payable =
          data.sec_company_paybale || $this.state.sec_company_payable;

        data.copay_amount = data.copay_amount || $this.state.copay_amount;
        data.sec_copay_amount =
          data.sec_copay_amount || $this.state.sec_copay_amount;
        data.addItemButton = false;
        data.saveEnable = false;

        // data.credit_amount = ItemInput.credit_amount;
        // data.advance_adjust = ItemInput.advance_adjust;
        if (context !== null) {
          context.updateState({ ...data });
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
  // }
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const ShowItemBatch = ($this, e) => {
  $this.setState({
    ...$this.state,
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

  let sale_price =
    e !== undefined
      ? e.selected === true
        ? e.sale_price
        : $this.state.unit_cost
      : $this.state.unit_cost;
  let uom_description =
    e !== undefined
      ? e.selected === true
        ? e.uom_description
        : $this.state.uom_description
      : $this.state.uom_description;

  let uom_id =
    e !== undefined
      ? e.selected === true
        ? e.sales_uom
        : $this.state.uom_id
      : $this.state.uom_id;

  const sales_qtyhand =
    e !== undefined
      ? e.selected === true
        ? parseFloat(qtyhand) / parseFloat($this.state.sales_conversion_factor)
        : $this.state.sales_qtyhand
      : $this.state.sales_qtyhand;

  let average_cost =
    e !== undefined
      ? e.selected === true
        ? e.avgcost
        : $this.state.average_cost
      : $this.state.average_cost;

  $this.setState({
    ...$this.state,
    selectBatch: !$this.state.selectBatch,
    batchno: batchno,
    expiry_date: expiry_date,
    grn_no: grn_no,
    qtyhand: qtyhand,
    sales_qtyhand: sales_qtyhand,
    uom_id: uom_id,
    unit_cost: sale_price,
    uom_description: uom_description,
    average_cost: average_cost
  });

  if (context !== null) {
    context.updateState({
      batchno: batchno,
      expiry_date: expiry_date,
      grn_no: grn_no,
      qtyhand: qtyhand,
      sales_qtyhand: sales_qtyhand,
      uom_id: uom_id,
      unit_cost: sale_price,
      uom_description: uom_description,
      average_cost: average_cost
    });
  }
};

const onchangegridcol = ($this, context, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  let _index = $this.state.pharmacy_stock_detail.indexOf(row);

  if (name === "discount_percentage") {
    if (parseFloat(value) > 100) {
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "warning"
      });
      row[name] = 0;
      row["discount_amount"] = 0;
      pharmacy_stock_detail[_index] = row;
      $this.setState({
        pharmacy_stock_detail: pharmacy_stock_detail
      });
      return;
    }
    if (parseFloat(value) < 0) {
      swalMessage({
        title: "Discount % cannot be less than Zero",
        type: "warning"
      });
      row[name] = 0;
      row["discount_amount"] = 0;
      pharmacy_stock_detail[_index] = row;
      $this.setState({
        pharmacy_stock_detail: pharmacy_stock_detail
      });
      return;
    }
  } else if (name === "discount_amount") {
    if (parseFloat(value) < 0) {
      swalMessage({
        title: "Discount Amount cannot be less than Zero",
        type: "warning"
      });
      row[name] = 0;
      pharmacy_stock_detail[_index] = row;
      $this.setState({
        pharmacy_stock_detail: pharmacy_stock_detail
      });
      return;
    }
    if (parseFloat(row.extended_cost) < parseFloat(value)) {
      swalMessage({
        title: "Discount Amount cannot be greater than Gross Amount.",
        type: "warning"
      });
      row[name] = 0;
      pharmacy_stock_detail[_index] = row;
      $this.setState({
        pharmacy_stock_detail: pharmacy_stock_detail
      });
      return;
    }
  }
  row[name] = value;
  calculateAmount($this, context, row, e);
};

const qtyonchangegridcol = ($this, context, row, e) => {
  if (row.batchno === undefined || row.batchno === null) {
    swalMessage({
      title: "Please select Batch",
      type: "error"
    });
    return;
  }
  let name = e.target.name;
  let value = e.target.value === "" ? null : e.target.value;

  if (parseFloat(value) < 0) {
    swalMessage({
      title: "Quantity cannot be less than Zero",
      type: "warning"
    });
  } else if (parseFloat(value) > row.qtyhand) {
    swalMessage({
      title: "Quantity cannot be greater than Quantity in hand",
      type: "warning"
    });
  } else {
    if (value === null) {
      let _pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
      const _index = _pharmacy_stock_detail.indexOf(row);
      row[name] = value;
      _pharmacy_stock_detail[_index] = row;

      if (context !== null) {
        context.updateState({
          pharmacy_stock_detail: _pharmacy_stock_detail
        });
      }
      return;
    }
    row[name] = value;
    // row.update();
    calculateAmount($this, context, row, e);
  }
};

const ViewInsurance = ($this, e) => {
  $this.setState({
    viewInsurance: !$this.state.viewInsurance
  });
};

const EditGrid = ($this, context, cancelRow) => {
  //
  if (context !== null) {
    let _pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
    if (cancelRow !== undefined) {
      _pharmacy_stock_detail[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: !$this.state.saveEnable,
      addItemButton: !$this.state.addItemButton,
      pharmacy_stock_detail: _pharmacy_stock_detail
    });
  }
};

const credittexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value > $this.state.net_amount) {
    swalMessage({
      title: "Credit amount cannot be greater than Net amount",
      type: "warning"
    });
  } else {
    $this.setState(
      {
        [e.target.name]: e.target.value,
        balance_credit: e.target.value
      },
      () => {
        PosheaderCalculation($this, context);
      }
    );

    if (context !== null) {
      context.updateState({
        [e.target.name]: e.target.value,
        balance_credit: e.target.value
      });
    }
  }
};

const SelectBatchDetails = ($this, row, context, e) => {
  //

  let _pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  const _index = _pharmacy_stock_detail.indexOf(row);

  row["batchno"] = e.selected.batchno;
  row["expiry_date"] = e.selected.expiry_date;
  row["qtyhand"] =
    e.selected.non_prec_Item === true
      ? parseFloat(e.selected.qtyhand)
      : parseFloat(e.selected.qtyhand) /
        parseFloat(e.selected.conversion_factor);
  row["grn_no"] = e.selected.grnno;
  row["barcode"] = e.selected.barcode;
  row["unit_cost"] = e.selected.sale_price;
  row["average_cost"] = e.selected.avgcost;
  _pharmacy_stock_detail[_index] = row;

  if (context !== null) {
    context.updateState({
      pharmacy_stock_detail: _pharmacy_stock_detail
    });
  }
};

const getMedicationAprovalList = ($this, row) => {
  if (
    $this.state.pos_customer_type === "OT" &&
    $this.state.hims_f_pharmacy_pos_header_id === null
  ) {
    swalMessage({
      title: "Save the record...",
      type: "warning"
    });
    return;
  }

  let inputobj = { item_id: row.item_id };

  if ($this.state.pos_customer_type === "OT") {
    if (row.hims_f_pharmacy_pos_detail_id !== null) {
      inputobj.pharmacy_pos_detail_id = row.hims_f_pharmacy_pos_detail_id;
    }
  }

  if ($this.state.patient_id !== null) {
    inputobj.patient_id = $this.state.patient_id;
  }
  if ($this.state.visit_id !== null) {
    inputobj.visit_id = $this.state.visit_id;
  }
  if ($this.state.insurance_provider_id !== null) {
    inputobj.insurance_provider_id = $this.state.insurance_provider_id;
  }

  algaehApiCall({
    uri: "/orderAndPreApproval/getMedicationAprovalList",
    method: "GET",
    data: inputobj,
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({
          medca_approval_Services: response.data.records,
          viewPreapproval: !$this.state.viewPreapproval,
          item_description: row.item_description,
          prescription_detail_id: row.prescription_detail_id,
          item_data: row,
          hims_f_pharmacy_pos_detail_id: row.hims_f_pharmacy_pos_detail_id
        });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.response.data.message,
        type: "warning"
      });
    }
  });
};

export {
  discounthandle,
  UomchangeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  deletePosDetail,
  updatePosDetail,
  calculateAmount,
  adjustadvance,
  dateFormater,
  ShowItemBatch,
  CloseItemBatch,
  onchangegridcol,
  PosheaderCalculation,
  ViewInsurance,
  qtyonchangegridcol,
  EditGrid,
  credittexthandle,
  SelectBatchDetails,
  getMedicationAprovalList
};
