import React, { Component } from "react";
import { getLabelFromLanguage } from "../../utils/GlobalFunctions";
import XLSX from "xlsx";
const UploadCsv = React.lazy(() => import("./csvUploader"));
export default class CreateCsv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      header: [],
      showImport: true,
      showExport: true
    };
  }
  componentDidMount() {
    let _onlyHeaders = [];
    const { tool } = this.props;
    const header = this.props.columns.map(column => {
      let _label = "";
      if (typeof column.label === "string") {
        _label = column.label;
      } else {
        if (column.label.props.label.forceLabel !== undefined)
          _label = column.label.props.label.forceLabel;
        else {
          if (column.label.props.label.fieldName !== undefined)
            _label = getLabelFromLanguage(column.label.props.label.fieldName);
        }
      }
      _onlyHeaders.push(column.fieldName);
      return _label;
    });
    if (Array.isArray(tool.extraColumns)) {
      _onlyHeaders.concat(tool.extraColumns);
    }
    this.setState({
      columns: header,
      header: _onlyHeaders
    });
  }
  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      showExport: props.showExport === undefined ? true : props.showExport,
      showImport: props.showImport === undefined ? true : props.showImport
    });
  }
  StartDownloadCsv(e) {
    const { rows, fileName, tool } = this.props;
    const { header } = this.state;

    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: fileName,
      Subject: fileName,
      Author: "Algaeh Technologies",
      CreatedDate: new Date()
    };
    wb.SheetNames.push(fileName);
    const ws = XLSX.utils.json_to_sheet(rows, { header: header });
    wb.Sheets[fileName] = ws;

    const myLabel = () => {
      var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      var blob = new Blob([this.s2ab(wbout)], {
        type: "application/octet-stream"
      });
      var objectUrl = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.setAttribute("href", objectUrl);
      link.setAttribute("download", fileName + ".xlsx");
      link.click();
    };

    if (typeof tool.formulazone === "function") {
      tool.formulazone(ws, myLabel);
    } else {
      myLabel();
    }
    // ws["F2"] = {
    //   ...ws["F2"],
    //   f: 'TEXT(E3-D2,"HH.MM")'
    // };
  }
  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  UploadCsvHandler() {
    return (
      <UploadCsv
        columns={this.props.columns}
        tool={this.props.tool}
        rows={this.props.rows}
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.state.showImport ? (
          <button
            onClick={this.StartDownloadCsv.bind(this)}
            className="btn btn-default"
          >
            Download Template
          </button>
        ) : null}
        {this.state.showExport ? this.UploadCsvHandler() : null}
      </React.Fragment>
    );
  }
}
