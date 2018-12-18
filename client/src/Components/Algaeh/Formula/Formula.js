import React, { Component } from "react";
import "./formula.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class Formula extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formulas: []
    };
    this.getFormulas();
  }

  getFormulas() {
    algaehApiCall({
      uri: "/algaehMasters/getFormulas",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            formulas: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "success"
        });
      }
    });
  }

  clearState() {
    this.setState({
      algaeh_d_formulas_id: "",
      formula_for: "",
      formula: ""
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  addFormulas() {
    algaehApiCall({
      uri: "/algaehMasters/addFormula",
      method: "POST",
      data: {
        algaeh_d_formulas_id: this.state.algaeh_d_formulas_id,
        formula_for: this.state.formula_for,
        formula: this.state.formula
      },
      onSuccess: response => {
        if (response.data.success) {
          this.getFormulas();
          this.clearState();
          swalMessage({
            title: "Added Successfully",
            type: "success"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "success"
        });
      }
    });
  }
  deleteformulas() {}
  updateformulas() {}

  render() {
    return (
      <div className="formulas">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "formula id",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "algaeh_d_formulas_id",
                value: this.state.algaeh_d_formulas_id,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Formula For",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "formula_for",
                value: this.state.formula_for,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Formula",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "formula",
                value: this.state.formula,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <div className="col-lg-3">
              <button
                type="submit"
                style={{ marginTop: 21 }}
                onClick={this.addFormulas.bind(this)}
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>

          <div data-validate="shiftDiv" id="algaehGrid_Cntr">
            <AlgaehDataGrid
              id="shift-grid"
              datavalidate="data-validate='shiftDiv'"
              columns={[
                {
                  fieldName: "algaeh_d_formulas_id",
                  label: "Formula ID"
                },
                {
                  fieldName: "formula_for",
                  label: "Formula For"
                },

                {
                  fieldName: "formula",
                  label: "Formula"
                }
              ]}
              keyId="algaeh_d_module_id"
              dataSource={{
                data: this.state.formulas
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteformulas.bind(this),
                onDone: this.updateformulas.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Formula;
