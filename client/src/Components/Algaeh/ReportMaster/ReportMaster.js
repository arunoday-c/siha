import React, { useState } from "react";
import "./ReportMaster.scss";
import {
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehDataGrid,
  AlgaehMessagePop,
  Spin,
} from "algaeh-react-components";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { newAlgaehApi } from "../../../hooks";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "react-query";
const getReportDetailsFromDataBase = async (key) => {
  const result = await newAlgaehApi({
    uri: "/algaehMasters/getReportDetailsFromDataBase",

    method: "GET",
  });
  return result?.data?.records;
};
const updateReportMaster = async (data) => {
  const result = await newAlgaehApi({
    uri: "/algaehMasters/updateReportMaster",

    data: {
      ...data,
      report_props: JSON.stringify({
        header: {
          top: data.header_top,
          bottom: data.header_bottom,
          right: data.header_right,
          left: data.header_left,
        },
        footer: {
          top: data.footer_top,
          bottom: data.footer_bottom,
          right: data.footer_right,
          left: data.footer_left,
        },
        pageOrientation: data.pageOrientation,
        pageSize: data.page_size,
      }),
    },
    method: "PUT",
  });
  return result.data?.records;
};
const addNewReportsFromReportMaster = async (data) => {
  const result = await newAlgaehApi({
    uri: "/algaehMasters/addNewReportsFromReportMaster",
    data: {
      ...data,
      report_props: JSON.stringify({
        header: {
          top: data.header_top,
          bottom: data.header_bottom,
          right: data.header_right,
          left: data.header_left,
        },
        footer: {
          top: data.footer_top,
          bottom: data.footer_bottom,
          right: data.footer_right,
          left: data.footer_left,
        },
        pageOrientation: data.pageOrientation,
        pageSize: data.page_size,
      }),
    },
    method: "POST",
  });
  return result.data?.records;
};
export default function ReportMaster() {
  const [thermal_print, setThermal_print] = useState("");
  const [current, setCurrent] = useState(null);
  const {
    control,
    errors,
    handleSubmit,
    // register,
    reset,
    // setValue,
    // getValues,
    // watch,
  } = useForm();

  const { data: reportDetails, refetch } = useQuery(
    ["report-details"],
    getReportDetailsFromDataBase,
    {
      // initialStale: true,
      onSuccess: (data) => {},
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const [save, { isLoading: saveLoading }] = useMutation(
    addNewReportsFromReportMaster,
    {
      onSuccess: (data) => {
        reset({});
        setCurrent(null);
        setThermal_print("");
        refetch();
        AlgaehMessagePop({
          display: "Report Added Successfully",
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

  const [update, { isLoading: updateLoading }] = useMutation(
    updateReportMaster,
    {
      onSuccess: (data) => {
        reset({});
        setCurrent(null);
        setThermal_print("");
        refetch();
        AlgaehMessagePop({
          display: "Report Updated Successfully",
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
  const onSubmit = (data) => {
    console.error(errors);

    if (current) {
      update({ ...data, report_id: current, report_type: thermal_print });
    } else {
      if (thermal_print) {
        save({ ...data, report_type: thermal_print });
      } else {
        AlgaehMessagePop({
          display: "Please Select Thermal Print",
          type: "error",
        });
      }
    }
  };
  return (
    <div className="ReportMaster">
      <form onSubmit={handleSubmit(onSubmit)} onError={onSubmit}>
        <Spin spinning={updateLoading || saveLoading}>
          <div className="row inner-top-search margin-bottom-15">
            {" "}
            <Controller
              control={control}
              rules={{ required: "Required" }}
              name="report_module"
              render={({ value, onChange, onBlur }) => (
                <AlgaehAutoComplete
                  div={{ className: "col mandatory form-group" }}
                  label={{
                    forceLabel: "Report Category",
                    isImp: true,
                  }}
                  error={errors}
                  selector={{
                    value,
                    onChange: (_, selected) => {
                      onChange(selected);
                    },
                    onClear: () => {
                      onChange("");
                    },
                    name: "report_module",
                    dataSource: {
                      data: GlobalVariables.REPORT_CATEGORY,
                      valueField: "value",
                      textField: "name",
                    },
                  }}
                />
              )}
            />
            <Controller
              name="report_name_for_header"
              control={control}
              rules={{ required: "Required" }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col-3 mandatory form-group" }}
                  error={errors}
                  label={{
                    forceLabel: "Report Name",
                    isImp: true,
                  }}
                  textBox={{
                    type: "text",
                    name: "report_name_for_header",
                    // type: "text",
                    className: "form-control",
                    ...props,
                  }}
                />
              )}
            />
            <Controller
              name="report_name"
              control={control}
              rules={{ required: "Required" }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col-3 mandatory form-group" }}
                  error={errors}
                  label={{
                    forceLabel: "Report File Name (Js)",
                    isImp: true,
                  }}
                  textBox={{
                    type: "text",
                    name: "report_name",
                    // type: "text",
                    className: "form-control",
                    ...props,
                  }}
                />
              )}
            />
            <Controller
              name="report_header_file_name"
              control={control}
              // rules={{ required: "Required" }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col-3 mandatory form-group" }}
                  // error={errors}
                  label={{
                    forceLabel: "Report Header Name (Hbs)",
                    isImp: true,
                  }}
                  textBox={{
                    type: "text",
                    name: "report_header_file_name",
                    // type: "text",
                    className: "form-control",
                    ...props,
                  }}
                />
              )}
            />
            <Controller
              name="report_footer_file_name"
              control={control}
              // rules={{ required: "Required" }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col-3 mandatory form-group" }}
                  // error={errors}
                  label={{
                    forceLabel: "Report Footer Name (Hbs)",
                    isImp: true,
                  }}
                  textBox={{
                    type: "text",
                    name: "report_footer_file_name",
                    // type: "text",
                    className: "form-control",
                    ...props,
                  }}
                />
              )}
            />
            <Controller
              control={control}
              rules={{ required: "Required" }}
              name="status"
              render={({ value, onChange, onBlur }) => (
                <AlgaehAutoComplete
                  div={{ className: "col mandatory form-group" }}
                  label={{
                    forceLabel: "Report Status",

                    isImp: true,
                  }}
                  error={errors}
                  selector={{
                    value,
                    onChange: (_, selected) => {
                      onChange(selected);
                    },
                    onClear: () => {
                      onChange("");
                    },
                    name: "status",
                    dataSource: {
                      data: GlobalVariables.FORMAT_STATUS,
                      valueField: "value",
                      textField: "name",
                    },
                  }}
                />
              )}
            />
            <div
              className="col algaehLabelFormGroup"
              style={{ margin: "0px 15px 15px" }}
            >
              <label className="algaehLabelGroup">Report Properties</label>
              <div className="row">
                <Controller
                  control={control}
                  // rules={{ required: "Required" }}
                  name="page_size"
                  render={({ value, onChange, onBlur }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col  form-group" }}
                      label={{
                        forceLabel: "Page Size",
                        // isImp: true,
                      }}
                      // error={errors}
                      selector={{
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);
                        },
                        onClear: () => {
                          onChange("");
                        },
                        name: "page_size",
                        dataSource: {
                          textField: "name",
                          valueField: "pageSize",
                          data: [
                            { name: "A1", pageSize: "A1" },
                            { name: "A2", pageSize: "A2" },
                            { name: "A3", pageSize: "A3" },
                            { name: "A4", pageSize: "A4" },
                          ],
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  // rules={{ required: "Required" }}
                  name="pageOrientation"
                  render={({ value, onChange, onBlur }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col  form-group" }}
                      label={{
                        forceLabel: "Page Layout",
                        // isImp: true,
                      }}
                      // error={errors}
                      selector={{
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);
                        },
                        onClear: () => {
                          onChange("");
                        },
                        name: "pageOrientation",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: [
                            {
                              name: "Landscape",
                              value: "landscape",
                            },
                            { name: "Potrait", value: "potrait" },
                          ],
                        },
                      }}
                    />
                  )}
                />

                <div className="col">
                  <label>Termal Print</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Thermal"
                        name="thermal_print"
                        onChange={(e) => setThermal_print(e.target.value)}
                        checked={thermal_print === "Thermal"}
                      />
                      <span>Yes</span>
                      {/* <input
                    type=""
                    value="Thermal"
                    name="thermal_print"
                    checked={
                      thermal_print === "Thermal"
                        ? true
                        : false
                    }
                    onChange={}
                  /> */}
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="No"
                        name="thermal_print"
                        onChange={(e) => setThermal_print(e.target.value)}
                        checked={thermal_print === "No"}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col algaehLabelFormGroup"
              style={{ margin: "0px 15px 15px" }}
            >
              <label className="algaehLabelGroup">Header Margin</label>
              <div className="row">
                <Controller
                  name="header_top"
                  control={control}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group " }}
                      // error={errors}
                      label={{
                        forceLabel: "Top",
                        // isImp: true,
                      }}
                      textBox={{
                        name: "header_top",
                        type: "number",
                        className: "form-control",
                        ...props,
                        others: {
                          type: "number",
                        },
                      }}
                    />
                  )}
                />{" "}
                <Controller
                  name="header_right"
                  control={control}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group " }}
                      // error={errors}
                      label={{
                        forceLabel: "Right",
                        // isImp: true,
                      }}
                      textBox={{
                        name: "header_right",
                        type: "number",
                        className: "form-control",
                        ...props,
                        others: {
                          type: "number",
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="header_bottom"
                  control={control}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group " }}
                      // error={errors}
                      label={{
                        forceLabel: "Bottom",
                        // isImp: true,
                      }}
                      textBox={{
                        name: "header_bottom",
                        type: "number",
                        className: "form-control",
                        ...props,
                        others: {
                          tabIndex: "7",
                          type: "number",
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="header_left"
                  control={control}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group " }}
                      // error={errors}
                      label={{
                        forceLabel: "Left",
                        // isImp: true,
                      }}
                      textBox={{
                        name: "header_left",
                        type: "number",
                        className: "form-control",
                        ...props,
                        others: {
                          tabIndex: "7",
                          type: "number",
                        },
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div
              className="col algaehLabelFormGroup"
              style={{ margin: "0px 15px 15px" }}
            >
              <label className="algaehLabelGroup">Footer Margin</label>
              <div className="row">
                <Controller
                  name="footer_top"
                  control={control}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group " }}
                      // error={errors}
                      label={{
                        forceLabel: "Top",
                        // isImp: true,
                      }}
                      textBox={{
                        name: "footer_top",
                        type: "number",
                        className: "form-control",
                        ...props,
                        others: {
                          tabIndex: "7",
                          type: "number",
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="footer_right"
                  control={control}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group " }}
                      // error={errors}
                      label={{
                        forceLabel: "Right",
                        // isImp: true,
                      }}
                      textBox={{
                        name: "footer_right",
                        type: "number",
                        className: "form-control",
                        ...props,
                        others: {
                          tabIndex: "7",
                          type: "number",
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="footer_bottom"
                  control={control}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group " }}
                      // error={errors}
                      label={{
                        forceLabel: "Bottom",
                        // isImp: true,
                      }}
                      textBox={{
                        name: "footer_bottom",
                        type: "number",
                        className: "form-control",
                        ...props,
                        others: {
                          tabIndex: "7",
                          type: "number",
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="footer_left"
                  control={control}
                  // rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group " }}
                      error={errors}
                      label={{
                        forceLabel: "Left",
                        // isImp: true,
                      }}
                      textBox={{
                        name: "footer_left",
                        type: "number",
                        className: "form-control",
                        ...props,
                        others: {
                          tabIndex: "7",
                          type: "number",
                        },
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-12" style={{ textAlign: "right" }}>
              <button
                type="submit"
                style={{ marginBottom: 15 }}
                className="btn btn-primary"
              >
                {current ? "Update" : "Add to List"}
              </button>
            </div>{" "}
          </div>
        </Spin>
      </form>

      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">List of Reports</h3>
              </div>
              <div className="actions"></div>
            </div>

            <div className="portlet-body">
              <div className="row">
                <div className="col-12">
                  <AlgaehDataGrid
                    id=""
                    columns={[
                      {
                        fieldName: "",
                        label: <AlgaehLabel label={{ fieldName: "Action" }} />,
                        filterable: true,
                        displayTemplate: (row) => {
                          return (
                            <i
                              className="fas fa-pen"
                              onClick={() => {
                                setCurrent(row.report_id);
                                const reportProps = JSON.parse(
                                  row.report_props
                                );
                                setThermal_print(
                                  row.report_type === "Thermal"
                                    ? "Thermal"
                                    : "No"
                                );
                                reset({
                                  ...row,
                                  header_bottom: reportProps?.header.bottom,
                                  header_left: reportProps?.header.left,
                                  header_right: reportProps?.header.right,
                                  header_top: reportProps?.header.top,
                                  footer_bottom: reportProps?.footer.bottom,
                                  footer_left: reportProps?.footer.left,
                                  footer_right: reportProps?.footer.right,
                                  footer_top: reportProps?.footer.top,
                                  pageOrientation: reportProps?.pageOrientation,
                                  page_size: reportProps?.pageSize,
                                });
                              }}
                            ></i>
                          );
                        },
                      },
                      {
                        fieldName: "report_module",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Category" }} />
                        ),
                        filterable: true,
                        displayTemplate: (row) => {
                          return row.report_module === "HR"
                            ? "HR Management"
                            : row.report_module === "INV"
                            ? "Inventory"
                            : row.report_module === "PHR"
                            ? "Pharmacy"
                            : row.report_module === "PAY"
                            ? "Payroll "
                            : row.report_module === "FIN"
                            ? "Finance"
                            : row.report_module === "HIS"
                            ? "HIS"
                            : row.report_module === "MIS"
                            ? "MIS"
                            : row.report_module === "APP"
                            ? "APP"
                            : row.report_module === "VAT"
                            ? "VAT Report"
                            : row.report_module === "PJC"
                            ? "Project Job Cost"
                            : row.report_module === "INS"
                            ? "INS"
                            : row.report_module === "SAL"
                            ? "Sales"
                            : row.report_module === "PRC"
                            ? "PRC"
                            : row.report_module === "EMP"
                            ? "Employee"
                            : row.report_module === "LAB"
                            ? "Laboratory"
                            : row.report_module === "RAD"
                            ? "Radiology"
                            : "None";
                        },
                      },

                      {
                        fieldName: "report_name_for_header",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Report Name" }} />
                        ),
                        filterable: true,
                      },
                      {
                        fieldName: "report_name",
                        label: (
                          <AlgaehLabel label={{ fieldName: "File Name" }} />
                        ),
                        filterable: true,
                      },
                      {
                        fieldName: "report_header_file_name",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Header Name" }} />
                        ),
                        filterable: true,
                      },
                      {
                        fieldName: "report_footer_file_name",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Footer Name" }} />
                        ),
                        filterable: true,
                      },
                      {
                        fieldName: "report_type",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Termal Print" }} />
                        ),
                        filterable: true,
                        displayTemplate: (row) => {
                          return row.report_type === "Thermal"
                            ? "Thermal"
                            : "--";
                        },
                      },
                      {
                        fieldName: "page_size",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Page Size" }} />
                        ),
                        filterable: true,
                        displayTemplate: (row) => {
                          const obj = JSON.parse(row.report_props);

                          return obj?.pageSize ? obj?.pageSize : "";
                        },
                      },
                      {
                        fieldName: "page_layout",
                        label: <AlgaehLabel label={{ fieldName: "Layout" }} />,
                        filterable: true,
                        displayTemplate: (row) => {
                          const obj = JSON.parse(row.report_props);

                          return obj?.pageOrientation
                            ? obj?.pageOrientation
                            : "";
                        },
                      },
                      {
                        fieldName: "status",
                        label: <AlgaehLabel label={{ fieldName: "Status" }} />,
                        filterable: true,
                      },
                    ]}
                    keyId="index"
                    data={reportDetails ? reportDetails : []}
                    isFilterable={true}
                    pagination={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
