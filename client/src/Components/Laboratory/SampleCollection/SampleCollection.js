import React, { useContext, useState, useEffect } from "react";
import Options from "../../../Options.json";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehMessagePop,
  MainContext,
  Tooltip,
  // AlgaehFormGroup,
  AlgaehSecurityComponent,
} from "algaeh-react-components";
import _ from "lodash";
import "./SampleCollection.scss";
import SampleCollectionModal from "../SampleCollections/SampleCollections";
import "./../../../styles/site.scss";
// import Enumerable from "linq";
import { useQuery } from "react-query";
import { newAlgaehApi } from "../../../hooks";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import sockets from "../../../sockets";
// import { algaehApiCall } from "../../../utils/algaehApiCall";
import BulkBarcodeModal from "./BulkBarcodeModal";
// import _ from "moment";
function SampleCollection() {
  const { userToken } = useContext(MainContext);
  const [currentPage, setCurrentPage] = useState(1);
  const { control, errors, reset } = useForm({
    defaultValues: {
      hospital_id: userToken.hims_d_hospital_id,
      // start_date: [moment(new Date()), moment(new Date())],
    },
  });
  const [bulkBarcodeModalVisible, setBulkBarcodeModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sample_collection, setSample_collection] = useState([]);
  const [selected_patient, setSelected_patient] = useState([]);
  const [start_date, setStartDate] = useState([
    moment(new Date()),
    moment(new Date()),
  ]);
  const ShowCollectionModel = (row, e) => {
    setIsOpen(!isOpen);
    setSelected_patient(row);
  };
  const CloseCollectionModel = (e) => {
    setIsOpen(!isOpen);
    setSelected_patient([]);
    refetch();
  };
  useEffect(() => {
    sockets.on("reload_specimen_collection", (billData) => {
      const { bill_date } = billData;
      const date = moment(bill_date).format("YYYY-MM-DD");
      // const start = new Date(
      //   moment(getValues().from_date).format("YYYY-MM-DD")
      // );
      // const end = new Date(moment(getValues().to_date).format("YYYY-MM-DD"));

      const _date = start_date;
      const start = moment(_date[0]).format("YYYY-MM-DD");
      const end = moment(_date[1]).format("YYYY-MM-DD");

      if (date >= start && date <= end) {
        // if (window.location.pathname === "/RadOrderedList")
        refetch();
      } else {
        return;
      }
    });
  }, []);
  const { refetch } = useQuery(
    ["getLabOrderedServices", {}],
    getLabOrderedServices,
    {
      // initialStale: true,
      // cacheTime: Infinity,
      // enabled: enabledHESN,
      onSuccess: (data) => {
        // setEnabledHESN(false);
        let sampleCollection = _.chain(data)
          .groupBy((g) => (g.visit_id ? g.visit_id : g.ip_id))
          .map((detail, key) => {
            const {
              patient_id,
              visit_id,
              primary_id_no,
              patient_code,
              test_type,
              full_name,
              status,
              ordered_date,
              ip_id,
            } = _.head(detail);
            const number_of_tests_collected = detail.filter(
              (f) => f.collected === "Y"
            ).length;
            return {
              patient_id: patient_id,
              visit_id: visit_id,
              primary_id_no: primary_id_no,
              patient_code: patient_code,
              full_name: full_name,
              ordered_date: ordered_date,
              ip_id: ip_id,
              number_of_tests: detail.length,
              // collected: "Y",

              number_of_tests_collected: number_of_tests_collected,

              status: status,
              sample_status:
                detail.length === number_of_tests_collected ? "CL" : "O",
              test_type: test_type,
              // doctor_name: firstRecordSet.doctor_name,}
            };
          })
          .value();
        // let sampleCollection = Enumerable.from(data)
        //   .groupBy("$.visit_id", null, (k, g) => {
        //     let firstRecordSet = Enumerable.from(g).firstOrDefault();

        //     const number_of_tests_collected = g
        //       .getSource()
        //       .filter((f) => f.collected === "Y").length;
        //     return {
        //       patient_id: firstRecordSet.patient_id,
        //       visit_id: firstRecordSet.visit_id,
        //       primary_id_no: firstRecordSet.primary_id_no,
        //       patient_code: firstRecordSet.patient_code,
        //       full_name: firstRecordSet.full_name,
        //       ordered_date: firstRecordSet.ordered_date,
        //       ip_id: firstRecordSet.ip_id,
        //       number_of_tests: g.getSource().length,
        //       // collected: "Y",

        //       number_of_tests_collected: number_of_tests_collected,

        //       status: firstRecordSet.status,
        //       sample_status:
        //         g.getSource().length === number_of_tests_collected ? "CL" : "O",
        //       test_type: firstRecordSet.test_type,
        //       // doctor_name: firstRecordSet.doctor_name,
        //     };
        //   })
        //   .toArray();
        setSample_collection(sampleCollection);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getLabOrderedServices(key) {
    const date = start_date;
    const from_date = moment(date[0]).format("YYYY-MM-DD");
    const to_date = moment(date[1]).format("YYYY-MM-DD");

    const result = await newAlgaehApi({
      uri: "/laboratory/getLabOrderedServices",
      module: "laboratory",
      method: "GET",
      data: {
        from_date,
        to_date,
      },
    });
    return result?.data?.records;
  }
  const changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.datetimeFormat);
    }
  };

  const printBulkBarcodewithFilter = () => {
    // const data = test_details;
    // const filterData = data.filter((f) => f.checked && f.collected === "Y");
    // if (filterData.length === 0) {
    //   swalMessage({
    //     title: "Select alteast one record.",
    //     type: "warning",
    //   });
    //   return;
    // }
    // const labOrderId = filterData.map((item) => item.hims_f_lab_order_id);
    setBulkBarcodeModalVisible(true);
    // algaehApiCall({
    //   uri: "/report",
    //   method: "GET",
    //   module: "reports",
    //   headers: {
    //     Accept: "blob",
    //   },
    //   others: { responseType: "blob" },
    //   data: {
    //     report: {
    //       others: {
    //         width: "50mm",
    //         height: "20mm",
    //         showHeaderFooter: false,
    //       },
    //       reportName: "specimenBarcodeBulk",
    //       reportParams: [
    //         // {
    //         //   name: "hims_f_lab_order_id",
    //         //   value: labOrderId,
    //         // },
    //       ],
    //       outputFileType: "PDF",
    //     },
    //   },

    //   onSuccess: (res) => {
    //     const urlBlob = URL.createObjectURL(res.data);
    //     const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
    //     window.open(origin);
    //   },

    //   // onSuccess: (res) => {
    //   //   const urlBlob = URL.createObjectURL(res.data);
    //   //   const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Specimen Barcode`;
    //   //   window.open(origin);
    //   //    window.document.title = "Specimen Barcode";
    //   // },
    // });
  };
  return (
    <div className="hptl-phase1-result-entry-form">
      <div className="row inner-top-search" style={{ paddingBottom: "10px" }}>
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
                forceLabel: "ORDERED DATE & TIME",
                isImp: true,
              }}
              error={errors}
              textBox={{
                className: "txt-fld",
                name: "start_date",
                value: start_date,
              }}
              type="range"
              // others={{ disabled }}
              events={{
                onChange: (mdate) => {
                  if (mdate) {
                    onChange(mdate);
                    setStartDate(mdate);
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

        <div className="col-2" style={{ marginTop: "21px" }}>
          <button
            className="btn btn-default btn-sm"
            type="button"
            onClick={() => {
              reset({ start_date: [moment(new Date()), moment(new Date())] });
            }}
          >
            Clear
          </button>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginLeft: "10px" }}
            type="button"
            onClick={() => {
              // setEnabledHESN(true)
              refetch();
            }}
          >
            Load
          </button>
        </div>
      </div>
      {/* <div className="row  margin-bottom-15 topResultCard">
       
      </div> */}
      <div className="row">
        <div className="col-lg-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Specimen Collection List</h3>
              </div>
            </div>
            <div className="portlet-body" id="samplecollectionListGrid">
              <AlgaehDataGrid
                columns={[
                  {
                    fieldName: "action",
                    label: <AlgaehLabel label={{ fieldName: "action" }} />,
                    displayTemplate: (row) => {
                      return (
                        <Tooltip title="View Ordered Test" placement={"right"}>
                          <span className="tooltopBagde">
                            <i
                              className="fas fa-eye"
                              onClick={() => ShowCollectionModel(row)}
                            />
                            <small>{row.number_of_tests}</small>
                          </span>
                        </Tooltip>
                      );
                    },
                    others: {
                      width: 50,
                      resizable: false,
                      filterable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "ordered_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "ordered_date" }} />
                    ),
                    displayTemplate: (row) => {
                      return <span>{changeDateFormat(row.ordered_date)}</span>;
                    },
                    disabled: true,
                    others: {
                      width: 180,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                    sortable: true,
                    filterable: true,
                    filterType: "date",
                    // choices: [
                    //   {
                    //     name: "Stat",
                    //     value: "S",
                    //   },
                    //   {
                    //     name: "Routine",
                    //     value: "R",
                    //   },
                    // ],
                  },
                  // {
                  //   fieldName: "number_of_tests",
                  //   label: (
                  //     <AlgaehLabel label={{ forceLabel: "Tests Count" }} />
                  //   ),
                  //   filterable: true,
                  //   others: {
                  //     width: 110,
                  //     resizable: false,
                  //     style: { textAlign: "center" },
                  //   },
                  // },
                  // {
                  //   fieldName: "test_type",
                  //   label: <AlgaehLabel label={{ fieldName: "priority" }} />,
                  //   displayTemplate: (row) => {
                  //     return row.test_type === "S" ? (
                  //       <span className="badge badge-danger">Stat</span>
                  //     ) : (
                  //       <span className="badge badge-secondary">Routine</span>
                  //     );
                  //   },
                  //   disabled: true,
                  //   others: {
                  //     width: 100,
                  //     resizable: false,
                  //     style: { textAlign: "center" },
                  //   },
                  //   filterable: true,
                  //   filterType: "choices",
                  //   choices: [
                  //     {
                  //       name: "Stat",
                  //       value: "S",
                  //     },
                  //     {
                  //       name: "Routine",
                  //       value: "R",
                  //     },
                  //   ],
                  // },

                  {
                    fieldName: "sample_status",
                    label: <AlgaehLabel label={{ fieldName: "status" }} />,
                    displayTemplate: (row) => {
                      return (
                        <span className="badge badge-light">
                          {row.number_of_tests_collected} /{row.number_of_tests}
                          -
                          {row.number_of_tests_collected === row.number_of_tests
                            ? "Collected"
                            : "Ordered"}
                        </span>
                      );
                    },
                    disabled: true,
                    filterable: true,
                    sortable: true,
                    filterType: "choices",
                    choices: [
                      {
                        name: "Ordered",
                        value: "O",
                      },
                      {
                        name: "Collected",
                        value: "CL",
                      },
                    ],
                    others: {
                      width: 120,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },

                  // {
                  //   fieldName: "status",
                  //   label: <AlgaehLabel label={{ fieldName: "status" }} />,
                  //   displayTemplate: (row) => {
                  //     return row.status === "O" ? (
                  //       <span className="badge badge-light">Ordered</span>
                  //     ) : row.status === "CL" ? (
                  //       <span className="badge badge-secondary">Collected</span>
                  //     ) : row.status === "CN" ? (
                  //       <span className="badge badge-danger">Cancelled</span>
                  //     ) : row.status === "CF" ? (
                  //       <span className="badge badge-primary">Confirmed</span>
                  //     ) : (
                  //       <span className="badge badge-success">Validated</span>
                  //     );
                  //   },
                  //   disabled: true,
                  //   others: {
                  //     width: 100,
                  //     resizable: false,
                  //     style: { textAlign: "center" },
                  //   },
                  //   filterable: true,
                  //   filterType: "choices",
                  //   choices: [
                  //     {
                  //       name: "Ordered",
                  //       value: "O",
                  //     },
                  //     {
                  //       name: "Collected",
                  //       value: "CL",
                  //     },
                  //     {
                  //       name: "Confirmed",
                  //       value: "CF",
                  //     },
                  //     {
                  //       name: "Validated",
                  //       value: "V",
                  //     },
                  //     {
                  //       name: "Cancelled",
                  //       value: "CN",
                  //     },
                  //   ],
                  // },

                  {
                    fieldName: "primary_id_no",
                    label: (
                      <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
                    ),
                    disabled: false,
                    filterable: true,
                    sortable: true,
                    others: {
                      width: 120,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "patient_code",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_code" }} />
                    ),
                    disabled: false,
                    filterable: true,
                    sortable: true,
                    others: {
                      width: 120,
                      resizable: false,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "full_name",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_name" }} />
                    ),
                    disabled: true,
                    filterable: true,
                    sortable: true,
                    others: {
                      resizable: false,
                      style: { textAlign: "left" },
                    },
                  },
                  // {
                  //   fieldName: "visit_code",
                  //   label: (
                  //     <AlgaehLabel label={{ fieldName: "visit_code" }} />
                  //   ),
                  //   disabled: false,
                  //   others: {
                  //     maxWidth: 150,
                  //     resizable: false,
                  //     style: { textAlign: "center" }
                  //   }
                  // },
                ]}
                keyId="patient_code"
                data={sample_collection}
                // filter={true}
                pagination={true}
                pageOptions={{ rows: 50, page: currentPage }}
                pageEvent={(page) => {
                  setCurrentPage(page);
                }}
                isFilterable={true}
                noDataText="No data available for selected period"
                // paging={{ page: 0, rowsPerPage: 100 }}
              />
            </div>
          </div>
        </div>
      </div>
      {isOpen ? (
        <SampleCollectionModal
          HeaderCaption={
            <AlgaehLabel
              label={{
                fieldName: "sample_collection",
                align: "ltr",
              }}
            />
          }
          isOpen={isOpen}
          onClose={CloseCollectionModel}
          selected_patient={selected_patient}
        />
      ) : null}
      {bulkBarcodeModalVisible ? (
        <BulkBarcodeModal
          visible={bulkBarcodeModalVisible}
          onCancel={() => {
            setBulkBarcodeModalVisible(!bulkBarcodeModalVisible);
          }}
          title={"Bulk Barcode Print"}
        />
      ) : null}
      <AlgaehSecurityComponent componentCode="BTN_BLK_SAM_BAR_COL_FLTR">
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-default"
                onClick={printBulkBarcodewithFilter}
              >
                <AlgaehLabel label={{ forceLabel: "Bulk Barcode" }} />
              </button>
            </div>
          </div>
        </div>
      </AlgaehSecurityComponent>
    </div>
  );
}

export default SampleCollection;
