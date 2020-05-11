import React from "react";
// import "./MonthlyDetail.scss";
import {
    AlgaehDataGrid,
    AlgaehModalPopUp,
    AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import moment from "moment";

function ContractSalesOrder(props) {
    // const _open = props.open;
    return (
        <AlgaehModalPopUp
            title="Monthly Detail"
            openPopup={props.open}
            events={{
                onClose: props.onClose
            }}
            className="col-lg-12 ContractSalesOrdersPopup"
        >
            <div className="popupInner">
                <div className="col-12">

                    <div className="row margin-top-15">
                        <div className="col">
                            <AlgaehLabel
                                label={{
                                    forceLabel: "Customer Name"
                                }}
                            />
                            <h6>{props.customer_list.customer_name}</h6>
                        </div>
                        <div className="col">
                            <AlgaehLabel
                                label={{
                                    forceLabel: "Contract No."
                                }}
                            />
                            <h6>{props.customer_list.contract_number}</h6>
                        </div>
                        <div className="col">
                            <AlgaehLabel
                                label={{
                                    forceLabel: "Incharge Person"
                                }}
                            />
                            <h6>{props.customer_list.employee_name}</h6>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 margin-bottom-15" id="ContractSalesOrderGridCntr">
                            <AlgaehDataGrid
                                id="ContractSalesOrderGrid"
                                columns={[
                                    {
                                        fieldName: "sales_order_date",
                                        label: <AlgaehLabel label={{ forceLabel: "Date" }} />,
                                        displayTemplate: row => {
                                            return moment(row.sales_order_date).format("DD-MMM-YYYY");
                                        }
                                    },
                                    {
                                        fieldName: "sales_order_number",
                                        label: (
                                            <AlgaehLabel label={{ forceLabel: "Sales Order Number" }} />
                                        )
                                    },
                                    {
                                        fieldName: "customer_po_no",
                                        label: <AlgaehLabel label={{ forceLabel: "PO Number" }} />
                                    },
                                    {
                                        fieldName: "invoice_generated",
                                        label: <AlgaehLabel label={{ forceLabel: "Invoice Generated" }} />,
                                        displayTemplate: row => {
                                            return row.invoice_generated === "N" ? "No" : "Yes";
                                        }
                                    },
                                ]}
                                dataSource={{
                                    data: props.order_list
                                }}
                                filter={true}
                                paging={{ page: 0, rowsPerPage: 31 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="popupFooter">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-4"> &nbsp;</div>

            <div className="col-lg-8">
              <button
                onClick={this.props.onClose}
                type="button"
                className="btn btn-default"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div> */}

            <div className="popupFooter">
                <div className="col-lg-12">
                    <button
                        onClick={props.onClose}
                        type="button"
                        className="btn btn-other"
                    >
                        Close
          </button>
                </div>
            </div>
        </AlgaehModalPopUp>
    );
}

export default ContractSalesOrder;
