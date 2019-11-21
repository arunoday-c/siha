import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

const dropDownHandle = ($this, value) => {
    $this.setState({ [value.name]: value.value });
};
const textHandle = ($this, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    $this.setState({ [name]: value });
}

const resetSaveState = ($this) => {
    $this.setState({
        group_code: null,
        group_name: null,
        arabic_group_name: null,
        antibiotic_id: null,
        group_type: null,
        group_types: null
    });
}


const updateMicroGroup = ($this, data) => {
    let send_data = {
        hims_d_micro_group_id: data.hims_d_micro_group_id,
        group_code: data.group_code,
        group_name: data.group_name,
        group_status: data.group_status,
        group_type: data.group_type,
        arabic_group_name: data.arabic_group_name,
        group_status: data.group_status
    };
    algaehApiCall({
        uri: "/labmasters/updateMicroGroup",
        method: "PUT",
        data: send_data,
        module: "laboratory",

        onSuccess: response => {
            if (response.data.success) {
                swalMessage({
                    title: "Record updated successfully",
                    type: "success"
                });
                getmicroGroups($this);
            }
        },
        onFailure: error => {
            swalMessage({
                title: error.message,
                type: "error"
            });
        }
    });
}

const getmicroGroups = ($this) => {
    algaehApiCall({
        uri: "/labmasters/selectMicroGroup",
        module: "laboratory",
        method: "GET",
        onSuccess: response => {
            if (response.data.success) {
                $this.setState({ microGroups: response.data.records });
            }
        },
        onFailure: error => {
            swalMessage({
                title: error.message,
                type: "error"
            });
        }
    });

    $this.props.getAntibiotic({
        uri: "/labmasters/selectAntibiotic",
        module: "laboratory",
        method: "GET",
        data: { antibiotic_status: "A" },
        redux: {
            type: "ANTIBIOTIC_GET_DATA",
            mappingName: "antibiotic"
        }
    });
}



const updateGroupAntiMap = ($this, data) => {
    let send_data = {
        hims_m_group_antibiotic_id: data.hims_m_group_antibiotic_id,
        micro_group_id: data.micro_group_id,
        antibiotic_id: data.antibiotic_id,
        group_types: data.group_types,
        map_status: data.map_status
    };
    algaehApiCall({
        uri: "/labmasters/updateGroupAntiMap",
        method: "PUT",
        data: send_data,
        module: "laboratory",

        onSuccess: response => {
            if (response.data.success) {
                swalMessage({
                    title: "Record updated successfully",
                    type: "success"
                });
                getAllGroupAntibiotic($this, data.micro_group_id);
            }
        },
        onFailure: error => {
            swalMessage({
                title: error.message,
                type: "error"
            });
        }
    });
}

const getAllGroupAntibiotic = ($this, id) => {
    algaehApiCall({
        uri: "/labmasters/selectGroupAntiMap",
        module: "laboratory",
        data: { micro_group_id: id },
        method: "GET",
        onSuccess: response => {
            if (response.data.success) {
                $this.setState({ microAntbiotic: response.data.records });
            }
        },
        onFailure: error => {
            swalMessage({
                title: error.message,
                type: "error"
            });
        }
    });

}

const getGroupComments = ($this, id) => {

    algaehApiCall({
        uri: "/labmasters/getGroupComments",
        module: "laboratory",
        data: { micro_group_id: id },
        method: "GET",
        onSuccess: response => {
            if (response.data.success) {
                $this.setState({
                    comments_data: response.data.records,
                    commnet_name: null,
                    commet: ""
                });
            }
        },
        onFailure: error => {
            swalMessage({
                title: error.message,
                type: "error"
            });
        }
    });
}
const changeGridEditors = ($this, row, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
}

