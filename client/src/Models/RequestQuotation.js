export default {
    inputParam: function (param) {
        var output;

        output = {
            hims_f_procurement_req_quotation_header_id: null,
            quotation_number: null,

            quotation_date: new Date(),
            quotation_for: null,

            expected_date: new Date(),
            material_requisition_number: null,
            phar_requisition_id: null,
            inv_requisition_id: null,

            phar_item_category: null,
            inv_item_category_id: null,
            phar_item_group: null,
            inv_item_group_id: null,
            phar_item_id: null,
            inv_item_id: null,
            pharmacy_uom_id: null,
            inventory_uom_id: null,
            quotation_detail: [],


            quantity: 0,
            dataExitst: false,
            addItemButton: true,
            ReqData: true,
            saveEnable: true,
        };
        return output;
    }
};
