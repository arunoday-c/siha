import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { MainContext } from "algaeh-react-components/context";
import "./AlgaehmainPage.scss";
import Menu from "../Menu";
import { AlagehFormGroup, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import {
  swalMessage,
  algaehApiCall,
  setCookie,
  getCookie
} from "../../../utils/algaehApiCall";
import DirectRoutes from "../../../Dynamicroutes";
import { Notifications } from "../Notifications";
import {
  AlgaehCloseContainer
  // AlgaehOpenContainer
} from "../../../utils/GlobalFunctions";
import Enumarable from "linq";
import swal from "sweetalert2";
import sockets from "../../../sockets";
import { MainContext } from "algaeh-react-components/context";
class PersistentDrawer extends React.Component {
  constructor(props) {
    super(props);

    // const Activated_Modueles =
    //   sessionStorage.getItem("ModuleDetails") !== null
    //     ? JSON.parse(
    //         AlgaehOpenContainer(sessionStorage.getItem("ModuleDetails"))
    //       )
    //     : [];
    // let Hims_active = false;
    // let Hrms_active = false;
    // let Pharma_active = false;
    // let Invento_active = false;
    // let Lab_active = false;
    // let Rad_active = false;

    // for (let i = 0; i < Activated_Modueles.length; i++) {
    //   const item = Activated_Modueles[i];
    //   switch (item.module_code) {
    //     case "FTDSK":
    //       Hims_active = true;
    //       break;
    //     case "PAYROLL":
    //       Hrms_active = true;
    //       break;
    //     case "PHCY":
    //       Pharma_active = true;
    //       break;
    //     case "INVTRY":
    //       Invento_active = true;
    //       break;
    //     case "LAB":
    //       Lab_active = true;
    //       break;
    //     case "RAD":
    //       Rad_active = true;
    //       break;
    //   }
    // }
    this.state = {
      sideopen: false,
      class: "",
      current_pwd: "",
      pwd: "",
      cf_pwd: "",
      anchor: "left",
      pwdDisplay: "none",
      onlyToggeleMenu: "",
      renderComponent: "Dashboard",
      title: "Dashboard",
      selectedLang: "lang_en",
      anchorEl: null,
      languageName: "English",
      Language: "en",
      arlabl: "",
      enlabl: "",
      searchModules: "",
      activeNode: {
        class: "active",
        menuselected: "GEN",
        subMenuItem: "GN0001"
      },
      isSelectedByForce: false,
      openPanel: false,
      menuList: [],
      scrollPosition: 0,
      lang_className: " english_component",
      Hims_active: false,//Hims_active,
      Hrms_active:false,// Hrms_active,
      Pharma_active:false,// Pharma_active,
      Invento_active:false,// Invento_active,
      Lab_active:false,// Lab_active,
      Rad_active:false// Rad_active
    };
    // const _userName = getCookie("userName");
    // if (_userName === null || _userName === "") {
    //   window.location.hash = "";
    // }
   

    // algaehApiCall({
    //   uri: "/algaehMasters/getRoleBaseActiveModules",
    //   method: "GET",
    //   onSuccess: dataResponse => {
    //     if (dataResponse.data.success) {
    //       const _module = Enumarable.from(dataResponse.data.records)
    //         .select(s => {
    //           return {
    //             module_id: s.module_id,
    //             module_code: s.module_code,
    //             module_plan: s.module_plan
    //           };
    //         })
    //         .toArray();
    //       sessionStorage.removeItem("AlgaehOrbitaryData");
    //       sessionStorage.setItem(
    //         "AlgaehOrbitaryData",
    //         AlgaehCloseContainer(JSON.stringify(_module))
    //       );
    //       algaehApiCall({
    //         uri: "/algaehMasters/getRoleBaseInActiveComponents",
    //         method: "GET",
    //         onSuccess: internalComponents => {
    //           if (internalComponents.data.success) {
    //             sessionStorage.removeItem("AlgaehScreener");
    //             sessionStorage.setItem(
    //               "AlgaehScreener",
    //               AlgaehCloseContainer(
    //                 JSON.stringify(internalComponents.data.records)
    //               )
    //             );
    //           }
    //         }
    //       });

    //       const HRActive = Enumarable.from(dataResponse.data.records)
    //         .where(w => w.module_code === "PAYROLL")
    //         .toArray();

    //       if (HRActive.length > 0) {
    //         algaehApiCall({
    //           uri: "/payrollOptions/getHrmsOptions",
    //           method: "GET",
    //           module: "hrManagement",
    //           onSuccess: res => {
    //             if (res.data.success) {
    //               sessionStorage.removeItem("hrOptions");
    //               sessionStorage.setItem(
    //                 "hrOptions",
    //                 AlgaehCloseContainer(JSON.stringify(res.data.result[0]))
    //               );
    //             }
    //           },
    //           onFailure: err => {
    //             swalMessage({
    //               title: err.message,
    //               type: "error"
    //             });
    //           }
    //         });
    //       }

    //       this.setState(
    //         {
    //           menuList: dataResponse.data.records
    //         },
    //         () => {
    //           if (sockets.connected) {
    //             sockets.emit(
    //               "user_logged",
    //               getCookie("userName"),
    //               this.state.menuList.map(module =>
    //                 module.module_code.toLowerCase()
    //               ),
    //               getCookie("keyResources")
    //             );
    //           }
    //         }
    //       );
    //     }
    //   },
    //   onFailure: error => {
    //     swalMessage({
    //       text: error.message,
    //       type: "error"
    //     });
    //   }
    // });
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    // const Hims_active =
    //   userToken.product_type === "HIMS_ERP" ||
    //   userToken.product_type === "HIMS_CLINICAL"
    //     ? true
    //     : false;
    // // const 


    let prevLang = getCookie("Language");
    if (prevLang !== "en") {
      this.setState({
        languageName: "عربي",
        Language: "ar",
        title: "لوحة القيادة",
        arlabl: "لوحة القيادة",
        enlabl: "Dashboard"
      });
    }
  }

  showPwdModal() {
    this.setState({
      pwdDisplay: null
    });
  }

  closePwdModal() {
    this.setState({
      pwdDisplay: "none",
      cf_pwd: "",
      pwd: "",
      current_pwd: ""
    });
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  changePassword() {
    if (
      this.state.current_pwd.length === 0 ||
      this.state.pwd.length === 0 ||
      this.state.cf_pwd.length === 0
    ) {
      swalMessage({
        title: "Please Enter all the Fields",
        type: "warning"
      });
    } else if (this.state.pwd !== this.state.cf_pwd) {
      swalMessage({
        title: "Passwords Do not Match",
        type: "warning"
      });
    } else {
      swal({
        title:
          "Changing Password may require to Re-login, Do you want to change password?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No"
      }).then(willDelete => {
        if (willDelete.value) {
          algaehApiCall({
            uri: "/algaehappuser/changePassword",
            method: "PUT",
            data: {
              password: this.state.pwd,
              oldPassword: this.state.current_pwd
            },
            onSuccess: res => {
              if (res.data.success) {
                swalMessage({
                  title: "Password Changed Successfully",
                  type: "success"
                });
                this.props.history.push("/");
                // window.location.href = window.location.origin + "/#";
              } else if (!res.data.success) {
                swalMessage({
                  title: res.data.records.message,
                  type: "warning"
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
      });
    }
  }

  Languaue(secLang, e) {
    let prevLang = getCookie("Language");
    setCookie("Language", secLang, 30);
    setCookie("prevLanguage", prevLang, 30);

    let renderComp = this.state.renderComponent;

    // var last2 = renderComp.slice(-2);
    // if (last2 === "Ar") {
    //   renderComp = renderComp.substring(0, renderComp.length - 2);
    // }

    if (secLang === "en") {
      setCookie("ScreenName", renderComp, 30);
      this.setState({
        selectedLang: "lang_en",
        languageName: "English",
        Language: "en",
        title: this.state.enlabl,
        renderComponent: renderComp,
        lang_className: " english_component"
      });
    } else if (secLang === "ar") {
      // if (renderComp === "FrontDesk" || renderComp === "OPBilling") {
      //   renderComp = renderComp + "Ar";
      // }
      setCookie("ScreenName", renderComp, 30);
      this.setState({
        selectedLang: "lang_ar",
        languageName: "عربي",
        Language: "ar",
        title: this.state.arlabl,
        renderComponent: renderComp,
        lang_className: " arabic_component"
      });
    }
  }

  handleOpenClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (seLang, e) => {
    this.setState({ anchorEl: null });

    if (typeof e === "object") this.Languaue(seLang, e);
  };

  renderCheck = () => {
    return <span> &#10004;</span>;
  };

  handleDrawerOpen = () => {
    this.setState({
      class: "slideInLeft",
      sideopen: true
    });
  };

  handleDrawerClose = () => {
    const _activeNodes =
      this.state.activeNode.menuselected === "" &&
      this.state.activeNode.lastSelected !== ""
        ? {
            activeNode: {
              ...this.state.activeNode,
              ...{
                menuselected: this.state.activeNode.lastSelected,
                lastSelected: ""
              }
            }
          }
        : {};

    this.setState({
      class: "slideOutLeft",
      onlyToggeleMenu: "",
      ..._activeNodes
    });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value
    });
  };

  openSubMenuSelection(data) {
    let _putData =
      data.module_code === this.state.onlyToggeleMenu ? "" : data.module_code;
    const isModfySelect =
      this.state.activeNode.menuselected === data.module_code
        ? {
            activeNode: {
              ...this.state.activeNode,
              ...{ menuselected: "", lastSelected: data.module_code }
            }
          }
        : {};
    _putData = isModfySelect.activeNode !== undefined ? "" : _putData;
    this.setState({ onlyToggeleMenu: _putData, ...isModfySelect });
  }

  // componentDidUpdate(prevProps) {
  //   const _offSet =
  //     document.querySelector("[menuselected]") === null
  //       ? 0
  //       : document.querySelector("[menuselected]").getBoundingClientRect().top;

  //   if (this.scrollLeftPanel !== undefined && this.scrollLeftPanel !== null)
  //     this.scrollLeftPanel.scrollTop = _offSet;
  // }

  TriggerPath(submenu, module_id, e) {
    const name = submenu.page_to_redirect.replace(/\s/g, ""); // e.currentTarget.getAttribute("name");

    // submenu.screen_name === "Doctor Appointment"
    // let screenName =
    //   submenu.page_to_redirect.replace(/\s/g, "") +
    //   (this.state.Language !== "en" &&
    //   (submenu.screen_name === "Front Desk" ||
    //     submenu.screen_name === "Op Billing")
    //     ? this.state.Language.charAt(0).toUpperCase() +
    //       this.state.Language.slice(1)
    //     : "");

    let screenName = submenu.page_to_redirect.replace(/\s/g, "");

    let lang_className =
      this.state.Language === "en" ? " english_component" : " arabic_component";
    const _menuselected = e.currentTarget.getAttribute("menuselected");
    const _submenuselected = submenu.screen_code; //e.currentTarget.getAttribute("submenuselected");
    setCookie("ScreenName", name, 30);
    setCookie("module_id", module_id, 30);
    setCookie("ScreenCode", submenu.screen_code, 30);
    // AlgaehLoader({ show: true });

    this.setState({
      sideopen: false,
      searchModules: "",
      title: e.currentTarget.innerText,
      renderComponent: screenName,
      arlabl: submenu.other_language,
      enlabl: submenu.screen_name,
      onlyToggeleMenu: "",
      lang_className: lang_className,
      activeNode: {
        class: "active",
        menuselected: _menuselected,
        subMenuItem: _submenuselected
      }
    });
  }

  logoutLink(e) {
    if (sockets.connected) {
      sockets.emit("user_logout");
    }
    algaehApiCall({
      uri: "/apiAuth/logout",
      method: "GET",
      onSuccess: response => {
        const { message } = response.data;
        swalMessage({
          title: message,
          type: "success"
        });
        this.props.history.push("/");
        // window.location.href = window.location.origin + "/#";
        //  window.location.reload();
      }
    });
  }

  handlePanel = () => {
    this.setState({
      openPanel: !this.state.openPanel
    });
  };

  SearchModuleHandler(e) {
    this.setState({ searchModules: e.target.value });
  }

  createSideMenuItemList() {
    const { onlyToggeleMenu, activeNode, searchModules, menuList } = this.state;

    const _isEnglish = this.state.Language !== "en" ? false : true;
    let menuArray = [];
    const _toggle = searchModules !== "" ? true : false;
    let menuList_condition = menuList;
    if (_toggle) {
      menuList_condition = [];
      menuList.filter(obj => {
        let submenu = [];
        obj.ScreenList.filter(item => {
          if (
            item.screen_name
              .toLowerCase()
              .indexOf(searchModules.toLowerCase()) > -1
          ) {
            submenu.push(item);
          }
        });
        // menuList_condition;
        if (submenu.length > 0) {
          menuList_condition.push({
            module_id: obj.module_id,
            icons: obj.icons,
            module_code: obj.module_code,
            module_name: obj.module_name,
            other_language: obj.other_language,
            ScreenList: submenu
          });
        }
      });
    }
    menuList_condition.map((menu, index) => {
      const _menuSelected =
        onlyToggeleMenu !== "" && onlyToggeleMenu === menu.module_code
          ? onlyToggeleMenu
          : activeNode.menuselected;

      menuArray.push(
        <div key={"side_menu_index" + index} className="container-fluid">
          <div
            className="row clearfix side-menu-title"
            onClick={this.openSubMenuSelection.bind(this, menu)}
          >
            <div className="col-2" style={{ marginTop: "2px" }}>
              <i className={menu.icons} />
            </div>
            <div className="col-8 ">
              {_isEnglish ? menu.module_name : menu.other_language}
            </div>
            <div className="col-2" style={{ marginTop: "2px" }}>
              {_menuSelected === menu.module_code || _toggle ? (
                <i className="fas fa-angle-up" />
              ) : (
                <i className="fas fa-angle-down" />
              )}
            </div>
          </div>
          {_menuSelected === menu.module_code || _toggle ? (
            <div className="row sub-menu-option">
              <ul className="tree-structure-menu">
                {menu.ScreenList.map((submenu, indexSub) => (
                  <li
                    onClick={this.TriggerPath.bind(
                      this,
                      submenu,
                      menu.module_id
                    )}
                    menuselected={menu.module_code}
                    key={indexSub}
                    className={
                      activeNode !== undefined && activeNode !== null
                        ? activeNode.subMenuItem === submenu.screen_code
                          ? activeNode.class
                          : ""
                        : ""
                    }
                  >
                    <i className="fas fa-arrow-circle-right fa-1x " />
                    <span>
                      {_isEnglish
                        ? submenu.screen_name
                        : submenu.other_language}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      );
    });
    return menuArray;
  }

  render() {
    const authToken = getCookie("authToken");

    // const keyResources = getCookie("keyResources");
    if (authToken === "" || authToken === undefined) {
      return (
        <b>
          No access, please re-login
          <button onClick={this.logoutLink.bind(this)}>
            Redirect to login
          </button>
        </b>
      );
    }

    const { anchor } = this.state;

    return (
      <div className="">
        {/* <Menu /> */}

        <main
          className={"mainPageArea container-fluid" + this.state.lang_className}
          id="hisapp"
        >
          <Notifications
            open={this.state.openPanel}
            handlePanel={this.handlePanel}
          />
          <DirectRoutes
            componet={this.state.renderComponent}
            selectedLang={this.state.selectedLang}
          />
        </main>
      </div>
    );
  }
}

export default withRouter(PersistentDrawer);
