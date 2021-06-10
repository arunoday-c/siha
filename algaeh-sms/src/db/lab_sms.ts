import hims_f_sms_lab from "./modules/lab_sms";
export async function updateLabSMSStatus(data: any) {
  try {
    const { JobId, MessageData, processed_by, error_message, delivery_status } =
      data;
    if (Array.isArray(MessageData) && MessageData.length > 0) {
      const { Number, MessageParts } = MessageData[0];
      if (Array.isArray(MessageParts) && MessageParts.length > 0) {
        const { MsgId, PartId, Text } = MessageParts[0];
        await hims_f_sms_lab.create(
          {
            contact_no: Number,
            message: Text,
            message_job_id: JobId,
            message_id: MsgId,
            part_id: PartId,
            processed_by,
            error_message,
            delivery_status,
          },
          {
            logging: true,
          }
        );
      }
    }
  } catch (e) {
    console.error("LAB_SMS error====>", e);
  }
}
