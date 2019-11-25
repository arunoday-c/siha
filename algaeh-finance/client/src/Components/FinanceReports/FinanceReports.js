import React from "react";

const style = {
  mystyle: {
    backgroundColor: "#fefefe"
  },
  eachTable: {
    width: "100%",
    marginTop: 1,
    paddingTop: 15,
    borderTop: "1px solid #ccc",
    borderBottom: "1px solid #ccc"
  },
  reportListLeftSide: {
    backgroundColor: "white"
  },
  reportPreviewRight: {
    border: "1px dashed #000"
  },
  reportListHead: {
    backgroundColor: "#efefef",
    padding: 10,
    margin: 0
  },
  reportListUl: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    maxHeight: "20vh"
  },
  reportListLi: {
    margin: 0,
    padding: "5px 10px",
    listStyle: "none",
    borderBottom: "2px dashed #ccc",
    cursor: "pointer"
  },
  treeListUL: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    maxHeight: "20vh"
  },
  treeListLi: {
    margin: 0,
    padding: "5px 10px",
    listStyle: "none",
    cursor: "pointer",
    width: "100%"
  },
  treeListInnerUl: {
    paddingRight: 0,
    paddingLeft: 15,
    margin: 0,
    listStyle: "none",
    width: "100%"
  },
  treeListInnerLi: {
    listStyle: "none",
    paddingTop: 4,
    paddingBottom: 4
  },
  treeListLiText: {
    textAlign: "left"
  },
  treeListLiValue: {
    float: "right"
  },
  treeListLiTextTotal: {
    textAlign: "left",
    fontWeight: "bold"
  },
  treeListLiValueTotal: {
    float: "right",
    fontWeight: "bold"
  }
};
export default function FinanceReports() {
  return (
    <div className="row" style={style.mystyle}>
      <div className="col-3" style={style.reportListLeftSide}>
        <h6 style={style.reportListHead}>Standard Report</h6>
        <ul style={style.reportListUl}>
          <li style={style.reportListLi}>Account receivable ageing summary</li>
          <li style={style.reportListLi}>Balance Sheet</li>
          <li style={style.reportListLi}>Profit and Loss</li>
        </ul>{" "}
        <h6 style={style.reportListHead}>Standard Report</h6>
        <ul style={style.reportListUl}>
          <li style={style.reportListLi}>Account receivable ageing summary</li>
          <li style={style.reportListLi}>Balance Sheet</li>
          <li style={style.reportListLi}>Profit and Loss</li>
        </ul>{" "}
        <h6 style={style.reportListHead}>Standard Report</h6>
        <ul style={style.reportListUl}>
          <li style={style.reportListLi}>Account receivable ageing summary</li>
          <li style={style.reportListLi}>Balance Sheet</li>
          <li style={style.reportListLi}>Profit and Loss</li>
        </ul>{" "}
      </div>
      <div className="col-9" style={style.reportPreviewRight}>
        <div>
          <table style={style.eachTable}>
            <tr>
              <td>
                <ul style={style.treeListUL}>
                  <li style={style.treeListLi}>
                    <span style={style.treeListLiText}>
                      <b>&#8627;</b> Assets
                    </span>
                    <ul style={style.treeListInnerUl}>
                      <li style={style.treeListInnerLi}>
                        <span style={style.treeListLiText}>
                          <b>&#8627;</b> Current Assets
                        </span>
                        <ul style={style.treeListInnerUl}>
                          <li style={style.treeListInnerLi}>
                            <span style={style.treeListLiText}>
                              <b>&#8627;</b> Cash and cash equivalents
                            </span>
                            <ul style={style.treeListInnerUl}>
                              <li style={style.treeListInnerLi}>
                                <span style={style.treeListLiText}>
                                  <b>&#8627;</b> Bank Account HDFC
                                </span>
                                <span style={style.treeListLiValue}>0.00</span>
                              </li>{" "}
                              <li style={style.treeListInnerLi}>
                                <span style={style.treeListLiTextTotal}>
                                  <b>&#8627;</b> Total Cash and cash equivalents
                                </span>
                                <span style={style.treeListLiValueTotal}>
                                  0.00
                                </span>
                              </li>
                            </ul>{" "}
                          </li>{" "}
                          <li style={style.treeListInnerLi}>
                            <span style={style.treeListLiTextTotal}>
                              <b>&#8627;</b> Total Current Assets
                            </span>
                            <span style={style.treeListLiValueTotal}>0.00</span>
                          </li>
                        </ul>
                      </li>
                      <li style={style.treeListInnerLi}>
                        <span style={style.treeListLiTextTotal}>
                          <b>&#8627;</b> Total Assets
                        </span>
                        <span style={style.treeListLiValueTotal}>0.00</span>
                      </li>
                    </ul>{" "}
                  </li>
                </ul>{" "}
              </td>
            </tr>
          </table>
          <table style={style.eachTable}>
            <tr>
              <td>
                <ul style={style.treeListUL}>
                  <li style={style.treeListLi}>
                    <span style={style.treeListLiText}>
                      <b>&#8627;</b> Liabilities and Equity
                    </span>
                    <ul style={style.treeListInnerUl}>
                      <li style={style.treeListInnerLi}>
                        <span style={style.treeListLiText}>
                          <b>&#8627;</b> Current Liabilities
                        </span>
                        <ul style={style.treeListInnerUl}>
                          <li style={style.treeListInnerLi}>
                            <span style={style.treeListLiText}>
                              <b>&#8627;</b> Input IGST
                            </span>{" "}
                            <span style={style.treeListLiValue}>0.00</span>
                          </li>{" "}
                          <li style={style.treeListInnerLi}>
                            <span style={style.treeListLiTextTotal}>
                              <b>&#8627;</b> Total Current Liabilities
                            </span>
                            <span style={style.treeListLiValueTotal}>0.00</span>
                          </li>
                        </ul>
                      </li>
                      <li style={style.treeListInnerLi}>
                        <span style={style.treeListLiTextTotal}>
                          <b>&#8627;</b> Liabilities and Equity
                        </span>
                        <span style={style.treeListLiValueTotal}>0.00</span>
                      </li>
                    </ul>{" "}
                  </li>
                </ul>{" "}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}
