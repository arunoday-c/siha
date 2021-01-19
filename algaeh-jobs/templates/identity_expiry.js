module.exports = (options, connection) =>
  new Promise(async (resolve, reject) => {
    try {
      // const result=   await connection.query(`
      //    SELECT EI.is_notify,EI.employee_id, EI.hims_d_employee_identification_id,ID.identity_document_name,ID.arabic_identity_document_name,
      //     DATEDIFF(date(EI.valid_upto),date(EI.issue_date)) as expire_after,E.employee_code,
      //     concat(if(T.title is not null,T.title,''),'. ', E.full_name)english_name,
      //     concat(if(T.arabic_title is not null,T.arabic_title,''),'. ', E.arabic_name)arabic_name,
      //     EI.issue_date,EI.valid_upto
      //     FROM hims_d_employee_identification as EI inner join hims_d_identity_document as ID
      //     on ID.hims_d_identity_document_id = EI.identity_documents_id
      //     inner join hims_d_employee as E on E.hims_d_employee_id =EI.employee_id
      //     left join hims_d_title as T on E.title_id = T.his_d_title_id
      //     where ID.notify_expiry='Y'  and
      //     DATEDIFF(date(EI.valid_upto),date(EI.issue_date)) <= ID.notify_before
      //     and ID.notify_before is not null and E.record_status='A'
      //     and (EI.alert_required is null or EI.alert_required ='Y');

      //     `)

      const { data } = options;
      let newData = [];
      for (let i = 0; i < data.length; i++) {
        const {
          hims_d_employee_identification_id,
          identity_document_name,
          arabic_identity_document_name,
          expire_after,
          employee_code,
          english_name,
          arabic_name,
          issue_date,
          valid_upto,
          employee_id,
          employees_id,
        } = data[i];
        newData.push({
          hims_d_employee_identification_id,
          primary_user_ids: employee_id,
          primary_message: `Dear ${english_name} / ${employee_code},
              Your ${identity_document_name} [${arabic_identity_document_name}] is going
              to expire with in ${expire_after} days. please provide as renew copy ASAP.
            `,
          other_user_ids: employees_id,
          other_message: `Employee ${english_name} / ${employee_code} 
              ${identity_document_name} is going to expire with in ${expire_after} days.
              
            `,
        });
      }
      resolve(newData);
    } catch (e) {
      reject(e);
    }
  });
