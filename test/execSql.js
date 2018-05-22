let mysql = require("mysql");
// let config = require("../src/keys/test")
module.exports = {
  execSql: execSql
};
function execSql(sql, values) {
  let conn = mysql.createConnection({
    host: "159.89.163.148",
    user: "devteam",
    password: "devteam",
    database: "algaeh_hims_test_db"
  });

  // let sql =
  //   "INSERT INTO `algaeh_d_api_auth`(`username`, `password`,`created_date`,`created_by`,`updated_date`, `updated_by`, `record_status`) VALUES ('clienttestuser', 'clienttestuser', curdate(), 'chai', curdate(), 'chai', 'A');";
  console.log(sql);
  conn.connect(function(err) {
    if (err) {
      console.log("connect: ", err);
      return;
    }
    console.log(conn.state);
    sql = mysql.format(sql);
    conn.query(sql, function(err, result) {
      if (err) {
        console.log("query :", err);
      }
      console.log("Test data inserted");
      console.log(result);

      // console.log(result);
      return result;
    });
    conn.commit();
    conn.end();
    // conn.commit();
    // console.log("connection closed");
  });
}
