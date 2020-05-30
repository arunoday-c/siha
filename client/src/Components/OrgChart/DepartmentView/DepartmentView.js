import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./DepartmentView.scss";

export class DepartmentView extends Component {
  constructor(props) {
    super(props);
    this.deptHeight = 0;
    this.subHeight = 0;
    this.state = {
      subDepts: [],
      toggleDept: false,
      toggleSubDept: false,
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

  onBranchClick = (id, e) => {
    let check = e.currentTarget.classList.contains("clickedLi");
    if (check) {
      e.currentTarget.classList.remove("clickedLi");
      this.setState({
        toggleDept: false,
        toggleSubDept: false,
      });
    } else {
      const els = document.querySelectorAll("#branch");
      this.removeClassFrom(els);
      e.currentTarget.classList.add("clickedLi");
      this.setState(
        {
          toggleDept: true,
        },
        () => this.props.api.getDeptForBranch(id)
      );
    }
  };

  onDeptClick = (dept, e) => {
    let check = e.currentTarget.classList.contains("clickedLi");
    if (check) {
      e.currentTarget.classList.remove("clickedLi");
      this.setState({
        toggleSubDept: false,
      });
    } else {
      const els = document.querySelectorAll("#sub-child");
      this.removeClassFrom(els);
      e.currentTarget.classList.add("clickedLi");
      this.setState({ toggleSubDept: true, subDepts: dept.subDepts });
    }
  };

  render() {
    const { allBranches, reqDepts } = this.props;
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
              {allBranches &&
                allBranches.map((branch) => (
                  <li
                    id="branch"
                    className="eachChild"
                    key={branch.hosipital_code}
                    onClick={(e) =>
                      this.onBranchClick(branch.hims_d_hospital_id, e)
                    }
                  >
                    <span className="childCount">{branch.dept_count}</span>
                    <span className="imgSection">
                      <i>BR</i>
                    </span>
                    <span className="contentSection">
                      <p>{branch.hospital_name}</p>
                      <small>{branch.hospital_code}</small>
                    </span>
                  </li>
                ))}
            </ul>

            {/* Department */}
            <TransitionGroup component={null}>
              <ul
                style={{
                  minHeight: toggleDept ? "85vh" : "0",
                }}
                className="eachShelf"
              >
                {reqDepts.length !== 0 ? (
                  reqDepts.map((item) => (
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
                      key={item.hims_d_department_id}
                    >
                      <li
                        id="sub-child"
                        onClick={(e) => this.onDeptClick(item, e)}
                      >
                        <span className="childCount">
                          {item.subDepts.length}
                        </span>
                        <span className="imgSection">
                          <i>
                            {item.department_name.substring(0, 2).toUpperCase()}
                          </i>
                        </span>
                        <span className="contentSection">
                          <p>{item.department_name}</p>
                        </span>
                      </li>
                    </CSSTransition>
                  ))
                ) : (
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
                    key={1232}
                  >
                    <li id="sub-child">
                      <span className="contentSection">
                        <h1>No Departments Available under this branch</h1>
                      </span>
                    </li>
                  </CSSTransition>
                )}
              </ul>
            </TransitionGroup>

            {/* Sub departments */}
            <TransitionGroup component={null}>
              <ul
                className="eachShelf"
                style={{
                  minHeight: toggleSubDept ? "85vh" : "0",
                }}
              >
                {subDepts &&
                  subDepts.map((item) => (
                    <CSSTransition
                      in={this.state.toggleSubDept}
                      appear={false}
                      classNames={{
                        enterActive: "eachChild animated slideInLeft faster",
                        enterDone: "eachChild",
                        exitActive: "eachChild animated slideOutLeft faster",
                        exitDone: "eachChild",
                      }}
                      unmountOnExit
                      timeout={500}
                      key={item.hims_d_sub_department_id}
                    >
                      <li>
                        <span className="imgSection">
                          <i>
                            {item.sub_department_name
                              .substring(0, 2)
                              .toUpperCase()}
                          </i>
                        </span>
                        <span className="contentSection">
                          <h1>{item.sub_department_name}</h1>
                        </span>
                      </li>
                    </CSSTransition>
                  ))}
              </ul>
            </TransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}
