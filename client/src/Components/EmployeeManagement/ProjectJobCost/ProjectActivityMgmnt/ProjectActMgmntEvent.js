import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
// import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
// import swal from "sweetalert2";
// import Enumerable from "linq";
// import AlgaehSearch from "../../../Wrapper/globalSearch";
// import spotlightSearch from "../../../../Search/spotlightSearch.json";
// import AlgaehLoader from "../../../Wrapper/fullPageLoader";

export default function ProjectActMgmntEvent() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },
    getActivities: $this => {
      getMainActivites($this);
    },
    getSubActivity: $this => {
      getSubActivites($this);
    },

    addMainActivity: $this => {
      debugger;
      if ($this.state.description === null || $this.state.description === "") {
        swalMessage({
          title: "Main Activity. Cannot be blank.",
          type: "warning"
        });
        document.querySelector("[name='description']").focus();
      } else {
        let inputObj = {
          description: $this.state.description
        };
        algaehApiCall({
          uri: "/projectjobcosting/addActivity",
          module: "hrManagement",
          data: inputObj,
          method: "POST",
          onSuccess: res => {
            debugger;
            if (res.data.success) {
              clearState($this);
              getMainActivites($this);
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
      }
    },

    addSubActivity: $this => {
      if ($this.state.activity_id === null || $this.state.activity_id === "") {
        swalMessage({
          title: "Main Activity. Cannot be blank.",
          type: "warning"
        });
        document.querySelector("[name='activity_id']").focus();
      } else if (
        $this.state.sub_description === null ||
        $this.state.sub_description === ""
      ) {
        swalMessage({
          title: "Sub Activity. Cannot be blank.",
          type: "warning"
        });
        document.querySelector("[name='sub_description']").focus();
      } else {
        let inputObj = {
          activity_id: $this.state.activity_id,
          description: $this.state.sub_description
        };
        algaehApiCall({
          uri: "/projectjobcosting/addSubActivity",
          module: "hrManagement",
          data: inputObj,
          method: "POST",
          onSuccess: res => {
            if (res.data.success) {
              clearState($this);
              getSubActivites($this);
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
      }
    },

    UpdateMainActivity: ($this, row) => {
      debugger;

      if (row.description === null || row.description === "") {
        swalMessage({
          title: "Main Activity. Cannot be blank.",
          type: "warning"
        });
      } else {
        let inputObj = {
          hims_d_activity_id: row.hims_d_activity_id,
          description: row.description
        };
        algaehApiCall({
          uri: "/projectjobcosting/updateActivity",
          module: "hrManagement",
          data: inputObj,
          method: "PUT",
          onSuccess: res => {
            debugger;
            if (res.data.success) {
              clearState($this);
              getMainActivites($this);
              swalMessage({
                title: "Record Updated Successfully",
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
      }
    },

    UpdateSubActivity: ($this, row) => {
      debugger;

      if (row.activity_id === null || row.activity_id === "") {
        swalMessage({
          title: "Main Activity. Cannot be blank.",
          type: "warning"
        });
      } else if (row.sub_description === null || row.sub_description === "") {
        swalMessage({
          title: "Sub Activity. Cannot be blank.",
          type: "warning"
        });
      } else {
        let inputObj = {
          hims_d_sub_activity_id: row.hims_d_sub_activity_id,
          activity_id: row.activity_id,
          description: row.description
        };
        algaehApiCall({
          uri: "/projectjobcosting/updateSubActivity",
          module: "hrManagement",
          data: inputObj,
          method: "PUT",
          onSuccess: res => {
            if (res.data.success) {
              clearState($this);
              getSubActivites($this);
              swalMessage({
                title: "Record Updated Successfully",
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
      }
    }
  };
}

function getMainActivites($this) {
  $this.props.getActivity({
    uri: "/projectjobcosting/getActivity",
    module: "hrManagement",
    method: "GET",
    redux: {
      type: "ACTIVITIES_GET_DATA",
      mappingName: "main_activites"
    }
  });
}

function getSubActivites($this) {
  $this.props.getSubActivity({
    uri: "/projectjobcosting/getSubActivity",
    module: "hrManagement",
    method: "GET",
    redux: {
      type: "SUB_ACTIVITIES_GET_DATA",
      mappingName: "sub_activites"
    }
  });
}

function clearState($this) {
  $this.setState({
    activity_id: null,
    description: null,
    sub_description: null
  });
}
