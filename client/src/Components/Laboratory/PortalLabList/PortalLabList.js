import React, { useContext, useState, useEffect } from "react";
import "./../../../styles/site.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehMessagePop,
  AlgaehAutoComplete,
  MainContext,
  Checkbox,
} from "algaeh-react-components";
import { useQuery } from "react-query";

import { newAlgaehApi } from "../../../hooks";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";

import PortalServiceDetailModal from "./PortalServiceDetailModal";

const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};
function PortalToHimsList() {
  const { userToken } = useContext(MainContext);
  const {
    control,
    errors,
    // register,
    reset,
    handleSubmit,
    getValues,
    // watch,
  } = useForm({
    defaultValues: {
      hospital_id: userToken.hims_d_hospital_id,
      start_date: [moment(new Date()), moment(new Date())],
    },
  });
  const [gridData, setGridData] = useState([]);
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  const [openServiceDataModal, setOpenServiceDataModal] = useState(false);
  const [currentRow, setCurrentRow] = useState([]);
  const { refetch } = useQuery(["patientPortalData"], patientPortalData, {
    onSuccess: (data) => {
      setGridData(data);
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });
  const selectAll = (e) => {
    const stats = e.target.checked === true ? "Y" : "N";
    let myState = [];

    myState = gridData.map((f) => {
      return { ...f, checked: stats };
    });
    setCheckAll(stats === "Y" ? STATUS.CHECK : STATUS.UNCHECK);
    setGridData([...myState]);
  };

  async function patientPortalData(key) {
    const date = getValues().start_date;
    const from_date = moment(date[0]).format("YYYY-MM-DD");
    const to_date = moment(date[1]).format("YYYY-MM-DD");

    const result = await newAlgaehApi({
      uri: "/laboratory/patientPortalData",
      module: "laboratory",
      method: "GET",
      data: { from_date, to_date, corporate_id: getValues().corporate_id },
    });
    return result?.data?.records;
  }
  const { data: subCompanyData } = useQuery(
    ["company-dropdown-data"],
    getSubCompanyDetails,
    {
      onSuccess: (data) => {
        debugger;
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getSubCompanyDetails(key) {
    const { data } = await newAlgaehApi({
      uri: "/insurance/getSubInsuranceGrid",
      module: "insurance",
      method: "GET",
      // data: inputobj,
    }).catch((error) => {
      throw error;
    });
    if (data.success === false) {
      throw new Error(data.message);
    } else {
      return data.records[1];
    }
  }

  const loadData = (data) => {
    patientPortalData().then((results) => {
      setGridData(results);
    });
  };

  async function onSubmitHandler() {
    try {
      const patientList = gridData
        .filter((f) => f.checked === "Y")
        .map((item) => {
          return item.portal_package_id;
        });
        debugger
      const result = await newAlgaehApi({
        uri: "/laboratory/patientBillGeneration",
        module: "laboratory",
        method: "POST",
        data: { patientList },
      }).catch((error) => {
        throw error;
      });
      AlgaehMessagePop({
        display: result.data.message,
        type: "success",
      });
      refetch();
    } catch (e) {
      AlgaehMessagePop({
        display: e?.message,
        type: "error",
      });
    }
  }

  return (
    <>
      {openServiceDataModal ? (
        <PortalServiceDetailModal
          visible={openServiceDataModal}
          onClose={() => {
            setOpenServiceDataModal(!openServiceDataModal);
            setCurrentRow([]);
          }}
          rowData={currentRow}
        />
      ) : null}
      <div className="hptl-phase1-result-entry-form">
        <form onSubmit={handleSubmit(loadData)}>
          <div
            className="row inner-top-search"
            style={{ paddingBottom: "10px" }}
          >
            <Controller
              control={control}
              name="start_date"
              rules={{
                required: {
                  message: "Field is Required",
                },
              }}
              render={({ onChange, value }) => (
                <AlgaehDateHandler
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "From And To Date",
                    isImp: true,
                  }}
                  error={errors}
                  textBox={{
                    className: "txt-fld",
                    name: "start_date",
                    value,
                  }}
                  type="range"
                  // others={{ disabled }}
                  events={{
                    onChange: (mdate) => {
                      if (mdate) {
                        onChange(mdate);

                        refetch();
                      } else {
                        onChange(undefined);
                      }
                    },
                    onClear: () => {
                      onChange(undefined);
                    },
                  }}
                />
              )}
            />
            <Controller
              name="corporate_id"
              control={control}
              rules={{ required: "Select Company" }}
              render={({ value, onChange }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-4 form-group mandatory" }}
                  label={{
                    forceLabel: "Filter by Company",
                    isImp: true,
                  }}
                  error={errors}
                  selector={{
                    className: "form-control",
                    name: "corporate_id",
                    value,
                    onChange: (_, selected) => {
                      onChange(selected);
                    },

                    dataSource: {
                      textField: "insurance_sub_name",
                      valueField: "user_id",
                      data: subCompanyData,
                    },
                  }}
                />
              )}
            />

            <div className="col" style={{ marginTop: "21px" }}>
              <button
                className="btn btn-default btn-sm"
                type="button"
                onClick={() => {
                  reset({
                    start_date: [moment(new Date()), moment(new Date())],
                  });
                }}
              >
                Clear
              </button>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginLeft: "10px" }}
                type="submit"
              >
                Load
              </button>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body" id="portalLabHeadGrid">
                <AlgaehDataGrid
                  // id="samplecollection_grid"
                  columns={[
                    {
                      label: (
                        <Checkbox
                          indeterminate={checkAll === STATUS.INDETERMINATE}
                          checked={checkAll === STATUS.CHECK}
                          onChange={selectAll}
                          // disabled={portalState?.portal_exists === "N"}
                        ></Checkbox>
                      ),
                      fieldName: "select",
                      displayTemplate: (row) => {
                        return (
                          <CheckBoxPlot
                            row={row}
                            fullData={gridData ?? []}
                            setCheckAll={setCheckAll}
                          />
                        );
                      },
                      others: {
                        width: 50,
                        filterable: false,
                        sortable: false,
                      },
                    },
                    // {
                    //   label: <input type="checkbox" />,
                    //   fieldName: "select",
                    //   others: {
                    //     width: 30,
                    //     filterable: false,
                    //     sortable: false,
                    //   },
                    //   displayTemplate: (row) => <input type="checkbox" />,
                    // },
                    {
                      fieldName: "view_package_details",
                      label: <AlgaehLabel label={{ forceLabel: "View" }} />,

                      disabled: true,
                      others: {
                        width: 110,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      displayTemplate: (row) => {
                        return (
                          <i
                            className="fa fa-eye"
                            onClick={() => {
                              setCurrentRow(row);
                              setOpenServiceDataModal(true);
                            }}
                          ></i>
                        );
                      },
                    },
                    {
                      fieldName: "patient_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_name" }} />
                      ),
                      disabled: true,
                      others: {
                        resizable: false,
                        style: { textAlign: "left" },
                      },
                    },

                    {
                      fieldName: "total_details_count",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "No. of Tests" }} />
                      ),

                      disabled: true,
                      others: {
                        width: 110,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },

                    {
                      fieldName: "identity_type",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Primary ID Type" }}
                        />
                      ),
                      disabled: false,
                      others: {
                        width: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "patient_identity",
                      label: (
                        <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
                      ),
                      disabled: false,
                      others: {
                        width: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },

                    {
                      fieldName: "mobile_no",
                      label: (
                        <AlgaehLabel label={{ fieldName: "contact_number" }} />
                      ),
                      disabled: true,
                      others: {
                        width: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                  ]}
                  keyId="patient_code"
                  data={gridData ?? []}
                  events={{
                    onSave: (row) => {},
                  }}
                  isFilterable={true}
                  pagination={true}
                  pageOptions={{ rows: 50, page: 1 }}
                  noDataText="No data available for selected period"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button className="btn btn-primary" onClick={onSubmitHandler}>
              Bulk Process
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PortalToHimsList;
/**
 * For checkboxes
 * @param {row} Object
 * @param {fullData} Array
 * @returns Component
 */
function CheckBoxPlot({ row, fullData, setCheckAll }) {
  const [checked, setChecked] = useState("N");
  useEffect(() => {
    setChecked(row.checked);
  }, [row.checked]);
  return (
    <input
      type="checkbox"
      checked={checked === "Y" ? true : false}
      onChange={(e) => {
        const check = e.target.checked === true ? "Y" : "N";

        if (row.id) {
          row.isDirty = true;
        }
        row.checked = check;

        const hasUncheck = fullData.filter((f) => {
          return f.checked === undefined || f.checked === "N";
        });
        const hasChecks = fullData.filter((f) => f.checked === "Y");
        setCheckAll(
          fullData.length === hasChecks.length
            ? STATUS.CHECK
            : fullData.length === hasUncheck.length
            ? STATUS.UNCHECK
            : STATUS.INDETERMINATE
        );
        setChecked(check);
      }}
      // disabled={portalState?.portal_exists === "N"}
    />
  );
}
React.memo(CheckBoxPlot);
