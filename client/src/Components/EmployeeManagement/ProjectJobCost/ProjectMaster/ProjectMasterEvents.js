import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import Options from "../../../../Options.json";
import swal from "sweetalert2";
export default function ProjectMasterEvents() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },
    datehandle: ($this, ctrl, e) => {
      let intFailure = false;
      if (e === "start_date") {
        if (Date.parse($this.state.end_date) < Date.parse(moment(ctrl)._d)) {
          intFailure = true;
          swalMessage({
            title: "Start Date cannot be grater than End Date.",
            type: "warning"
          });
        }
      } else if (e === "end_date") {
        if (Date.parse(moment(ctrl)._d) < Date.parse($this.state.start_date)) {
          intFailure = true;
          swalMessage({
            title: "End Date cannot be less than Start Date.",
            type: "warning"
          });
        }
      }

      if (intFailure === false) {
        $this.setState({
          [e]: moment(ctrl)._d
        });
      }
    },

    addProject: $this => {
      //   let projects = $this.state.projects;
      algaehApiCall({
        uri: "/hrsettings/addProject",
        module: "hrManagement",
        method: "POST",
        data: {
          project_code: $this.state.project_code,
          project_desc: $this.state.project_desc,
          project_desc_arabic: $this.state.project_desc_arabic,
          abbreviation: $this.state.abbreviation,
          start_date: moment($this.state.start_date).format("YYYY-MM-DD"),
          end_date: moment($this.state.end_date).format("YYYY-MM-DD")
        },
        onSuccess: res => {
          if (res.data.success) {
            clearState($this);
            getProjectsApi($this);
            swalMessage({
              title: "Record Added Successfully",
              type: "success"
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
    },
    griddatehandle: ($this, row, ctrl, e) => {
      let intFailure = false;
      if (e === "start_date") {
        if (Date.parse(row.end_date) < Date.parse(moment(ctrl)._d)) {
          intFailure = true;
          swalMessage({
            title: "Start Date cannot be grater than End Date.",
            type: "warning"
          });
        }
      } else if (e === "end_date") {
        if (Date.parse(moment(ctrl)._d) < Date.parse(row.start_date)) {
          intFailure = true;
          swalMessage({
            title: "End Date cannot be less than Start Date.",
            type: "warning"
          });
        }
      }

      if (intFailure === false) {
        row[e] = moment(ctrl)._d;
        row.update();
      }
    },
    getProjectsFunction: $this => {
      getProjectsApi($this);
    },

    updateEmployeeGroups: ($this, data) => {
      algaehApiCall({
        uri: "/hrsettings/updateProjects",
        module: "hrManagement",
        method: "PUT",
        data: {
          hims_d_project_id: data.hims_d_project_id,
          project_code: data.project_code,
          project_desc: data.project_desc,
          project_desc_arabic: data.project_desc_arabic,
          abbreviation: data.abbreviation,
          start_date: moment(data.start_date).format("YYYY-MM-DD"),
          end_date: moment(data.end_date).format("YYYY-MM-DD"),
          pjoject_status: data.pjoject_status,
          inactive_date:
            data.inactive_date !== null
              ? moment(data.inactive_date).format("YYYY-MM-DD")
              : null,
          record_status: "A"
        },
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record updated successfully",
              type: "success"
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

    deleteEmployeeGroups: ($this, data) => {
      swal({
        title: "Are you sure you want to delete " + data.project_desc + " ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No"
      }).then(willDelete => {
        if (willDelete.value) {
          algaehApiCall({
            uri: "/hrsettings/updateProjects",
            module: "hrManagement",
            data: {
              hims_d_project_id: data.hims_d_project_id,
              project_code: data.project_code,
              project_desc: data.project_desc,
              project_desc_arabic: data.project_desc_arabic,
              start_date: moment(data.start_date).format("YYYY-MM-DD"),
              end_date: moment(data.end_date).format("YYYY-MM-DD"),
              pjoject_status: data.pjoject_status,
              inactive_date:
                data.inactive_date !== null
                  ? moment(data.inactive_date).format("YYYY-MM-DD")
                  : null,
              record_status: "I"
            },
            method: "PUT",
            onSuccess: response => {
              if (response.data.success) {
                swalMessage({
                  title: "Record deleted successfully . .",
                  type: "success"
                });
                getProjectsApi($this);
              } else if (!response.data.success) {
                swalMessage({
                  title: response.data.message,
                  type: "error"
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
      });
    },

    changeGridEditors: ($this, row, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      row[name] = value;
      if (name === "pjoject_status") {
        row["inactive_date"] = moment(new Date()).format(Options.dateFormat);
      }
      row.update();
    }
  };
}

function getProjectsApi($this) {
  algaehApiCall({
    uri: "/hrsettings/getProjects",
    module: "hrManagement",
    method: "GET",
    onSuccess: res => {
      if (res.data.success) {
        $this.setState({
          projects: res.data.records
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

function clearState($this) {
  $this.setState({
    project_code: null,
    project_desc: null,
    project_desc_arabic: null,
    start_date: null,
    end_date: null,
    abbreviation: null
  });
}
