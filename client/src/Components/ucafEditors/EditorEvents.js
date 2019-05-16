import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import Enumerable from "linq";
import AlgaehSearch from "../Wrapper/globalSearch";
import GlobalVariables from "../../utils/GlobalVariables.json";
import { SetBulkState } from "../../utils/GlobalFunctions";

export default function EditorEvents() {
  return {

    ChangeEventHandler: ($this, e) => {
      debugger
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      $this.setState({
        [name]: value
      });
    },

    dcafradioChange: ($this, e) => {
      debugger
      let value = e.target.value
      switch (e.target.name) {

        case "regular_dental_trt":
          value = $this.state.regular_dental_trt ==="Y" ? "N" : "Y"
          $this.setState({
            regular_dental_trt: value
          });
          break;
        case "dental_cleaning":
          value = $this.state.dental_cleaning ==="Y" ? "N" : "Y"
          $this.setState({
            dental_cleaning: value
          });
          break;
        case "RTA":
          value = $this.state.RTA ==="Y" ? "N" : "Y"
          $this.setState({
            RTA: value
          });
          break;

        case "work_related":
          value = $this.state.work_related ==="Y" ? "N" : "Y"
          $this.setState({
            work_related: value
          });
          break;

        case "patient_marital_status":
          $this.setState({
            patient_marital_status: value
          });
          break;

        case "new_visit_patient":
          $this.setState({
            new_visit_patient: value
          });
          break;
        default:
          break;
      }
    },

    ucafradioChange: ($this, e) => {
      debugger
      let value = e.target.value
      switch (e.target.name) {

        case "patient_complaint_type":
          $this.setState({
            patient_complaint_type: value
          });
          break;


        case "patient_marital_status":
          $this.setState({
            patient_marital_status: value
          });
          break;

        case "patient_emergency_case":
          $this.setState({
            patient_emergency_case: value
          });
          break;
        default:
          break;
      }
    },

    radioChange:($this, e) =>{
      switch (e.target.name) {

        case "patient_marital_status":
          $this.setState({
            patient_marital_status: e.target.value
          });
          break;
        case "multi_coated":
          $this.setState({
            multi_coated: !$this.state.multi_coated
          });
          break;
        case "varilux":
          $this.setState({
            varilux: !$this.state.varilux
          });
          break;

        case "light":
          $this.setState({
            light: !$this.state.light
          });
          break;

        case "aspheric":
          $this.setState({
            aspheric: !$this.state.aspheric
          });
          break;

        case "bifocal":
          $this.setState({
            bifocal: !$this.state.bifocal
          });
          break;

        case "medium":
          $this.setState({
            medium: !$this.state.medium
          });
          break;

        case "lenticular":
          $this.setState({
            lenticular: !$this.state.lenticular
          });
          break;

        case "single_vision":
          $this.setState({
            single_vision: !$this.state.single_vision
          });
          break;
        case "dark":
          $this.setState({
            dark: !$this.state.dark
          });
          break;
        case "safety_thickness":
          $this.setState({
            safety_thickness: !$this.state.safety_thickness
          });
          break;
        case "anti_reflecting_coating":
          $this.setState({
            anti_reflecting_coating: !$this.state.anti_reflecting_coating
          });
          break;
        case "photosensitive":
          $this.setState({
            photosensitive: !$this.state.photosensitive
          });
          break;
        case "high_index":
          $this.setState({
            high_index: !$this.state.high_index
          });
          break;
        case "colored":
          $this.setState({
            colored: !$this.state.colored
          });
          break;

        case "anti_scratch":
          $this.setState({
            anti_scratch: !$this.state.anti_scratch
          });
          break;

        case "contact_lense_type":
          $this.setState({
            contact_lense_type: e.target.value
          });
          break;

        case "resgular_lense_type":
          $this.setState({
            resgular_lense_type: e.target.value
          });
          break;


        case "frames":
          $this.setState({
            frames: e.target.value
          });
          break;

        default:
          break;
      }
    },

    saveAndPrintOcaf:($this, e) => {
      debugger
      // const _hims_f_ocaf_header = $this.props.dataProps.hims_f_ocaf_header[0];

      let inputObj = {
        hims_f_ocaf_header_id:$this.state.hims_f_ocaf_header_id,
        dv_right_sch:$this.state.dv_right_sch,
        dv_right_cyl:$this.state.dv_right_cyl,
        dv_right_axis:$this.state.dv_right_axis,
        dv_right_vision:$this.state.dv_right_vision,
        nv_right_sch:$this.state.nv_right_sch,
        nv_right_cyl:$this.state.nv_right_cyl,
        nv_right_vision:$this.state.nv_right_vision,
        dv_left_sch:$this.state.dv_left_sch,
        dv_left_cyl:$this.state.dv_left_cyl,
        dv_left_axis:$this.state.dv_left_axis,
        dv_left_vision:$this.state.dv_left_vision,
        nv_left_sch:$this.state.nv_left_sch,
        nv_left_cyl:$this.state.nv_left_cyl,
        nv_left_axis:$this.state.nv_left_axis,
        nv_left_vision:$this.state.nv_left_vision,
        resgular_lense_type:$this.state.resgular_lense_type,
        patient_marital_status:$this.state.patient_marital_status,
        frames: $this.state.frames,
        no_pairs: $this.state.no_pairs,
        eye_pd1:$this.state.eye_pd1,
        eye_pd2:$this.state.eye_pd2,

        right_bifocal_add: $this.state.right_bifocal_add,
        left_bifocal_add:$this.state.left_bifocal_add,
        vertical_add:$this.state.vertical_add,

        estimated_cost: $this.state.estimated_cost,
        lense_cost:$this.state.lense_cost,
        frame_cost:$this.state.frame_cost,

        multi_coated:$this.state.multi_coated === true?"Y":"N",
        varilux:$this.state.varilux === true?"Y":"N",
        light:$this.state.light === true?"Y":"N",
        aspheric:$this.state.aspheric === true?"Y":"N",
        bifocal:$this.state.bifocal === true?"Y":"N",
        medium:$this.state.medium === true?"Y":"N",
        lenticular:$this.state.lenticular === true?"Y":"N",
        single_vision:$this.state.single_vision === true?"Y":"N",
        dark:$this.state.dark === true?"Y":"N",
        safety_thickness:$this.state.safety_thickness === true?"Y":"N",
        anti_reflecting_coating:$this.state.anti_reflecting_coating === true?"Y":"N",
        photosensitive:$this.state.photosensitive === true?"Y":"N",
        high_index:$this.state.high_index === true?"Y":"N",
        colored:$this.state.colored === true?"Y":"N",
        anti_scratch:$this.state.anti_scratch === true?"Y":"N",
        contact_lense_type:$this.state.contact_lense_type
      }

      algaehApiCall({
        uri: "/ocaf/updateOcafDetails",
        data: inputObj,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            algaehApiCall({
              uri: "/report",
              method: "GET",
              module: "reports",
              headers: {
                Accept: "blob"
              },
              others: { responseType: "blob" },
              data: {
                report: {
                  reportName: "ocaf",
                  reportParams: [
                    {
                      name: "hims_d_patient_id",
                      value: $this.state.patient_id
                    },
                    { name: "visit_id", value: $this.state.visit_id },
                    { name: "visit_date", value: null }
                  ],
                  outputFileType: "PDF" //"EXCEL", //"PDF",
                }
              },
              onSuccess: res => {
                let reader = new FileReader();
                reader.onloadend = () => {
                  let myWindow = window.open(
                    "{{ product.metafields.google.custom_label_0 }}",
                    "_blank"
                  );
                  myWindow.document.write(
                    "<embed src= '" + reader.result + "' width='100%' height='100%' />"
                  );
                  myWindow.document.title = "Algaeh OCAF 2.0";
                };

                reader.readAsDataURL(res.data);
              }
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
    },


    saveAndPrintDcaf:($this, e) => {
      debugger
      algaehApiCall({
        uri: "/dcaf/updateDcafDetails",
        data: $this.state,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            algaehApiCall({
              uri: "/report",
              method: "GET",
              module: "reports",
              headers: {
                Accept: "blob"
              },
              others: { responseType: "blob" },
              data: {
                report: {
                  reportName: "dcaf",
                  reportParams: [
                    {
                      name: "hims_d_patient_id",
                      value: $this.state.patient_id
                    },
                    { name: "visit_id", value: $this.state.visit_id },
                    { name: "visit_date", value: null }
                  ],
                  outputFileType: "PDF" //"EXCEL", //"PDF",
                }
              },
              onSuccess: res => {
                let reader = new FileReader();
                reader.onloadend = () => {
                  let myWindow = window.open(
                    "{{ product.metafields.google.custom_label_0 }}",
                    "_blank"
                  );
                  myWindow.document.write(
                    "<embed src= '" + reader.result + "' width='100%' height='100%' />"
                  );
                  myWindow.document.title = "Algaeh DCAF 2.0";
                };

                reader.readAsDataURL(res.data);
              }
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

  };
}
