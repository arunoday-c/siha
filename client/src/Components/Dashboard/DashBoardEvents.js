import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import moment from "moment";
import Options from "../../Options.json";
import Enumerable from "linq";
import _ from "lodash";
import { getCookie } from "../../utils/algaehApiCall.js";

let HospitalId =
  getCookie("HospitalId") !== undefined ? getCookie("HospitalId") : "";

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
                  status: firstRecordSet.status
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
    },

    getEmployeeList: $this => {
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      var firstDay = new Date(y, m, 1);
      var lastDay = new Date(y, m + 1, 0);

      algaehApiCall({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",

        onSuccess: response => {
          if (response.data.success) {
            debugger;
            let no_of_employees = response.data.records.length;

            let no_of_emp_join = _.filter(response.data.records, function(
              item
            ) {
              return _.every([
                _.inRange(
                  moment(item.date_of_joining).format("YYYYMMDD"),
                  moment(firstDay).format("YYYYMMDD"),
                  moment(lastDay).format("YYYYMMDD")
                )
              ]);
            });
            // date_of_joining
            let total_company_salary = _.sumBy(response.data.records, s =>
              parseFloat(s.cost_to_company)
            );

            let avg_salary =
              (parseFloat(no_of_employees) / parseFloat(total_company_salary)) *
              100;
            // avg_salary = Math.round(avg_salary);

            $this.setState({
              no_of_employees: no_of_employees,
              total_company_salary: total_company_salary,
              no_of_emp_join: no_of_emp_join,
              avg_salary: avg_salary
            });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    },

    getEmployeeDepartmentsWise: $this => {
      algaehApiCall({
        uri: "/employee/getEmployeeDepartmentsWise",
        module: "hrManagement",
        method: "GET",
        data: { hospital_id: HospitalId },

        onSuccess: response => {
          if (response.data.success) {
            debugger;
            let no_of_employees = response.data.records;

            let labels = [];
            let datasets = [
              {
                data: [],
                label: "Employees",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)"
              }
            ];
            for (let i = 0; i < no_of_employees.length; i++) {
              labels.push(no_of_employees[i].sub_department_name);
              datasets[0].data.push(no_of_employees[i].no_of_emp);
            }
            let Dept_Employee = { labels, datasets };

            $this.setState({
              Dept_Employee: Dept_Employee
            });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    },

    getEmployeeDesignationWise: $this => {
      algaehApiCall({
        uri: "/employee/getEmployeeDesignationWise",
        module: "hrManagement",
        method: "GET",
        data: { hospital_id: HospitalId },
        onSuccess: response => {
          if (response.data.success) {
            debugger;
            let no_of_employees = response.data.records;

            let labels = [];
            let datasets = [
              {
                data: [],
                label: "Employees",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)"
              }
            ];
            for (let i = 0; i < no_of_employees.length; i++) {
              labels.push(no_of_employees[i].designation);
              datasets[0].data.push(no_of_employees[i].no_of_emp);
            }
            let Desig_Employee = { labels, datasets };

            $this.setState({
              Desig_Employee: Desig_Employee
            });
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
