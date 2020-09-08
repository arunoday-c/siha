const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strQuery = "";

      let return_age = "ALL";
      let isAge = "";

      switch (input.age_range) {
        case "L":
          if (input.age > 0) {
            isAge = ` where  new_age <= ${input.age}`;
            return_age = ` Less/Equal to ${input.age}`;
          }

          break;
        case "G":
          if (input.age > 0) {
            isAge = ` where  new_age >= ${input.age}`;
            return_age = ` Greater/Equal ${input.age}`;
          }

          break;
        case "E":
          if (input.age > 0) {
            isAge = ` where new_age = ${input.age}`;
            return_age = ` Equal to ${input.age}`;
          }

          break;
      }

      options.mysql
        .executeQuery({
          query: ` 
          select  hospital_name FROM hims_d_hospital where hims_d_hospital_id=?;
          select * from (select P.hims_d_patient_id,P.patient_code,P.full_name,P.gender,P.created_date, P.date_of_birth, TIMESTAMPDIFF(YEAR, P.date_of_birth, CURDATE()) AS new_age, N.nationality
          from hims_f_patient P
          left join hims_d_nationality N on P.nationality_id=N.hims_d_nationality_id
          where P.hospital_id=?  ${strQuery} )as EM ${isAge} order by new_age ; `,
          values: [input.hospital_id, input.hospital_id],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const hospital_name = res[0][0]["hospital_name"];
          const result = res[1];

          resolve({
            return_age: return_age,
            hospital_name: hospital_name,
            no_patients: result.length,
            result: result,
          });
        })
        .catch((e) => {
          console.log("e:", e);
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      console.log("e:", e);
      reject(e);
    }
  });
};
module.exports = { executePDF };
