import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";

export default function ScreenAssignmentEvents() {
  return {
    dropDownHandler: ($this, value) => {
      switch (value.name) {
        case "app_group_id":
          getRoles($this, value.value);
          $this.setState({
            [value.name]: value.value
          });
          break;

        default:
          getRoleActiveModules($this, value.value);
          $this.setState({
            [value.name]: value.value
          });
      }
    },
    assignScreens: $this => {
      debugger;
      const module_data = _.filter($this.state.modules, f => {
        return f.checked == true;
      });
      if (module_data.length > 0) {
        debugger;
        let inputObj = { role_id: $this.state.role_id };
        let inputs = [];
        for (let i = 0; i < module_data.length; i++) {
          let Obj = {};
          let screen_ids = [];
          const screen_data = _.filter(module_data[i].ScreenList, f => {
            return f.checked === true;
          });
          Obj.module_id = module_data[i].module_id;
          for (let i = 0; i < screen_data.length; i++) {
            screen_ids.push(screen_data[i].screen_id);
          }
          Obj.screen_ids = screen_ids;
          inputs.push(Obj);
        }
        inputObj.inputs = inputs;
        algaehApiCall({
          uri: "/algaehMasters/assignScreens",
          method: "POST",
          data: inputObj,
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Assigned Successfully.",
                type: "error"
              });
              $this.setState($this.baseState);
              getRoleBaseActive($this);
            }
          },
          onFailure: err => {
            swalMessage({
              title: err.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Please select the screens.",
          type: "error"
        });
      }
    },
    getRoleBaseActiveModules: $this => {
      getRoleBaseActive($this);
    },
    getGroups: $this => {
      algaehApiCall({
        uri: "/algaehappuser/selectAppGroup",
        method: "GET",
        onSuccess: response => {
          if (response.data.success) {
            $this.setState({ groups: response.data.records });
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
    clearState: $this => {
      $this.setState($this.baseState);
    },

    changeScreen: ($this, data, e) => {
      debugger;
      const _status = e.target.checked;
      let val = parseInt(e.target.value, 10);

      let main_modules = $this.state.modules;

      const _screens = data.ScreenList.map(item => {
        if (item.screen_id === val) {
          item.checked = _status ? true : false;
        }
        return {
          ...item
        };
      });

      const _check = _.filter(_screens, f => {
        return f.checked === true;
      });

      let newModule = _.map(main_modules, f => {
        let _sList = f.ScreenList;
        if (f.module_id === data.module_id) {
          _sList = _screens;
          f.checked = _check.length > 0 ? true : false;
        }
        return {
          ...f,
          ScreenList: _sList
        };
      });

      $this.setState({ modules: newModule });
    },
    changeModules: ($this, data, e) => {
      debugger;
      const _status = e.target.checked;
      let val = parseInt(e.target.value, 10);

      let main_modules = $this.state.modules;

      const _screens = data.ScreenList.map(item => {
        return {
          ...item,
          checked: _status ? true : false
        };
      });
      let newModule = _.map(main_modules, f => {
        let _sList = f.ScreenList;
        let _checked = { checked: f.checked ? true : false };
        if (f.module_id === val) {
          _sList = _screens;
          _checked = { checked: _status ? true : false };
        }
        return {
          ...f,
          ..._checked,
          ScreenList: _sList
        };
      });
      $this.setState({ modules: newModule });
    }
  };
}

function resetState($this) {
  $this.setState($this.baseState);
}
function getRoleBaseActive($this) {
  algaehApiCall({
    uri: "/algaehMasters/getRoleBaseActiveModules",
    method: "GET",
    onSuccess: res => {
      if (res.data.success) {
        $this.setState({
          modules: res.data.records
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

function getRoles($this, group_id) {
  algaehApiCall({
    uri: "/algaehappuser/selectRoles",
    method: "GET",
    data: {
      algaeh_d_app_group_id: group_id
    },
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({ roles: response.data.records });
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

function getRoleActiveModules($this, role_id) {
  let inputObj = { role_id: role_id, from_assignment: "Y" };

  debugger;
  algaehApiCall({
    uri: "/algaehMasters/getRoleBaseActiveModules",
    method: "GET",
    data: inputObj,
    onSuccess: res => {
      debugger;
      if (res.data.success) {
        let data = res.data.records;
        let modules = $this.state.modules;
        data.map(item => {
          let _findModule = _.find(
            modules,
            m => m.module_id === item.module_id
          );
          const index = modules.indexOf(_findModule);
          modules[index] = { ...modules[index], checked: true };

          item.ScreenList.map(screen => {
            let _findScreen = _.find(
              modules[index]["ScreenList"],
              s => s.screen_id === screen.screen_id
            );
            const indexS = modules[index]["ScreenList"].indexOf(_findScreen);
            modules[index]["ScreenList"][indexS] = {
              ...modules[index]["ScreenList"][indexS],
              checked: true
            };
          });
        });
        debugger;

        $this.setState({
          modules: modules
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
