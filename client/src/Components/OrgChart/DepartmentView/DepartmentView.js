import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./DepartmentView.css";

export default class DepartmentView extends Component {
  constructor(props) {
    super(props);
    this.height = 0;
    this.state = {
      dept: [],
      subDept: [],
      toggleDept: false,
      toggleSubDept: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(prevState.dept, nextProps.dept)) {
      return {
        dept: nextProps.dept,
        toggleDept: true
      };
    }
    if (!isEqual(prevState.subDept, nextProps.subDept)) {
      return {
        subDept: nextProps.subDept
      };
    }
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
          exitDone: "eachChild"
        }}
        unmountOnExit
        timeout={500}
        key={data.id}
      >
        <li
          id="sub-child"
          onClick={e => {
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

  removeClassFrom = name => {
    name.forEach(el => {
      if (el.classList.contains("clickedLi")) {
        el.classList.remove("clickedLi");
      }
    });
  };

  onBranchClick = e => {
    const { dept } = this.state;
    let check = e.currentTarget.classList.contains("clickedLi");
    if (check) {
      e.currentTarget.classList.remove("clickedLi");
      this.height = "0";
      this.setState(
        {
          toggleDept: false,
          toggleSubDept: false
        },
        () => this.props.clearState("subDept")
      );
    } else if (Array.isArray(dept) && dept.length !== 0) {
      e.currentTarget.classList.add("clickedLi");
      this.setState({
        toggleDept: true
      });
    } else {
      e.currentTarget.classList.add("clickedLi");
      this.props.getDept();
    }
  };

  onDeptClick = (id, e) => {
    let check = e.currentTarget.classList.contains("clickedLi");
    if (check) {
      e.currentTarget.classList.remove("clickedLi");
      this.height = "0";
      this.setState({
        toggleSubDept: false
      });
    } else {
      const els = document.querySelectorAll("#sub-child");
      this.removeClassFrom(els);
      e.currentTarget.classList.add("clickedLi");
      this.height = "85vh";
      this.props.getSubDept(id);
      this.setState({ toggleSubDept: true });
    }
  };

  render() {
    const { dept, subDept, toggleDept } = this.state;
    const count = dept && dept.length;
    return (
      <div className="DepartmentOrgView">
        <div className="row">
          <div className="col-12">
            {/* branch */}
            <ul className="eachShelf animated slideInLeft faster">
              <li className="eachChild" onClick={this.onBranchClick}>
                <span className="childCount">{count}</span>
                <span className="imgSection">
                  <i>BR</i>
                </span>
                <span className="contentSection">
                  <h1>Branch</h1>
                </span>
              </li>
            </ul>

            {/* Department */}
            <TransitionGroup component={null}>
              <ul className="eachShelf">
                {dept &&
                  dept.map(item => (
                    <CSSTransition
                      in={toggleDept}
                      appear={false}
                      classNames={{
                        enterActive: "eachChild animated slideInLeft faster",
                        enterDone: "eachChild",
                        exitActive: "eachChild animated slideOutLeft faster",
                        exitDone: "eachChild"
                      }}
                      unmountOnExit
                      timeout={500}
                      key={item.hims_d_department_id}
                    >
                      <li
                        id="sub-child"
                        onClick={e =>
                          this.onDeptClick(item.hims_d_department_id, e)
                        }
                      >
                        {/* <span className="childCount" /> */}
                        <span className="imgSection">
                          <i>
                            {item.department_name.substring(0, 2).toUpperCase()}
                          </i>
                        </span>
                        <span className="contentSection">
                          <h1>{item.department_name}</h1>
                        </span>
                      </li>
                    </CSSTransition>
                  ))}
              </ul>
            </TransitionGroup>

            {/* Sub departments */}
            <TransitionGroup component={null}>
              <ul
                className="eachShelf"
                style={{
                  minHeight: this.height
                }}
              >
                {subDept &&
                  subDept.map(item => (
                    <CSSTransition
                      in={this.state.toggleSubDept}
                      appear={false}
                      classNames={{
                        enterActive: "eachChild animated slideInLeft faster",
                        enterDone: "eachChild",
                        exitActive: "eachChild animated slideOutLeft faster",
                        exitDone: "eachChild"
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
