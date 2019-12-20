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

const servicechangeText = ($this, e, ctrl) => {
    let name = ctrl;

    let value = e.hims_d_inventory_item_master_id;

    $this.setState({
        [name]: value,
        quantity: 1,
        addItemButton: false,
        service_name: e.service_name,
        unit_cost: e.standard_fee,
    });

};

const AddSerices = ($this, context) => {
    let serviceData = Enumerable.from($this.state.sales_quotation_services)
        .where(
            w =>
                w.services_id === $this.state.services_id
        )
        .toArray();
    if ($this.state.services_id === null) {
        swalMessage({
            title: "Please Select Service.",
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
    if (serviceData.length > 0) {
        swalMessage({
            title: "Selected Setvice already added in the list.",
            type: "warning"
        });
    } else {
        let sales_quotation_services = $this.state.sales_quotation_services;

        const extended_cost = parseFloat($this.state.unit_cost) * parseFloat($this.state.quantity)
        const discount_amount = ((parseFloat(extended_cost) * parseFloat($this.state.discount_percentage)) / 100).toFixed(
            $this.state.decimal_place
        );
        const net_extended_cost = extended_cost - discount_amount
        const tax_amount = ((parseFloat(net_extended_cost) * parseFloat($this.state.tax_percentage)) / 100).toFixed(
            $this.state.decimal_place
        );

        const total_amount = (parseFloat(net_extended_cost) + parseFloat(tax_amount)).toFixed(
            $this.state.decimal_place
        );

        const ItemInput = {
            service_name: $this.state.service_name,
            services_id: $this.state.services_id,
            quantity: $this.state.quantity,
            discount_percentage: $this.state.discount_percentage,
            unit_cost: $this.state.unit_cost,
            extended_cost: extended_cost,
            net_extended_cost: net_extended_cost,
            discount_amount: discount_amount,
            tax_percentage: $this.state.tax_percentage,
            tax_amount: tax_amount,
            total_amount: total_amount
        };
        sales_quotation_services.push(ItemInput);

        const sub_total = _.sumBy(sales_quotation_services, s =>
            parseFloat(s.extended_cost)
        );
        const h_discount_amount = _.sumBy(sales_quotation_services, s =>
            parseFloat(s.discount_amount)
        );
        const net_total = _.sumBy(sales_quotation_services, s =>
            parseFloat(s.net_extended_cost)
        );

        const total_tax = _.sumBy(sales_quotation_services, s =>
            parseFloat(s.tax_amount)
        );

        const net_payable = _.sumBy(sales_quotation_services, s =>
            parseFloat(s.total_amount)
        );

        $this.setState({
            sales_quotation_services: sales_quotation_services,

            addItemButton: true,
            service_name: "",
            addedItem: true,
            services_id: null,
            quantity: 0,
            discount_percentage: 0,
            unit_cost: 0,
            tax_percent: 0
        });

        if (context !== undefined) {
            context.updateState({
                sales_quotation_services: sales_quotation_services,
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
    let sales_quotation_services = $this.state.sales_quotation_services;
    const _index = sales_quotation_services.indexOf(row);
    sales_quotation_services.splice(_index, 1);

    if (sales_quotation_services.length === 0) {
        if (context !== undefined) {
            context.updateState({
                sales_quotation_services: sales_quotation_services,
                discount_amount: 0,
                sub_total: 0,
                total_tax: 0,
                net_total: 0,
                net_payable: 0,
                saveEnable: true
            });
        }
    } else {

        const sub_total = _.sumBy(sales_quotation_services, s =>
            parseFloat(s.extended_cost)
        );
        const discount_amount = _.sumBy(sales_quotation_services, s =>
            parseFloat(s.discount_amount)
        );

        const net_total = _.sumBy(sales_quotation_services, s =>
            parseFloat(s.net_extended_cost)
        );

        const total_tax = _.sumBy(sales_quotation_services, s =>
            parseFloat(s.tax_amount)
        );

        const net_payable = _.sumBy(sales_quotation_services, s =>
            parseFloat(s.total_amount)
        );


        if (context !== undefined) {
            context.updateState({
                sales_quotation_services: sales_quotation_services,

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
    let sales_quotation_services = $this.state.sales_quotation_services;
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
    row.tax_amount = ((parseFloat(row.net_extended_cost) * parseFloat(row.tax_percentage)) / 100).toFixed(
        $this.state.decimal_place
    );

    row.total_amount = (parseFloat(row.net_extended_cost) + parseFloat(row.tax_amount)).toFixed(
        $this.state.decimal_place
    );

    sales_quotation_services[_index] = row

    const sub_total = _.sumBy(sales_quotation_services, s =>
        parseFloat(s.extended_cost)
    );
    const discount_amount = _.sumBy(sales_quotation_services, s =>
        parseFloat(s.discount_amount)
    );

    const net_total = _.sumBy(sales_quotation_services, s =>
        parseFloat(s.net_extended_cost)
    );

    const total_tax = _.sumBy(sales_quotation_services, s =>
        parseFloat(s.tax_amount)
    );

    const net_payable = _.sumBy(sales_quotation_services, s =>
        parseFloat(s.total_amount)
    );


    if (context !== undefined) {
        context.updateState({
            sales_quotation_services: sales_quotation_services,
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
    let sales_quotation_services = $this.state.sales_quotation_services;
    let _index = $this.state.sales_quotation_services.indexOf(row);

    if (name === "discount_percentage") {
        if (parseFloat(value) > 100) {
            row[name] = 0;
            row["discount_amount"] = 0;
            sales_quotation_services[_index] = row;
            $this.setState({
                sales_quotation_services: sales_quotation_services
            });
            swalMessage({
                title: "Discount % cannot be greater than 100.",
                type: "warning"
            });

            // return;
        } else if (parseFloat(value) < 0) {
            row[name] = 0;
            row["discount_amount"] = 0;
            sales_quotation_services[_index] = row;
            $this.setState({
                sales_quotation_services: sales_quotation_services
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
            sales_quotation_services[_index] = row;
            $this.setState({
                sales_quotation_services: sales_quotation_services
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
            sales_quotation_services[_index] = row;
            $this.setState({
                sales_quotation_services: sales_quotation_services
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
    let _index = $this.state.sales_quotation_services.indexOf(row);

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
    servicechangeText,
    numberchangeTexts,
    AddSerices,
    deleteSalesDetail,
    calculateAmount,
    dateFormater,
    onchangegridcol,
    qtyonchangegridcol
};
