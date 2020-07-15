import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

const changeTexts = ($this, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    $this.setState({ [name]: value });
};

const resetState = $this => {
    $this.setState($this.baseState);
};

const onchangegridcol = ($this, row, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
};

const updateLabAnalytes = ($this, data) => {
    // data.updated_by = getCookie("UserID");

    algaehApiCall({
        uri: "/doctorsWorkBench/updateAllergy",
        data: data,
        method: "PUT",
        onSuccess: response => {
            if (response.data.success) {
                swalMessage({
                    title: "Record updated successfully . .",
                    type: "success"
                });
                $this.props.getAllAllergies({
                    uri: "/doctorsWorkBench/getAllAllergies",
                    method: "GET",
                    cancelRequestId: "getAllAllergies",
                    redux: {
                        type: "ALL_ALLERGIES",
                        mappingName: "allallergies"
                    }
                });
            }
        },
        onFailure: error => { }
    });
};

const insertLabAnalytes = ($this, e) => {
    e.preventDefault();

    AlgaehValidation({
        alertTypeIcon: "warning",
        onSuccess: () => {
            algaehApiCall({
                uri: "/doctorsWorkBench/addAllergy",
                data: $this.state,
                onSuccess: response => {
                    if (response.data.success === true) {
                        resetState($this);
                        //Handle Successful Add here
                        $this.props.getAllAllergies({
                            uri: "/doctorsWorkBench/getAllAllergies",
                            method: "GET",
                            cancelRequestId: "getAllAllergies",
                            redux: {
                                type: "ALL_ALLERGIES",
                                mappingName: "allallergies"
                            }
                        });
                        swalMessage({
                            title: "Allergy added successfully",
                            type: "success"
                        });
                    } else {
                        //Handle unsuccessful Add here.
                    }
                }
            });
        }
    });
};

export {
    changeTexts,
    onchangegridcol,
    insertLabAnalytes,
    updateLabAnalytes
};
