import React, { memo, useState } from "react";
import "./QuickSearchFinance.scss";
import { AlgaehTable, AlgaehLabel } from "algaeh-react-components";
import { Spin, Button } from "antd";
import FilterComponent from "./FilterComponent";
import VoucherDetails from "./VoucherDetails";
import { getAmountFormart } from "../../utils/GlobalFunctions";
// import { useLocation } from "react-router-dom";

export default memo(function QuickSearch(props) {
  // const location = useLocation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);

  function onSelect(row) {
    setVisible(true);
    setSelected(row);
  }

  function onClose() {
    setSelected(null);
    setVisible(false);
  }

  const linkCol = (row) => {
    return (
      <Button type="link" onClick={() => onSelect(row)}>
        {row.voucher_no}
      </Button>
    );
  };

  return (
    <>
      <VoucherDetails visible={visible} data={selected} onClose={onClose} />
      <div className="row">
        <div className="col-12">
          <FilterComponent
            setData={setData}
            loading={loading}
            setLoading={setLoading}
          />
          <Spin spinning={loading}>
            <div className="row">
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  {" "}
                  <div className="portlet-body">
                    <div className="row">
                      <div
                        className="col-lg-12 customCheckboxGrid"
                        id="quickSearchGrid"
                      >
                        <AlgaehTable
                          columns={[
                            {
                              fieldName: "invoice_date",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Date" }} />
                              ),
                              label: "Date",
                              sortable: true,
                              others: {
                                Width: 100,
                                style: { textAlign: "center" },
                              },
                            },
                            {
                              fieldName: "voucher_type",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Type" }} />
                              ),
                              sortable: true,
                              filterable: true,
                              others: {
                                Width: 120,
                                style: { textAlign: "center" },
                              },
                            },
                            {
                              fieldName: "narration",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Narration" }}
                                />
                              ),
                              sortable: true,
                              filterable: true,
                              others: {
                                // Width: 120,
                                style: { textAlign: "left" },
                              },
                            },
                            {
                              fieldName: "voucher_no",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Voucher No." }}
                                />
                              ),
                              sortable: true,
                              filterable: true,
                              displayTemplate: linkCol,
                              others: {
                                Width: 120,
                                style: { textAlign: "center" },
                              },
                            },

                            {
                              fieldName: "invoice_no",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Invoice No." }}
                                />
                              ),
                              sortable: true,
                              filterable: true,
                              others: {
                                Width: 120,
                                style: { textAlign: "center" },
                              },
                            },
                            {
                              fieldName: "custom_ref_no",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Reference No." }}
                                />
                              ),
                              sortable: true,
                              filterable: true,
                              others: {
                                Width: 120,
                                style: { textAlign: "center" },
                              },
                            },

                            {
                              fieldName: "amount",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Amount" }} />
                              ),
                              sortable: true,
                              filterable: true,
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {getAmountFormart(row.amount, {
                                      appendSymbol: false,
                                    })}
                                  </span>
                                );
                              },
                              others: {
                                Width: 120,
                                style: { textAlign: "right" },
                              },
                            },
                            {
                              fieldName: "updated_date",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Last Modified" }}
                                />
                              ),
                              sortable: true,
                              others: {
                                Width: 120,
                                style: { textAlign: "center" },
                              },
                            },
                          ]}
                          // height="80vh"
                          isFilterable={true}
                          // rowUnique="finance_voucher_header_id"
                          rowUniqueId="finance_voucher_header_id"
                          // dataSource={{ data: data }}
                          data={data || []}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </>
  );
});
