import moment from "moment";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
// import swal from "sweetalert2";
import Options from "../../../../Options.json";
import _ from "lodash";
import extend from "extend";
// import { parse } from "cfb/types";

const datehandle = ($this, ctrl, e) => {
    $this.setState({
        [e]: moment(ctrl)._d
    });
};

const onchangegridcol = ($this, context, row, e) => {
    debugger
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
        let dispatched_quantity = _.sumBy(item_details.batches, s => {
            return s.dispatch_quantity !== null ? parseFloat(s.dispatch_quantity) : 0;
        });

        const _index = item_details.batches.indexOf(row);
        item_details.batches[_index] = row;

        item_details.dispatched_quantity = dispatched_quantity;

        item_details.quantity_outstanding =
            item_details.quantity -
            item_details.delivered_to_date -
            dispatched_quantity;

        // item_details.ordered_quantity = item_details.quantity
        if (item_details.quantity_outstanding < 0) {
            swalMessage({
                title: "Quantity cannot be greater than Ordered quantity.",
                type: "warning"
            });
            row[name] = 0;
            dispatched_quantity = _.sumBy(item_details.batches, s => {
                return s.dispatch_quantity !== null ? parseFloat(s.dispatch_quantity) : 0;
            });
            item_details.dispatched_quantity = dispatched_quantity;

            item_details.quantity_outstanding =
                item_details.quantity -
                item_details.delivered_to_date -
                dispatched_quantity;
        }

        item_details.extended_cost = (parseFloat(item_details.unit_cost) * parseFloat(value)).toFixed(
            $this.state.decimal_place
        );


        item_details.discount_amount = ((parseFloat(item_details.extended_cost) * parseFloat(item_details.discount_percentage)) / 100).toFixed(
            $this.state.decimal_place
        );

        item_details.net_extended_cost = (parseFloat(item_details.extended_cost) - parseFloat(item_details.discount_amount)).toFixed(
            $this.state.decimal_place
        )

        item_details.tax_amount = ((parseFloat(item_details.net_extended_cost) * parseFloat(item_details.tax_percentage)) / 100).toFixed(
            $this.state.decimal_place
        );

        item_details.total_amount = (parseFloat(item_details.net_extended_cost) + parseFloat(item_details.tax_amount)).toFixed(
            $this.state.decimal_place
        );

        $this.setState({
            item_details: item_details,
            dispatched_quantity: dispatched_quantity
        });



        if (context !== undefined) {
            context.updateState({
                item_details: item_details,
                dispatched_quantity: dispatched_quantity
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


const AddSelectedBatches = ($this, context) => {
    if (
        parseFloat($this.state.item_details.dispatched_quantity) >
        parseFloat($this.state.item_details.quantity)
    ) {
        swalMessage({
            title: "Transfer Qty cannot be greater than Request Qty.",
            type: "warning"
        });
    } else {
        debugger
        if (context !== null) {
            let saveEnable = true;
            let _inventory_stock_detail = $this.state.inventory_stock_detail;
            let _stock_detail = $this.state.stock_detail;
            let details = extend({}, $this.state.item_details);
            let batches = _.filter($this.state.item_details.batches, f => {
                return (
                    parseFloat(f.dispatch_quantity) !== 0 && f.dispatch_quantity !== null
                );
            });

            const _index = _stock_detail.indexOf($this.state.item_details);
            _stock_detail[_index] = $this.state.item_details;

            delete details.batches;

            _stock_detail[_index].inventory_stock_detail = batches.map(
                (item, index) => {
                    item.sales_price = item.sale_price;
                    return { ...item, ...details };
                }
            );

            let remove_item = _.filter(_inventory_stock_detail, f => {
                return f.item_id === details.item_id;
            });

            for (let i = 0; i < remove_item.length; i++) {
                if (remove_item[i].item_id === details.item_id) {
                    let remove_index = _inventory_stock_detail.indexOf(remove_item[i])
                    _inventory_stock_detail.splice(remove_index, 1);
                }
            }

            _inventory_stock_detail.push(
                ...batches.map((item, index) => {
                    item.sales_price = item.sale_price;
                    return { ...item, ...details };
                })
            );

            saveEnable = _inventory_stock_detail.length > 0 ? false : true;

            const sub_total = _.sumBy(_inventory_stock_detail, s =>
                parseFloat(s.extended_cost)
            );
            const discount_amount = _.sumBy(_inventory_stock_detail, s =>
                parseFloat(s.discount_amount)
            );

            const net_total = _.sumBy(_inventory_stock_detail, s =>
                parseFloat(s.net_extended_cost)
            );

            const total_tax = _.sumBy(_inventory_stock_detail, s =>
                parseFloat(s.tax_amount)
            );

            const net_payable = _.sumBy(_inventory_stock_detail, s =>
                parseFloat(s.total_amount)
            );
            context.updateState({
                stock_detail: _stock_detail,
                inventory_stock_detail: _inventory_stock_detail,
                batch_detail_view: false,
                saveEnable: saveEnable,
                quantity_transferred: 0,

                sub_total: sub_total,
                discount_amount: discount_amount,
                net_total: net_total,
                total_tax: total_tax,
                net_payable: net_payable
            });
        }
    }
};


export {
    datehandle,
    onchangegridcol,
    dateFormater,
    getItemLocationStock,
    AddSelectedBatches
};
