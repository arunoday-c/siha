import React, { memo, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { InfoBar } from "../../Wrappers";
import { AlgaehDataGrid, AlgaehMessagePop } from "algaeh-react-components";
import { LoadCustomerReceivables } from "./event";
import { Button } from "antd";

function CustomerList(props) {
  const history = useHistory();

  const [customer_receivables, setCustomerReceivables] = useState([]);
  const [info, setInfo] = useState({
    over_due: "0.00",
    total_receivable: "0.00"
  });

  useEffect(() => {
    LoadCustomerReceivables()
      .then(data => {
        setCustomerReceivables(data.result);
        setInfo({ ...data });
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
              <div className="portlet-title">
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
                  <AlgaehDataGrid
                    columns={[
                      {
                        title: "Customer / Company",
                        sortable: true,
                        fieldName: "child_name",
                        filtered: true,
                        displayTemplate: (text, record) => {
                          return (
                            <Button
                              type="link"
                              onClick={() =>
                                history.push("/CustomerPayment", {
                                  data: record
                                })
                              }
                            >
                              {text}
                            </Button>
                          );
                        }
                      },
                      {
                        title: "Balance",
                        sortable: true,
                        fieldName: "balance_amount",
                        others: {
                          width: 200
                        }
                      }
                    ]}
                    height="80vh"
                    filter={true}
                    rowUnique="finance_voucher_header_id"
                    dataSource={{ data: customer_receivables }}
                  ></AlgaehDataGrid>
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
