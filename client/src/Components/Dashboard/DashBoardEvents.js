import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import moment from "moment";
import Options from "../../Options.json";
import Enumerable from "linq";
import _ from "lodash";
import { getCookie } from "../../utils/algaehApiCall.js";

let HospitalId =
  getCookie("HospitalId") !== undefined ? getCookie("HospitalId") : "";

export const chartLegends = {
  display: true,
  position: "top",
  align: "center",
  fullWidth: true,
  maintainAspectRatio: true,
  responsive: true,
  legend: {
    position: "center",
    fontSize: 12,
    labels: {
      boxWidth: 10
    }
  }
};

export const chartOptions = {
  scales: {
    yAxes: [
      {
        ticks: {
          min: 0, // it is for ignoring negative step.
          beginAtZero: true,
          callback: function(value, index, values) {
            if (Math.floor(value) === value) {
              return value;
            }
          }
        }
      }
    ],
    xAxes: [
      {
        gridLines: {
          display: false
        }
      }
    ]
  }
};
export const chartOptionsHorizontal = {
  scales: {
    xAxes: [
      {
        ticks: {
          min: 0, // it is for ignoring negative step.
          beginAtZero: true,
          callback: function(value, index, values) {
            if (Math.floor(value) === value) {
              return value;
            }
          }
        }
      }
    ],
    yAxes: [
      {
        gridLines: {
          display: false
        }
      }
    ]
  }
};

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
        data: { hospital_id: $this.state.hospital_id },
        method: "GET",

        onSuccess: response => {
          if (response.data.success) {
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
              s.cost_to_company !== null ? parseFloat(s.cost_to_company) : 0
            );

            let avg_salary =
              (parseFloat(no_of_employees) / parseFloat(total_company_salary)) *
              100;
            // avg_salary = Math.round(avg_salary);

            const total_staff_salary = _.chain(response.data.records)
              .filter(f => f.employee_group_id === 1)
              .sumBy(s =>
                s.cost_to_company !== null ? parseFloat(s.cost_to_company) : 0
              )
              .value();

            const total_labor_salary = _.chain(response.data.records)
              .filter(f => f.employee_group_id === 2)
              .sumBy(s =>
                s.cost_to_company !== null ? parseFloat(s.cost_to_company) : 0
              )
              .value();

            const total_staff_count = _.chain(response.data.records)
              .filter(f => f.employee_group_id === 1)
              .value().length;
            const total_labour_count = _.chain(response.data.records)
              .filter(f => f.employee_group_id === 2)
              .value().length;

            const total_localite_count = _.chain(response.data.records)
              .filter(
                f =>
                  f.nationality === $this.context.userToken.default_nationality
              )
              .value().length;

            const total_expatriate_count = _.chain(response.data.records)
              .filter(
                f =>
                  f.nationality !== $this.context.userToken.default_nationality
              )
              .value().length;

            $this.setState({
              no_of_employees: no_of_employees,
              total_company_salary: total_company_salary,
              no_of_emp_join: no_of_emp_join,
              total_staff_count: total_staff_count,
              total_labour_count: total_labour_count,
              total_localite_count: total_localite_count,
              total_expatriate_count: total_expatriate_count,
              total_staff_salary: total_staff_salary,
              total_labor_salary: total_labor_salary,
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

    getEmployeeProjectWise: $this => {
      algaehApiCall({
        uri: "/projectjobcosting/getNoEmployeesProjectWise",
        module: "hrManagement",
        method: "GET",
        data: { hospital_id: $this.state.hospital_id },

        onSuccess: response => {
          debugger;
          if (response.data.success) {
            const { records } = response.data;
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
            for (let i = 0; i < records.length; i++) {
              labels.push(records[i].project_desc);
              datasets[0].data.push(records[i].no_employees);
            }
            $this.setState({
              projectEmployee: { labels, datasets }
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
        data: { hospital_id: $this.state.hospital_id },

        onSuccess: response => {
          console.log("response:", response);
          if (response.data.success) {
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
        data: { hospital_id: $this.state.hospital_id },
        onSuccess: response => {
          if (response.data.success) {
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
    },

    getProjectList: $this => {
      algaehApiCall({
        uri: "/hrsettings/getProjects",
        module: "hrManagement",
        method: "GET",
        data: { pjoject_status: "A", hospital_id: $this.state.hospital_id },
        onSuccess: res => {
          if (res.data.success) {
            $this.setState({
              no_of_projects: res.data.records.length
            });
          }
        },

        onFailure: err => {
          swalMessage({
            title: err.message,
            type: "error"
          });
        }
      });
    }
  };
}
