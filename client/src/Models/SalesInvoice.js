export default {
    inputParam: function (param) {
        var output;

        output = {
            hims_f_sales_invoice_header_id: null,
            invoice_number: null,
            sales_quotation_id: null,
            sales_invoice_mode: "I",
            loaction_id: null,
            location_name: null,
            invoice_date: new Date(),
            dataExitst: false,
            project_name: null,
            customer_name: null,
            hospital_name: null,
            payment_terms: null,
            customer_id: null,
            sales_order_number: null,
            sales_quotation_number: null,
            invoice_entry_detail_item: [],
            invoice_entry_detail_services: [],
            saveEnable: true,
            postEnable: true,

            sub_total: null,
            discount_amount: null,
            net_total: null,
            total_tax: null,
            net_payable: null,
        };
        return output;
    }
};
