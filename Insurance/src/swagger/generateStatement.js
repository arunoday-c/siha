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
 *    - name: insurance_statement_id
 *      description: Insurance Statement ID
 *      in: query
 *      required: true
 *      type: number
 *   responses:
 *    200:
 *     description: Return all
 */
