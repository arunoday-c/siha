import extend from "extend";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/BillCancellation";
import {
    algaehApiCall,
    swalMessage,
    getCookie,
} from "../../utils/algaehApiCall";

import AlgaehLoader from "../Wrapper/fullPageLoader";
import Enumerable from "linq";
import AlgaehSearch from "../Wrapper/globalSearch";
import spotlightSearch from "../../Search/spotlightSearch.json";

const ClearData = ($this, e) => {
    let _screenName = getCookie("ScreenName").replace("/", "");
    let counter_id = 0;
    algaehApiCall({
        uri: "/userPreferences/get",
        data: {
            screenName: _screenName,
            identifier: "Counter",
        },
        method: "GET",
        onSuccess: (response) => {
            counter_id = response.data.records.selectedValue;

            let IOputs = extend(
                PatRegIOputs.inputParam(),
                BillingIOputs.inputParam()
            );
            IOputs.selectedLang = getCookie("Language");
            IOputs.patient_payable_h = 0;
            IOputs.counter_id = counter_id;
            IOputs.cancel_remarks = null;
            $this.setState({ ...$this.state, ...IOputs }, () => {
                getCashiersAndShiftMAP($this, $this.state.cancel_checkin);
            });
        },
    });
};

const Validations = ($this) => {
    let isError = false;

    if ($this.state.Cardchecked === true) {
        if (
            $this.state.card_check_number === null ||
            $this.state.card_check_number === ""
        ) {
            isError = true;

            swalMessage({
                type: "warning",
                title: "Card Number cannot be blank.",
            });

            document.querySelector("[name='card_check_number']").focus();
            return isError;
        } else if (parseFloat($this.state.card_amount) === 0) {
            isError = true;

            swalMessage({
                type: "warning",
                title: "Enter Card Amount.",
            });

            document.querySelector("[name='card_amount']").focus();
            return isError;
        }
    }

    if ($this.state.unbalanced_amount > 0) {
        isError = true;
        swalMessage({
            type: "warning",
            title: "Total receipt amount should be equal to reciveable amount.",
        });

        return isError;
    } else if ($this.state.shift_id === null) {
        isError = true;
        swalMessage({
            type: "warning",
            title: "Shift is Mandatory.",
        });

        return isError;
    }
};

const getCashiersAndShiftMAP = ($this) => {
    algaehApiCall({
        uri: "/shiftAndCounter/getCashiersAndShiftMAP",
        module: "masterSettings",
        method: "GET",
        data: { for: "T" },
        onSuccess: (response) => {
            if (response.data.records.length > 0) {
                $this.setState(
                    {
                        shift_assinged: response.data.records,
                    },
                    () => {
                        $this.setState({
                            shift_id: response.data.records[0].shift_id,
                        });
                    }
                );
            }
        },
        onFailure: (error) => {
            swalMessage({
                title: error.message,
                type: "error",
            });
        },
    });
};

const getBillDetails = ($this, bill_number) => {
    AlgaehLoader({ show: true });
    algaehApiCall({
        uri: "/opBilling/get",
        module: "billing",
        method: "GET",
        data: { bill_number: bill_number, from_cancellation: "Y" },
        onSuccess: (response) => {
            if (response.data.success) {
                let data = response.data.records;

                let x = Enumerable.from($this.props.patienttype)
                    .where((w) => w.hims_d_patient_type_id === data.patient_type)
                    .toArray();

                if (x !== undefined && x.length > 0) {
                    data.patient_type = x[0].patitent_type_desc;
                } else {
                    data.patient_type = "Not Selected";
                }

                data.receipt_number = null;
                data.receipt_date = new Date();
                data.cash_amount = data.receiveable_amount;
                data.from_bill_id = data.hims_f_billing_header_id;
                data.counter_id = $this.state.counter_id || null;
                data.shift_id = $this.state.shift_id || null;
                data.mode_of_pay = data.insured === "Y" ? "Insured" : "Self";
                data.saveEnable = false;

                $this.setState(data);
                if (data.insured === "Y") {
                    $this.props.getPatientInsurance({
                        uri: "/patientRegistration/getPatientInsurance",
                        module: "frontDesk",
                        method: "GET",
                        data: {
                            patient_id: $this.state.hims_d_patient_id,
                            patient_visit_id: $this.state.visit_id,
                        },
                        redux: {
                            type: "EXIT_INSURANCE_GET_DATA",
                            mappingName: "existinsurance",
                        },
                    });
                }
                AlgaehLoader({ show: false });
            }
        },
        onFailure: (error) => {
            AlgaehLoader({ show: false });
            swalMessage({
                title: error.message,
                type: "error",
            });
        },
    });
};


const BillSearch = ($this, e) => {
    AlgaehSearch({
        searchGrid: {
            columns: spotlightSearch.billing.opBilling
        },
        searchName: "billsforCanel",
        uri: "/gloabelSearch/get",
        inputs: "adjusted = 'N'",
        onContainsChange: (text, serchBy, callBack) => {
            callBack(text);
        },
        onRowSelect: row => {
            getBillDetails($this, row.bill_number)
            // $this.setState({ bill_number: row.bill_number });
        }
    });
};

export {
    ClearData,
    Validations,
    getCashiersAndShiftMAP,
    getBillDetails,
    BillSearch
};
