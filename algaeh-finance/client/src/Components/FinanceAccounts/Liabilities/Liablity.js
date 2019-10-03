import React from "react";
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app

import "./liablity.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehDropDown
} from "../../../Wrappers";
import {
  currency_list,
  liabilityType,
  interestperiodType
} from "../../../data/dropdownList";

export default function Liablity() {
  const maxDepth = 5;

  const renderDepthTitle = ({ path }) => `Depth: ${path.length}`;

  const treeData = [
    {
      title: "`title`",
      subtitle: "`subtitle`",
      expanded: true,
      children: [
        {
          title: "Child Node",
          subtitle: "Defined in `children` array belonging to parent"
        },
        {
          title: "Nested structure is rendered virtually",
          subtitle: (
            <span>
              The tree uses&nbsp;
              <a href="https://github.com/bvaughn/react-virtualized">
                react-virtualized
              </a>
              &nbsp;and the relationship lines are more of a visual trick.
            </span>
          )
        }
      ]
    },
    {
      expanded: true,
      title: "Any node can be the parent or child of any other node",
      children: [
        {
          expanded: true,
          title: "Chicken",
          children: [{ title: "Egg" }]
        }
      ]
    },
    {
      title: "Button(s) can be added to the node",
      subtitle:
        "Node info is passed when generating so you can use it in your onClick handler"
    },
    {
      expanded: true,
      title: "Show node children by setting `expanded`",
      subtitle: ({ node }) => `expanded: ${node.expanded ? "true" : "false"}`,
      children: [
        {
          title: "Bruce",
          subtitle: ({ node }) =>
            `expanded: ${node.expanded ? "true" : "false"}`,
          children: [{ title: "Bruce Jr." }, { title: "Brucette" }]
        }
      ]
    },
    {
      expanded: true,
      title: "Advanced",
      subtitle: "Settings, behavior, etc.",
      children: [
        {
          title: (
            <div>
              <div
                style={{
                  backgroundColor: "gray",
                  display: "inline-block",
                  borderRadius: 10,
                  color: "#FFF",
                  padding: "0 5px"
                }}
              >
                Any Component
              </div>
              &nbsp;can be used for `title`
            </div>
          )
        },
        {
          expanded: true,
          title: "Limit nesting with `maxDepth`",
          subtitle: `It's set to ${maxDepth} for this example`,
          children: [
            {
              expanded: true,
              title: renderDepthTitle,
              children: [
                {
                  expanded: true,
                  title: renderDepthTitle,
                  children: [
                    { title: renderDepthTitle },
                    {
                      title: ({ path }) =>
                        path.length >= maxDepth
                          ? "This cannot be dragged deeper"
                          : "This can be dragged deeper"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: "Disable dragging on a per-node basis with the `canDrag` prop",
          subtitle: "Or set it to false to disable all dragging.",
          noDragging: true
        },
        {
          title: "You cannot give this children",
          subtitle:
            "Dropping is prevented via the `canDrop` API using `nextParent`",
          noChildren: true
        },
        {
          title:
            "When node contents are really long, it will cause a horizontal scrollbar" +
            " to appear. Deeply nested elements will also trigger the scrollbar."
        }
      ]
    }
  ];

  return (
    <div className="container-fluid liablityModuleScreen">
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Liablity accounts</h3>
          </div>
          <div className="actions">
            {" "}
            <button className="btn btn-primary btn-circle active">
              <i className="fas fa-plus" />
            </button>
          </div>
        </div>
        <div className="portlet-body">
          <div className="col">
            <div className="row">
              {" "}
              <div style={{ height: 400, width: "100vw" }}>
                <SortableTree treeData={treeData} />
              </div>{" "}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h5 className="card-header">New Liablity Account</h5>
        <div className="card-body">
          <div className="row">
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Liablity Name",
                isImp: true
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter Asset Name",
                autocomplete: false
              }}
            />{" "}
            <AlgaehDropDown
              div={{
                className: "form-group algaeh-select-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Select Default Currency",
                isImp: true
              }}
              selector={{
                className: "form-control",
                name: "country",
                onChange: "value"
              }}
              dataSource={{
                textField: "name",
                valueField: "value",
                data: currency_list
              }}
            />{" "}
            <AlgaehDropDown
              div={{
                className: "form-group algaeh-select-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Select Liability type",
                isImp: true
              }}
              selector={{
                className: "form-control",
                name: "country",
                onChange: "value"
              }}
              dataSource={{
                textField: "name",
                valueField: "value",
                data: liabilityType
              }}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Start amount of debt",
                isImp: true
              }}
              textBox={{
                type: "number",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter amount of debt",
                autocomplete: false
              }}
            />{" "}
            <AlgaehDateHandler
              div={{
                className: "form-group algaeh-email-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Start date of debt",
                isImp: true
              }}
              textBox={{
                name: "enter_date",
                className: "form-control"
              }}
              events={{
                onChange: e => console.log(e.target)
              }}
              value={new Date()}
              maxDate={new Date()}
              minDate={new Date()}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Interest %",
                isImp: true
              }}
              textBox={{
                type: "number",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: "%",
                autocomplete: false
              }}
            />{" "}
            <AlgaehDropDown
              div={{
                className: "form-group algaeh-select-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Select Interest period",
                isImp: true
              }}
              selector={{
                className: "form-control",
                name: "country",
                onChange: "value"
              }}
              dataSource={{
                textField: "name",
                valueField: "value",
                data: interestperiodType
              }}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "IBAN",
                isImp: false
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: "Enter IBAN",
                autocomplete: false
              }}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "BIC",
                isImp: false
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter BIC",
                autocomplete: false
              }}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Account number",
                isImp: false
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter Account number",
                autocomplete: false
              }}
            />{" "}
            <div className="form-group algaeh-checkbox-fld col-xs-4 col-md-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="includeNetWorth"
                />
                <label className="form-check-label" for="includeNetWorth">
                  Include in net worth
                </label>
              </div>
            </div>
          </div>
        </div>{" "}
        <div class="card-footer text-muted ">
          <button className="btn btn-primary" style={{ float: "right" }}>
            Add to List
          </button>{" "}
          <button
            className="btn btn-default"
            style={{ float: "right", marginRight: 10 }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
