const Risk = require("../functions/risk.js");
const asynCall = require("../functions/asyncCall.js");

module.exports = (app) => {
  app.get("/properties", (res, req) => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
  });
};
