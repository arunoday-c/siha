import React, { useState, useRef } from "react";
// import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "react-query";
import { newAlgaehApi } from "../../../hooks";
// import moment from "moment";
import { Select, AlgaehMessagePop } from "algaeh-react-components";
import "./PortalSetup.scss";
import { AlgaehDataGrid, AlgaehLabel, Spin } from "algaeh-react-components";
const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};
const addOrUpdatePortalSetup = async (data) => {
  const dataArray = data.filteredArray.map((item) => {
    return {
      ...item,
      id: item.id,
      insurance_id: item.insurance_provider_id,
      sub_insurance_id: item.hims_d_insurance_sub_id,
      service_types: JSON.stringify(item.service_type),
      hospital_id: item.hospitalID,
    };
  });

  const result = await newAlgaehApi({
    uri: "/insurance/addOrUpdatePortalSetup",
    module: "insurance",
    data: { data: dataArray },
    method: "POST",
  });
  return result.data?.records;
};
const updatePortal = async (data) => {
  const result = await newAlgaehApi({
    uri: "/insurance/updatePortalExists",
    module: "insurance",
    data: { portal_exists: data.portal_exists },
    method: "PUT",
  });
  return result.data?.records;
};
export function PortalSetup() {
  const [checkAll, setCheckAll] = useState(STATUS.UNCHECK);
  const [gridData, setGridData] = useState([]);
  const [portal_exists, setPortal_exists] = useState("N");
  const [isDirty, setIsDirty] = useState(false);
  let allChecked = useRef(undefined);
  const selectAll = (e) => {
    const staus = e.target.checked;
    const myState = gridData.map((f) => {
      return { ...f, checked: staus, isDirty: staus ? true : false };
    });

    const hasUncheck = myState.filter((f) => {
      return f.checked === undefined || f.checked === false;
    });

    const totalRecords = myState.length;
    setCheckAll(
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE"
    );
    setGridData([...myState]);
  };
  const selectToProcess = (row, e) => {
    const status = e.target.checked;
    row.checked = status;
    row["isDirty"] = status ? true : false;
    const records = gridData;
    const hasUncheck = records.filter((f) => {
      return f.checked === undefined || f.checked === false;
    });

    const totalRecords = records.length;
    let ckStatus =
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE";
    if (ckStatus === "INDETERMINATE") {
      allChecked.indeterminate = true;
    } else {
      allChecked.indeterminate = false;
    }
    setCheckAll(ckStatus);
    setGridData([...records]);
  };

  const { data: serviceTypes } = useQuery(
    "dropdown-data",
    getServiceTypeDropDown,
    {
      refetchOnMount: false,
      initialStale: true,
      cacheTime: Infinity,
      onSuccess: (data) => {},
    }
  );
  async function getServiceTypeDropDown() {
    const result = await newAlgaehApi({
      uri: "/serviceType/getServiceTypeDropDown",
      module: "masterSettings",
      method: "GET",
    });

    return result?.data?.records;
  }
  const { refetch } = useQuery(["getSubInsuranceGrid"], getSubInsuranceGrid, {
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
  async function getSubInsuranceGrid(key) {
    const result = await newAlgaehApi({
      uri: "/insurance/getSubInsuranceGrid",
      module: "insurance",
      method: "GET",
      // data: inputobj,
    });
    return result?.data?.records;
  }

  const {} = useQuery(["getPortalExists"], getPortalExists, {
    onSuccess: (data) => {
      setPortal_exists(data[0].portal_exists);
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });
  async function getPortalExists(key) {
    const result = await newAlgaehApi({
      uri: "/insurance/getPortalExists",
      module: "insurance",
      method: "GET",
      // data: inputobj,
    });
    return result?.data?.records;
  }
  const [save, { isLoading: saveLoading }] = useMutation(
    addOrUpdatePortalSetup,
    {
      onSuccess: (data) => {
        refetch();
        AlgaehMessagePop({
          display: "Data updated Successfully...",
          type: "success",
        });
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err.message,
          type: "error",
        });
      },
    }
  );
  const [updatePortalExists] = useMutation(updatePortal, {
    onSuccess: (data) => {
      AlgaehMessagePop({
        display: "Data updated Successfully...",
        type: "success",
      });
      setIsDirty(false);
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err.message,
        type: "error",
      });
    },
  });
  // const updateSetup = (filteredArray) => {
  //   // const filteredArray = gridData.filter((f) => f.checked);
  //   // if (filteredArray.length > 0) {

  //   // } else {
  //   //   AlgaehMessagePop({
  //   //     display: "Nothing To Update...",
  //   //     type: "warning",
  //   //   });
  //   //   return;
  //   // }
  // };
  const updateFunction = () => {
    const filteredArray = gridData.filter((f) => f.checked);
    if (isDirty) {
      updatePortalExists({ portal_exists: portal_exists });

      if (filteredArray.length > 0) {
        save({
          filteredArray: filteredArray,
        });
      }
    } else {
      if (filteredArray.length > 0) {
        save({
          filteredArray: filteredArray,
        });
      } else {
        AlgaehMessagePop({
          display: "Nothing To Update...",
          type: "warning",
        });
      }
    }
  };
  return (
    <Spin spinning={saveLoading}>
      <div className="PortalSetup">
        <div className="row inner-top-search">
          <div className="col-3 form-group">
            <label>Portal Active</label>
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  value="Y"
                  checked={portal_exists === "Y"}
                  onChange={(e) => {
                    setIsDirty(true);
                    setPortal_exists(e.target.value);
                  }}
                  name="portal_exists"
                />
                <span>Yes</span>
              </label>{" "}
              <label className="radio inline">
                <input
                  type="radio"
                  value="N"
                  checked={portal_exists === "N"}
                  onChange={(e) => {
                    setIsDirty(true);
                    setPortal_exists(e.target.value);
                  }}
                  name="portal_exists"
                />
                <span>No</span>
              </label>
            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Portal Corporate Lists</h3>
                </div>
                <div className="actions"></div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <div id="CardMasterGrid_Cntr">
                      <AlgaehDataGrid
                        id="CardMasterGrid"
                        datavalidate="data-validate='cardDiv'"
                        columns={[
                          {
                            label: (
                              <input
                                type="checkbox"
                                defaultChecked={
                                  checkAll === "CHECK" ? true : false
                                }
                                ref={(input) => {
                                  allChecked = input;
                                }}
                                onChange={selectAll}
                                disabled={portal_exists === "N"}
                              />
                            ),
                            fieldName: "select",
                            displayTemplate: (row) => {
                              return (
                                <input
                                  type="checkbox"
                                  checked={row.checked}
                                  onChange={(e) => selectToProcess(row, e)}
                                  disabled={portal_exists === "N"}
                                />
                              );
                            },
                            others: {
                              maxWidth: 50,
                              filterable: false,
                              sortable: false,
                            },
                          },
                          {
                            fieldName: "insurance_sub_code",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Corporate Code" }}
                              />
                            ),
                          },
                          {
                            fieldName: "insurance_sub_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Corporate Company Name" }}
                              />
                            ),
                            filterable: true,
                          },
                          {
                            fieldName: "user_id",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Username" }} />
                            ),
                          },
                          {
                            fieldName: "effective_end_date",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Valid Upto" }}
                              />
                            ),
                          },
                          {
                            fieldName: "service_type",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Service Type" }}
                              />
                            ),

                            displayTemplate: (row) => {
                              let array = JSON.parse(row.service_types);

                              return (
                                <Select
                                  {...{
                                    mode: "multiple",
                                    style: {
                                      width: "100%",
                                    },
                                    data_role: "multipleSelectList",
                                    name: "service_type",
                                    value: array ? array : undefined,
                                    options: serviceTypes,
                                    onChange: (e) => {
                                      row["isDirtyUpdate"] = true;
                                      row.service_type = e;
                                    },
                                    optionFilterProp: "children",
                                    // onSearch: onSearch,
                                    disabled: portal_exists === "N",
                                    filterOption: (input, option) => {
                                      return (
                                        option.label
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                      );
                                    },

                                    placeholder: "Select Item...",
                                    // maxTagCount: "responsive",
                                  }}
                                />
                              );
                            },
                          },
                        ]}
                        rowUniqueId="hims_d_promotion_id"
                        data={gridData ?? []}
                        // data={data}
                        pagination={true}
                        isFilterable={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                className="btn btn-primary"
                onClick={() => {
                  updateFunction();
                }}
                // disabled={portal_exists === "N"}
              >
                Publish to Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
