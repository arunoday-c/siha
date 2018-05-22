let chai = require("chai");
let chaiHttp = require("chai-http");
// import apiAuth from "../src/middleware/index";
let databaseCleaner = require("../test/databaseCleaner");
let execSql = require("./execSql");
 let server = require("../src/server");
let data = require("./test_data/apiAuth.json");
// import debug from "debug."
let should = chai.should();

chai.use(chaiHttp);
 console.log(process.env.NODE_ENV);

describe("API Auth & Token Generation", function() {
  beforeEach(function(done) {
    databaseCleaner.databaseCleaner(done)
   
  });

  // // });
  // //     1. This API call excepts username and password in body
  // //     2. If username/password is valid returns a api auth token
  // //     3. if username/password is invalid, throws an error
  describe("POST /api/v1/apiAuth", function() {
    // Test 1:

    it("It should return a token for valid account", function(done) {
      let account = {
        username: "clienttestuser",
        password: "clienttestuser"
      };
    //   var conn = mysql.createConnection({
    //     host: "159.89.163.148",
    //     user: "devteam",
    //     password: "devteam",
    //     database: "algaeh_hims_test_db"
    //   });
    //   conn.connect(function(error){
    //     if(error){
    //         console.log("Connection Error",error);
    //         return;
    //     }
        
    //     conn.query("INSERT INTO `algaeh_d_api_auth`(`username`, `password`,`created_date`,\
    //     `created_by`,`updated_date`, `updated_by`, `record_status`) \
    //     VALUES(?,?,?,?,?,?,?)",[
    //       "clienttestuser",
    //       "clienttestuser",
    //       new Date(),
    //       "chai",
    //       new Date(),
    //       "chai",
    //       "A"
    //     ],function(error,result){
    //         if(error){
    //             console.log("Query Issue",error);
    //             done(err);
    //         }
           
    //         console.log("if error",JSON.stringify(error));
    //         console.log("Executed result ",result);
    //         done();
    //     });
    //  });

    execSql.execSql(data.insert_account_user);
      
     
      // console.log(account);
      // Insert sample data
      // let result = execSql.execSql(data.insert_account_user);
      // let result = execSql1.execSql(
      //   "INSERT INTO `algaeh_d_api_auth`(`username`, `password`,`created_date`,`created_by`,`updated_date`, `updated_by`, `record_status`) VALUES ('clienttestuser', 'clienttestuser', now(), 'chai', now(), 'chai', 'A');"
      // );
      // console.log(result);
      chai
        .request(server)
        .post("/api/v1/apiAuth")
        .send(account)
        .end(function(err, res) {
           console.log(res);
          // console.log("1");
          // console.log(JSON.stringify(res));
          res.should.have.status(200);
          console.log("2");
          res.body.should.be.a("object");
          console.log("3");
         res.body.should.have.property("username");
         res.body.should.have.property("password");
      
    });
   
  });
   });
});
