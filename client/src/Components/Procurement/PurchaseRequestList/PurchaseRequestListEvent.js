import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
import Options from "../../../Options.json";
import { setGlobal } from "../../../utils/GlobalFunctions";
import Enumerable from "linq";

const getPurchaseRequestList = $this => {
    let inpObj = { request_from: $this.state.request_from };

    if ($this.state.from_date !== null) {
        inpObj.from_date = $this.state.from_date;
    }
    if ($this.state.to_date !== null) {
        inpObj.to_date = $this.state.to_date;
    }

    algaehApiCall({
        uri: "/PurchaseOrderEntry/getraiseRequestForPO",
        module: "procurement",
        method: "GET",
        data: inpObj,

        onSuccess: response => {
            debugger
            if (response.data.success) {
                let data = response.data.records;
                $this.setState({ purchase_request_list: data });
            }
        },
        onFailure: error => {
            swalMessage({
                title: error.message,
                type: "error"
            });
        }
    });
};

const dateFormater = ($this, value) => {
    if (value !== null) {
        return moment(value).format(Options.dateFormat);
    }
};

const poforhandle = ($this, e) => {

    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    if ($this.state.request_from !== value) {
        $this.setState(
            {
                [name]: value,
                pharmcy_location_id: null,
                inventory_location_id: null,
                poSelected: false,
                status: "1"
            },
            () => {
                getData($this);
                getPurchaseRequestList($this);
            }
        );
    }

};

const getData = $this => {
    if ($this.state.request_from === "PHR") {
        $this.props.getLocation({
            uri: "/pharmacy/getPharmacyLocation",
            module: "pharmacy",
            method: "GET",
            redux: {
                type: "LOCATIONS_GET_DATA",
                mappingName: "polocations"
            }
        });
    } else if ($this.state.request_from === "INV") {
        $this.props.getLocation({
            uri: "/inventory/getInventoryLocation",
            module: "inventory",
            method: "GET",
            redux: {
                type: "LOCATIONS_GET_DATA",
                mappingName: "polocations"
            }
        });
    }
};

const datehandle = ($this, ctrl, e) => {
    let intFailure = false;
    if (e === "from_date") {
        if (Date.parse($this.state.to_date) < Date.parse(moment(ctrl)._d)) {
            intFailure = true;
            swalMessage({
                title: "From Date cannot be grater than To Date.",
                type: "warning"
            });
        }
    } else if (e === "to_date") {
        if (Date.parse(moment(ctrl)._d) < Date.parse($this.state.from_date)) {
            intFailure = true;
            swalMessage({
                title: "To Date cannot be less than From Date.",
                type: "warning"
            });
        }
    }

    if (intFailure === false) {
        $this.setState(
            {
                [e]: moment(ctrl)._d
            },
            () => {
                if ($this.state.request_from !== null) {
                    getPurchaseRequestList($this);
                }
            }
        );
    }
};

const RequestForQuotation = ($this) => {
    let _purchase_request_list = $this.state.purchase_request_list;

    let listOfinclude = Enumerable.from(_purchase_request_list)
        .where(w => w.checked === true)
        .toArray();

    setGlobal({
        "RQ-STD": "RequestForQuotation",
        quotation_detail: listOfinclude
    });
    document
        .getElementById("rq-router")
        .click();
}

export {
    dateFormater,
    poforhandle,
    datehandle,
    getPurchaseRequestList,
    RequestForQuotation
};
