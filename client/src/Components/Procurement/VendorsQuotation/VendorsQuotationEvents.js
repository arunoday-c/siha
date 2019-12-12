import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import RequestQuotation from "../../../Models/RequestQuotation";
import _ from "lodash";

const texthandle = ($this, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    $this.setState({
        [name]: value
    });
};

const QuotationSearch = ($this, e) => {
    AlgaehSearch({
        searchGrid: {
            columns: spotlightSearch.Purchase.RequestQuotation
        },
        searchName: "RequestQuotation",
        uri: "/gloabelSearch/get",

        onContainsChange: (text, serchBy, callBack) => {
            callBack(text);
        },
        onRowSelect: row => {

            algaehApiCall({
                uri: "/RequestForQuotation/getRequestForQuotation",
                module: "procurement",
                method: "GET",
                data: { quotation_number: row.quotation_number },
                onSuccess: response => {
                    if (response.data.success) {
                        debugger
                        let data = response.data.records;
                        data.req_quotation_header_id = data.hims_f_procurement_req_quotation_header_id;
                        for (let i = 0; i < data.quotation_detail.length; i++) {
                            data.quotation_detail[i].unit_price = 0
                            data.quotation_detail[i].extend_cost = 0
                            data.quotation_detail[i].discount_percentage = 0
                            data.quotation_detail[i].discount_amount = 0
                            data.quotation_detail[i].tax_percentage = 0
                            data.quotation_detail[i].tax_amount = 0
                            data.quotation_detail[i].net_extend_amount = 0
                            data.quotation_detail[i].net_total = 0
                        }
                        getData($this, data.quotation_for);
                        data.saveEnable = false;
                        $this.setState(data);
                        AlgaehLoader({ show: false });
                    } else {
                        AlgaehLoader({ show: false });
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

const ClearData = ($this, e) => {
    $this.setState($this.baseState);
    clearItemDetails($this)
};

const clearItemDetails = ($this) => {
    $this.props.getItems({
        redux: {
            type: "ITEM_GET_DATA",
            mappingName: "poitemlist",
            data: []
        }
    });

    $this.props.getItemCategory({
        redux: {
            type: "ITEM_CATEGORY_GET_DATA",
            mappingName: "poitemcategory",
            data: []
        }
    });

    $this.props.getItemGroup({
        redux: {
            type: "ITEM_GROUP_GET_DATA",
            mappingName: "poitemgroup",
            data: []
        }
    });

    $this.props.getItemUOM({
        redux: {
            type: "ITEM_UOM_GET_DATA",
            mappingName: "poitemuom",
            data: []
        }
    });
};
const SaveVendorQuotationEnrty = $this => {

    debugger
    const unit_price_exist = _.filter($this.state.quotation_detail, f => {
        return f.unit_price === 0 || f.unit_price === null || f.unit_price === "";
    });

    if (unit_price_exist.length > 0) {
        swalMessage({
            type: "error",
            title: "Please Enter Unit Price for all the items."
        });
        return
    }

    AlgaehLoader({ show: true });

    algaehApiCall({
        uri: "/VendorsQuotation/addVendorQuotation",
        module: "procurement",
        data: $this.state,
        onSuccess: response => {
            if (response.data.success === true) {
                $this.setState({
                    vendor_quotation_number: response.data.records.vendor_quotation_number,
                    hims_f_procurement_vendor_quotation_header_id: response.data.records.hims_f_procurement_vendor_quotation_header_id,
                    saveEnable: true,
                    dataExitst: true
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
    AlgaehLoader({ show: true });
    let IOputs = RequestQuotation.inputParam();

    IOputs.dataExitst = false;
    $this.setState(IOputs, () => {
        algaehApiCall({
            uri: "/VendorsQuotation/getVendorQuotation",
            module: "procurement",
            method: "GET",
            data: { vendor_quotation_number: docNumber },
            onSuccess: response => {
                if (response.data.success) {
                    let data = response.data.records;
                    getData($this, data.quotation_for);
                    data.saveEnable = true;
                    data.dataExitst = true;

                    data.addedItem = true;
                    $this.setState(data);
                    AlgaehLoader({ show: false });
                } else {
                    AlgaehLoader({ show: false });
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
    });
};

const getData = ($this, quotation_for) => {
    if (quotation_for === "PHR") {
        $this.props.getItems({
            uri: "/pharmacy/getItemMaster",
            data: { item_status: "A" },
            module: "pharmacy",
            method: "GET",
            redux: {
                type: "ITEM_GET_DATA",
                mappingName: "poitemlist"
            }
        });


        $this.props.getItemCategory({
            uri: "/pharmacy/getItemCategory",
            module: "pharmacy",
            method: "GET",
            redux: {
                type: "ITEM_CATEGORY_GET_DATA",
                mappingName: "poitemcategory"
            }
        });

        $this.props.getItemGroup({
            uri: "/pharmacy/getItemGroup",
            module: "pharmacy",
            method: "GET",
            redux: {
                type: "ITEM_GROUP_GET_DATA",
                mappingName: "poitemgroup"
            }
        });

        $this.props.getItemUOM({
            uri: "/pharmacy/getPharmacyUom",
            module: "pharmacy",
            method: "GET",
            redux: {
                type: "ITEM_UOM_GET_DATA",
                mappingName: "poitemuom"
            }
        });
    } else if (quotation_for === "INV") {
        $this.props.getItems({
            uri: "/inventory/getItemMaster",
            data: { item_status: "A" },
            module: "inventory",
            method: "GET",
            redux: {
                type: "ITEM_GET_DATA",
                mappingName: "poitemlist"
            }
        });


        $this.props.getItemCategory({
            uri: "/inventory/getItemCategory",
            module: "inventory",
            method: "GET",
            redux: {
                type: "ITEM_CATEGORY_GET_DATA",
                mappingName: "poitemcategory"
            },
            afterSuccess: data => { }
        });

        $this.props.getItemGroup({
            uri: "/inventory/getItemGroup",
            module: "inventory",
            method: "GET",
            redux: {
                type: "ITEM_GROUP_GET_DATA",
                mappingName: "poitemgroup"
            }
        });

        $this.props.getItemUOM({
            uri: "/inventory/getInventoryUom",
            module: "inventory",
            method: "GET",
            redux: {
                type: "ITEM_UOM_GET_DATA",
                mappingName: "poitemuom"
            }
        });
    }
};

const generateVendorQuotation = data => {
    console.log("data:", data);
    debugger
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
                    data.quotation_for === "PHR"
                        ? "venPharmacyQuotation"
                        : "venInventoryQuotation",
                reportParams: [
                    {
                        name: "vendor_quotation_number",
                        value: data.vendor_quotation_number
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


const vendortexthandle = ($this, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    $this.setState({
        [name]: value,
        vendor_name: e.selected.vendor_name,
        payment_terms: e.selected.payment_terms,
        tax_percentage: e.selected.vat_percentage,
        ReqData: false
    });
};

const getVendorMaster = $this => {
    $this.props.getVendorMaster({
        uri: "/vendor/getVendorMaster",
        module: "masterSettings",
        method: "GET",
        data: { vendor_status: "A" },
        redux: {
            type: "VENDORS_GET_DATA",
            mappingName: "povendors"
        }
    });
};

export {
    texthandle,
    QuotationSearch,
    ClearData,
    SaveVendorQuotationEnrty,
    getCtrlCode,
    generateVendorQuotation,
    clearItemDetails,
    vendortexthandle,
    getVendorMaster
};
