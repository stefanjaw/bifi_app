// .dependency-cruiser.js
module.exports = {
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsConfig: {
      fileName: "./tsconfig.json",
    },
    includeOnly: "^projects", // analizar solo src
    exclude: "^projects/.+/index\\.ts$", // ignorar barrels internos
    combinedDependencies: true,
  },
};
