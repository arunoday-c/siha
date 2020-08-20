/**
 * @swagger
 * /frontDesk/getDoctorAndDepartment:
 *  get:
 *   tags:
 *    - Patient Registration
 *   description: Return doctor and departments in tree style
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
 *  patientRegistration:
 *   allOf:
 *    - $ref: "#/definitions/patientDemgraphics"
 *    - $ref: "#/definitions/PatientVist"
 *    - $ref: "#/definitions/PatientInsurance"
 *    - $ref: "#/definitions/PatientReceptHeader"
 *    - $ref: "#/definitions/BillingHeader"
 *    - $ref: "#/definitions/PackageHeader"
 *   properties:
 *    billdetails:
 *     type: array
 *     items:
 *      $ref: "#/definitions/BillingDetails"
 *    receiptdetails:
 *     type: array
 *     items:
 *      $ref: "#/definitions/PatientReceptDetails"
 *    package_details:
 *     type: array
 *     default: []
 *     items:
 *      $ref: "#/definitions/PackageDetails"
 *     applicable: visit is of multi visit package else its []
 *  patientDemgraphics:
 *   type: object
 *   properties:
 *    title_id:
 *     type: number
 *     required: true
 *    first_name:
 *     type: string
 *     required: true
 *    middle_name:
 *     type: string
 *     required: true
 *    last_name:
 *     type: string
 *     required: true
 *    full_name:
 *     type: string
 *     required: true
 *    arabic_name:
 *     type: string
 *     required: true
 *    gender:
 *     type: string
 *     required: true
 *    religion_id:
 *     type: number
 *    date_of_birth:
 *     type: string
 *     format: YYYY-MM-DD
 *     required: true
 *    age:
 *     type: number
 *    marital_status:
 *     type: string
 *    address1:
 *     type: string
 *    address2:
 *     type: string
 *    contact_number:
 *     type: string
 *    relationship_with_patient:
 *     type: string
 *     nullable: true
 *    visa_type_id:
 *     type: number
 *     nullable: true
 *    nationality_id:
 *     type: number
 *    postal_code:
 *     type: string
 *    primary_identity_id:
 *     type: number
 *     required: true
 *    primary_id_no:
 *     type: string
 *     required: true
 *    secondary_identity_id:
 *     type: number
 *     nullable: true
 *    secondary_id_no:
 *     type: string
 *     nullable: true
 *    patient_type:
 *     type: number
 *    vat_applicable:
 *     type: string
 *     enum: ["Y","N"]
 *     default: "N"
 *    city_id:
 *     type: number
 *     nullable: true
 *    state_id:
 *     type: number
 *     nullable: true
 *    country_id:
 *     type: number
 *     rewuired: true
 *    employee_id:
 *     type: number
 *     nullable: true
 *    ScreenCode:
 *     type: string
 *     required: true
 *     description: screen code from cookies
 *  PatientVist:
 *   type: object
 *   properties:
 *    age_in_years:
 *     type: number
 *     nullable: true
 *    new_visit_patient:
 *     type: string
 *     enum: ["N","Y","P"]
 *     default: "N"
 *     required: true
 *    visit_type:
 *     type: number
 *     required: true
 *    insured:
 *     type: string
 *     enum: ["N","Y"]
 *     required: true
 *    department_id:
 *     type: number
 *     required: true
 *    sub_department_id:
 *     type: number
 *     required: true
 *    doctor_id:
 *     type: number
 *     required: true
 *    maternity_patient:
 *     type: string
 *     enum: ["Y","N"]
 *     default: "N"
 *    is_mlc:
 *     type: string
 *     enum: ["Y","N"]
 *     default: "N"
 *    mlc_accident_reg_no:
 *     type: string
 *     nullable: true
 *    mlc_police_station:
 *     type: string
 *     nullable: true
 *    mlc_wound_certified_date:
 *     type: string
 *     format: YYYY-MM-DD
 *     nullable: true
 *    existing_plan:
 *     type: string
 *     enum: ["Y","N"]
 *     default: "N"
 *    treatment_plan_id:
 *     type: number
 *     nullable: true
 *    visit_code:
 *     type: string
 *     nullable: true
 *     applicable: patient within expired date
 *    appointment_id:
 *     type: number
 *     nullable: true
 *     applicable: appointment to patient registration
 *    eligible_reference_number:
 *     type: string
 *     nullable: true
 *  PatientInsurance:
 *   type: object
 *   properties:
 *    primary_insurance_provider_id:
 *     type: number
 *     nullable: true
 *     applicable: only when insurance is avilable
 *    primary_sub_id:
 *     type: number
 *     nullable: true
 *     applicable: only when insurance is avilable
 *    primary_network_id:
 *     type: number
 *     nullable: true
 *     applicable: only when insurance is avilable
 *    primary_policy_num:
 *     type: number
 *     nullable: true
 *     applicable: only when insurance is avilable
 *    primary_effective_start_date:
 *     type: string
 *     format: YYYY-MM-DD
 *     nullable: true
 *     applicable: only when insurance is avilable
 *    primary_effective_end_date:
 *     type: string
 *     format: YYYY-MM-DD
 *     nullable: true
 *     applicable: only when insurance is avilable
 *    primary_card_number:
 *     type: string
 *     nullable: true
 *     applicable: only when insurance is avilable
 *    card_holder_name:
 *     type: string
 *     nullable: true
 *     applicable: only when insurance is avilable
 *  PatientReceptHeader:
 *    type: object
 *    properties:
 *     consultation:
 *      type: string
 *      enum: ["Y","N"]
 *      default: "N"
 *     total_amount:
 *      type: number
 *      format: decimal
 *      required: true
 *     counter_id:
 *      type: number
 *      required: true
 *     shift_id:
 *      type: number
 *      required: true
 *     sheet_discount_amount:
 *      type: number
 *      format: decimal
 *      nullable: true
 *     bill_comments:
 *      type: string
 *      nullable: true
 *      applicable: if sheet_discount_amount this is mandatory
 *  PatientReceptDetails:
 *   type: object
 *   properties:
 *    amount:
 *     type: number
 *     required: true
 *     format: decimal
 *    hims_f_receipt_header_id:
 *     type: number
 *     nullable: true
 *    card_check_number:
 *     type: number
 *     format: decimal
 *     nullable: true
 *    expiry_date:
 *     type: string
 *     format: "YYYY-MM-DD"
 *     nullable: true
 *    pay_type:
 *     type: string
 *     enum: ["CA","CD","CH"]
 *     default: ""
 *    bank_card_id:
 *     type: number
 *     nullable: true
 *  BillingHeader:
 *   type: object
 *   properties:
 *    incharge_or_provider:
 *     type: number
 *     nullable: true
 *    advance_amount:
 *     type: number
 *     format: decimal
 *     default: 0
 *    advance_adjust:
 *     type: number
 *     format: decimal
 *     default: 0
 *    discount_amount:
 *     type: number
 *     format: decimal
 *     default: 0
 *    sub_total_amount:
 *     type: number
 *     format: decimal
 *     required: true
 *    total_tax:
 *     type: number
 *     format: decimal
 *     required: true
 *     default: 0
 *    sheet_discount_amount:
 *     type: number
 *     format: decimal
 *     default: 0
 *    sheet_discount_percentage:
 *     type: number
 *     format: decimal
 *     default: 0
 *    net_amount:
 *     type: number
 *     format: decimal
 *     required: true
 *    net_total:
 *     type: number
 *     format: decimal
 *     required: true
 *    company_res:
 *     type: number
 *     format: decimal
 *     default: 0
 *    patient_res:
 *     type: number
 *     format: decimal
 *     required: true
 *    patient_payable:
 *     type: number
 *     format: decimal
 *     required: true
 *    company_payable:
 *     type: number
 *     format: decimal
 *     default: 0
 *    patient_tax:
 *     type: number
 *     format: decimal
 *     applicable: "tax for non saudi patients if saudi
 *     patient value is 0"
 *    s_patient_tax:
 *     type: number
 *     format: decimal
 *     applicable: "tax for saudi patient only else its 0"
 *    company_tax:
 *     type: number
 *     format: decimal
 *     default: 0
 *    net_tax:
 *     type: number
 *     format: decimal
 *     default: 0
 *    credit_amount:
 *     type: number
 *     format: decimal
 *     default: 0
 *    receiveable_amount:
 *     type: number
 *     format: decimal
 *     required: true
 *    balance_credit:
 *     type: number
 *     format: decimal
 *     nullable: true
 *    copay_amount:
 *     type: number
 *     format: decimal
 *     default: 0
 *    deductable_amount:
 *     type: number
 *     format: decimal
 *     default: 0
 *  BillingDetails:
 *   type: object
 *   properties:
 *    service_type_id:
 *     type: number
 *     required: true
 *    services_id:
 *     type: number
 *     required: true
 *    quantity:
 *     type: number
 *     default: 1
 *    unit_cost:
 *     type: number
 *     format: decimal
 *    insurance_yesno:
 *     type: string
 *     enum: ["Y","N"]
 *     default: "N"
 *    gross_amount:
 *     type: number
 *     format: decimal
 *     required: true
 *    discount_amout:
 *     type: number
 *     format: decimal
 *     default: 0
 *    discount_percentage:
 *     type: number
 *     format: decimal
 *     default: 0
 *    net_amout:
 *     type: number
 *     format: decimal
 *     required: true
 *    copay_percentage:
 *     type: number
 *     format: decimal
 *     default: 0
 *    copay_amount:
 *     type: number
 *     format: decimal
 *     default: 0
 *    deductable_amount:
 *     type: number
 *     format: decimal
 *     default: 0
 *    deductable_percentage:
 *     type: number
 *     format: decimal
 *     default: 0
 *    tax_inclusive:
 *     type: string
 *     enum: ["Y","N"]
 *     default: "N"
 *    patient_tax:
 *     type: number
 *     format: decimal
 *     default: 0
 *     applicable: "tax for non saudi patients if saudi"
 *    s_patient_tax:
 *     type: number
 *     format: decimal
 *     default: 0
 *     applicable: "tax for saudi patient only else its 0"
 *    company_tax:
 *     type: number
 *     format: decimal
 *     default: 0
 *    total_tax:
 *     type: number
 *     format: decimal
 *     default: 0
 *    patient_resp:
 *     type: number
 *     format: decimal
 *     default: 0
 *    patient_payable:
 *     type: number
 *     format: decimal
 *     default: 0
 *    comapany_resp:
 *     type: number
 *     format: decimal
 *     default: 0
 *    company_payble:
 *     type: number
 *     format: decimal
 *     default: 0
 *   #teeth_number:
 *   #type: number
 *   #nullable: true
 *   #ordered_services_id:
 *     #type: number
 *     #required: true
 *    #ordered_inventory_id:
 *     #type: number
 *     #required: true
 *  PackageHeader:
 *   type: object
 *   properties:
 *    balance_amount:
 *     type: number
 *     format: decimal
 *     required: true
 *     default: 0
 *     applicable: when package is there else its null
 *    actual_utilize_amount:
 *     type: number
 *     format: decimal
 *     required: true
 *     default: 0
 *     applicable: when package is there else its null
 *    utilize_amount:
 *     type: number
 *     format: decimal
 *     required: true
 *     default: 0
 *     applicable: when package is there else its null
 *    hims_f_package_header_id:
 *     type: number
 *     required: true
 *     applicable: when package is there else its null
 *  PackageDetails:
 *   type: object
 *   properties:
 *    utilized_qty:
 *     type: number
 *     required: true
 *     default: 0
 *    available_qty:
 *     type: number
 *     required: true
 *     default: 0
 *    hims_f_package_detail_id:
 *     type: number
 *     required: true
 *  AppointmentPatientDetails:
 *   type: object
 *   properties:
 *    patient_id:
 *     type: number
 *     nullable: true
 *    patient_code:
 *     type: string
 *     nullable: true
 *    provider_id:
 *     type: number
 *     nullable: false
 *    sub_department_id:
 *     type: number
 *    department_id:
 *     type: number
 *    title_id:
 *     type: number
 *     nullable: false
 *    patient_name:
 *     type: string
 *     nullable: false
 *    arabic_name:
 *     type: string
 *     nullable: false
 *    date_of_birth:
 *     type: string
 *     format: "YYYY-MM-DD"
 *     nullable: false
 *    age:
 *     type: number
 *     nullable: false
 *    contact_number:
 *     type: string
 *     nullable: false
 *    gender:
 *     type: string
 *     nullable: false
 *    email:
 *     type: string
 *     nullable: true
 *    services_id:
 *     type: number
 *     nullable: false
 *    department_type:
 *     type: string
 *     enum: ['D','E','O','N','PH','I']
 *     default: "N"
 *  UpdatePatientCheckIn:
 *   type: object
 *   properties:
 *    application_id:
 *     type: number
 *     required: true
 *    appointment_status_id:
 *     type: number
 *     required: true
 *    patient_id:
 *     type: number
 *     required: true
 *    patient_code:
 *     type: string
 *     required: true
 *
 */

