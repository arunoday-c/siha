// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strQuery = "";

      if (input.hospital_id > 0) {
        strQuery += ` and hospital_id= ${input.hospital_id} `;
      }

      if (input.location_id > 0) {
        strQuery += ` and inventory_location_id= ${input.location_id} `;
      }
      if (input.item_id > 0) {
        strQuery += ` and item_id= ${input.item_id} `;
      }

      console.log("input", input);
      options.mysql
        .executeQuery({
          query: `SELECT * FROM hims_d_inventory_item_master WHERE item_status='A';

            SELECT MAX(item_id) as item_id, ROUND(SUM(qtyhand),0) as qtyhand, MAX(item_code) as item_code, MAX(item_description) as item_description FROM hims_m_inventory_item_location IL 
            inner join hims_d_inventory_item_master ITM ON ITM.hims_d_inventory_item_master_id = IL.item_id 
            WHERE DATE(IL.created_date) =CURDATE() ${strQuery} GROUP BY item_id ;
            
            SELECT MAX(item_id) as item_id, ROUND(SUM(qtyhand),0) as qtyhand, MAX(item_code) as item_code, MAX(item_description) as item_description FROM hims_m_inventory_item_location IL 
            inner join hims_d_inventory_item_master ITM ON ITM.hims_d_inventory_item_master_id = IL.item_id 
            WHERE DATE(IL.created_date) BETWEEN DATE_SUB(CURDATE(),INTERVAL 30 DAY) AND CURDATE() ${strQuery} GROUP BY item_id;
            
            
            SELECT MAX(item_id) as item_id, ROUND(SUM(qtyhand),0) as qtyhand, MAX(item_code) as item_code, MAX(item_description) as item_description FROM hims_m_inventory_item_location IL 
            inner join hims_d_inventory_item_master ITM ON ITM.hims_d_inventory_item_master_id = IL.item_id 
            WHERE DATE(IL.created_date) BETWEEN DATE_SUB(CURDATE(),INTERVAL 60 DAY) AND DATE_SUB(CURDATE(),INTERVAL 30 DAY) ${strQuery}  GROUP BY item_id;
            
            
            SELECT MAX(item_id) as item_id, ROUND(SUM(qtyhand),0) as qtyhand, MAX(item_code) as item_code, MAX(item_description) as item_description FROM hims_m_inventory_item_location IL 
            inner join hims_d_inventory_item_master ITM ON ITM.hims_d_inventory_item_master_id = IL.item_id 
            WHERE DATE(IL.created_date) BETWEEN DATE_SUB(CURDATE(),INTERVAL 90 DAY) AND DATE_SUB(CURDATE(),INTERVAL 60 DAY) ${strQuery} GROUP BY item_id;
            
            
            SELECT MAX(item_id) as item_id, ROUND(SUM(qtyhand),0) as qtyhand, MAX(item_code) as item_code, MAX(item_description) as item_description FROM hims_m_inventory_item_location IL 
            inner join hims_d_inventory_item_master ITM ON ITM.hims_d_inventory_item_master_id = IL.item_id 
            WHERE DATE(IL.created_date) < DATE_SUB(CURDATE(),INTERVAL 90 DAY) ${strQuery}  GROUP BY item_id;`,
          printQuery: true,
        })
        .then((Result) => {
          options.mysql.releaseConnection();
          const item_data = Result[0];
          //   let todays_total = 0;
          //   let thirty_days_total = 0;
          //   let sixty_days_total = 0;
          //   let ninety_days_total = 0;
          //   let above_ninety_days_total = 0;
          //   let grand_total = 0;

          const outputArray = [];
          //   if (Result[1].length > 1) {
          //     todays_total = Result[1].pop().qtyhand;
          //   }
          //   if (Result[2].length > 1) {
          //     thirty_days_total = Result[2].pop().qtyhand;
          //   }
          //   if (Result[3].length > 1) {
          //     sixty_days_total = Result[3].pop().qtyhand;
          //   }
          //   if (Result[4].length > 1) {
          //     ninety_days_total = Result[4].pop().qtyhand;
          //   }
          //   if (Result[5].length > 1) {
          //     above_ninety_days_total = Result[5].pop().qtyhand;
          //   }

          item_data.forEach((items) => {
            let todays_stock = 0;
            let thirty_days_stock = 0;
            let sixty_days_stock = 0;
            let ninety_days_stock = 0;
            let above_ninety_days_stock = 0;

            const todays = Result[1].find(
              (f) => f.item_id == items.hims_d_inventory_item_master_id
            );

            if (todays) {
              todays_stock = todays.qtyhand;
            }
            const thirty_days = Result[2].find(
              (f) => f.item_id == items.hims_d_inventory_item_master_id
            );

            if (thirty_days) {
              thirty_days_stock = thirty_days.qtyhand;
            }
            const sixty_days = Result[3].find(
              (f) => f.item_id == items.hims_d_inventory_item_master_id
            );
            if (sixty_days) {
              sixty_days_stock = sixty_days.qtyhand;
            }
            const ninety_days = Result[4].find(
              (f) => f.item_id == items.hims_d_inventory_item_master_id
            );
            if (ninety_days) {
              ninety_days_stock = ninety_days.qtyhand;
            }
            const above_ninety_days = Result[5].find(
              (f) => f.item_id == items.hims_d_inventory_item_master_id
            );

            if (above_ninety_days) {
              above_ninety_days_stock = above_ninety_days.qtyhand;
            }

            const balance =
              parseFloat(todays_stock) +
              parseFloat(thirty_days_stock) +
              parseFloat(sixty_days_stock) +
              parseFloat(ninety_days_stock) +
              parseFloat(above_ninety_days_stock);

            if (balance > 0) {
              outputArray.push({
                item_code: items.item_code,
                item_description: items.item_description,
                todays_stock: todays_stock,
                thirty_days_stock: thirty_days_stock,
                sixty_days_stock: sixty_days_stock,
                ninety_days_stock: ninety_days_stock,
                above_ninety_days_stock: above_ninety_days_stock,
                balance: balance,
              });
            }
          });

          //   grand_total =
          //     parseFloat(todays_total) +
          //     parseFloat(thirty_days_total) +
          //     parseFloat(sixty_days_total) +
          //     parseFloat(ninety_days_total) +
          //     parseFloat(above_ninety_days_total);

          //   console.log("outputArray", outputArray);
          const result = {
            result: outputArray,
            // todays_total: todays_total,
            // thirty_days_total: thirty_days_total,
            // sixty_days_total: sixty_days_total,
            // ninety_days_total: ninety_days_total,
            // above_ninety_days_total: above_ninety_days_total,
            // grand_total: grand_total,
          };
          resolve(result);
        })
        .catch((e) => {
          // console.log("e:", e);

          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
