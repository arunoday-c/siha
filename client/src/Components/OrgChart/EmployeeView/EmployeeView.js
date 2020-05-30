import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./EmployeeView.scss";

export default class EmployeeView extends Component {
  constructor(props) {
    super(props);
    this.deptHeight = 0;
    this.subHeight = 0;
    this.state = {
      toggleDept: false,
      toggleSubDept: false,
      getChildren: [],
    };
  }

  renderBlocks = (data, clickMethod) => {
    let funcExist;
    if (clickMethod && typeof clickMethod === "function") {
      funcExist = true;
    }
    return (
      <CSSTransition
        in={data.condition}
        appear={false}
        classNames={{
          enterActive: "eachChild animated slideInLeft faster",
          enterDone: "eachChild",
          exitActive: "eachChild animated slideOutLeft faster",
          exitDone: "eachChild",
        }}
        unmountOnExit
        timeout={500}
        key={data.id}
      >
        <li
          id="sub-child"
          onClick={(e) => {
            funcExist && clickMethod(data.id, e);
          }}
        >
          <span className="childCount">{data.count}</span>
          <span className="imgSection">
            <i>{data.name.substring(0, 2).toUpperCase()}</i>
          </span>
          <span className="contentSection">
            <h1>{data.name}</h1>
          </span>
        </li>
      </CSSTransition>
    );
  };

  removeClassFrom = (name) => {
    name.forEach((el) => {
      if (el.classList.contains("clickedLi")) {
        el.classList.remove("clickedLi");
      }
    });
  };
  // clearState = () => {
  //   this.setState({
  //     getChildren: [],
  //   });
  // };

  onBranchClick = (children, e) => {
    const childs = this.state.getChildren;
    childs.push(children);
    this.setState({ getChildren: childs });
    let check = e.currentTarget.classList.contains("clickedLi");
    if (check) {
      e.currentTarget.classList.remove("clickedLi");
      this.setState({
        toggleDept: false,
        toggleSubDept: false,
      });
    } else {
      const els = document.querySelectorAll("#sub-child");
      this.removeClassFrom(els);
      e.currentTarget.classList.add("clickedLi");
      this.setState({
        toggleDept: true,
        // toggleSubDept: true,
      });
      //     () => {
      //       const allEmployees = this.props.employeesReportingTo;
      //       let arr = [];

      //       allEmployees.map((item) => {
      //         for (let i = 0; i < item.children.length; i++)
      //           arr.push(item.children[i]);
      //         return;
      //       });
      //       this.setState({
      //         getChildren: arr,
      //       });

      //       return arr;
      //     }
      //   );
      // }
    }
  };

  // onDeptClick = (dept, e) => {
  //   let check = e.currentTarget.classList.contains("clickedLi");
  //   if (check) {
  //     e.currentTarget.classList.remove("clickedLi");
  //     this.setState({
  //       toggleSubDept: false,
  //     });
  //   } else {
  //     const els = document.querySelectorAll("#CEO");
  //     this.removeClassFrom(els);
  //     e.currentTarget.classList.add("clickedLi");
  //     this.setState(
  //       {
  //         toggleSubDept: true,
  //       },
  //       () => {
  //         // const allEmployees = this.props.employeesReportingTo;
  //         // let arr = [];
  //         // let arr1 = [];
  //         // allEmployees.map((item) => {
  //         //   for (let i = 0; i < item.children.length; i++)
  //         //     arr.push(item.children[i]);
  //         // });
  //         // for (let j = 0; j < arr.length; j++)
  //         //   arr[j].map((item) => {
  //         //     for (let k = 0; k < item.children.length; k++)
  //         //       arr1.push(item.children[k]);
  //         //     return;
  //         //   });
  //         let arr1 = [];
  //         this.state.getChildren.map((item) => {
  //           // debugger;
  //           // for (let j = 0; j < item.length; j++)
  //           // for (let k = 0; k < item[j].children.length; k++)
  //           arr1.push(item.children);
  //         });
  //         this.setState({
  //           getChildren1: arr1,
  //         });
  //         console.log("data", arr1);
  //         return;
  //       }
  //     );
  //   }
  // };