const addGroupAntibiotic = ($this, data, e) => {
    getAllGroupAntibiotic($this, data.hims_d_micro_group_id);
    getGroupComments($this, data.hims_d_micro_group_id);
    $this.setState({
        showGroupAntibiotic: true,
        selected_group_name: data.group_name,
        hims_d_micro_group_id: data.hims_d_micro_group_id
    });
}

const addGroupAntiMap = ($this, e) => {
    e.preventDefault();
    AlgaehValidation({
        querySelector: "data-validate='subdepDiv'",
        alertTypeIcon: "warning",
        onSuccess: () => {
            let sen_data = {
                micro_group_id: $this.state.hims_d_micro_group_id,
                antibiotic_id: $this.state.antibiotic_id,
                group_types: $this.state.group_types
            };

            algaehApiCall({
                uri: "/labmasters/insertGroupAntiMap",
                method: "POST",
                data: sen_data,
                module: "laboratory",
                onSuccess: response => {
                    if (response.data.success) {
                        swalMessage({
                            title: "Added Successfully",
                            type: "success"
                        });
                        resetSaveState($this);
                        getAllGroupAntibiotic($this, $this.state.hims_d_micro_group_id);
                    }
                },
                onFailure: error => {
                    swalMessage({
                        title: error.message,
                        type: "error"
                    });
                }
            });
        }
    });
}

const addMicroGroup = ($this, e) => {
    e.preventDefault();

    AlgaehValidation({
        alertTypeIcon: "warning",
        onSuccess: () => {
            let send_data = {
                group_code: $this.state.group_code,
                group_name: $this.state.group_name,
                group_status: $this.state.group_status,
                group_type: $this.state.group_type,
                arabic_group_name: $this.state.arabic_group_name
            };

            algaehApiCall({
                uri: "/labmasters/insertMicroGroup",
                method: "POST",
                data: send_data,
                module: "laboratory",
                onSuccess: response => {
                    if (response.data.success) {
                        swalMessage({
                            title: "Added Successfully",
                            type: "success"
                        });
                        resetSaveState($this);
                        getmicroGroups($this);
                    }
                },
                onFailure: error => {
                    swalMessage({
                        title: error.message,
                        type: "error"
                    });
                }
            });
        }
    });
}

const onClose = ($this) => {
    $this.setState({
        selected_group_name: null,
        microAntbiotic: [],
        showGroupAntibiotic: false,
        commet: "",
        commnet_name: null
    });
}

//Comments Part
const addComments = ($this) => {

    AlgaehValidation({
        alertTypeIcon: "warning",
        querySelector: "data-validate='group_comments_data'",
        onSuccess: () => {
            if ($this.state.commet === "") {
                swalMessage({
                    type: "warning",
                    title: "Enter Commets"
                });
                return;
            }
            let IntObj = {
                micro_group_id: $this.state.hims_d_micro_group_id,
                commnet_name: $this.state.commnet_name,
                commet: $this.state.commet
            };
            algaehApiCall({
                uri: "/labmasters/addGroupComments",
                module: "laboratory",
                data: IntObj,
                onSuccess: response => {
                    if (response.data.success === true) {
                        getGroupComments($this, $this.state.hims_d_micro_group_id);
                        swalMessage({
                            type: "success",
                            title: "Added successfully . ."
                        });
                    }
                }
            });
        }
    });
}

const updateComments = ($this, row) => {
    algaehApiCall({
        uri: "/labmasters/updateGroupComments",
        module: "laboratory",
        data: row,
        method: "PUT",
        onSuccess: response => {
            if (response.data.success === true) {
                swalMessage({
                    type: "success",
                    title: "Updated successfully . ."
                });
            }
        }
    });
}


const onchangegridcol = ($this, row, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
}

export {
    dropDownHandle,
    textHandle,
    updateMicroGroup,
    getmicroGroups,
    updateGroupAntiMap,
    changeGridEditors,
    addGroupAntibiotic,
    addGroupAntiMap,
    addMicroGroup,
    onClose,
    addComments,
    updateComments,
    onchangegridcol
};
