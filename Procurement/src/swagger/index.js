/**
 * @swagger
 * /procurement/getReportForMail:
 *  get:
 *   tags:
 *    - Procurement
 *   description: Return Report to send mail to the vendor
 *   responses:
 *    '200':
 *      description: successful response
 */

/**
 * @swagger
 * definitions:
 *  Success:
 *   type: object
 *   required:
 *    - success
 *   properties:
 *    success:
 *     type: boolean
 *    any:
 *     type: object
 *  Error:
 *   type: object
 *   required:
 *    - success
 *    - message
 *   properties:
 *    success:
 *     type: boolean
 *     default: false
 *    message:
 *     type: string
 *  getReportForMail:
 *   type: object
 *   properties:
 *    report:
 *     type: object
 *     required: true
 *    vendor_email:
 *     type: string
 *     required: true
 *    subject:
 *     type: string
 */
