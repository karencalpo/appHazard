const calcData = require("../functions/calcData.js");
const CONSTANTS = require("../constants.js");

module.exports = (app) => {
  app.get("/properties", (req, res) => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth();
    month = month.toString().match(/\b[1-9]\b/) ? "0" + month : month;
    const currentDate = `${year}-${month}-01`;
    const endDate = `${year-10}-${month}-01`;
    const pageSize = 10000;
    const radius = 1;
    const yearRange = (req.query.yearRange) ? req.query.yearRange : 10;
    const filter = `(fyDeclared ge ${year-yearRange} and state eq '${req.query.state}' and declaredCountyArea eq '${req.query.county}')`;
    const property_url = encodeURI(`/propertyapi/v1.0.0/attomavm/detail?address1=${req.query.address}&address2=${req.query.city}`);
    const fema_url = encodeURI(`/api/open/v1/DisasterDeclarationsSummaries?$filter=${filter}&$orderby=fyDeclared,state,declaredCountyArea,fyDeclared`);
    const properties_url = encodeURI(`/propertyapi/v1.0.0/assessment/snapshot?address1=${req.query.address}&address2=${req.query.city}&radius=${radius}&pageSize=${pageSize}`);

    const ATTOM_PROPERTIES_DATA = CONSTANTS.ATTOM_PROPERTIES_DATA;
    ATTOM_PROPERTIES_DATA["path"] =  properties_url;

    const FEMA_DATA = CONSTANTS.FEMA_DATA;
    FEMA_DATA["path"] =  fema_url;

    const headers = [ATTOM_PROPERTIES_DATA, FEMA_DATA];

    if(req.query.address && req.query.city && req.query.state) {
      calcData(headers, req, res);
    } else if(req.query.city) {
      const results = [];
      for(let i = 0; i < data.length; i++) {
        if(data[i]["city"] === req.query.city) {
          results.push(data[i]);
        }
      }
      return res.send(results);
    } else {
      res.status(400).send("Requires address, city, and state.");
    }
  });
};
