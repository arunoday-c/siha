import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import { AlgaehOpenContainer, AlgaehValidation } from "../../../utils/GlobalFunctions";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const texthandle = ($this, ctrl, e) => {
    e = ctrl || e;
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    switch (name) {
        case "sales_quotation_mode":
            $this.setState({
                [name]: value,
                hims_f_sales_order_id: null,
                sales_quotation_number: null,
                sales_quotation_id: null,
                sales_order_number: null,
                sales_order_date: new Date(),
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
                customer_po_no: null,
                tax_percentage: null,

                sales_order_items: [],
                sales_order_services: [],
                decimal_place: JSON.parse(
                    AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
                ).decimal_places,
                saveEnable: true,
                dataExists: false,
                hospital_id: JSON.parse(
                    AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
                ).hims_d_hospital_id,

                addItemButton: true,
                item_description: "",
                addedItem: true,

                item_id: null,
                quantity: 0,
                uom_id: null,
                uom_description: null,
                discount_percentage: 0,
                unit_cost: 0,
                tax_percent: 0
            });
            break;

        default:
            $this.setState({
                [name]: value
            });
            break;
    }

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
            columns: spotlightSearch.Sales.SalesQuotation
        },
        searchName: "SalesQuotation",
        uri: "/gloabelSearch/get",
        // inputs: " sales_quotation_mode= '" + $this.state.sales_order_mode + "'",

        onContainsChange: (text, serchBy, callBack) => {
            callBack(text);
        },
        onRowSelect: row => {
            AlgaehLoader({ show: true });
            algaehApiCall({
                uri: "/SalesQuotation/getSalesQuotation",
                module: "sales",
                method: "GET",
                data: { sales_quotation_number: row.sales_quotation_number },
                onSuccess: response => {
                    if (response.data.success) {
                        let data = response.data.records;

                        data.sales_quotation_id = data.hims_f_sales_quotation_id;

                        if (data.sales_quotation_mode === "I") {
                            data.sales_order_items = data.qutation_detail
                        } else {
                            data.sales_order_services = data.qutation_detail
                        }
                        data.saveEnable = false;
                        data.selectedData = true;
                        data.tax_percentage = data.vat_percentage;
                        // data.addedItem = false;
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
        }
    });
};

const ClearData = ($this, e) => {
    let IOputs = {
        hims_f_sales_order_id: null,
        sales_quotation_number: null,
        sales_quotation_id: null,
        sales_order_number: null,
        sales_order_date: new Date(),
        sales_order_mode: "I",
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
        customer_po_no: null,
        tax_percentage: null,

        sales_order_items: [],
        sales_order_services: [],
        decimal_place: JSON.parse(
            AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
        ).decimal_places,
        saveEnable: true,
        dataExists: false,
        hospital_id: JSON.parse(
            AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
        ).hims_d_hospital_id,

        addItemButton: true,
        item_description: "",
        addedItem: true,

        item_id: null,
        quantity: 0,
        uom_id: null,
        uom_description: null,
        discount_percentage: 0,
        unit_cost: 0,
        tax_percent: 0,
        services_required: "N"
    };

    $this.setState(IOputs)
};

const SaveSalesOrderEnrty = $this => {
    AlgaehValidation({
        querySelector: "data-validate='HeaderDiv'",
        alertTypeIcon: "warning",
        onSuccess: () => {
            AlgaehLoader({ show: true });
            algaehApiCall({
                uri: "/SalesOrder/addSalesOrder",
                module: "sales",
                method: "POST",
                data: $this.state,
                onSuccess: response => {

                    if (response.data.success) {
                        $this.setState({
                            sales_order_number: response.data.records.sales_order_number,
                            hims_f_sales_order_id:
                                response.data.records.hims_f_sales_order_id,
                            saveEnable: true,
                            dataExists: true
                        });
                        swalMessage({
                            type: "success",
                            title: "Saved successfully ..."
                        });
                        AlgaehLoader({ show: false });
                    } else {
                        AlgaehLoader({ show: false });
                        swalMessage({
                            type: "error",
                            title: response.data.records.message
                        });
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
    });
};

const getCtrlCode = ($this, docNumber) => {
    AlgaehLoader({ show: true });
    algaehApiCall({
        uri: "/SalesOrder/getSalesOrder",
        module: "sales",
        method: "GET",
        data: { sales_order_number: docNumber },
        onSuccess: response => {
            if (response.data.success) {
                let data = response.data.records;

                if (data.sales_order_mode === "I") {
                    data.sales_order_items = data.qutation_detail
                } else {
                    data.sales_order_services = data.qutation_detail
                }
                data.saveEnable = true;
                data.dataExists = true;

                data.addedItem = true;
                data.selectedData = true;
                $this.setState(data);
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


const getSalesOptions = ($this) => {
    algaehApiCall({
        uri: "/SalesSettings/getSalesOptions",
        method: "GET",
        module: "sales",
        onSuccess: res => {
            if (res.data.success) {
                $this.setState({ services_required: res.data.records[0].services_required });
            }
        }
    });
}

export {
    texthandle,
    datehandle,
    SalesQuotationSearch,
    customerTexthandle,
    ClearData,
    SaveSalesOrderEnrty,
    getCtrlCode,
    generatePOReceipt,
    generatePOReceiptNoPrice,
    getSalesOptions
};
