import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import Options from "../../../Options.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";


const getContractList = $this => {
    let inpObj = { HRMNGMT_Active: true };

    if ($this.state.from_date !== null) {
        inpObj.from_date = $this.state.from_date;
    }
    if ($this.state.to_date !== null) {
        inpObj.to_date = $this.state.to_date;
    }

    if ($this.state.customer_id) {
        inpObj.customer_id = $this.state.customer_id;
    }


    algaehApiCall({
        uri: "/ContractManagement/getContractManagementList",
        module: "sales",
        method: "GET",
        data: inpObj,
        onSuccess: response => {

            if (response.data.success) {
                // let data = response.data.records;

                // data.comment_list =
                //     data.terms_conditions !== null
                //         ? data.terms_conditions.split("<br/>")
                //         : [];

                // data.saveEnable = true;
                // data.dataExists = true;
                $this.setState({ contract_list: response.data.records });
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

const dateFormater = ($this, value) => {
    if (value !== null) {
        return moment(value).format(Options.dateFormat);
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
                getContractList($this);
            }
        );
    }
};

const changeEventHandaler = ($this, ctrl, e) => {
    e = ctrl || e;
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    $this.setState({ [name]: value }, () => {
        getContractList($this);
    });
};


const dateFormaterTime = ($this, value) => {
    if (value !== null) {
        return moment(value).format(Options.datetimeFormat24);
    }
};

const ShowOrdersOfContarct = ($this, row) => {
    let inpObj = { HRMNGMT_Active: true, contract_id: row.hims_f_contract_management_id };

    if ($this.state.from_date !== null) {
        inpObj.from_date = $this.state.from_date;
    }
    if ($this.state.to_date !== null) {
        inpObj.to_date = $this.state.to_date;
    }

    if ($this.state.customer_id) {
        inpObj.customer_id = row.customer_id;
    }

    algaehApiCall({
        uri: "/ContractManagement/getOrderListGenContract",
        method: "GET",
        data: inpObj,
        module: "sales",
        onSuccess: (res) => {

            if (res.data.success) {
                $this.setState({
                    order_list: res.data.records,
                    openOrderList: !$this.state.openOrderList,
                    customer_list: row
                });
            }
        },
        onFailure: (err) => {
            swalMessage({
                title: err.message,
                type: "error",
            });
        },
    });
}

const closeOrdersOfContarct = ($this) => {
    $this.setState({
        order_list: [],
        customer_list: {},
        openOrderList: !$this.state.openOrderList
    });
}

export {
    dateFormater,
    getContractList,
    datehandle,
    changeEventHandaler,
    dateFormaterTime,
    ShowOrdersOfContarct,
    closeOrdersOfContarct
};
