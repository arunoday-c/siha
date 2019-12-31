import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../utils/GlobalFunctions";

const changeTexts = ($this, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    $this.setState({ [name]: value });
};


const savePharmacyOptions = ($this) => {

    let inputObj = {
        hims_d_pharmacy_options_id: $this.state.hims_d_pharmacy_options_id,
        notification_before: $this.state.notification_before,
        notification_type: $this.state.notification_type,
        requisition_auth_level: $this.state.requisition_auth_level,
    }
    if (inputObj.hims_d_pharmacy_options_id !== null) {
        algaehApiCall({
            uri: "/pharmacy/updatePharmacyOptions",
            module: "pharmacy",
            data: inputObj,
            method: "PUT",
            onSuccess: res => {
                if (res.data.success) {
                    swalMessage({
                        title: "Record Updated Successfully",
                        type: "success"
                    });
                    getPharmacyOptions($this)
                }
            }
        });
    } else {
        algaehApiCall({
            uri: "/pharmacy/addPharmacyOptions",
            module: "pharmacy",
            data: inputObj,
            method: "POST",
            onSuccess: res => {
                if (res.data.success) {
                    swalMessage({
                        title: "Saved Successfully",
                        type: "success"
                    });
                    getPharmacyOptions($this)
                }
            }
        });
    }
}


const saveInventoryOptions = ($this) => {
    let inputObj = {
        hims_d_inventory_options_id: $this.state.hims_d_inventory_options_id,
        requisition_auth_level: $this.state.inv_requisition_auth_level,
    }
    if (inputObj.hims_d_inventory_options_id !== null) {
        algaehApiCall({
            uri: "/inventory/updateInventoryOptions",
            module: "inventory",
            data: inputObj,
            method: "PUT",
            onSuccess: res => {
                if (res.data.success) {
                    swalMessage({
                        title: "Record Updated Successfully",
                        type: "success"
                    });
                }
                getInventoryOptions($this)
            }
        });
    } else {
        algaehApiCall({
            uri: "/inventory/addInventoryOptions",
            module: "inventory",
            data: inputObj,
            method: "POST",
            onSuccess: res => {
                if (res.data.success) {
                    swalMessage({
                        title: "Saved Successfully",
                        type: "success"
                    });
                    getInventoryOptions($this)
                }
            }
        });
    }
}

const savePOOptions = ($this) => {

    let inputObj = {
        hims_d_procurement_options_id: $this.state.hims_d_procurement_options_id,
        po_auth_level: $this.state.po_auth_level,
    }
    if (inputObj.hims_d_procurement_options_id !== null) {
        algaehApiCall({
            uri: "/POSettings/updatePOOptions",
            module: "procurement",
            data: $this.state,
            method: "PUT",
            onSuccess: res => {
                if (res.data.success) {
                    swalMessage({
                        title: "Record Updated Successfully",
                        type: "success"
                    });
                    getPOOptions($this)
                }
            }
        });

    } else {
        algaehApiCall({
            uri: "/POSettings/addPOOptions",
            module: "procurement",
            data: $this.state,
            method: "POST",
            onSuccess: res => {
                if (res.data.success) {
                    swalMessage({
                        title: "Saved Successfully",
                        type: "success"
                    });
                    getPOOptions($this)
                }
            }
        });
    }
}

const saveSalesOptions = ($this) => {

    let inputObj = {
        hims_d_sales_options_id: $this.state.hims_d_sales_options_id,
        sales_order_auth_level: $this.state.sales_order_auth_level,
    }
    if (inputObj.hims_d_sales_options_id !== null) {
        algaehApiCall({
            uri: "/SalesSettings/updateSalesOptions",
            module: "sales",
            data: $this.state,
            method: "PUT",
            onSuccess: res => {
                if (res.data.success) {
                    swalMessage({
                        title: "Record Updated Successfully",
                        type: "success"
                    });
                    getSalesOptions($this)
                }
            }
        });

    } else {
        algaehApiCall({
            uri: "/SalesSettings/addSalesOptions",
            module: "sales",
            data: $this.state,
            method: "POST",
            onSuccess: res => {
                if (res.data.success) {
                    swalMessage({
                        title: "Saved Successfully",
                        type: "success"
                    });
                    getSalesOptions($this)
                }
            }
        });
    }
}



const getPharmacyOptions = ($this) => {
    algaehApiCall({
        uri: "/pharmacy/getPharmacyOptions",
        method: "GET",
        module: "pharmacy",
        onSuccess: res => {
            if (res.data.success) {
                $this.setState(res.data.records[0]);
            }
        }
    });
}

const getInventoryOptions = ($this) => {
    algaehApiCall({
        uri: "/inventory/getInventoryOptions",
        method: "GET",
        module: "inventory",
        onSuccess: res => {
            if (res.data.success) {
                res.data.records[0].inv_requisition_auth_level =
                    res.data.records[0].requisition_auth_level;
                $this.setState(res.data.records[0]);
            }
        }
    });
}

const getPOOptions = ($this) => {
    algaehApiCall({
        uri: "/POSettings/getPOOptions",
        method: "GET",
        module: "procurement",
        onSuccess: res => {
            if (res.data.success) {
                $this.setState(res.data.records[0]);
            }
        }
    });
}

const getSalesOptions = ($this) => {
    algaehApiCall({
        uri: "/SalesSettings/getSalesOptions",
        method: "GET",
        module: "sales",
        onSuccess: res => {
            if (res.data.success) {
                $this.setState(res.data.records[0]);
            }
        }
    });
}

export {
    changeTexts,
    savePharmacyOptions,
    saveInventoryOptions,
    savePOOptions,
    saveSalesOptions,
    getPharmacyOptions,
    getInventoryOptions,
    getPOOptions,
    getSalesOptions
};
