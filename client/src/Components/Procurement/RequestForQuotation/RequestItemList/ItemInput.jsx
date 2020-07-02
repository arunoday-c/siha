import React, { useState } from "react";

import AlgaehAutoSearch from "../../../Wrapper/autoSearch.js";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { swalMessage } from "../../../../utils/algaehApiCall";

import {
  AlagehFormGroup,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";

export function InputItem({
  quotation_for = "PHR",
  disabled = false,
  poitemcategory = [],
  poitemgroup = [],
  poitemuom = [],
  AddItem = () => {},
}) {
  const isPharmacy = quotation_for === "PHR";
  const baseState = {
    item_description: "",
    item_id: "",
    quantity: "",
    uom_id: "",
    category_id: "",
    group_id: "",
    item_notes: "",
    disableAddBtn: true,
  };
  const [state, setState] = useState(baseState);

  const onItemChange = (i) => {
    setState((state) => ({
      ...state,
      item_description: i.item_description,
      item_id: isPharmacy
        ? i.hims_d_item_master_id
        : i.hims_d_inventory_item_master_id,
      uom_id: i.purchase_uom_id,
      category_id: i.category_id,
      group_id: i.group_id,
      disableAddBtn: false,
    }));
  };

  const onNumberChange = (e) => {
    const { value } = e.target;
    if (value < 0) {
      swalMessage({
        title: "Cannot be less than Zero",
        type: "warning",
      });
    } else {
      setState((state) => ({ ...state, quantity: value }));
    }
  };

  const onNoteChange = (e) => {
    const { value } = e.target;
    setState((state) => ({ ...state, item_notes: value }));
  };

  return (
    <div className="col-lg-12">
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="row">
          <AlgaehAutoSearch
            div={{ className: "col-3 form-group mandatory" }}
            label={{ forceLabel: "Item Name" }}
            title="Search Items"
            id="item_id_search"
            template={(result) => {
              return (
                <section className="resultSecStyles">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="title">{result.item_description}</h4>
                      <small>{result.uom_description}</small>
                    </div>
                  </div>
                </section>
              );
            }}
            name={"item_id"}
            columns={
              quotation_for === "PHR"
                ? spotlightSearch.Items.Pharmacyitemmaster
                : spotlightSearch.Items.Invitemmaster
            }
            displayField="item_description"
            value={state.item_description}
            searchName={
              isPharmacy
                ? "PurchaseOrderForPharmacy"
                : "PurchaseOrderForInventry"
            }
            onClick={onItemChange}
            onClear={() => setState(baseState)}
            others={{
              disabled,
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{ forceLabel: "Item Category" }}
            selector={{
              name: "category_id",
              className: "select-fld",
              value: state.category_id,
              dataSource: {
                textField: "category_desc",
                valueField: isPharmacy
                  ? "hims_d_item_category_id"
                  : "hims_d_inventory_tem_category_id",
                data: poitemcategory,
              },
              others: {
                disabled: true,
              },
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{ forceLabel: "Item Group" }}
            selector={{
              name: "group_id",
              className: "select-fld",
              value: state.group_id,
              dataSource: {
                textField: "group_description",
                valueField: isPharmacy
                  ? "hims_d_item_group_id"
                  : "hims_d_inventory_item_group_id",
                data: poitemgroup,
              },
              others: {
                disabled: true,
              },
              onChange: null,
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{ forceLabel: "UOM" }}
            selector={{
              name: "uom_id",
              className: "select-fld",
              value: state.uom_id,
              dataSource: {
                textField: "uom_description",
                valueField: isPharmacy
                  ? "hims_d_pharmacy_uom_id"
                  : "hims_d_inventory_uom_id",
                data: poitemuom,
              },
              others: {
                disabled: true,
              },
            }}
          />
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Quantity",
              isImp: true,
            }}
            textBox={{
              number: {
                allowNegative: false,
                thousandSeparator: ",",
              },
              className: "txt-fld",
              name: "quantity",
              dontAllowKeys: ["-", "e", "."],
              value: state.quantity,
              events: {
                onChange: onNumberChange,
              },
              others: {
                disabled,
              },
            }}
          />
        </div>
        <div className="row">
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Notes",
            }}
            textBox={{
              className: "txt-fld",
              name: "item_notes",
              value: state.item_notes,
              events: {
                onChange: onNoteChange,
              },
              others: {
                disabled,
              },
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 subFooter-btn">
          <button
            className="btn btn-primary"
            onClick={() => {
              AddItem({ ...state });
              setState(baseState);
            }}
            disabled={state.disableAddBtn}
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}
