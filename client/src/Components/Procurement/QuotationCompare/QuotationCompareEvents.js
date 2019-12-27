import React from "react";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import _ from "lodash";
import Enumerable from "linq";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

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
            AlgaehLoader({ show: true });
            debugger
            algaehApiCall({
                uri: "/RequestForQuotation/getRequestQuotationToComapre",
                module: "procurement",
                method: "GET",
                data: {
                    hims_f_procurement_req_quotation_header_id: row.hims_f_procurement_req_quotation_header_id,
                    quotation_for: row.q_f
                },
                onSuccess: response => {
                    if (response.data.success) {
                        debugger

                        let vendor_headers = [];
                        let vendor_body = [];
                        vendor_headers = Enumerable.from(response.data.records)
                            .groupBy("$.vendor_name", null, (k, g) => {
                                for (let i = 0; i < g.getSource().length; i++) {
                                    const item = g.getSource()[i];
                                    let obj = {};
                                    const exists = vendor_body.find(f => f.item_id === item.item_id);
                                    if (exists === undefined) {
                                        obj["item_id"] = item.item_id;
                                        obj["item_description"] = item.item_description;
                                        obj["uom_description"] = item.uom_description;
                                        obj[`unit_price${item.vendor_id}`] = item.unit_price;
                                        obj["quantity"] = item.quantity;
                                        vendor_body.push(obj)
                                    } else {
                                        let _index = vendor_body.indexOf(exists)

                                        obj[`unit_price${item.vendor_id}`] = item.unit_price;
                                        vendor_body[_index] = { ...exists, ...obj };
                                    }
                                }


                                return k;
                            })
                            .toArray();

                        // let vendor_headers = vendor_inputs.map((item, index) => {
                        //     return {
                        //         fieldName: item.vendor_name
                        //     };
                        // })



                        // let item_details = Enumerable.from(response.data.records)
                        //     .groupBy("$.item_id", null, (k, g) => {

                        //         let firstRecordSet = Enumerable.from(g).firstOrDefault();
                        //         return {
                        //             item_description: firstRecordSet.item_description,
                        //             uom_description: firstRecordSet.uom_description,
                        //             unit_price: firstRecordSet.unit_price,
                        //         };
                        //     })
                        //     .toArray();






                        debugger
                        $this.setState({
                            quotation_number: row.quotation_number,
                            vendor_headers: vendor_headers,
                            vendor_body: vendor_body
                        });
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

const generateVendorQuotation = data => {
    // console.log("data:", data);

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
    generateVendorQuotation,
    getVendorMaster
};
