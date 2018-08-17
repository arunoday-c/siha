import React, { Component } from "react";
import "./experiment.css";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
// import { AlagehAutoComplete } from "./Wrapper/algaehWrapper";
// import GlobalVariables from "../utils/GlobalVariables.json";

class DeptMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pain: 0
    };
  }

  //   handleChangeStart = () => {
  //     console.log("Change event started");
  //   };

  //   handleChange = pain => {
  //     this.setState({
  //       pain: pain
  //     });
  //   };

  //   handleChangeComplete = ()   => {
  //     console.log("Change event completed");
  //   };

  //   setPainScale(pain_number, e) {
  //     var element = document.querySelectorAll("[painTab]");
  //     for (var i = 0; i < element.length; i++) {
  //       element[i].classList.remove("active");
  //     }
  //     e.currentTarget.classList.add("active");
  //     this.setState({ pain: pain_number });
  //   }

  render() {
    return (
      //   <div className="experiment">
      //     <div>PAIN SCALE {" " + this.state.pain} </div>
      //     <br />
      //     <div className="row">
      //       <div className="pain_slider col">
      //         <Slider
      //           step={2}
      //           min={0}
      //           max={10}
      //           value={this.state.pain}
      //           onChangeStart={this.handleChangeStart}
      //           onChange={this.handleChange}
      //           onChangeComplete={this.handleChangeComplete}
      //         />
      //       </div>

      //       <AlagehAutoComplete
      //         div={{ className: "col-lg-3" }}
      //         label={{
      //           fieldName: "pain",
      //           forceLabel: "Pain",
      //           isImp: true
      //         }}
      //         selector={{
      //           name: "pain",
      //           className: "select-fld",
      //           value: this.state.pain,
      //           dataSource: {
      //             textField:
      //               this.state.selectedLang === "en" ? "name" : "arabic_name",
      //             valueField: "value",
      //             data: GlobalVariables.PAIN_SCALE
      //           }
      //           // onChange: texthandle.bind(this, this)
      //         }}
      //       />
      //     </div>

      //     <div>
      //       <ul className="pain-scale-ul">
      //         <li
      //           className="pain-1"
      //           painTab="1"
      //           onClick={this.setPainScale.bind(this, 0)}
      //         />
      //         <li
      //           className="pain-2"
      //           painTab="2"
      //           onClick={this.setPainScale.bind(this, 2)}
      //         />
      //         <li
      //           className="pain-3"
      //           painTab="3"
      //           onClick={this.setPainScale.bind(this, 4)}
      //         />
      //         <li
      //           className="pain-4"
      //           painTab="4"
      //           onClick={this.setPainScale.bind(this, 6)}
      //         />
      //         <li
      //           className="pain-5"
      //           painTab="5"
      //           onClick={this.setPainScale.bind(this, 8)}
      //         />
      //         <li
      //           className="pain-6"
      //           painTab="6"
      //           onClick={this.setPainScale.bind(this, 10)}
      //         />
      //       </ul>
      //     </div>
      //   </div>

      // Bootstrap code below
      <div>
        <nav className="navbar navbar-dark fixed-top bg-algaeh flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0">Company name</a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap">
              <a className="nav-link">Sign out</a>
            </li>
          </ul>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
              <div className="sidebar-sticky">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a className="nav-link active">
                      <span data-feather="home" />
                      Dashboard <span className="sr-only">(current)</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file" />
                      Orders
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="shopping-cart" />
                      Products
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="users" />
                      Customers
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="bar-chart-2" />
                      Reports
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="layers" />
                      Integrations
                    </a>
                  </li>
                </ul>

                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                  <span>Saved reports</span>
                  <a className="d-flex align-items-center text-muted">
                    <span data-feather="plus-circle" />
                  </a>
                </h6>
                <ul className="nav flex-column mb-2">
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Current month
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Last quarter
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Social engagement
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span data-feather="file-text" />
                      Year-end sale
                    </a>
                  </li>
                </ul>
              </div>
            </nav>

            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Dashboard</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                  <div className="btn-group mr-2">
                    <button className="btn btn-sm btn-outline-secondary">
                      Share
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      Export
                    </button>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle">
                    <span data-feather="calendar" />
                    This week
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default DeptMaster;
