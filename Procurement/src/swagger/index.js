/**
 * @swagger
 * /procurement/getReportForMail:
 *  get:
 *   tags:
 *    - Procurement
 *   description: Return Report to send mail to the vendor
 *   parameters:
 *    - name: net_total
 *      in: formData
 *      type: number
 *      format: decimal
 *      required: true
 *    - name: po_from
 *      in: formData
 *      type: string
 *      required: true
 *    - name: purchase_number
 *      in: formData
 *      type: string
 *      required: true
 *    - name: vendor_email
 *      in: formData
 *      type: string
 *      required: true
 *    - name: location_name
 *      in: formData
 *      type: string
 *      required: true
 *    - name: po_date
 *      in: formData
 *      type: string
 *      format: YYYY-MM-DD
 *      required: true
 *    - name: vendor_name
 *      in: formData
 *      type: string
 *      required: true
 *   responses:
 *    200:
 *     description: Return response Sucessfully sent
 *     schema:
 *       $ref: '#/definitions/Success'
 *    400:
 *     description: Return error message
 *     schema:
 *      $ref: '#/definitions/Error'
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
 *    net_total:
 *     type: number
 *     format: decimal
 *     required: true
 *    po_from:
 *     type: string
 *     required: true
 *    purchase_number:
 *     type: string
 *     required: true
 *    vendor_email:
 *     type: string
 *     required: true
 *    location_name:
 *     type: string
 *     required: true
 *    po_date:
 *     type: string
 *     format: YYYY-MM-DD
 *     required: true
 *    vendor_name:
 *     type: string
 *     required: true
 */
