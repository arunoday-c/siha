import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import "./DepartmentView.css";

export default class DepartmentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dept: [],
      subDept: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(prevState.dept, nextProps.dept)) {
      return {
        dept: nextProps.dept
      };
    }
    if (!isEqual(prevState.subDept, nextProps.subDept)) {
      return {
        subDept: nextProps.subDept
      };
    }
  }

  onBranchClick = e => {
    e.currentTarget.classList.add("clickedLi");
    this.props.getDept();
  };

  onDeptClick = (id, e) => {
    e.currentTarget.classList.add("clickedLi");
    this.props.getSubDept(id);
  };

  render() {
    const { dept, subDept } = this.state;
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
            <ul className="eachShelf animated slideInLeft faster">
              {dept &&
                dept.map(item => (
                  <li
                    key={item.hims_d_department_id}
                    className="eachChild"
                    onClick={e =>
                      this.onDeptClick(item.hims_d_department_id, e)
                    }
                  >
                    <span className="childCount" />
                    <span className="imgSection">
                      <i>
                        {item.department_name.substring(0, 2).toUpperCase()}
                      </i>
                    </span>
                    <span className="contentSection">
                      <h1>{item.department_name}</h1>
                    </span>
                  </li>
                ))}
            </ul>
            <ul className="eachShelf animated slideInLeft faster">
              {subDept &&
                subDept.map(item => (
                  <li key={item.hims_d_sub_department_id} className="eachChild">
                    <span className="childCount">121</span>
                    <span className="imgSection">
                      <i>
                        {item.sub_department_name.substring(0, 2).toUpperCase()}
                      </i>
                    </span>
                    <span className="contentSection">
                      <h1>{item.sub_department_name}</h1>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
