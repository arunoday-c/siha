import hims_f_sms_lab from "./modules/lab_sms";
export async function updateLabSMSStatus(data: any) {
  try {
    const {
      JobId,
      MessageData,
      processed_by,
      error_message,
      delivery_status,
      message,
      number_contact,
    } = data;
    let _MsgId, _PartId;
    if (Array.isArray(MessageData) && MessageData.length > 0) {
      const { MessageParts } = MessageData[0];
      if (Array.isArray(MessageParts) && MessageParts.length > 0) {
        const { MsgId, PartId } = MessageParts[0];
        _MsgId = MsgId;
        _PartId = PartId;
      }
    }
    await hims_f_sms_lab.create(
      {
        contact_no: number_contact,
        message,
        message_job_id: JobId,
        message_id: _MsgId,
        part_id: _PartId,
        processed_by,
        error_message,
        delivery_status,
      },
      {
        logging: true,
      }
    );
  } catch (e) {
    console.error("LAB_SMS error====>", e);
  }
}
