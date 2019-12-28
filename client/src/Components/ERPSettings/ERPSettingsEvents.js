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
                }
            }
        });
    }
}

export {
    changeTexts,
    savePharmacyOptions,
    saveInventoryOptions,
    savePOOptions
};
