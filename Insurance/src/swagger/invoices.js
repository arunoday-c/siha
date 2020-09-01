/**
 * @swagger
 * definitions:
 *  InvoiceDetailsModel:
 *   type: object
 *   properties:
 *    hims_f_invoice_details_id:
 *     type: number
 *    invoice_header_id:
 *     type: number
 *    bill_header_id:
 *     type: number
 *    bill_detail_id:
 *     type: number
 *    service_id:
 *     type: number
 *    quantity:
 *     type: number
 *     format: decimal
 *    gross_amount:
 *     type: number
 *     format: decimal
 *    discount_amount:
 *     type: number
 *     format: decimal
 *    patient_resp:
 *     type: number
 *     format: decimal
 *    patient_tax:
 *     type: number
 *     format: decimal
 *    patient_payable:
 *     type: number
 *     format: decimal
 *    company_resp:
 *     type: number
 *     format: decimal
 *    company_tax:
 *     type: number
 *     format: decimal
 *    company_payable:
 *     type: number
 *     format: decimal
 *    sec_company_resp:
 *     type: number
 *     format: decimal
 *    sec_company_tax:
 *     type: number
 *     format: decimal
 *    sec_company_payable:
 *     type: number
 *     format: decimal
 *    service_type_id:
 *     type: number
 *   service_type_code:
 *    type: string
 *   service_type:
 *    type: string
 *   arabic_service_type:
 *    type: string
 *   service_code:
 *    type: string
 *   service_name:
 *    type: string
 *   cpt_code:
 *    type: string
 *   cpt_desc:
 *    type: string
 *   prefLabel:
 *    type: string
 * 
 *  InvoiceForClaims:
 *   type: object
 *   properties:
 *    chkselect:
 *     type: string
 *     enum: ["0","1"]
 *    hims_f_invoice_header_id:
 *     type: number
 *    invoice_number:
 *     type: string
 *    invoice_date:
 *     type: string
 *     format: "YYYY-MM-DD HH:mm:ss"
 *    patient_id:
 *     type: number
 *    visit_id:
 *     type: number
 *    insurance_provider_id:
 *     type: number
 *    sub_insurance_id:
 *     type: number
 *    network_id:
 *     type: number
 *    network_office_id:
 *     type: number
 *    card_number:
 *     type: string
 *    gross_amount:
 *     type: number
 *     format: decimal
 *    discount_amount:
 *     type: number
 *     format: decimal
 *    patient_resp:
 *     type: number
 *     format: decimal
 *    patient_tax:
 *     type: number
 *     format: decimal
 *    company_resp:
 *     type: number
 *     format: decimal
 *    company_tax:
 *     type: number
 *     format: decimal
 *    company_payable:
 *     type: number
 *     format: decimal
 *    sec_company_resp:
 *     type: number
 *     format: decimal
 *    sec_company_tax:
 *     type: nuber
 *     format: decimal
 *    sec_company_payable:
 *     type: number
 *     format: decimal
 *    submission_date:
 *     type: string
 *     format: "YYYY-MM-DD"
 *     nullable: true
 *    submission_amount:
 *     type: number
 *     format: decimal
 *    remittance_date:
 *     type: string
 *     format: "YYYY-MM-DD"
 *    remittance_amount:
 *     type: number
 *     format: decimal
 *    denial_amount:
 *     type: number
 *     format: decimal
 *    claim_validated:
 *     type: string
 *     enum: ["V","E","X","P"]
 *    patient_code:
 *     type: string
 *    patient_name:
 *     type: string
 *    arabic_patient_name:
 *     type: string
 *    contact_number:
 *     type: string
 *    visit_code:
 *     type: string
 *    episode_id:
 *     type: number
 *     nullable: true
 *    doctor_id:
 *     type: number
 *    doctor_name:
 *     type: string
 *    employee_code:
 *     type: string
 *    insurance_provider_name:
 *     type: string
 *    arabic_insurance_provider_name:
 *     type: string
 *    sub_insurance_provider_code:
 *     type: string
 *    sub_insurance_provider:
 *     type: string
 *    arabic_sub_insurance_provider:
 *     type: string
 *    network_type:
 *     type: string
 *    arabic_network_type:
 *     type: string
 *     nullable: true
 *    price_from:
 *     type: string
 *     enum: ["S","P"]
 *    employer:
 *     type: string
 *    policy_number:
 *     type: string
 *    department_type:
 *     type: string
 *     enum: [D','E','O','N','PH','I','S']
 *    invoiceDetails:
 *     type: array
 *     items:
 *      $ref: "#/definitions/InvoiceDetailsModel"
 *

 *
 */
/**
 * @swagger
 * /invoiceGeneration/getInvoicesForClaims:
 *  get:
 *   tags:
 *    - Invoice Generation
 *   summary: get invoice details based on insurance statement id
 *   produces:
 *    -application/json
 *   parameters:
 *    - name: insurance_statement_id
 *      description: Insurance statement Id
 *      in: query
 *      required: true
 *      type: string
 *   responses:
 *    200:
 *     description: Return all insurances related to that statement
 *     schema:
 *      properties:
 *       success:
 *        type: boolean
 *       records:
 *        type: array
 *        items:
 *         $ref: "#/definitions/InvoiceForClaims"
 *    400:
 *     description: Return failure response
 *     schema:
 *      $ref: "#/definitions/Error"
 */
/**
 * @swagger
 * /resubmission/submit:
 *  post:
 *   tags:
 *    - Invoice Resubmission
 *   summary: resubmit invoice details
 *   produces:
 *    -application/json
 *   parameters:
 *    - name: body
 *      in: body
 *      required: true
 *      schema:
 *       properties:
 *        invoiceList:
 *         type: array
 *         required: true
 *         items:
 *          type: integer
 *   responses:
 *    200:
 *     description: return inurance number and id
 *     schema:
 *      properties:
 *       success:
 *        type: boolean
 *        default: true
 *       records:
 *        type: object
 *        properties:
 *         insurance_statement_number:
 *          type: string
 *          nullable: false
 *         insurance_statement_id:
 *          type: number
 *          nullable: false
 *    400:
 *     description: Return failure response
 *     schema:
 *      $ref: "#/definitions/Error"
 */
