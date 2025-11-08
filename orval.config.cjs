module.exports = {
 "petstore-file": {
   input: "./docs/openapi.yml",
   output: {
     mode: "tags-split",
     target: "src/api/petstore.ts",
     baseUrl: "https://petstore3.swagger.io/api/v3",
     schemas: "./src/api/model",
     mock: true,
     client: "swr",
   },
 },
};