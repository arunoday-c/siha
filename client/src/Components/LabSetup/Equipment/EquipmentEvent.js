import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import Enumerable from "linq";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import _ from "lodash";

const changeTexts = ($this, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    $this.setState({ [name]: value });
};

const addToList = ($this) => {
    if ($this.state.machine_id === null) {
        swalMessage({
            title: "Select Machine.",
            type: "warning"
        });
        document.querySelector("[name='machine_id']").focus();
        return
    }
    AlgaehValidation({
        alertTypeIcon: "warning",
        querySelector: "data-validate='MachineAnalyteDetails'",
        onSuccess: () => {
            let analytes_data = $this.state.analytes_data
            let insert_analytes_data = $this.state.insert_analytes_data
            let InsertObj = {
                machine_analyte_code: $this.state.machine_analyte_code,
                machine_analyte_name: $this.state.machine_analyte_name,
                analyte_id: $this.state.analyte_id,
                analyte_name: $this.state.analyte_name
            }
            analytes_data.push(InsertObj)
            if ($this.state.hims_m_machine_analytes_header_id !== null) {
                InsertObj.machine_analytes_header_id = $this.state.hims_m_machine_analytes_header_id
                insert_analytes_data.push(InsertObj)
            }
            $this.setState({
                analytes_data: analytes_data,
                insert_analytes_data: insert_analytes_data,
                machine_analyte_code: null,
                machine_analyte_name: null,
                analyte_id: null,
                analyte_name: null,
                saveEnable: false
            })

        }
    });
};

const analyteEvent = ($this, e) => {

    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    $this.setState({ [name]: value, analyte_name: e.selected.description });
};

const deleteAnalyteMap = ($this, row) => {
    swal({
        title: "Are you sure you want to delete this Analytes?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No"
    }).then(willDelete => {
        if (willDelete.value) {
            let analytes_data = $this.state.analytes_data
            let insert_analytes_data = $this.state.insert_analytes_data
            let delete_analytes_data = $this.state.delete_analytes_data
            let _index = analytes_data.indexOf(row)
            analytes_data.splice(_index, 1);

            if (row.hims_m_machine_analytes_detail_id === null) {
                let _insert_index = analytes_data.indexOf(row)
                insert_analytes_data.splice(_insert_index, 1);
            } else {
                delete_analytes_data.push(row)
            }

            $this.setState({
                analytes_data: analytes_data,
                insert_analytes_data: insert_analytes_data,
                delete_analytes_data: delete_analytes_data,
                saveEnable: analytes_data.length === 0 ? true : false
            })
        }
    });
}

const saveMachineAnalyte = ($this) => {

    if ($this.state.hims_m_machine_analytes_header_id === null) {

        const machine_Exists = _.find($this.props.machine_ana_data, f => f.machine_id === $this.state.machine_id);

        if (Object.keys(machine_Exists).length > 0) {
            swalMessage({
                title: "Selected Machine alreacy exists . .",
                type: "error"
            });
            return
        }

        algaehApiCall({
            uri: "/labmasters/insertMachineAnalytesMap",
            module: "laboratory",
            data: $this.state,
            method: "POST",
            onSuccess: response => {
                if (response.data.success) {
                    swalMessage({
                        title: "Saved successfully . .",
                        type: "success"
                    });

                    $this.setState({
                        hims_m_machine_analytes_header_id: null,
                        machine_id: null,
                        machine_analyte_code: null,
                        machine_analyte_name: null,
                        analyte_id: null,
                        analytes_data: [],
                        analyte_name: null,
                        saveEnable: true,
                        insert_analytes_data: [],
                        delete_analytes_data: []
                    }, () => {
                        $this.props.onClose && $this.props.onClose(false);
                    })
                }
            }
        });
    } else {
        algaehApiCall({
            uri: "/labmasters/updateMachineAnalytesMap",
            module: "laboratory",
            data: $this.state,
            method: "PUT",
            onSuccess: response => {
                if (response.data.success) {
                    swalMessage({
                        title: "Updated successfully . .",
                        type: "success"
                    });

                    $this.setState({
                        hims_m_machine_analytes_header_id: null,
                        machine_id: null,
                        machine_analyte_code: null,
                        machine_analyte_name: null,
                        analyte_id: null,
                        analytes_data: [],
                        analyte_name: null,
                        saveEnable: true,
                        insert_analytes_data: [],
                        delete_analytes_data: []
                    }, () => {
                        $this.props.onClose && $this.props.onClose(false);
                    })
                }
            }
        });
    }

};

const getMachineAnalyte = ($this) => {
    algaehApiCall({
        uri: "/labmasters/selectMachineAnalytesMap",
        module: "laboratory",
        method: "GET",
        onSuccess: response => {
            if (response.data.success) {
                let machine_ana_data = Enumerable.from(response.data.records)
                    .groupBy("$.hims_m_machine_analytes_header_id", null, (k, g) => {
                        let firstRecordSet = Enumerable.from(g).firstOrDefault();
                        return {
                            hims_m_machine_analytes_header_id: firstRecordSet.hims_m_machine_analytes_header_id,
                            machine_id: firstRecordSet.machine_id,
                            machine_name: firstRecordSet.machine_name,
                            created_by: firstRecordSet.created_by,
                            hospital_name: firstRecordSet.hospital_name,
                            analytes_data: g.getSource()
                        };
                    })
                    .toArray();
                $this.setState({ machine_ana_data: machine_ana_data });
            }
        }
    });
};

export {
    changeTexts,
    addToList,
    analyteEvent,
    deleteAnalyteMap,
    saveMachineAnalyte,
    getMachineAnalyte
};
