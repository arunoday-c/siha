const Excel = require("exceljs");

function algaehExcel() {
  this.workbook = null;
  this.response = null;
}
/*
{
  creator:"",//default algaeh 
 sheets: [
{
    sheetProperties:{}, //Object type,
    sheetName:"",
    columns:[{header:"",key:""}],//other properties we can assign
    rows:[],
    getWorkSheet:(worksheet)=>{}//if required
  }
    ]
}
*/
algaehExcel.prototype.CreateExcelWorkBook = function(options, response) {
  try {
    this.response = response;
    this.workbook = new Excel.stream.xlsx.WorkbookWriter({
      stream: this.response
    });
    this.workbook.creator =
      options.creator == null ? "algaeh" : options.creator;

    for (let i = 0; i < options.sheets.length; i++) {
      const _sheetProperties =
        options.sheets[i].sheetProperties != null
          ? options.sheets[i].sheetProperties
          : {};
      let worksheet = this.workbook.addWorksheet(
        options.sheets[i].sheetName,
        _sheetProperties
      );
      worksheet.columns = options.sheets[i].columns;

      for (let row = 0; row < options.sheets[i]["rows"].length; row++) {
        worksheet.addRow(options.sheets[i]["rows"][row]); //.commit();
      }

      // worksheet.getCell("K1").dataValidation = {
      //   type: "list",
      //   allowBlank: true,
      //   formulae: ['"One,Two,Three,Four"']
      // };
    }
  } catch (e) {
    console.log("Error : ", e);
  }
};
algaehExcel.prototype.FlushExcel = function() {
  this.workbook.commit();
  if (this.response != null) {
    this.response.writeHead(200, {
      "Content-Disposition": `attachment; filename="export.xlsx"`,
      "Transfer-Encoding": "chunked",
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
  }
};

module.exports = algaehExcel;
