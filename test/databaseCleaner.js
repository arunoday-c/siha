// import { builtinModules } from "module";
require("module").builtinModules;
let knexCleaner = require("knex-cleaner");
// let config = require("../src/keys/test");
// import knexMod from "knex";
// let mysql = require("mysql");

module.exports.databaseCleaner = function(done,callBack) {
  console.log("Database cleaner invoked");
  var knex = require("knex")({
    client: "mysql",
    connection: {
      host: "159.89.163.148",
      user: "devteam",
      password: "devteam",
      database: "algaeh_hims_test_db"
    }
  });

  let options = {
    mode: "truncate", // Valid options 'truncate', 'delete'
    ignoreTables: []
  };
  // console.log(knex);
  // console.log(options);

  knexCleaner.clean(knex, options)
  .then(function() {
    console.log("clear count");
    done();
    return;
  });
  //done;
};
