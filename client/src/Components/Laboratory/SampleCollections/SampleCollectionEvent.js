const CollectSample = ($this, row) => {
  let inputobj = {
    hims_d_lab_sample_id: row.hims_d_lab_sample_id,
    order_id: row.hims_f_lab_order_id,
    hims_f_lab_order_id: row.hims_f_lab_order_id,
    sample_id: row.sample_id,
    collected: "Y",
    location_id: 1,
    service_id: row.service_id
  };
};

export { CollectSample };
