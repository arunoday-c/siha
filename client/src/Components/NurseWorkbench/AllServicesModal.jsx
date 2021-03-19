import React from "react";
import { AlgaehDataGrid, Spin, AlgaehLabel } from "algaeh-react-components";
import { useQuery } from "react-query";
import { newAlgaehApi } from "../../hooks";
const getAllServicesDateRange = async (key, { dateRange }) => {
  const res = await newAlgaehApi({
    uri: "/orderAndPreApproval/getAllServicesDateRange",
    method: "GET",
    data: {
      selectedHDate: dateRange,
    },
  });
  return res.data?.records;
};
export default function AllServicesModal({ selectedHDate }) {
  const { data: gridData, isLoading: serviceLoading } = useQuery(
    ["promoDetails", { dateRange: selectedHDate }],
    getAllServicesDateRange
  );
  return (
    <div>
      <Spin spinning={serviceLoading}>
        <AlgaehDataGrid
          //   id="hospitalservices_grid"
          columns={[
            {
              fieldName: "service_code",
              label: <AlgaehLabel label={{ fieldName: "service_code" }} />,
              others: {
                Width: 150,
                style: { textAlign: "center" },
              },
              filterable: true,
            },
            {
              fieldName: "service_name",
              label: <AlgaehLabel label={{ fieldName: "service_name" }} />,
              others: {
                style: { textAlign: "left" },
              },
              filterable: true,
            },
            {
              fieldName: "service_type",
              label: <AlgaehLabel label={{ fieldName: "Service type" }} />,

              others: {
                Width: 150,
                style: { textAlign: "center" },
              },
              filterable: true,
              filterType: "choices",
              choices: [
                {
                  name: "Laboratory",
                  value: "Lab",
                },
                {
                  name: "Radiology",
                  value: "Radiology",
                },
              ],
            },
            {
              fieldName: "full_name",
              label: <AlgaehLabel label={{ fieldName: "Patient Name" }} />,

              others: {
                Width: 130,
                style: { textAlign: "center" },
              },
              filterable: true,
            },
            {
              fieldName: "patient_code",
              label: <AlgaehLabel label={{ fieldName: "Patient Code" }} />,
              others: {
                Width: 110,
                style: { textAlign: "right" },
              },
              filterable: true,
            },
            {
              fieldName: "doc_name",
              label: <AlgaehLabel label={{ fieldName: "Doctor Name" }} />,
              others: {
                Width: 120,
                style: { textAlign: "right" },
              },
              filterable: true,
            },
          ]}
          keyId="service_code"
          data={gridData ?? []}
          pagination={true}
          // editable
          // actionsStyle={{width:100}}
          pageOptions={{ rows: 20, page: 1 }}
          isFilterable={true}
        />
      </Spin>
    </div>
  );
}

// export default AllServicesModal;
