import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";

export default function ScreenAssignmentEvents() {
  return {
    dropDownHandler: ($this, value) => {
      switch (value.name) {
        case "app_group_id":
          getRoleBaseActive($this);
          getRoles($this, value.value);
          $this.setState({
            [value.name]: value.value,
            roles: []
          });
          break;

        default:
          getRoleBaseActive($this);
          getRoleActiveModules($this, value.value);
          $this.setState({
            [value.name]: value.value
          });
          break;
      }
    },
    assignScreens: $this => {
      //To build delete inputs
      let inputObj = { role_id: $this.state.role_id };
      let delete_modules = [];
      let delete_screens = [];
      let update_screens = [];
      let inputs = [];
      const exist_module_data = _.filter($this.state.modules, f => {
        return f.algaeh_m_module_role_privilage_mapping_id !== undefined;
      });

      if (exist_module_data.length > 0) {
        //Delete
        const removed_module_data = _.filter(exist_module_data, f => {
          return f.checked === false;
        });
        if (removed_module_data.length > 0) {
          delete_modules = removed_module_data.map(item => {
            return item.algaeh_m_module_role_privilage_mapping_id;
          });
        }

        const check_module_data = _.filter(exist_module_data, f => {
          return f.checked === true;
        });
        for (let y = 0; y < check_module_data.length; y++) {
          const exist_screen_data = _.filter(
            check_module_data[y].ScreenList,
            f => {
              return f.algaeh_m_screen_role_privilage_mapping_id !== undefined;
            }
          );
          const removed_screen_data = _.filter(exist_screen_data, f => {
            return f.checked === false;
          });
          if (removed_screen_data.length > 0) {
            delete_screens = removed_screen_data.map(item => {
              return item.algaeh_m_screen_role_privilage_mapping_id;
            });
          }
        }
        // Update
        const update_module_data = _.filter(exist_module_data, f => {
          return f.checked === true;
        });
        if (update_module_data.length > 0) {
          let insert_screens = [];
          for (let k = 0; k < update_module_data.length; k++) {
            const insert_screen_data = _.filter(
              update_module_data[k].ScreenList,
              f => {
                return (
                  f.checked === true &&
                  f.algaeh_m_screen_role_privilage_mapping_id === undefined
                );
              }
            );
            if (insert_screen_data.length > 0) {
              let Obj = {
                algaeh_m_module_role_privilage_mapping_id:
                  update_module_data[k]
                    .algaeh_m_module_role_privilage_mapping_id
              };

              insert_screens = insert_screen_data.map(item => {
                return item.screen_id;
              });

              Obj.insert_screens = insert_screens;
              update_screens.push(Obj);
            }
          }
        }
      }
      //To build insert inputs
      const module_data = _.filter($this.state.modules, f => {
        return (
          f.checked === true &&
          f.algaeh_m_module_role_privilage_mapping_id === undefined
        );
      });
      if (module_data.length > 0) {
        for (let i = 0; i < module_data.length; i++) {
          let Obj = {};
          let screen_ids = [];
          const screen_data = _.filter(module_data[i].ScreenList, f => {
            return (
              f.checked === true &&
              f.algaeh_m_screen_role_privilage_mapping_id === undefined
            );
          });
          if (screen_data.length > 0) {
            Obj.module_id = module_data[i].module_id;
            screen_ids = screen_data.map(item => {
              return item.screen_id;
            });
            Obj.screen_ids = screen_ids;
            inputs.push(Obj);
          }
        }
      }

      inputObj.inputs = inputs;
      inputObj.delete_modules = delete_modules;
      inputObj.delete_screens = delete_screens;
      inputObj.update_screens = update_screens;

      algaehApiCall({
        uri: "/algaehMasters/assignScreens",
        method: "POST",
        data: inputObj,
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Assigned Successfully.",
              type: "success"
            });
            $this.setState({ app_group_id: null, role_id: null, roles: [] });
            getRoleBaseActive($this);
          } else {
            swalMessage({
              title: res.data.records.message,
              type: "error"
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
      $this.setState({ app_group_id: null, role_id: null, roles: [] });
      getRoleBaseActive($this);
    },

    changeScreen: ($this, data, e) => {
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
        if (parseInt(f.module_id) === val) {
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

// function getGroupData($this) {
//   algaehApiCall({
//     uri: "/algaehappuser/selectAppGroup",
//     method: "GET",
//     onSuccess: response => {
//       if (response.data.success) {
//         $this.setState({ groups: response.data.records });
//       }
//     },
//     onFailure: error => {
//       swalMessage({
//         title: error.message,
//         type: "error"
//       });
//     }
//   });
// }

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

  algaehApiCall({
    uri: "/algaehMasters/getRoleBaseActiveModules",
    method: "GET",
    data: inputObj,
    onSuccess: res => {
      if (res.data.success) {
        let data = res.data.records;
        let modules = $this.state.modules;
        data.map(item => {
          let _findModule = _.find(
            modules,
            m => m.module_id === item.module_id
          );
          const index = modules.indexOf(_findModule);
          modules[index] = {
            ...modules[index],
            checked: true,
            algaeh_m_module_role_privilage_mapping_id:
              item.algaeh_m_module_role_privilage_mapping_id
          };

          item.ScreenList.map(screen => {
            let _findScreen = _.find(
              modules[index]["ScreenList"],
              s => s.screen_id === screen.screen_id
            );
            const indexS = modules[index]["ScreenList"].indexOf(_findScreen);
            modules[index]["ScreenList"][indexS] = {
              ...modules[index]["ScreenList"][indexS],
              checked: true,
              algaeh_m_screen_role_privilage_mapping_id:
                screen.algaeh_m_screen_role_privilage_mapping_id
            };
          });
        });

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
