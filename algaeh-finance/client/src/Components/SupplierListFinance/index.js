import React, { memo, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "antd";
import { AlgaehMessagePop, AlgaehTable } from "algaeh-react-components";
import { LoadSupplierPayable } from "./event";
import { InfoBar } from "../../Wrappers";

function CustomerList(props) {
  const [supplier_payable, setSupplierPayable] = useState([]);
  const history = useHistory();
  const [info, setInfo] = useState({
    over_due: "",
    total_receivable: ""
  });

  useEffect(() => {
    LoadSupplierPayable()
      .then(data => {
        setSupplierPayable(data.result);
        setInfo({
          over_due: data.over_due,
          total_receivable: data.total_receivable
        });
      })
      .catch(error => {
        AlgaehMessagePop({
          type: "error",
          display: error
        });
      });
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <InfoBar data={info} />
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-label">
                <div className="caption">
                  <h3 className="caption-subject">Customer List</h3>
                </div>
                <div className="actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      history.push("CustomerSetup", { data: "placeholder" });
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  {/* <button className="btn btn-default">
                    <i className="fas fa-print"></i>
                  </button>
                  <button className="btn btn-default">
                    <i className="fas fa-share-square"></i>
                  </button>
                  <button className="btn btn-default">
                    <i className="fas fa-cog"></i>
                  </button> */}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 customCheckboxGrid">
                  <AlgaehTable
                    columns={[
                      {
                        label: "Supplier / Company",
                        sortable: true,
                        filterable: true,
                        fieldName: "child_name",
                        filtered: true,
                        displayTemplate: record => {
                          return (
                            <Button
                              type="link"
                              onClick={() =>
                                history.push("/SupplierPayment", {
                                  data: record
                                })
                              }
                            >
                              {record.child_name}
                            </Button>
                          );
                        }
                      },
                      {
                        label: "Contact Number",
                        sortable: true,
                        filterable: true,
                        fieldName: "contact_number",
                        others: {
                          width: 200
                        }
                      },
                      {
                        label: "Account Number",
                        sortable: true,
                        filterable: true,
                        fieldName: "bank_account_no",
                        others: {
                          width: 200
                        }
                      },
                      {
                        label: "Balance",
                        sortable: true,
                        filterable: true,
                        fieldName: "balance_amount",
                        others: {
                          width: 200
                        }
                      }
                    ]}
                    height="80vh"
                    isFilterable={true}
                    row_unique_id="finance_voucher_header_id"
                    // dataSource={{ data: supplier_payable }}
                    data={supplier_payable}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CustomerList);