/**
 * @swagger
 *
 * /frontDesk/add:
 *   post:
 *    tags:
 *     - Patient Registration
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: body
 *        description: Save Patient demographics visit and bill
 *        in:  body
 *        required: true
 *        type: string
 *        schema:
 *         $ref: '#/definitions/patientRegistration'
 *    responses:
 *     200:
 *      description: Return Patient Code along with a success message
 *      schema:
 *       $ref: '#/definitions/Success'
 *     400:
 *      description: Return error message
 *      schema:
 *       $ref: '#/definitions/Error'
 */
/**
 * @swagger
 * /frontdesk/update:
 *  post:
 *   tags:
 *    - Patient Registration
 *   produces:
 *    - application/json
 *   parameters:
 *    - name: body
 *      discription: Update patient with new visit
 *      in: body
 *      required: true
 *      schema:
 *       properties:
 *          patient_code:
 *           type: string
 *           required: true
 *          patient_id:
 *           type: number
 *           required: true
 *       allOf:
 *        - $ref: "#/definitions/patientRegistration"
 *   responses:
 *     200:
 *      description: Return Patient Code along with a success message
 *      schema:
 *       $ref: '#/definitions/Success'
 *     400:
 *      description: Return message
 *      schema:
 *       $ref: '#/definitions/Error'
 *
 */
