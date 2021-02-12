import React, { useEffect, useState } from "react";
import {
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
      getHeaders({ finance_account_head_id: 4 }),
      getHeaders({ finance_account_head_id: 5 }),
      getFinanceAccountsMaping(),
    ])
      .then((results) => {
        setAccountHeads({
          1: results[0][0].children,
          2: results[1][0].children,
          4: results[2][0].children,
          5: results[3][0].children,
        });
        setMappings(results[4]);
      })
      .catch((error) => {
        AlgaehMessagePop({
          type: "error",
          display: error.message || error.response.data.message,
        });
      });
  }, []);

  function update(value, account_name, mapping_group_id) {
    setMappings((state) => {
      const mainIndex = state.findIndex(
        (f) => f.mapping_group_id === mapping_group_id
      );
      if (mainIndex >= 0) {
        const reqIndex = state[mainIndex]["details"].findIndex(
          (f) =>
            String(f.account).toUpperCase() ===
            String(account_name).toUpperCase()
        );
        if (reqIndex >= 0) {
          if (value) {
            const [head_id, child_id] = value.split("-");
            state[mainIndex]["details"][reqIndex]["head_id"] = head_id;
            state[mainIndex]["details"][reqIndex]["child_id"] = child_id;
            return [...state];
          } else {
            state[mainIndex]["details"][reqIndex]["head_id"] = null;
            state[mainIndex]["details"][reqIndex]["child_id"] = null;
            return [...state];
          }
        } else {
          return [...state];
        }
      } else {
        return [...state];
      }

      // const reqIndex = state.findIndex((item) => item.account === account_name);
      // if (value) {
      //   const [head_id, child_id] = value.split("-");
      //   state[reqIndex].head_id = head_id;
      //   state[reqIndex].child_id = child_id;
      //   return [...state];
      // } else {
      //   state[reqIndex].head_id = null;
      //   state[reqIndex].child_id = null;
      //   return [...state];
      // }
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
    <div
      className=" FinanceMappingScreen"
      style={{ marginTop: 20, marginBottom: 75 }}
    >
      <div className="row">
        {mappings.map((item, index) => (
          <div className="col-12" key={index}>
            <div className="card">
              <div className="card-header">
                <b>{item.mapping_group}</b>
              </div>
              <div className="card-body" style={{ paddingBottom: 5 }}>
                <div className="row">
                  {item.details.map((items) => (
                    <AlgaehTreeSearch
                      key={items.account}
                      div={{ className: "col-3 form-group" }}
                      label={{
                        forceLabel: items.description,
                        isImp: false,
                        align: "ltr",
                      }}
                      tree={{
                        treeDefaultExpandAll: true,
                        onChange: (val) =>
                          update(val, items.account, item.mapping_group_id),
                        name: items.account,
                        data: [
                          ...accountHeads[1],
                          ...accountHeads[2],
                          ...accountHeads[4],
                          ...accountHeads[5],
                        ],
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
                        defaultValue: `${items.head_id}-${items.child_id}`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
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
