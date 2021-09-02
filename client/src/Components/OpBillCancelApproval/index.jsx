import React, { useState, memo } from "react";
import { useForm } from "react-hook-form";
import { newAlgaehApi } from "../../hooks";
import {
  AlgaehDateHandler,
  AlgaehMessagePop,
  AlgaehDataGrid,
  AlgaehLabel,
} from "algaeh-react-components";
import swal from "sweetalert2";
import "./OpBillCancelApproval.scss";
import { Controller } from "react-hook-form";
import moment from "moment";
export const getOpBillCancelApproval = async (inputObj) => {
  const result = await newAlgaehApi({
    uri: "/opBillCancellation/getOpBillCancelApproval",
    module: "billing",
    method: "GET",
    data: inputObj,
  });
  return result?.data;
};

export default memo(function OpBillCancelApproval() {
  const { control, errors, setValue, getValues } = useForm({
    shouldFocusError: true,
    defaultValues: {
      selected_date: new Date(),
    },
  });

  const [approval_data_list, setApprovalDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const onClickLoad = async () => {
    try {
      const after_load = await getOpBillCancelApproval({
        selected_date: getValues("selected_date"),
      }).catch((error) => {
        throw error;
      });

      debugger;
      if (after_load.success === false) {
        AlgaehMessagePop({
          display: after_load.message,
          type: "error",
        });
        setValue("barcode_scanner", "");
        return;
      }
      if (after_load.records.length > 0) {
        setApprovalDataList(after_load.records);
      } else {
        AlgaehMessagePop({
          display: "No Records Found",
          type: "warning",
        });
      }
    } catch (e) {
      AlgaehMessagePop({
        display: e.message,
        type: "error",
      });
    }
  };

  const approvalCancelBill = async (data) => {
    const result = await newAlgaehApi({
      uri: "/opBillCancellation/approvalBillCancalation",
      module: "billing",
      method: "PUT",
      data: data,
    });
    return result?.data?.records;
  };
  const onSubmit = (row) => {
    swal({
      title: `Are you sure to Approve?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willProceed) => {
      if (willProceed.value) {
        const inpujObj = {
          hims_f_bill_cancel_approval_id: row.hims_f_bill_cancel_approval_id,
          billing_header_id: row.billing_header_id,
        };

        approvalCancelBill(inpujObj)
          .then((result) => {
            swal({
              title: "Batch Created Successfully",
              icon: "success",
            });
            onClickLoad();
          })
          .catch((e) => {
            debugger;
            AlgaehMessagePop({
              display: e.message,
              type: "error",
            });
          });
      }
    });
  };

  return (
    <div className="CreateBatchScreen">
      <div className="row inner-top-search">
        <Controller
          control={control}
          name="selected_date"
          render={(props) => (
            <AlgaehDateHandler
              div={{
                className: "col-3 mandatory",
              }}
              error={errors}
              label={{
                fieldName: "Select Date",
                isImp: true,
              }}
              textBox={{
                ...props,
                className: "txt-fld",
                name: "selected_date",
                // value,
              }}
              // maxDate={new Date()}
              maxDate={moment().add(1, "days")}
              events={{
                onChange: (mdate) => {
                  if (mdate) {
                    setValue("selected_date", mdate._d);
                    // onChange(mdate._d);
                  } else {
                    setValue("selected_date", undefined);
                    // onChange(undefined);
                  }
                },
                onClear: () => {
                  setValue("selected_date", undefined);
                  // onChange(undefined);
                },
              }}
            />
          )}
        />
        <div className="col-1 mandatory form-group">
          <button
            className="btn btn-primary"
            style={{ marginTop: 21 }}
            onClick={onClickLoad}
          >
            Load
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            {/* <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Portal Lab List</h3>
                </div>
              </div> */}
            <div className="portlet-body" id="batchGenerationGrid">
              <AlgaehDataGrid
                columns={[
                  {
                    label: "Action",
                    fieldName: "",
                    displayTemplate: (row) => {
                      return (
                        <i
                          className="fa fa-check"
                          style={{
                            pointerEvents:
                              row.approved_status === "Y" ? "none" : "",
                            opacity: row.approved_status === "Y" ? "0.1" : "",
                          }}
                          onClick={() => {
                            onSubmit(row);
                          }}
                        ></i>
                      );
                    },
                  },
                  {
                    fieldName: "bill_number",
                    label: <AlgaehLabel label={{ fieldName: "Bill Number" }} />,
                    others: {
                      // filterable: true,
                      // sortable: true,
                    },
                    filterable: true,
                    sortable: true,
                  },
                  {
                    fieldName: "requested_by",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Requested By" }} />
                    ),

                    filterable: true,
                    sortable: true,
                  },
                  {
                    fieldName: "approved_status",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Approved Status" }} />
                    ),
                    displayTemplate: (row) => {
                      return row.approved_status === "Y" ? "Yes" : "No";
                    },
                    filterable: true,
                    sortable: true,
                  },
                ]}
                data={approval_data_list}
                pagination={true}
                pageOptions={{ rows: 50, page: currentPage }}
                pageEvent={(page) => {
                  setCurrentPage(page);
                }}
                isFilterable={true}
                noDataText="No data available for selected period"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
