import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import { AlgaehOpenContainer } from "../../../utils/GlobalFunctions";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const texthandle = ($this, ctrl, e) => {
    e = ctrl || e;
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    switch (name) {
        case "location_id":
            $this.setState({
                [name]: value,
                ReqData: false
            });
        default:
            $this.setState({
                [name]: value
            });
            break;
    }

};


const SalesOrderSearch = ($this, e) => {
    AlgaehSearch({
        searchGrid: {
            columns: spotlightSearch.Sales.SalesOrder
        },
        searchName: "SalesOrder",
        uri: "/gloabelSearch/get",
        inputs: " sales_order_mode = 'I'",

        onContainsChange: (text, serchBy, callBack) => {
            callBack(text);
        },
        onRowSelect: row => {
            AlgaehLoader({ show: true });
            algaehApiCall({
                uri: "/DispatchNote/getSalesOrderItem",
                module: "sales",
                method: "GET",
                data: { sales_order_number: row.sales_order_number, location_id: $this.state.location_id },
                onSuccess: response => {
                    debugger
                    if (response.data.success) {
                        let data = response.data.records;

                        data.sales_quotation_id = data.hims_f_sales_quotation_id;
                        data.saveEnable = true;
                        data.selectedData = true
                        data.sub_total = 0;
                        data.discount_amount = 0;
                        data.net_total = 0;
                        data.total_tax = 0;
                        data.net_payable = 0;

                        $this.setState(data);
                        AlgaehLoader({ show: false });
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
        hims_f_delivery_note_id: null,
        delivery_note_number: null,
        sales_order_id: null,
        sales_order_number: null,
        delivery_note_date: new Date(),
        customer_id: null,
        sub_total: null,
        discount_amount: null,
        net_total: null,
        total_tax: null,
        net_payable: null,
        narration: null,
        project_id: null,
        customer_po_no: null,
        tax_percentage: null,
        location_id: null,
        decimal_place: JSON.parse(
            AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
        ).decimal_places,
        saveEnable: true,
        dataExists: false,
        hospital_id: JSON.parse(
            AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
        ).hims_d_hospital_id,
        ReqData: true,
        selectedData: false,
        customer_name: null,
        branch_name: null,
        project_name: null,
        item_details: [],
        batch_detail_view: false,
        selected_quantity: 0,
        inventory_stock_detail: [],
        stock_detail: [],
        customer_name: null,
        hospital_name: null,
        project_name: null,

    };

    $this.setState(IOputs)
};

const SaveDispatchNote = $this => {
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
                data.saveEnable = true;
                data.dataExists = true;

                data.addedItem = true;
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

export {
    texthandle,
    SalesOrderSearch,
    ClearData,
    SaveDispatchNote,
    getCtrlCode,
    generatePOReceipt,
    generatePOReceiptNoPrice
};
