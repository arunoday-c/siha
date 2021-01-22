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
          hims_f_sales_quotation_id,
          customer_name,
          sales_quotation_number,
          // english_name,
          sales_person_id,
          created_date,
        } = data[i];
        newData.push({
          hims_f_sales_quotation_id,
          primary_user_ids: sales_person_id,
          primary_message: `Dear, Kindly follow up Quotation <b>${sales_quotation_number}</b> created for customer <b>${customer_name}</b> on ${created_date}.`,
        });
      }
      // console.log("newData=== ", JSON.stringify(newData));
      resolve(newData);
    } catch (e) {
      reject(e);
    }
  });
