import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import AlgaehSearch from "../../Wrapper/globalSearch";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { SetBulkState } from "../../../utils/GlobalFunctions";

export default function EyeModalEvent() {
  return {

    ChangeEventHandler: ($this, e) => {
      
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      $this.setState({
        [name]: value
      });
    },

    DVRightEventHandler:($this, e) => {
      

      $this.setState({
        cva_dv_right: e.target.value
      });
    },

    SaveGlassPrescription:($this) => {
      
      let inputObj = {
        patient_id: Window.global["current_patient"],
        visit_id:Window.global["visit_id"],
        provider_id:Window.global["provider_id"],
        prescription_date:$this.state.prescription_date,
        pgp_power_right_odsph:$this.state.pgp_power_right_odsph,
        pgp_power_right_odcyl:$this.state.pgp_power_right_odcyl,
        pgp_power_right_odaxis:$this.state.pgp_power_right_odaxis,
        pgp_power_right_odadd:$this.state.pgp_power_right_odadd,
        // pgp_power_right_ossph:$this.state.pgp_power_right_ossph,
        // pgp_power_right_oscyl:$this.state.pgp_power_right_oscyl,
        // pgp_power_right_osaxis:$this.state.pgp_power_right_osaxis,
        // pgp_power_right_osadd:$this.state.pgp_power_right_osadd,
        pgp_power_left_odsph:$this.state.pgp_power_left_odsph,
        pgp_power_left_odcyl:$this.state.pgp_power_left_odcyl,
        pgp_power_left_odaxis:$this.state.pgp_power_left_odaxis,
        pgp_power_left_odadd:$this.state.pgp_power_left_odadd,
        // pgp_power_left_ossph:$this.state.pgp_power_left_ossph,
        // pgp_power_left_oscyl:$this.state.pgp_power_left_oscyl,
        // pgp_power_left_osaxis:$this.state.pgp_power_left_osaxis,
        // pgp_power_left_osadd:$this.state.pgp_power_left_osadd,
        cva_specs:$this.state.cva_specs,
        cva_dv_right:$this.state.cva_dv_right,
        cva_dv_left:$this.state.cva_dv_left,
        cva_nv_right:$this.state.cva_nv_right,
        cva_nv_left:$this.state.cva_nv_left,
        auto_ref_right_sch:$this.state.auto_ref_right_sch,
        auto_ref_right_cyl:$this.state.auto_ref_right_cyl,
        auto_ref_right_axis:$this.state.auto_ref_right_axis,
        auto_ref_left_sch:$this.state.auto_ref_left_sch,
        auto_ref_left_cyl:$this.state.auto_ref_left_cyl,
        auto_ref_left_axis:$this.state.auto_ref_left_axis,
        bcva_dv_right_sch:$this.state.bcva_dv_right_sch,
        bcva_dv_right_cyl:$this.state.bcva_dv_right_cyl,
        bcva_dv_right_axis:$this.state.bcva_dv_right_axis,
        bcva_dv_right_vision:$this.state.bcva_dv_right_vision,
        bcva_nv_right_sch:$this.state.bcva_nv_right_sch,
        bcva_nv_right_cyl:$this.state.bcva_nv_right_cyl,
        bcva_nv_right_axis:$this.state.bcva_nv_right_axis,
        bcva_nv_right_vision:$this.state.bcva_nv_right_vision,
        bcva_dv_left_sch:$this.state.bcva_dv_left_sch,
        bcva_dv_left_cyl:$this.state.bcva_dv_left_cyl,
        bcva_dv_left_axis:$this.state.bcva_dv_left_axis,
        bcva_dv_left_vision:$this.state.bcva_dv_left_vision,
        bcva_nv_left_sch:$this.state.bcva_nv_left_sch,
        bcva_nv_left_cyl:$this.state.bcva_nv_left_cyl,
        bcva_nv_left_axis:$this.state.bcva_nv_left_axis,
        bcva_nv_left_vision:$this.state.bcva_nv_left_vision,
        k1_right:$this.state.k1_right,
        k2_right:$this.state.k2_right,
        axis_right:$this.state.axis_right,
        k1_left:$this.state.k1_left,
        k2_left:$this.state.k2_left,
        axis_left:$this.state.axis_left,
        bcva_dv_right_prism:$this.state.bcva_dv_right_prism,
        bcva_dv_right_bc:$this.state.bcva_dv_right_bc,
        bcva_dv_right_dia:$this.state.bcva_dv_right_dia,
        bcva_nv_right_prism:$this.state.bcva_nv_right_prism,
        bcva_nv_right_bc:$this.state.bcva_nv_right_bc,
        bcva_nv_right_dia:$this.state.bcva_nv_right_dia,
        bcva_dv_left_prism:$this.state.bcva_dv_left_prism,
        bcva_dv_left_bc:$this.state.bcva_dv_left_bc,
        bcva_dv_left_dia:$this.state.bcva_dv_left_dia,
        bcva_nv_left_prism:$this.state.bcva_nv_left_prism,
        bcva_nv_left_bc:$this.state.bcva_nv_left_bc,
        bcva_nv_left_dia:$this.state.bcva_nv_left_dia,
        pachy_right:$this.state.pachy_right,
        pachy_left:$this.state.pachy_left,
        w_wcs_right:$this.state.w_wcs_right,
        w_wcs_left:$this.state.w_wcs_left,
        ac_depth_right:$this.state.ac_depth_right,
        ac_depth_left:$this.state.ac_depth_left,
        ipd_right:$this.state.ipd_right,
        ipd_left:$this.state.ipd_left,
        color_vision_wnl_right:$this.state.color_vision_wnl_right,
        color_vision_wnl_left:$this.state.color_vision_wnl_left,
        confrontation_fields_full_right:$this.state.confrontation_fields_full_right,
        confrontation_fields_full_left:$this.state.confrontation_fields_full_left,
        pupils_errl_right:$this.state.pupils_errl_right,
        pupils_errl_left:$this.state.pupils_errl_left,
        cover_test_ortho_right:$this.state.cover_test_ortho_right,
        cover_test_ortho_left:$this.state.cover_test_ortho_left,
        covergence:$this.state.covergence,
        safe_fesa:$this.state.safe_fesa,

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

        cl_type:$this.state.cl_type,
        remarks:$this.state.remarks
      }

      
      if($this.state.hims_f_glass_prescription_id === null){
        algaehApiCall({
          uri: "/opthometry/addGlassPrescription",
          data: inputObj,
          method: "POST",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Recorded Successfully...",
                type: "success"
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
      }else{
        inputObj.hims_f_glass_prescription_id = $this.state.hims_f_glass_prescription_id
        algaehApiCall({
          uri: "/opthometry/updateGlassPrescription",
          data: inputObj,
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Recorded Successfully...",
                type: "success"
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
    },

    radioChange:($this, e) =>{
      switch (e.target.name) {

        case "cl_type":
          $this.setState({
            cl_type: e.target.value
          });
        break;

        case "cva_specs":
          $this.setState({
            cva_specs: e.target.value
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

        default:
          break;
      }
    }

  };
}
