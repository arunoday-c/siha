import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import Enumerable from "linq";
import { AlgaehValidation } from "../../utils/GlobalFunctions";
import moment from "moment";

export default function PhysioTherapyEvent() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },

    ongridtexthandle: ($this, row, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let physiotherapy_treatment_detail =
        $this.state.physiotherapy_treatment_detail;
      let _index = physiotherapy_treatment_detail.indexOf(row);

      row[name] = value;
      physiotherapy_treatment_detail[_index] = row;
      $this.setState({
        physiotherapy_treatment_detail: physiotherapy_treatment_detail
      });
    },

    gridOndateHandler: ($this, row, e) => {
      let physiotherapy_treatment_detail =
        $this.state.physiotherapy_treatment_detail;
      let _index = physiotherapy_treatment_detail.indexOf(row);

      row["session_date"] = moment(e)._d;
      physiotherapy_treatment_detail[_index] = row;
      $this.setState({
        physiotherapy_treatment_detail: physiotherapy_treatment_detail
      });
    },

    getPhysiotherapyTreatment: $this => {
      algaehApiCall({
        uri: "/physiotherapy/getPhysiotherapyTreatment",
        module: "frontDesk",
        method: "GET",
        onSuccess: res => {
          if (res.data.success) {
            let Physiotherapy_Treatment = Enumerable.from(res.data.records)
              .groupBy("$.visit_id", null, (k, g) => {
                let firstRecordSet = Enumerable.from(g).firstOrDefault();
                return {
                  hims_f_physiotherapy_header_id:
                    firstRecordSet.hims_f_physiotherapy_header_id,
                  physioth_diagnosis: firstRecordSet.physioth_diagnosis,
                  no_of_session: firstRecordSet.no_of_session,
                  patient_code: firstRecordSet.patient_code,
                  full_name: firstRecordSet.full_name,
                  ordered_date: firstRecordSet.ordered_date,
                  physiotherapy_treatment_detail:
                    firstRecordSet.hims_f_physiotherapy_detail_id === null
                      ? []
                      : g.getSource(),
                  provider_id: firstRecordSet.provider_id,
                  billed: firstRecordSet.billed,
                  doctor_name: firstRecordSet.doctor_name,
                  physiotherapy_status:
                    firstRecordSet.physiotherapy_status === "A"
                      ? "Active"
                      : "Completed",
                  data_exists:
                    firstRecordSet.hims_f_physiotherapy_detail_id === null
                      ? false
                      : true
                };
              })
              .toArray();

            $this.setState({
              PhysiotherapyPatient: Physiotherapy_Treatment
            });
          }
        }
      });
    },

    AddtoList: $this => {
      AlgaehValidation({
        alertTypeIcon: "warning",
        querySelector: "data-validate='demographicDetails'",
        onSuccess: () => {
          let data = $this.state.physiotherapy_treatment_detail;
          if (data.length === parseInt($this.state.no_of_session)) {
            swalMessage({
              title: "Cannot add more than No. of Sessions",
              type: "warning"
            });
            return;
          }
          data.push({
            session_status: "P",
            physiotherapy_header_id: $this.state.hims_f_physiotherapy_header_id,
            session_date: $this.state.session_date,
            session_time: $this.state.session_time,
            physiotherapy_type: $this.state.physiotherapy_type,
            others_specify: $this.state.others_specify,
            treatment_remarks: $this.state.treatment_remarks
          });

          $this.setState({
            physiotherapy_treatment_detail: data,
            session_date: null,
            session_time: null,
            physiotherapy_type: null,
            others_specify: null,
            treatment_remarks: null
          });
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    },

    savePhysiotherapyTreatment: $this => {
      if ($this.state.physiotherapy_treatment_detail.length === 0) {
        swalMessage({
          title: "Please add atleast one session to save",
          type: "warning"
        });
        return;
      }
      algaehApiCall({
        uri: "/physiotherapy/savePhysiotherapyTreatment",
        module: "frontDesk",
        method: "POST",
        data: $this.state,
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Saved Succesfully",
              type: "success"
            });
          }
        },
        onFailure: error => {
          // AlgaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  };
}
