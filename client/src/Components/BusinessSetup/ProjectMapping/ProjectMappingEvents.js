import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import Enumerable from "linq";

export default function ProjectMappingEvents() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },

    addDivisionProjectEvent: $this => {
      const data_exit = Enumerable.from($this.state.division_project)
        .where(
          w =>
            w.division_id === $this.state.division_id &&
            w.project_id === $this.state.project_id
        )
        .toArray();

      if (data_exit.length > 0) {
        swalMessage({
          title: "Already assinged selected project to selected division",
          type: "warning"
        });
        return;
      }
      algaehApiCall({
        uri: "/projectjobcosting/addDivisionProject",
        module: "hrManagement",
        method: "POST",
        data: {
          division_id: $this.state.division_id,
          project_id: $this.state.project_id
        },
        onSuccess: res => {
          if (res.data.success) {
            clearState($this);
            getDivisionProjectApi($this);
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

    getDivisionProjectFunction: $this => {
      getDivisionProjectApi($this);
    },

    deleteDivisionProjectEvent: ($this, data) => {
      swal({
        title: "Are you sure you want to delete this ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No"
      }).then(willDelete => {
        if (willDelete.value) {
          algaehApiCall({
            uri: "/projectjobcosting/deleteDivisionProject",
            module: "hrManagement",
            data: {
              hims_m_division_project_id: data.hims_m_division_project_id
            },
            method: "DELETE",
            onSuccess: response => {
              if (response.data.success) {
                swalMessage({
                  title: "Record deleted successfully . .",
                  type: "success"
                });
                getDivisionProjectApi($this);
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
    }
  };
}

function getDivisionProjectApi($this) {
  algaehApiCall({
    uri: "/projectjobcosting/getDivisionProject",
    module: "hrManagement",
    method: "GET",
    onSuccess: res => {
      if (res.data.success) {
        $this.setState({
          division_project: res.data.records
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
    division_id: "",
    project_id: ""
  });
}
