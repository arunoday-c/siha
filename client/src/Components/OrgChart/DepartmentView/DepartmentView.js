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
      toggleDept: false
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

  onBranchClick = e => {
    const { dept } = this.state;
    let check = e.currentTarget.classList.contains("clickedLi");
    if (check) {
      e.currentTarget.classList.remove("clickedLi");
      this.height = "0";
      this.props.clearSub();
      this.setState({
        toggleDept: false
      });
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
      this.props.clearSub();
    } else {
      const els = document.querySelectorAll("#sub-child");
      els.forEach(el => {
        if (el.classList.contains("clickedLi")) {
          el.classList.remove("clickedLi");
        }
      });
      e.currentTarget.classList.add("clickedLi");
      this.height = "85vh";
      this.props.getSubDept(id);
    }
  };

  render() {
    const { dept, subDept, toggleDept } = this.state;
    const count = dept && dept.length;
    return (
      <div className="DepartmentOrgView">
        <div className="row">
          <div className="col-12">
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
            <TransitionGroup component={null}>
              <ul className="eachShelf">
                {//toggleDept?
                dept &&
                  dept.map(item => (
                    <CSSTransition
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
                        // className="eachChild"
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
                  ))
                //: null
                }
              </ul>
            </TransitionGroup>
            <ul
              className="eachShelf"
              style={{
                minHeight: this.height
              }}
            >
              {toggleDept
                ? subDept &&
                  subDept.map(item => (
                    <li
                      key={item.hims_d_sub_department_id}
                      className="eachChild animated slideInLeft faster"
                    >
                      {/* <span className="childCount">121</span> */}
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
                  ))
                : null}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
