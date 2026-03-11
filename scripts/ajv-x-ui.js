module.exports = (ajv) => {
  ajv.addKeyword({
    keyword: "x-ui",
    schemaType: "object",
    valid: true,
  });
};
