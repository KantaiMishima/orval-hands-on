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
  // 追記
  "petstore-zod": {
    input: {
      target: "./docs/openapi.yml",
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: 'src/api/petstore.zod.ts',
      fileExtension: '.zod.ts',
    },
  },
};