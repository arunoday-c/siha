import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import { AlgaehOpenContainer } from "../../../utils/GlobalFunctions";

import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const texthandle = ($this, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    $this.setState({
        [name]: value
    });
};

const customerTexthandle = ($this, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    $this.setState({
        [name]: value,
        vendor_name: e.selected.vendor_name,
        payment_terms: e.selected.payment_terms,
        tax_percentage: e.selected.vat_percentage,
    });
};


const datehandle = ($this, ctrl, e) => {
    $this.setState({
        [e]: moment(ctrl)._d
    });
};

const SalesQuotationSearch = ($this, e) => {
    AlgaehSearch({
        searchGrid: {
            columns: spotlightSearch.RequisitionEntry.ReqEntry
        },
        searchName: $this.state.po_from === "PHR" ? "PhrPOEntry" : "InvPOEntry",
        uri: "/gloabelSearch/get",

        onContainsChange: (text, serchBy, callBack) => {
            callBack(text);
        },
        onRowSelect: row => {
            AlgaehLoader({ show: true });
            algaehApiCall({
                uri:
                    $this.state.po_from === "PHR"
                        ? "/PurchaseOrderEntry/getPharRequisitionEntryPO"
                        : "/PurchaseOrderEntry/getInvRequisitionEntryPO",
                module: "procurement",
                data: {
                    material_requisition_number: row.material_requisition_number
                },
                method: "GET",
                onSuccess: response => {
                    if (response.data.success === true) {
                        let data = response.data.records;
                        if (data !== null && data !== undefined) {


                            data.saveEnable = false;

                            data.location_type = "MS";

                            // data.dataFinder = true;

                            for (let i = 0; i < data.po_entry_detail.length; i++) {
                                let purchase_cost = data.po_entry_detail[i].purchase_cost;

                                if ($this.state.po_from === "PHR") {
                                    data.po_entry_detail[i].pharmacy_requisition_id =
                                        data.po_entry_detail[i].hims_f_pharmacy_material_detail_id;

                                    data.po_entry_detail[i].phar_item_category =
                                        data.po_entry_detail[i].item_category_id;
                                    data.po_entry_detail[i].phar_item_group =
                                        data.po_entry_detail[i].item_group_id;
                                    data.po_entry_detail[i].phar_item_id =
                                        data.po_entry_detail[i].item_id;

                                    data.po_entry_detail[i].pharmacy_uom_id =
                                        data.po_entry_detail[i].purchase_uom_id;
                                } else {
                                    data.po_entry_detail[i].inventory_requisition_id =
                                        data.po_entry_detail[i].hims_f_inventory_material_detail_id;

                                    data.po_entry_detail[i].inv_item_category_id =
                                        data.po_entry_detail[i].item_category_id;
                                    data.po_entry_detail[i].inv_item_group_id =
                                        data.po_entry_detail[i].item_group_id;
                                    data.po_entry_detail[i].inv_item_id =
                                        data.po_entry_detail[i].item_id;

                                    data.po_entry_detail[i].inventory_uom_id =
                                        data.po_entry_detail[i].purchase_uom_id;
                                }

                                data.po_entry_detail[i].order_quantity =
                                    data.po_entry_detail[i].quantity_authorized;
                                data.po_entry_detail[i].total_quantity =
                                    data.po_entry_detail[i].quantity_authorized;

                                data.po_entry_detail[i].uom_requested_id =
                                    data.po_entry_detail[i].item_uom;

                                data.po_entry_detail[i].unit_price = purchase_cost;
                                data.po_entry_detail[i].unit_cost = purchase_cost;

                                data.po_entry_detail[i].extended_price =
                                    purchase_cost * data.po_entry_detail[i].quantity_authorized;

                                data.po_entry_detail[i].extended_cost =
                                    purchase_cost * data.po_entry_detail[i].quantity_authorized;
                                data.po_entry_detail[i].net_extended_cost =
                                    purchase_cost * data.po_entry_detail[i].quantity_authorized;
                                data.po_entry_detail[i].quantity_outstanding = 0;

                                data.po_entry_detail[i].sub_discount_percentage = 0;
                                data.po_entry_detail[i].sub_discount_amount = 0;
                                data.po_entry_detail[i].expected_arrival_date =
                                    $this.state.expected_date;
                                data.po_entry_detail[i].authorize_quantity = 0;
                                data.po_entry_detail[i].rejected_quantity = 0;
                                data.po_entry_detail[i].tax_percentage =
                                    $this.state.tax_percentage;
                                data.po_entry_detail[i].tax_amount =
                                    (parseFloat(data.po_entry_detail[i].extended_cost) *
                                        parseFloat($this.state.tax_percentage)) /
                                    100;

                                data.po_entry_detail[i].total_amount =
                                    parseFloat(data.po_entry_detail[i].extended_cost) +
                                    data.po_entry_detail[i].tax_amount;
                            }

                            let sub_total = Enumerable.from(data.po_entry_detail).sum(s =>
                                parseFloat(s.extended_price)
                            );

                            let net_total = Enumerable.from(data.po_entry_detail).sum(s =>
                                parseFloat(s.net_extended_cost)
                            );

                            let net_payable = Enumerable.from(data.po_entry_detail).sum(s =>
                                parseFloat(s.total_amount)
                            );

                            let total_tax = Enumerable.from(data.po_entry_detail).sum(s =>
                                parseFloat(s.tax_amount)
                            );

                            let detail_discount = Enumerable.from(data.po_entry_detail).sum(
                                s => parseFloat(s.sub_discount_amount)
                            );

                            data.sub_total = sub_total;
                            data.net_total = net_total;
                            data.net_payable = net_payable;
                            data.total_tax = total_tax;
                            data.detail_discount = detail_discount;

                            if ($this.state.po_from === "PHR") {
                                data.phar_requisition_id =
                                    data.hims_f_pharamcy_material_header_id;
                                data.pharmacy_stock_detail = data.po_entry_detail;
                            } else {
                                data.inv_requisition_id =
                                    data.hims_f_inventory_material_header_id;
                                data.inventory_stock_detail = data.po_entry_detail;
                            }
                            $this.setState(data);
                        }
                    }
                    AlgaehLoader({ show: false });
                }
            });
        }
    });
};

