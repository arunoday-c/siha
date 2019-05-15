import React, { Component } from "react";

import GlobalVariables from "../../../utils/GlobalVariables.json";
import "./Eye.css";
import {
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import EyeModalEvent from "./EyeModalEvent"
import OptometricIOputs from "../../../Models/Optometric";

export default class GlassPrescription extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {
    let IOputs = OptometricIOputs.inputParam();
    this.setState(IOputs);
  }

  onClose(e) {
    let IOputs = OptometricIOputs.inputParam();
    this.setState(IOputs,()=>{
      this.props.onClose && this.props.onClose(e);
    });
  }

  DVRightEventHandler(e){
    this.setState({
      cva_dv_right: e.target.value
    });
  }


  ChangeEventHandler(e){
    EyeModalEvent().ChangeEventHandler(this, e)
  }

  SaveGlassPrescription(){
    EyeModalEvent().SaveGlassPrescription(this)
  }

  radioChange(e){
    EyeModalEvent().radioChange(this, e)
  }

componentWillReceiveProps(newProps){
  debugger
  if(newProps.PrescriptionData !== undefined &&
    newProps.PrescriptionData.length !== 0){

      let data =newProps.PrescriptionData[0]
      this.setState({...this.state, ...data})
  }
}

  render() {
    return (
      <React.Fragment>

        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openGlassPres}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive" style={{overflow:"auto"}}>
              <table className="table table-bordered table-sm">
                <thead>

                  <tr>
                    <th />
                    <th />
                    <th colspan="4">Right Eye</th>
                    <th colspan="4">Left Eye</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="trHighlight">
                    <td />
                    <td />
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>ADD</td>
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>ADD</td>
                  </tr>
                  <tr>
                    <td rowspan="1">PGP Power</td>
                    <td />
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "pgp_power_right_odsph",
                          className: "select-fld",
                          value: this.state.pgp_power_right_odsph,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.POWER_GLASS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "pgp_power_right_odcyl",
                          className: "select-fld",
                          value: this.state.pgp_power_right_odcyl,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.POWER_GLASS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "pgp_power_right_odaxis",
                          className: "select-fld",
                          value: this.state.pgp_power_right_odaxis,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AXIS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "pgp_power_right_odadd",
                          className: "select-fld",
                          value: this.state.pgp_power_right_odadd,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.ADD_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>

                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "pgp_power_left_odsph",
                          className: "select-fld",
                          value: this.state.pgp_power_left_odsph,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.POWER_GLASS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "pgp_power_left_odcyl",
                          className: "select-fld",
                          value: this.state.pgp_power_left_odcyl,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.POWER_GLASS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>

                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "pgp_power_left_odaxis",
                          className: "select-fld",
                          value: this.state.pgp_power_left_odaxis,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AXIS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "pgp_power_left_odadd",
                          className: "select-fld",
                          value: this.state.pgp_power_left_odadd,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.ADD_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td rowspan="2">
                      CVA
                      <div className="customRadio">
                        <label className="radio inline">
                          <input
                            type="radio"
                            name="cva_specs"
                            value = "S"
                            checked={this.state.cva_specs === "S"?true : false}
                            onChange={this.radioChange.bind(this)}
                          />
                          <span>Specs</span>
                        </label>
                        <label className="radio inline">
                          <input
                            type="radio"
                            name="cva_specs"
                            value = "C"
                            checked={this.state.cva_specs === "C"?true : false}
                            onChange={this.radioChange.bind(this)}
                          />
                          <span>CL</span>
                        </label>
                      </div>
                    </td>
                    <td>DV</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "cva_dv_right",
                          value: this.state.cva_dv_right,
                          events: {
                            onChange: this.DVRightEventHandler.bind(this)
                          },
                          option: {
                            type: "text"
                          }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "cva_dv_left",
                          value: this.state.cva_dv_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: {
                            type: "text"
                          }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>NV</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "cva_nv_right",
                          value: this.state.cva_nv_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: {
                            type: "text"
                          }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "cva_nv_left",
                          value: this.state.cva_nv_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: {
                            type: "text"
                          },
                        }}
                      />
                    </td>
                  </tr>
                  <tr className="trHighlight">
                    <td />
                    <td />
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>Vision</td>
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>Vision</td>
                  </tr>
                  <tr>
                    <td>Auto Ref.</td>
                    <td />
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "auto_ref_right_sch",
                          className: "select-fld",
                          value:this.state.auto_ref_right_sch,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "auto_ref_right_cyl",
                          className: "select-fld",
                          value:this.state.auto_ref_right_cyl,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "auto_ref_right_axis",
                          className: "select-fld",
                          value:this.state.auto_ref_right_axis,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AXIS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td />
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "auto_ref_left_sch",
                          className: "select-fld",
                          value:this.state.auto_ref_left_sch,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "auto_ref_left_cyl",
                          className: "select-fld",
                          value:this.state.auto_ref_left_cyl,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                          data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "auto_ref_left_axis",
                          className: "select-fld",
                          value:this.state.auto_ref_left_axis,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AXIS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td />
                  </tr>
                  <tr>
                    <td rowspan="2">BCVA</td>
                    <td>DV</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_dv_right_sch",
                          className: "select-fld",
                          value:this.state.bcva_dv_right_sch,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_dv_right_cyl",
                          className: "select-fld",
                          value:this.state.bcva_dv_right_cyl,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_dv_right_axis",
                          className: "select-fld",
                          value: this.state.bcva_dv_right_axis,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AXIS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_dv_right_vision",
                          className: "select-fld",
                          value:this.state.bcva_dv_right_vision,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.DV_VISION_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_dv_left_sch",
                          className: "select-fld",
                          value:this.state.bcva_dv_left_sch,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_dv_left_cyl",
                          className: "select-fld",
                          value:this.state.bcva_dv_left_cyl,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_dv_left_axis",
                          className: "select-fld",
                          value: this.state.bcva_dv_left_axis,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AXIS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_dv_left_vision",
                          className: "select-fld",
                          value:this.state.bcva_dv_left_vision,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.DV_VISION_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>NV</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_nv_right_sch",
                          className: "select-fld",
                          value:this.state.bcva_nv_right_sch,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_nv_right_cyl",
                          value:this.state.bcva_nv_right_cyl,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_nv_right_axis",
                          className: "select-fld",
                          value:this.state.bcva_nv_right_axis,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AXIS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_nv_right_vision",
                          className: "select-fld",
                          value:this.state.bcva_nv_right_vision,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.NV_VISION_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_nv_left_sch",
                          className: "select-fld",
                          value:this.state.bcva_nv_left_sch,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_nv_left_cyl",
                          className: "select-fld",
                          value:this.state.bcva_nv_left_cyl,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AUTO_REF_SCH
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_nv_left_axis",
                          className: "select-fld",
                          value:this.state.bcva_nv_left_axis,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AXIS_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "bcva_nv_left_vision",
                          className: "select-fld",
                          value:this.state.bcva_nv_left_vision,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.NV_VISION_TYPE
                          },
                          onChange:this.ChangeEventHandler.bind(this)
                        }}
                      />
                    </td>
                  </tr>

                  <tr className="trHighlight">
                    <td rowspan="2">K Reading</td>
                    <td />
                    <td>K1</td>
                    <td>K2</td>
                    <td colspan="2">AXIS</td>
                    <td>K1</td>
                    <td>K2</td>
                    <td colspan="2">AXIS</td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "k1_right",
                          value: this.state.k1_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          others: { type: "number" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "k2_right",
                          value: this.state.k2_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          others: { type: "number" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "axis_right",
                          value: this.state.axis_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          others: { type: "number" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "k1_left",
                          value: this.state.k1_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          others: { type: "number" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "k2_left",
                          value: this.state.k2_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          others: { type: "number" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "axis_left",
                          value: this.state.axis_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          others: { type: "number" }
                        }}
                      />
                    </td>
                  </tr>

                  <tr className="trHighlight">
                    <td />
                    <td />
                    <td>Prism</td>
                    <td>BC</td>
                    <td colspan="2">DIA</td>
                    <td>Prism</td>
                    <td>BC</td>
                    <td colspan="2">DIA</td>
                  </tr>
                  <tr>
                    <td rowspan="2">BCVA</td>
                    <td>DV</td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_dv_right_prism",
                          value: this.state.bcva_dv_right_prism,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }

                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_dv_right_bc",
                          value: this.state.bcva_dv_right_bc,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_dv_right_dia",
                          value: this.state.bcva_dv_right_dia,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_dv_left_prism",
                          value: this.state.bcva_dv_left_prism,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_dv_left_bc",
                          value: this.state.bcva_dv_left_bc,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_dv_left_dia",
                          value: this.state.bcva_dv_left_dia,
                          option: { type: "text" },
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>NV</td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_nv_right_prism",
                          value: this.state.bcva_nv_right_prism,
                          option: { type: "text" },
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_nv_right_bc",
                          value: this.state.bcva_nv_right_bc,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_nv_right_dia",
                          value: this.state.bcva_nv_right_dia,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_nv_left_prism",
                          value: this.state.bcva_nv_left_prism,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_nv_left_bc",
                          value: this.state.bcva_nv_left_bc,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "bcva_nv_left_dia",
                          value: this.state.bcva_nv_left_dia,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Pachy</td>
                    <td />
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "pachy_right",
                          value: this.state.pachy_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "pachy_left",
                          value: this.state.pachy_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>W. to W (C.S)</td>
                    <td />
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "w_wcs_right",
                          value: this.state.w_wcs_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "w_wcs_left",
                          value: this.state.w_wcs_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>AC. Depth</td>
                    <td />
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "ac_depth_right",
                          value: this.state.ac_depth_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "ac_depth_left",
                          value: this.state.ac_depth_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>IPD</td>
                    <td />
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "ipd_right",
                          value: this.state.ipd_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>

                  </tr>
                  <tr>
                    <td>Color Vision (SC/CC)</td>
                    <td>WNL</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "color_vision_wnl_right",
                          value: this.state.color_vision_wnl_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "color_vision_wnl_left",
                          value: this.state.color_vision_wnl_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Confrontation Fields</td>
                    <td>Full</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "confrontation_fields_full_right",
                          value: this.state.confrontation_fields_full_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "confrontation_fields_full_left",
                          value: this.state.confrontation_fields_full_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>PUPILS</td>
                    <td>ERRL</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "pupils_errl_right",
                          value: this.state.pupils_errl_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "pupils_errl_left",
                          value: this.state.pupils_errl_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Cover Test (SC/CC)</td>
                    <td>Ortho</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "cover_test_ortho_right",
                          value: this.state.cover_test_ortho_right,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "cover_test_ortho_left",
                          value: this.state.cover_test_ortho_left,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Covergence</td>
                    <td />
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "covergence",
                          value: this.state.covergence,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4" />
                  </tr>
                  <tr>
                    <td>SAFE</td>
                    <td>FESA</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "safe_fesa",
                          value: this.state.safe_fesa,
                          events: {
                            onChange: this.ChangeEventHandler.bind(this)
                          },
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                  <tr>
                    <td rowspan="2">Advice</td>
                    <td />
                    <td colspan="8">
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="multi_coated"
                            checked={this.state.multi_coated}
                            onChange={this.radioChange.bind(this)}
                          />
                        <span>Multi Coated</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="varilux"
                            checked={this.state.varilux}
                            onChange={this.radioChange.bind(this)}
                          />
                        <span>Varilux</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="light"
                            checked={this.state.light}
                            onChange={this.radioChange.bind(this)}
                          />
                        <span>Light</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="aspheric"
                            checked={this.state.aspheric}
                            onChange={this.radioChange.bind(this)}
                          />
                        <span>Aspheric</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="bifocal"
                            checked={this.state.bifocal}
                            onChange={this.radioChange.bind(this)}
                          />
                          <span>Bifocal</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="medium"
                            checked={this.state.medium}
                            onChange={this.radioChange.bind(this)}
                          />
                        <span>Medium</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="lenticular"
                            checked={this.state.lenticular}
                            onChange={this.radioChange.bind(this)}
                          />
                        <span>Lenticular</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td colspan="8">
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="single_vision"
                            checked={this.state.single_vision}
                            onChange={this.radioChange.bind(this)}
                          />
                        <span>Single Vision</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="dark"
                            checked={this.state.dark}
                            onChange={this.radioChange.bind(this)}
                          />
                        <span>Dark</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="safety_thickness"
                            checked={this.state.safety_thickness}
                            onChange={this.radioChange.bind(this)}
                          />
                        <span>Safety Thickness</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="anti_reflecting_coating"
                            checked={this.state.anti_reflecting_coating}
                            onChange={this.radioChange.bind(this)}
                          />
                          <span>Anti-Reflection Coating</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="photosensitive"
                            checked={this.state.photosensitive}
                            onChange={this.radioChange.bind(this)}
                          />
                          <span>Photosensitive</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="high_index"
                            checked={this.state.high_index}
                            onChange={this.radioChange.bind(this)}
                          />
                          <span>High Index</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="colored"
                            checked={this.state.colored}
                            onChange={this.radioChange.bind(this)}
                          />
                          <span>Colored</span>
                        </label>


                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="anti_scratch"
                            checked={this.state.anti_scratch}
                            onChange={this.radioChange.bind(this)}
                          />
                          <span>Anti-Scratch</span>
                        </label>

                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">CL Type</td>
                      <div className="customRadio">
                        <label className="radio block">
                          <input
                            type="radio"
                            name="cl_type"
                            value = "P"
                            checked={this.state.cl_type === "P"?true : false}
                            onChange={this.radioChange.bind(this)}
                          />
                        <span>Permanent</span>
                        </label>
                        <label className="radio block">
                          <input
                            type="radio"
                            name="cl_type"
                            value = "D"
                            checked={this.state.cl_type === "D"?true : false}
                            onChange={this.radioChange.bind(this)}
                          />
                        <span>Disposable</span>
                        </label>
                      </div>
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                  <tr>
                    <td colspan="2" rowspan="2">
                      Remarks
                    </td>
                    <td colspan="8" rowspan="2">
                    <textarea
                      className="textArea"
                      value={
                       this.state.remarks
                      }
                      name="remarks"
                      onChange={this.ChangeEventHandler.bind(this)}
                    >
                      {this.state.remarks}
                    </textarea>
                    </td>
                  </tr>
                  <tr />
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                      onClick={this.SaveGlassPrescription.bind(this)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </React.Fragment>
    );
  }
}
