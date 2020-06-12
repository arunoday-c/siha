import React, { memo, useState } from "react";
import "./modalGlobal.scss";
import { AlgaehTable } from "algaeh-react-components";
import { Spin, Button } from "antd";
import FilterComponent from "./FilterComponent";
import VoucherDetails from "./VoucherDetails";
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

  const linkCol = row => {
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
                  <div className="row">
                    <div className="col-lg-12 customCheckboxGrid">
                      <AlgaehTable
                        columns={[
                          {
                            fieldName: "invoice_date",
                            label: "Date",
                            sortable: true
                          },
                          {
                            fieldName: "voucher_type",
                            label: "Type",
                            sortable: true,
                            filterable: true
                          },
                          {
                            fieldName: "voucher_no",
                            label: "Voucher No",
                            sortable: true,
                            filterable: true,
                            displayTemplate: linkCol
                          },
                          {
                            fieldName: "narration",
                            label: "Description",
                            sortable: true,
                            filterable: true
                          },
                          {
                            fieldName: "invoice_no",
                            label: "Invoice No",
                            sortable: true,
                            filterable: true
                          },
                          {
                            fieldName: "amount",
                            label: "Amount",
                            sortable: true,
                            filterable: true
                          },
                          {
                            fieldName: "updated_date",
                            label: "Last Modified Date",
                            sortable: true
                          }
                        ]}
                        // height="80vh"
                        isFilterable={true}
                        // rowUnique="finance_voucher_header_id"
                        row_unique_id="finance_voucher_header_id"
                        // dataSource={{ data: data }}
                        data={data || []}
                      />
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
