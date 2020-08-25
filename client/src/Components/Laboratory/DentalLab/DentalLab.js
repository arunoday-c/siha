import React, { useEffect, useState, useContext } from "react";
import "./DentalLab.scss";
import {
  AlgaehLabel,
  AlgaehFormGroup,
  // AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  // Checkbox,
  // AlgaehButton,
  // Modal,
  // AlgaehTreeSearch,
  AlgaehDateHandler,
  AlgaehMessagePop,
  // DatePicker,
  Spin,
  AlgaehModal,
  MainContext,

  //   AlgaehButton,
} from "algaeh-react-components";
import ButtonType from "../../Wrapper/algaehButton";
import { newAlgaehApi } from "../../../hooks/";
import moment from "moment";
// import swal from "sweetalert2";
import { Controller, useForm } from "react-hook-form";
// import DentalImage from "../../../assets/images/dcaf_Dental_chart.png";
// import { swalMessage } from "../../../utils/algaehApiCall";
// const { confirm } = Modal;
export default function DentalLab() {
  // const [OpenForm, setOpenForm] = useState(false);
  const { userLanguage } = useContext(MainContext);
  const [openDentalModal, setOpenDentalModal] = useState(false);
  const [loading_request_list, setLoadingRequestList] = useState(false);
  const [request_list, setRequestList] = useState([]);
  console.log("request_list", request_list);
  const [procedureList, setProcedureList] = useState([]);
  console.log("request_list", procedureList);
  const [loading, setLoading] = useState(true);
  // const [viewDentalModal, setViewDentalModal] = useState(false);

  const { control, getValues, setValue } = useForm({
    shouldFocusError: true,
    defaultValues: {},
  });
  useEffect(() => {
    Promise.all([loadRequestList(getValues())]).then(() => {
      setLoadingRequestList(false);
    });
  }, []);
  const loadRequestList = async (data) => {
    setLoadingRequestList(true);
    try {
      const res = await newAlgaehApi({
        uri: "/dentalForm/getDentalLab",
        method: "GET",
        data: {
          from_due_date: data.from_due_date,
          to_due_date: data.to_due_date,
        },
      });
      if (res.data.success) {
        setRequestList(res.data.result);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  const getProcedures = async () => {
    try {
      const res = await newAlgaehApi({
        uri: "/serviceType/getService",
        module: "masterSettings",
        data: {
          procedure_type: "DN",
        },
        method: "GET",
      });
      if (res.data.success) {
        setProcedureList(res.data.result);
      }
    } catch (e) {
      setLoading(false);
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  const onCancel = () => {
    setOpenDentalModal(false);
  };
  const openDentalModalHandler = (row) => {
    setOpenDentalModal(true);
    getProcedures();
  };
  return (
    <Spin spinning={loading}>
      <AlgaehModal
        visible={openDentalModal}
        title="Request Dental Service"
        closable={false}
        onCancel={onCancel}
        className={`${userLanguage}_comp row algaehNewModal dentalLabRequest`}
        // onOk={onOK}
      >
        <div
          className="col-12 popupInner margin-top-15"
          data-validate="addDentalPlanDiv"
        >
          <div className="row">
            <div className="col-12 popRightDiv">
              <div className="row">
                {/* <div className="col-3 globalSearchCntr">
            <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
            <h6 onClick={this.employeeSearch.bind(this)}>
              {this.state.employee_name
                ? this.state.employee_name
                : "Search Employee"}
              <i className="fas fa-search fa-lg"></i>
            </h6>
          </div> */}
                <div className="col-3 globalSearchCntr">
                  <AlgaehLabel label={{ forceLabel: "Search Patient" }} />
                  <h6>
                    Search Patient
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>
                <AlgaehDateHandler
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{
                    forceLabel: "Requesting Date",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "",
                  }}
                  minDate={new Date()}
                  events={{}}
                  value=""
                />
                <AlgaehAutoComplete
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{
                    forceLabel: "Select Procedure",
                    isImp: true,
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    value: "",
                    dataSource: {
                      textField: "",
                      valueField: "",
                      data: [],
                    },
                    // onChange:{},
                  }}
                />{" "}
                <AlgaehAutoComplete
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{
                    forceLabel: "Select Vendor",
                    isImp: true,
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    value: "",
                    dataSource: {
                      textField: "",
                      valueField: "",
                      data: [],
                    },
                    // onChange:{},
                  }}
                />
                <AlgaehFormGroup
                  div={{ className: "col-3 mandatory" }}
                  label={{
                    forceLabel: "Service Amount",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "",
                    type: "number",
                    value: "",
                    // onChange: (e) => {},
                    placeholder: "0.00",
                  }}
                />
                <AlgaehAutoComplete
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{
                    forceLabel: "Select Doctor",
                    isImp: true,
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    value: "",
                    dataSource: {
                      textField: "",
                      valueField: "",
                      data: [],
                    },
                    // onChange:{},
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </AlgaehModal>
      <div className="DentalLabScreen">
        <div className="row inner-top-search">
          <div className="row padding-10">
            <Controller
              name="from_due_date"
              control={control}
              render={({ value, onChange }) => (
                // <div className="col-2 algaeh-date-fld">
                <AlgaehDateHandler
                  div={{
                    className: "col-3 algaeh-date-fld",
                  }}
                  label={{ forceLabel: "From Requested Date", isImp: false }}
                  textBox={{
                    className: "form-control",
                    value,
                  }}
                  maxDate={new Date()}
                  events={{
                    onChange: (selectedDate) => {
                      setValue("from_due_date", moment(selectedDate));
                    },
                  }}
                />
              )}
            />

            <Controller
              name="to_due_date"
              control={control}
              render={({ value, onChange }) => (
                // <div className="col-6 algaeh-date-fld">
                <AlgaehDateHandler
                  div={{
                    className: "col-3 algaeh-date-fld",
                  }}
                  label={{ forceLabel: "From Requested Date", isImp: false }}
                  textBox={{
                    className: "form-control",
                    value,
                  }}
                  maxDate={new Date()}
                  events={{
                    onChange: (selectedDate) => {
                      setValue("to_due_date", moment(selectedDate));
                    },
                  }}
                />
                // </div>
              )}
            />
            <div className="col-2" style={{ marginTop: 21 }}>
              {" "}
              <ButtonType
                className="btn btn-default"
                label={{
                  forceLabel: "Load",
                  returnText: true,
                }}
                loading={loading_request_list}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 margin-top-15">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Dental Form Requests List</h3>
                </div>
                <div className="actions">
                  <a
                    className="btn btn-primary btn-circle active"
                    onClick={openDentalModalHandler}
                  >
                    <i className="fas fa-plus" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="DentalFormGrid_Cntr">
                    <AlgaehDataGrid
                      className="DentalFormGrid"
                      columns={[
                        {
                          fieldName: "action",
                          label: "Actions",
                          displayTemplate: (row) => (
                            <button onClick={openDentalModalHandler(row)}>
                              Detail
                            </button>
                          ),
                          others: {
                            maxWidth: 100,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "work_status",
                          label: "Status",

                          displayTemplate: (row) => (
                            // return (
                            <span>
                              {row.work_status === "PEN" ? (
                                <span className="badge badge-warning">
                                  Pending
                                </span>
                              ) : row.work_status === "COM" ? (
                                <span className="badge badge-success">
                                  Completed
                                </span>
                              ) : (
                                "------"
                              )}
                            </span>
                            // )

                            // <label>
                            //   {row.work_status === "WIP"
                            //     ? "Work In Progress"
                            //     : row.work_status === "PEN"
                            //     ? "Pending"
                            //     : "Completed"}{" "}
                            // </label>
                          ),
                        },
                        {
                          fieldName: "patient_code",
                          label: "MRN Number",
                        },
                        {
                          fieldName: "patient_name",
                          label: "Patient Name",
                        },
                        {
                          fieldName: "patient_name",
                          label: "Request Date",
                        },
                        {
                          fieldName: "plan_name",
                          label: "Procedure Name",
                        },
                        {
                          fieldName: "plan_name",
                          label: "Vendor Name",
                        },
                        {
                          fieldName: "employee_name",
                          label: "Doctor Name",
                        },
                        {
                          fieldName: "due_date",
                          label: "Arrival Date",
                        },
                      ]}
                      loading={false}
                      data={[]}
                      pagination={true}
                      events={
                        {
                          // onSave: updatePrePayReq,
                          // onEdit:
                          // onEditShow:
                        }
                      }
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <DentelForm
//           show={this.state.OpenForm}
//           onClose={this.OpenDentalForm.bind(this)}
//           HeaderCaption={
//             <AlgaehLabel
//               label={{
//                 forceLabel: "Dental Form",
//                 align: "ltr"
//               }}
//             />
//           }
//         /> */}
      {/* //         </div> */}
    </Spin>
  );
}