/**
 * @swagger
 *
 * /appointment/getPatientDetilsByAppId:
 *  get:
 *   tags:
 *    - Appointment
 *   produces:
 *    -application/json
 *   parameters:
 *    - name: application_id
 *      description: Get patient demographics by appointment ID
 *      in: query
 *      required: true
 *      type: string
 *   responses:
 *    200:
 *     description: Return Details
 *     schema:
 *      properties:
 *       success:
 *        type: boolean
 *       records:
 *        $ref: "#/definitions/AppointmentPatientDetails"
 *    400:
 *     decription: Return failure message
 *     schema:
 *      $ref: "#/definitions/Error"
 */
/**
 * @swagger
 * /appointment/updateCheckIn:
 *  put:
 *   tags:
 *    - Appointment
 *   produces:
 *    -application/json
 *   parameters:
 *    - name: body
 *      discription: Update Checkin status of an appointment
 *      in: body
 *      required: true
 *      schema:
 *       $ref: "#/definitions/UpdatePatientCheckIn"
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
/**
 * @swagger
 * /appointment/getPatientAppointmentClinicalDesk:
 *  get:
 *   tags:
 *    - Appointment
 *   produces:
 *    -application/json
 *   parameters:
 *    provider_id:
 *     type: number
 *     required: true
 */
