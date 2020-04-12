
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

let queryResultPrint = (req, res, next) => {

    const _mysql = new algaehMysql({ path: keyPath });
    try {
      let input = req.body
      
        _mysql
          .executeQuery({
            query:input
              
            // printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            res.status(200)
            .json({
                success: true,
               record: result
              })
              .end();
            next();
          })
        .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });

        }catch (e) {
            _mysql.releaseConnection();
            next(e);
          }
        

    }
    export default {
        queryResultPrint
      };