const ClearData = ($this, e) => {
    let IOputs = {
        hims_f_sales_quotation_id: null,
        sales_quotation_number: null,
        sales_quotation_date: new Date(),
        sales_quotation_mode: "I",
        reference_number: null,
        customer_id: null,
        quote_validity: null,
        sales_man: null,
        payment_terms: null,
        service_terms: null,
        other_terms: null,
        sub_total: null,
        discount_amount: null,
        net_total: null,
        total_tax: null,
        net_payable: null,
        narration: null,
        project_id: null,
        tax_percentage: null,


        sales_quotation_items: [],
        sales_quotation_services: [],
        decimal_place: JSON.parse(
            AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
        ).decimal_places,
        saveEnable: true,
        dataExists: false
    };

    $this.setState(IOputs)
};

const SavePOEnrty = $this => {
    AlgaehLoader({ show: true });
    if ($this.state.po_from === "PHR") {
        $this.state.po_entry_detail = $this.state.pharmacy_stock_detail;
    } else {
        $this.state.po_entry_detail = $this.state.inventory_stock_detail;
    }

    algaehApiCall({
        uri: "/PurchaseOrderEntry/addPurchaseOrderEntry",
        module: "procurement",
        data: $this.state,
        onSuccess: response => {
            if (response.data.success === true) {
                $this.setState({
                    purchase_number: response.data.records.purchase_number,
                    hims_f_procurement_po_header_id:
                        response.data.records.hims_f_procurement_po_header_id,
                    saveEnable: true,
                    dataExitst: true,
                    dataFinder: true
                });

                swalMessage({
                    type: "success",
                    title: "Saved successfully . ."
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
};

const getCtrlCode = ($this, docNumber) => {

    algaehApiCall({
        uri: "/PurchaseOrderEntry/getPurchaseOrderEntry",
        module: "procurement",
        method: "GET",
        data: { purchase_number: docNumber },
        onSuccess: response => {
            if (response.data.success) {
                let data = response.data.records;
                if (
                    $this.props.purchase_number !== undefined &&
                    $this.props.purchase_number.length !== 0
                ) {
                    data.authorizeEnable = false;
                    data.ItemDisable = true;
                    data.ClearDisable = true;

                    for (let i = 0; i < data.po_entry_detail.length; i++) {
                        data.po_entry_detail[i].authorize_quantity =
                            data.authorize1 === "N"
                                ? data.po_entry_detail[i].total_quantity
                                : data.po_entry_detail[i].authorize_quantity;
                        data.po_entry_detail[i].quantity_outstanding =
                            data.authorize1 === "N"
                                ? data.po_entry_detail[i].total_quantity
                                : data.po_entry_detail[i].quantity_outstanding;
                        data.po_entry_detail[i].rejected_quantity =
                            parseFloat(data.po_entry_detail[i].total_quantity) -
                            parseFloat(data.po_entry_detail[i].authorize_quantity);
                    }
                }
                data.saveEnable = true;
                data.dataExitst = true;
                data.dataFinder = true;

                if (data.po_from === "PHR") {
                    $this.state.pharmacy_stock_detail = data.po_entry_detail;
                } else {
                    $this.state.inventory_stock_detail = data.po_entry_detail;
                }

                data.addedItem = true;
                $this.setState(data);
                AlgaehLoader({ show: false });

                // $this.setState({ ...response.data.records });
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

};

const generatePOReceipt = data => {
    console.log("data:", data);
    algaehApiCall({
        uri: "/report",
        method: "GET",
        module: "reports",
        headers: {
            Accept: "blob"
        },
        others: { responseType: "blob" },
        data: {
            report: {
                reportName:
                    data.po_from === "PHR"
                        ? "poPharmacyProcurement"
                        : "poInventoryProcurement",
                reportParams: [
                    {
                        name: "purchase_number",
                        value: data.purchase_number
                    }
                ],
                outputFileType: "PDF"
            }
        },
        onSuccess: res => {
            const url = URL.createObjectURL(res.data);
            let myWindow = window.open(
                "{{ product.metafields.google.custom_label_0 }}",
                "_blank"
            );
            myWindow.document.write(
                "<iframe src= '" + url + "' width='100%' height='100%' />"
            );
            myWindow.document.title = "Purchase Order Receipt";
        }
    });
};

const generatePOReceiptNoPrice = data => {
    console.log("data:", data);
    algaehApiCall({
        uri: "/report",
        method: "GET",
        module: "reports",
        headers: {
            Accept: "blob"
        },
        others: { responseType: "blob" },
        data: {
            report: {
                reportName:
                    data.po_from === "PHR"
                        ? "poPharmacyProcurementNoPrice"
                        : "poInventoryProcurementNoPrice",
                reportParams: [
                    {
                        name: "purchase_number",
                        value: data.purchase_number
                    }
                ],
                outputFileType: "PDF"
            }
        },
        onSuccess: res => {
            const url = URL.createObjectURL(res.data);
            let myWindow = window.open(
                "{{ product.metafields.google.custom_label_0 }}",
                "_blank"
            );
            myWindow.document.write(
                "<iframe src= '" + url + "' width='100%' height='100%' />"
            );
            myWindow.document.title = "Purchase Order Receipt";
        }
    });
};

export {
    texthandle,
    datehandle,
    SalesQuotationSearch,
    customerTexthandle,
    ClearData,
    SavePOEnrty,
    getCtrlCode,
    generatePOReceipt,
    generatePOReceiptNoPrice
};
