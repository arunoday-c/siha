import { newAlgaehApi } from "../../../hooks";

export const getNurseNotes = async (key, { patient_id, visit_id }) => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/getNurseNotes",
    data: { patient_id, visit_id },
    method: "GET",
  });
  return res.data?.records;
};

export const addNurseNote = async ({
  patient_id,
  visit_id,
  episode_id,
  nursing_notes,
  visit_date,
}) => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/addNurseNote",
    data: {
      patient_id,
      visit_id,
      episode_id: episode_id || null,
      nursing_notes,
      visit_date: visit_date || new Date(),
    },
    method: "POST",
  });
  return res.data?.records;
};

export const updateNurseNote = async ({
  nursing_notes,
  hims_f_nurse_notes_id,
}) => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/updateNurseNote",
    data: {
      nursing_notes,
      hims_f_nurse_notes_id,
    },
    method: "PUT",
  });
  return res.data?.records;
};

export const deleteNurseNote = async ({ hims_f_nurse_notes_id }) => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/deleteNurseNote",
    data: {
      hims_f_nurse_notes_id,
    },
    method: "DELETE",
  });
  return res.data?.records;
};
