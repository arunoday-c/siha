import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import Options from "../../../../Options.json";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import _ from "lodash";

const UomchangeTexts = ($this, context, ctrl, e) => {
    e = ctrl || e;
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    if ($this.state.uom_id !== value) {
        let unit_cost = 0;
        if (e.selected.conversion_factor === 1) {
            unit_cost = $this.state.Real_unit_cost;
        } else {
            unit_cost = e.selected.conversion_factor * $this.state.Real_unit_cost;
        }
        $this.setState({
            [name]: value,
            conversion_factor: e.selected.conversion_factor,
            unit_cost: unit_cost
        });
    }
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
        }
    } else if (name === "discount_percentage") {
        if (parseFloat(value) < 0) {
            swalMessage({
                title: "Discount % cannot be less than Zero",
                type: "warning"
            });
            $this.setState({ [name]: $this.state.discount_percentage });
            return;
        } else if (parseFloat(value) > 100) {
            swalMessage({
                title: "Discount % cannot be greater than 100.",
                type: "warning"
            });
            $this.setState({ [name]: $this.state.discount_percentage });
            return;
        } else {
            $this.setState({ [name]: value });
        }
    } else {
        $this.setState({ [name]: value });
    }
};

const itemchangeText = ($this, e, ctrl) => {
    let name = ctrl;
    if ($this.state.location_id !== null) {
        let value = e.hims_d_inventory_item_master_id;

        algaehApiCall({
            uri: "/inventoryGlobal/getUomLocationStock",
            module: "inventory",
            method: "GET",
            data: {
                location_id: $this.state.location_id,
                item_id: value
            },
            onSuccess: response => {
                if (response.data.success) {
                    let data = response.data.records;
                    if (data.locationResult.length > 0) {
                        $this.setState({
                            [name]: value,
                            item_category_id: e.category_id,
                            uom_id: e.sales_uom_id,
                            item_group_id: e.group_id,
                            quantity: 1,
                            expiry_date: data.locationResult[0].expirydt,
                            batchno: data.locationResult[0].batchno,
                            grn_no: data.locationResult[0].grnno,
                            qtyhand: data.locationResult[0].qtyhand,
                            barcode: data.locationResult[0].barcode,
                            ItemUOM: data.uomResult,
                            Batch_Items: data.locationResult,
                            addItemButton: false,
                            item_description: e.item_description,
                            unit_cost: e.sale_price,
                            Real_unit_cost: e.sale_price,
                            uom_description: e.uom_description,
                            tax_percent: e.vat_percent
                        });
                    } else {
                        swalMessage({
                            title: "No stock available for selected Item.",
                            type: "warning"
                        });
                        $this.setState({
                            item_description: $this.state.item_description,
                            item_id: $this.state.item_id
                        });
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
        $this.setState({
            item_description: null,
            [name]: null
        });
        swalMessage({
            title: "Please select Location.",
            type: "warning"
        });
    }
};

const AddItems = ($this, context) => {
    let itemData = Enumerable.from($this.state.inventory_stock_detail)
        .where(
            w =>
                w.item_id === $this.state.item_id && w.batchno === $this.state.batchno
        )
        .toArray();
    if ($this.state.item_id === null) {
        swalMessage({
            title: "Please Select Item.",
            type: "warning"
        });
        return
    } else if (
        parseFloat($this.state.quantity) === 0 ||
        $this.state.quantity === ""
    ) {
        swalMessage({
            title: "Enter the Quantity.",
            type: "warning"
        });
        return
    }
    if (itemData.length > 0) {
        swalMessage({
            title: "Selected Item already added in the list.",
            type: "warning"
        });
    } else {
        let sales_quotation_detail = $this.state.sales_quotation_detail;

        const extended_cost = parseFloat($this.state.unit_cost) * parseFloat($this.state.quantity)
        const discount_amount = ((parseFloat(extended_cost) * parseFloat($this.state.discount_percentage)) / 100).toFixed(
            $this.state.decimal_place
        );
        const net_extended_cost = extended_cost - discount_amount
        const tax_amount = ((parseFloat(net_extended_cost) * parseFloat($this.state.tax_percent)) / 100).toFixed(
            $this.state.decimal_place
        );

        const total_amount = (parseFloat(net_extended_cost) + parseFloat(tax_amount)).toFixed(
            $this.state.decimal_place
        );

        const ItemInput = {
            item_category_id: $this.state.item_category_id,
            item_group_id: $this.state.item_group_id,
            item_id: $this.state.item_id,
            quantity: $this.state.quantity,
            uom_id: $this.state.uom_id,
            batchno: $this.state.batchno,
            expiry_date: $this.state.expiry_date,
            qtyhand: $this.state.qtyhand,
            uom_description: $this.state.uom_description,
            discount_percentage: $this.state.discount_percentage,
            unit_cost: $this.state.unit_cost,
            extended_cost: extended_cost,
            net_extended_cost: net_extended_cost,
            discount_amount: discount_amount,
            tax_percent: $this.state.tax_percent,
            tax_amount: tax_amount,
            total_amount: total_amount
        };
        sales_quotation_detail.push(ItemInput);

        const sub_total = _.sumBy(sales_quotation_detail, s =>
            parseFloat(s.extended_cost)
        );
        const h_discount_amount = _.sumBy(sales_quotation_detail, s =>
            parseFloat(s.discount_amount)
        );
        const net_total = _.sumBy(sales_quotation_detail, s =>
            parseFloat(s.net_extended_cost)
        );

        const total_tax = _.sumBy(sales_quotation_detail, s =>
            parseFloat(s.tax_amount)
        );

        const net_payable = _.sumBy(sales_quotation_detail, s =>
            parseFloat(s.total_amount)
        );

        $this.setState({
            sales_quotation_detail: sales_quotation_detail,

            addItemButton: true,
            item_description: "",
            addedItem: true,
            item_category_id: null,
            item_group_id: null,
            item_id: null,
            quantity: 0,
            uom_id: null,
            batchno: null,
            expiry_date: null,
            qtyhand: 0,
            uom_description: null,
            discount_percentage: 0,
            barcode: null,
            ItemUOM: [],
            Batch_Items: [],
            unit_cost: 0,
            Real_unit_cost: 0,
            tax_percent: 0
        });

        if (context !== undefined) {
            context.updateState({
                sales_quotation_detail: sales_quotation_detail,
                saveEnable: false,
                sub_total: sub_total,
                discount_amount: h_discount_amount,
                net_total: net_total,
                total_tax: total_tax,
                net_payable: net_payable
            });
        }
    }
};

const deleteSalesDetail = ($this, context, row) => {
    let sales_quotation_detail = $this.state.sales_quotation_detail;
    const _index = sales_quotation_detail.indexOf(row);
    sales_quotation_detail.splice(_index, 1);

    if (sales_quotation_detail.length === 0) {
        if (context !== undefined) {
            context.updateState({
                sales_quotation_detail: sales_quotation_detail,
                discount_amount: 0,
                sub_total: 0,
                total_tax: 0,
                net_total: 0,
                net_payable: 0,
                saveEnable: true
            });
        }
    } else {

        const sub_total = _.sumBy(sales_quotation_detail, s =>
            parseFloat(s.extended_cost)
        );
        const discount_amount = _.sumBy(sales_quotation_detail, s =>
            parseFloat(s.discount_amount)
        );

        const net_total = _.sumBy(sales_quotation_detail, s =>
            parseFloat(s.net_extended_cost)
        );

        const total_tax = _.sumBy(sales_quotation_detail, s =>
            parseFloat(s.tax_amount)
        );

        const net_payable = _.sumBy(sales_quotation_detail, s =>
            parseFloat(s.total_amount)
        );


        if (context !== undefined) {
            context.updateState({
                sales_quotation_detail: sales_quotation_detail,

                sub_total: sub_total,
                discount_amount: discount_amount,
                net_total: net_total,
                total_tax: total_tax,
                net_payable: net_payable
            });
        }
    }
};


//Calculate Row Detail
const calculateAmount = ($this, context, row, _index) => {
    let sales_quotation_detail = $this.state.sales_quotation_detail;
    row.extended_cost = (parseFloat(row.unit_cost) * parseFloat(row.quantity)).toFixed(
        $this.state.decimal_place
    )
    row.discount_amount = ((parseFloat(row.extended_cost) * parseFloat(row.discount_percentage)) / 100).toFixed(
        $this.state.decimal_place
    );
    row.net_extended_cost = (parseFloat(row.extended_cost) - parseFloat(row.discount_amount)).toFixed(
        $this.state.decimal_place
    )

    debugger
    row.tax_amount = ((parseFloat(row.net_extended_cost) * parseFloat(row.tax_percent)) / 100).toFixed(
        $this.state.decimal_place
    );

    row.total_amount = (parseFloat(row.net_extended_cost) + parseFloat(row.tax_amount)).toFixed(
        $this.state.decimal_place
    );

    sales_quotation_detail[_index] = row

    const sub_total = _.sumBy(sales_quotation_detail, s =>
        parseFloat(s.extended_cost)
    );
    const discount_amount = _.sumBy(sales_quotation_detail, s =>
        parseFloat(s.discount_amount)
    );

    const net_total = _.sumBy(sales_quotation_detail, s =>
        parseFloat(s.net_extended_cost)
    );

    const total_tax = _.sumBy(sales_quotation_detail, s =>
        parseFloat(s.tax_amount)
    );

    const net_payable = _.sumBy(sales_quotation_detail, s =>
        parseFloat(s.total_amount)
    );


    if (context !== undefined) {
        context.updateState({
            sales_quotation_detail: sales_quotation_detail,
            sub_total: sub_total,
            discount_amount: discount_amount,
            net_total: net_total,
            total_tax: total_tax,
            net_payable: net_payable
        });
    }
};

const dateFormater = ($this, value) => {
    if (value !== null) {
        return moment(value).format(Options.dateFormat);
    }
};
const onchangegridcol = ($this, context, row, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    let sales_quotation_detail = $this.state.sales_quotation_detail;
    let _index = $this.state.sales_quotation_detail.indexOf(row);

    if (name === "discount_percentage") {
        if (parseFloat(value) > 100) {
            row[name] = 0;
            row["discount_amount"] = 0;
            sales_quotation_detail[_index] = row;
            $this.setState({
                sales_quotation_detail: sales_quotation_detail
            });
            swalMessage({
                title: "Discount % cannot be greater than 100.",
                type: "warning"
            });

            // return;
        } else if (parseFloat(value) < 0) {
            row[name] = 0;
            row["discount_amount"] = 0;
            sales_quotation_detail[_index] = row;
            $this.setState({
                sales_quotation_detail: sales_quotation_detail
            });
            swalMessage({
                title: "Discount % cannot be less than Zero",
                type: "warning"
            });
            // return;
        } else {
            row[name] = value;
        }
    } else if (name === "discount_amount") {

        if (parseFloat(value) < 0) {

            row[name] = 0;
            row["discount_percentage"] = 0
            sales_quotation_detail[_index] = row;
            $this.setState({
                sales_quotation_detail: sales_quotation_detail
            });
            swalMessage({
                title: "Discount Amount cannot be less than Zero",
                type: "warning"
            });
            // return;
        }
        else if (parseFloat(row.extended_cost) < parseFloat(value)) {

            row[name] = 0;
            row["discount_percentage"] = 0
            sales_quotation_detail[_index] = row;
            $this.setState({
                sales_quotation_detail: sales_quotation_detail
            });
            swalMessage({
                title: "Discount Amount cannot be greater than Gross Amount.",
                type: "warning"
            });
            // return;
        } else {
            row[name] = value;
        }
    }
    calculateAmount($this, context, row, _index);
};

const qtyonchangegridcol = ($this, context, row, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    let _index = $this.state.sales_quotation_detail.indexOf(row);

    if (value <= 0) {
        swalMessage({
            title: "Quantity cannot be less than or equal to Zero",
            type: "warning"
        });
    } else if (parseFloat(value) > row.qtyhand) {
        swalMessage({
            title: "Quantity cannot be greater than Quantity in hand",
            type: "warning"
        });
    } else {
        row[name] = value;
        calculateAmount($this, context, row, _index);
    }
};

export {
    UomchangeTexts,
    itemchangeText,
    numberchangeTexts,
    AddItems,
    deleteSalesDetail,
    calculateAmount,
    dateFormater,
    onchangegridcol,
    qtyonchangegridcol
};
