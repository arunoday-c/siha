import React, { memo, useState, useEffect } from "react";
import "../../infobar.scss";
import {
  AlgaehDataGrid,
  AlgaehMessagePop
} from "algaeh-react-components";
import {
  LoadCustomerReceivables
} from "./event";
export default memo(function (props) {
  const [customer_receivables, setCustomerReceivables] = useState([]);

  useEffect(() => {
    debugger
    LoadCustomerReceivables()
      .then(result => {
        debugger
        setCustomerReceivables(result);
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
        <div className="row infoBar">
          <div className="col danger">
            <div className="text">
              <p>Overdue</p>
              0.00
            </div>
          </div>
          <div className="col">
            <div className="text">
              <p>Open Invoices</p>
              0.00
            </div>
          </div>
          <div className="col">
            <div className="text">
              <p>Paid Last 30 days</p>
              0.00
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Customer List</h3>
                </div>
                <div className="actions">
                  <button className="btn btn-primary">

                    <i className="fas fa-plus"></i>
                  </button>
                  <button className="btn btn-default">

                    <i className="fas fa-print"></i>
                  </button>
                  <button className="btn btn-default">

                    <i className="fas fa-share-square"></i>
                  </button>
                  <button className="btn btn-default">

                    <i className="fas fa-cog"></i>
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 customCheckboxGrid">
                  <AlgaehDataGrid
                    columns={[
                      {
                        title: "Customer/ Company",
                        sortable: true,
                        fieldName: "child_name",
                        filtered: true
                      },
                      {
                        title: "Opening Balance",
                        sortable: true,
                        fieldName: "balance_amount",
                        others: {
                          width: 200
                        }
                      },
                      {
                        title: "Action",
                        sortable: true,
                        fieldName: "child_name",
                        others: {
                          width: 250
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
});