  initalLetters(name) {
    if (name === undefined) return "";
    const firt = name.split(" ")[0];
    return firt.substring(0, 2).toUpperCase();
  }

  render() {
    const allEmployees = this.props.employeesReportingTo;

    const { subDepts, toggleDept, toggleSubDept } = this.state;
    return (
      <div className="DepartmentOrgView">
        <div className="row">
          <div className="col-12">
            {/* branch */}
            <ul
              className="eachShelf animated slideInLeft faster"
              // style={{ minHeight: "85vh" }}
            >
              {allEmployees &&
                allEmployees.map((ceo) => (
                  <li
                    id="CEO"
                    className="eachChild"
                    key={ceo.hims_d_employee_id}
                    onClick={(e) => this.onBranchClick(ceo.children, e)}
                  >
                    <span className="childCount">{ceo.count}</span>
                    <span className="imgSection">
                      <i>{this.initalLetters(ceo.employee_name)}</i>
                    </span>
                    <span className="contentSection">
                      <p>{ceo.employee_name}</p>
                      <p>{ceo.designation}</p>
                      <p>{ceo.employee_code}</p>
                      <p>{ceo.sub_department_name}</p>
                    </span>
                  </li>
                ))}
            </ul>
            {this.state.getChildren.map((mainItem, index) => {
              return (
                <TransitionGroup component={null} key={index}>
                  <ul
                    style={{
                      minHeight: toggleDept ? "85vh" : "0",
                    }}
                    className="eachShelf"
                  >
                    {mainItem.map((item, sIndex) => {
                      const events =
                        item.count === undefined || item.count === 0
                          ? {}
                          : {
                              onClick: (e) =>
                                this.onBranchClick(item.children, e),
                            };
                      return (
                        <CSSTransition
                          in={this.state.toggleDept}
                          appear={true}
                          classNames={{
                            enterActive:
                              "eachChild animated slideInLeft faster",
                            enterDone: "eachChild",
                            exitActive:
                              "eachChild animated slideOutLeft faster",
                            exitDone: "eachChild",
                          }}
                          unmountOnExit
                          timeout={500}
                          key={sIndex}
                        >
                          <li id="sub-child" {...events}>
                            <span className="childCount">
                              {item.count === undefined ? 0 : item.count}
                            </span>

                            <span className="contentSection">
                              <p>{item.employee_name}</p>
                              <p>{item.designation}</p>
                              <p>Employee Code:{item.employee_code}</p>
                              <p> Department:{item.sub_department_name}</p>
                            </span>
                          </li>
                        </CSSTransition>
                      );
                    })}
                  </ul>
                </TransitionGroup>
              );
            })}
            {/* Department */}
            {/* <TransitionGroup component={null}>
              <ul
                style={{
                  minHeight: toggleDept ? "85vh" : "0",
                }}
                className="eachShelf"
              >
                {this.state.getChildren.map((item) => (
                  <CSSTransition
                    in={this.state.toggleDept}
                    appear={false}
                    classNames={{
                      enterActive: "eachChild animated slideInLeft faster",
                      enterDone: "eachChild",
                      exitActive: "eachChild animated slideOutLeft faster",
                      exitDone: "eachChild",
                    }}
                    unmountOnExit
                    timeout={500}
                    key={item.hims_d_employee_id}
                  >
                    <li
                      id="sub-child"
                      onClick={(e) =>
                        this.onDeptClick(item.hims_d_employee_id, e)
                      }
                    >
                      <span className="childCount">{item.count}</span>
                     
                      <span className="contentSection">
                        <p>{item.employee_name}</p>
                      </span>
                    </li>
                  </CSSTransition>
                ))}
              </ul>
            </TransitionGroup> */}
          </div>
        </div>
      </div>
    );
  }
}
