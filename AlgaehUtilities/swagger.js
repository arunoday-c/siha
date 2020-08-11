const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
export default function Configure(title) {
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: title,
        contact: {
          name: "Alagaeh Technologies Private Limited.",
        },
      },
      host: `localhost:${process.env.PORT}`,
      basePath: "/api/v1/",
      //we can see modules
      // definitions: {
      //   inBody: {
      //     type: {},
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
};
