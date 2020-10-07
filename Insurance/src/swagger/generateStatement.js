/**
 * @swagger
 * /insurance/generateInsuranceStatement:
 *  get:
 *   tags:
 *    - Insurance Statement Generation
 *   summary: Insurance statement generation in excel
 *   producers:
 *    -application/json
 *   parameters:
 *    - name: from_date
 *      description: From Date
 *      in: query
 *      required: true
 *      format: "YYYY-MM-DD"
 *      type: string
 *    - name: to_date
 *      description: To Date
 *      in: query
 *      required: true
 *      format: "YYYY-MM-DD"
 *      type: string
 *    - name: insurance_provider_id
 *      description: Insurance Provider ID
 *      in: query
 *      required: true
 *      type: number
 *   responses:
 *    200:
 *     description: Return all
 */
