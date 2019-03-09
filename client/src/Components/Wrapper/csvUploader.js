import React, { Component } from "react";
import { getLabelFromLanguage } from "../../utils/GlobalFunctions";
import Dropzone from "react-dropzone";
import _ from "lodash";
import XLSX from "xlsx";
export default class UploadCsv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: []
    };
  }
  componentDidMount() {
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
      return {
        label: _label,
        id: column.fieldName
      };
    });
    this.setState({
      columns: header
    });
  }

  onChangeFileUploader(files) {
    const { columns } = this.state;
    const { rows, tool } = this.props;
    if (files.length > 0) {
      let file = files[0];
      let _jsonRecords = [];
      const _needToverify =
        typeof updateRecords === "function" && rows.length > 0 ? true : false;
      const reader = new FileReader();
      reader.onload = e => {
        let data = e.target.result;
        const workbook = XLSX.read(data, {
          type: "binary",
          cellDates: true,
          cellStyles: true
        });
        for (let i = 0; i < workbook.SheetNames.length; i++) {
          const ws = workbook.Sheets[workbook.SheetNames[i]];
          const data = XLSX.utils.sheet_to_json(ws, {
            raw: false,
            defval: null
          });
          _jsonRecords.push(data);
        }
      };
      reader.onloadend = () => {
        let _sendingRecords = [];
        if (_needToverify) {
          _sendingRecords = rows;
        }
        for (let i = 0; i < _jsonRecords.length; i++) {
          if (_needToverify) {
            for (let r = 0; r < _jsonRecords[i].length; r++) {
              _sendingRecords[r] = {
                ..._sendingRecords[r],
                ..._jsonRecords[i][r]
              };
            }
          } else {
            _sendingRecords = _jsonRecords[i];
          }
        }
        if (typeof tool.updateRecords === "function")
          tool.updateRecords(_sendingRecords);
      };
      reader.readAsBinaryString(file);
    }
  }

  render() {
    return (
      <React.Fragment>
        <Dropzone
          className=""
          style={{ border: "none", height: "auto", width: "auto" }}
          onDrop={this.onChangeFileUploader.bind(this)}
        >
          <button className="btn btn-primary">Upload Template</button>
        </Dropzone>
      </React.Fragment>
    );
  }
}
