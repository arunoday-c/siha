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
 *  insuranceStatement:
 *   type: object
 *   properties:
 *    claims:
 *     type: array
 *     items:
 *      $ref: "#/definitions/ClaimsDetails"
 *  ClaimsDetails:
 *     type: object
 *     properties:
 *      card_class:
 *       type: number
 *      card_holder_age:
 *       type: number
 *      card_holder_gender:
 *       type: string
 *      card_holder_name:
 *       type: string
 *      card_number:
 *       type: string
 *       required: true
 *      patient_code:
 *       type: string
 *      pat_name:
 *       type: string
 *      doc_name:
 *       type: string
 *      invoice_number:
 *       type: string
 *      invoice_date:
 *       type: string
 *       format : YYYY-MM-DD
 *      gross_amount:
 *       type: number
 *       format: decimal
 *      company_resp:
 *       type: number
 *       format: decimal
 *      company_tax:
 *       type: number
 *       format: decimal
 *      company_payable:
 *       type: number
 *       format: decimal
 *      denial_amount:
 *       type: number
 *       format: decimal
 *      remittance_amount:
 *       type: number
 *       format: decimal
 *      claim_validated:
 *       type: string
 *      insurance_provider_id:
 *       type: number
 *      hims_f_invoice_header_id:
 *       type: number
 *      insurance_statement_id:
 *       type: number
 *      network_id:
 *       type: number
 *      network_office_id:
 *       type: number
 *      patient_id:
 *       type: number
 *      sub_insurance_id:
 *       type: number
 *      visit_id:
 *       type: number
 *  insuranceStamentDetails:
 *      hims_f_insurance_statement_id:
 *       type: number
 *      insurance_provider_id:
 *       type: number
 *      insurance_statement_number:
 *       type: string
 *      insurance_status:
 *       type: string
 *      sub_insurance_id:
 *       type: number
 *      total_balance_amount:
 *       type: number
 *       format: decimal
 *      total_company_payable:
 *       type: number
 *       format: decimal
 *      total_denial_amount:
 *       type: number
 *       format: decimal
 *      total_remittance_amount:
 *       type: number
 *       format: decimal
 *  UpdateInsuranceStatement:
 *   type: object
 *   properties:
 *    invoice_header_id:
 *     type: number
 *     required: true
 *    invoice_detail_id:
 *     type: number
 *     required: true
 *    insurance_statement_id:
 *     type: number
 *     required: true
 *    remittance_amount:
 *     type: number
 *     format: decimal
 *     required: true
 *    denial_amount:
 *     type: number
 *     format: decimal
 *     required: true
 *    denial_reason_id:
 *     type: number
 *     require: true
 *    cpt_code:
 *     type: string
 *     require: true
 *
 */

/**
 * @swagger
 *
 * /insurance/getInsuranceStatement:
 *  get:
 *   tags:
 *    - Insuarance Statement
 *   produces:
 *    -application/json
 *   parameters:
 *    - name: hims_f_insurance_statement_id
 *      description: Get Insurance Statement For perticular Insuarance
 *      in: query
 *      required: true
 *      type: string
 *   responses:
 *    200:
 *     description: Return Insurance Statement Details
 *     schema:
 *      properties:
 *       success:
 *        type: boolean
 *       records:
 *        allOf:
 *         - $ref: "#/definitions/insuranceStatement"
 *         - $ref: "#/definitions/insuranceStamentDetails"
 *    400:
 *     decription: Return failure message
 *     schema:
 *      $ref: "#/definitions/Error"
 */
/**
 * @swagger
 * /insurance/updateInsuranceStatement:
 *  put:
 *   tags:
 *    - Insuarance Statement
 *   produces:
 *    -application/json
 *   parameters:
 *    - name: body
 *      discription: Update Insurance Statement
 *      in: body
 *      required: true
 *      schema:
 *        $ref: "#/definitions/UpdateInsuranceStatement"
 *   responses:
 *    200:
 *     description: Return success with messag
 *     schema:
 *      properties:
 *       success:
 *        type: boolean
 *       message:
 *        type: string
 *        default: Updated Successfully
 *    400:
 *     decription: Return error message
 *     schema:
 *      $ref: "#/definitions/Error"
 */
