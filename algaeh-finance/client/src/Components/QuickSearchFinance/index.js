import React, { memo, useState } from "react";
import { AlgaehDataGrid, AlgaehMessagePop } from "algaeh-react-components";
import {
  LoadVouchersToAuthorize,
  ApproveReject,
  LoadVoucherDetails
} from "./event";
import { FilterComponent } from "../InvoiceCommon";
let rejectText = "";
let finance_voucher_header_id = "";
export default memo(function(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="row">
      <div className="col-12">
        <div className="row inner-top-search" style={{ paddingBottom: 10 }}>
          <div className="col-12 inner-top-search-hdg">
            <h3>Quick Search</h3>
          </div>
          <FilterComponent />
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="row">
                <div className="col-lg-12 customCheckboxGrid">
                  <AlgaehDataGrid
                    columns={[
                      {
                        key: "",
                        title: "Date",
                        sortable: true,
                        others: {
                          width: 130
                        }
                      },
                      {
                        key: "",
                        title: "Type",
                        sortable: true,
                        others: {
                          width: 130
                        }
                      },
                      {
                        key: "",
                        title: "Number",
                        sortable: true,
                        others: {
                          width: 130
                        }
                      },
                      {
                        key: "",
                        title: "Contact",
                        sortable: true
                      },
                      {
                        key: "",
                        title: "Amount",
                        sortable: true,

                        others: {
                          width: 130
                        }
                      },
                      {
                        key: "",
                        title: "Last Modified Date",
                        sortable: true,
                        others: {
                          width: 180
                        }
                      }
                    ]}
                    height="40vh"
                    rowUnique="finance_voucher_header_id"
                    dataSource={{ data: data }}
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
