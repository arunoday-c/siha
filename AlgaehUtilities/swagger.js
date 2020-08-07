const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
export default function Configure(title, description) {
  const swaggerOptions = {
    swaggerDefinition: {
      // openapi: "3.0.1",
      info: {
        version: "1.0.0",
        title: title,
        // description: description,
        contact: {
          name: "Alagaeh Technologies Private Limited.",
        },
        //servers: [`http://localhost:${process.env.PORT}/api/v1`],
      },
      host: `localhost:${process.env.PORT}`,
      basePath: "/api/v1/",
      // components: {
      //   securitySchemes: {
      //     JWTKey: { type: "apiKey", in: "header", name: "x-api-key" },
      //     ClientKey: { type: "apiKey", in: "header", name: "x-client-ip" },
      //     BranchKey: { name: "x-branch", in: "header", type: "apiKey" },
      //   },
      // },

      securityDefinitions: {
        JWTKey: { type: "apiKey", in: "header", name: "x-api-key" },
        ClientKey: { type: "apiKey", in: "header", name: "x-client-ip" },
        BranchKey: { name: "x-branch", in: "header", type: "apiKey" },
      },
      security: [
        {
          JWTKey: [],
          ClientKey: [],
          BranchKey: [],
        },
      ],
    },
    apis: [process.cwd() + "/src/swagger/*.js"],
  };
  this.swaggerDocs = swaggerJsDoc(swaggerOptions);
}
Configure.prototype.Geteate = function (app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(this.swaggerDocs));
  console.log("this.swaggerDocs ", this.swaggerDocs);
};
