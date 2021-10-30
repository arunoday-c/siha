import hims_f_request_download from "../modules/hims_f_request_download";
export async function insertRecord(data: any) {
  try {
    const result = await hims_f_request_download.create(
      {
        user_id: data.user_id,
        report_title: data.report_title,
        download_link: data.download_link,
      },
      {
        raw: true,
      }
    );
    return result["hims_f_request_download_id"];
  } catch (e: any) {
    throw e;
  }
}

export async function upperRecord(data: any) {
  try {
    await hims_f_request_download.update(
      {
        download_location: data.download_location,
        is_notify: "N",
      },
      {
        where: {
          hims_f_request_download_id: data.hims_f_request_download_id,
        },
      }
    );
  } catch (e: any) {
    throw e;
  }
}
