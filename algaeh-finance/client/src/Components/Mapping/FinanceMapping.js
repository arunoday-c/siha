import React, { useEffect, useState } from "react";
import {
  AlgaehButton,
  AlgaehMessagePop,
  AlgaehTreeSearch,
  AlgaehLabel,
} from "algaeh-react-components";
import {
  getHeaders,
  updateFinanceAccountsMaping,
  getFinanceAccountsMaping,
} from "./mapping.event";
export default function Mapping(props) {
  const [accountHeads, setAccountHeads] = useState([]);
  const [mappings, setMappings] = useState([]);
  useEffect(() => {
    Promise.all([
      getHeaders({ finance_account_head_id: 1 }),
      getHeaders({ finance_account_head_id: 2 }),
      getHeaders({ finance_account_head_id: 5 }),
      getFinanceAccountsMaping(),
    ])
      .then((results) => {
        setAccountHeads({
          1: results[0][0].children,
          2: results[1][0].children,
          5: results[2][0].children,
        });
        setMappings(results[3]);
      })
      .catch((error) => {
        AlgaehMessagePop({
          type: "error",
          display: error.message || error.response.data.message,
        });
      });
  }, []);

  function update(value, account_name) {
    setMappings((state) => {
      const reqIndex = state.findIndex((item) => item.account === account_name);
      if (value) {
        const [head_id, child_id] = value.split("-");
        state[reqIndex].head_id = head_id;
        state[reqIndex].child_id = child_id;
        return [...state];
      } else {
        state[reqIndex].head_id = null;
        state[reqIndex].child_id = null;
        return [...state];
      }
    });
  }

  function updateMapping() {
    updateFinanceAccountsMaping(mappings)
      .then(() => {
        AlgaehMessagePop({
          type: "success",
          display: "Updated successfully",
        });
      })
      .catch((error) => {
        AlgaehMessagePop({
          type: "error",
          display: JSON.stringify(error),
        });
      });
  }

  return (
    <div className="FinanceMappingScreen">
      <div className="row margin-top-15 margin-bottom-15">
        <div className="col">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              {/* <div className="caption">
                <h3 className="caption-subject">OP Billing</h3>
              </div> */}
            </div>
            <div className="portlet-body">
              <div className="row">
                {mappings.map((item) => (
                  <AlgaehTreeSearch
                    key={item.account}
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: item.description,
                      isImp: false,
                      align: "ltr",
                    }}
                    tree={{
                      treeDefaultExpandAll: true,
                      onChange: (val) => update(val, item.account),
                      name: item.account,
                      data: accountHeads[item.root_id] || accountHeads[1],
                      textField: "label",
                      valueField: (node) => {
                        if (node["leafnode"] === "Y") {
                          return (
                            node["head_id"] +
                            "-" +
                            node["finance_account_child_id"]
                          );
                        } else {
                          return node["finance_account_head_id"];
                        }
                      },
                      defaultValue: `${item.head_id}-${item.child_id}`,
                    }}
                  />
                ))}
                {/* <div className="col-3">
                  <AlgaehButton
                    onClick={updateMapping}
                    className="btn btn-primary"
                  >
                    MAP/UPDATE
                  </AlgaehButton>
                </div> */}
              </div>
            </div>
          </div>
        </div>{" "}
        {/* <div className="col-4">fgfgfg</div>
        <div className="col-4">fgfgfg</div> */}
      </div>
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              type="button"
              className="btn btn-primary"
              onClick={updateMapping}
            >
              <AlgaehLabel label={{ forceLabel: "Save Mapping" }} />
            </button>
            {/* <button type="button" className="btn btn-default">
              <AlgaehLabel label={{ forceLabel: "Export as Excel" }} />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
