import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import moment from "moment";
import Options from "../../Options.json";
import Enumerable from "linq";

export default function DashBoardEvents() {
  return {
    getSampleCollectionDetails: $this => {
      let inputobj = {};

      let month = moment(new Date()).format("MM");
      let year = moment().year();

      let from_date = moment("01" + month + year, "DDMMYYYY")._d;

      inputobj.from_date = moment(from_date).format(Options.dateFormatYear);

      inputobj.to_date = moment().format(Options.dateFormatYear);

      algaehApiCall({
        uri: "/laboratory/getLabOrderedServices",
        module: "laboratory",
        method: "GET",
        data: inputobj,
        onSuccess: response => {
          if (response.data.success) {
            let sample_collection = Enumerable.from(response.data.records)
              .groupBy("$.visit_id", null, (k, g) => {
                let firstRecordSet = Enumerable.from(g).firstOrDefault();
                return {
                  patient_code: firstRecordSet.patient_code,
                  full_name: firstRecordSet.full_name,
                  ordered_date: firstRecordSet.ordered_date,
                  //   number_of_tests: g.getSource().length,
                  //   test_details: g.getSource(),
                  //   provider_id: firstRecordSet.provider_id,
                  //   billed: firstRecordSet.billed,
                  //   visit_code: firstRecordSet.visit_code,
                  //   doctor_name: firstRecordSet.doctor_name,
                  status: firstRecordSet.status
                  //   test_type: firstRecordSet.test_type
                };
              })
              .toArray();
            console.log("sample_collection", sample_collection);
            $this.setState({ sample_collection: sample_collection });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  };
}
