import React, { memo, useState } from "react";
import "./modalGlobal.scss";
import { AlgaehDataGrid } from "algaeh-react-components";
import { Spin, Button } from "antd";
import FilterComponent from "./FilterComponent";
import VoucherDetails from "./VoucherDetails";

export default memo(function(props) {
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

  const linkCol = (text, row) => {
    return (
      <Button type="link" onClick={() => onSelect(row)}>
        {text}
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
                      <AlgaehDataGrid
                        columns={[
                          {
                            key: "invoice_date",
                            title: "Date",
                            sortable: true
                          },
                          {
                            key: "voucher_type",
                            title: "Type",
                            sortable: true,
                            filterable: true
                          },
                          {
                            key: "voucher_no",
                            title: "Voucher No",
                            sortable: true,
                            filterable: true,
                            displayTemplate: linkCol
                          },
                          {
                            key: "narration",
                            title: "Description",
                            sortable: true,
                            filterable: true
                          },
                          {
                            key: "invoice_no",
                            title: "Invoice No",
                            sortable: true,
                            filterable: true
                          },
                          {
                            key: "amount",
                            title: "Amount",
                            sortable: true,
                            filterable: true
                          },
                          {
                            key: "updated_date",
                            title: "Last Modified Date",
                            sortable: true
                          }
                        ]}
                        height="59vh"
                        rowUnique="finance_voucher_header_id"
                        dataSource={{ data: data }}
                      ></AlgaehDataGrid>
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
