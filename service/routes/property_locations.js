const asyncCall = require("../functions/asyncCall.js");
const Risk = require("../functions/calcRisk.js");

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

    const ATTOM_PROPERTIES_DATA = {
      hostname: `api.gateway.attomdata.com`,
      headers: { accept: `application/json`, apikey: `ef4e2dafba28149f3f3c987e3a1ea57c`},
      port: 443,
      path: properties_url
    };

    const FEMA_DATA = {
      hostname: `www.fema.gov`,
      headers: { "Content-Type": `application/json`},
      port: 443,
      path: fema_url
    };

    const headers = [ATTOM_PROPERTIES_DATA, FEMA_DATA];

    if(req.query.address && req.query.city && req.query.state) {

      const calculated_data = async () => {
        try {
          let allData = {}
          let riskData = {};
          let totalDisasters = {};
          let locations = [];
          let worst_disasters = [];
          let total_disasters = [];
          let propertyVals = [];
          let propertyAvg = 0;
          let greatest_disaster = 0;
          const [attom, fema] = await Promise.all(headers.map(asyncCall));
          if(attom["property"]) {
            attom["property"].forEach((property) => {
              propertyVals.push(property["assessment"]["assessed"]["assdttlvalue"]);
            });

            let propertyValsSorted = propertyVals.sort((a,b) => {
              return a - b;
            })

            if((propertyValsSorted.length % 2) === 0) {
              propertyAvg = (propertyValsSorted[(propertyValsSorted.length/2)-1] + propertyValsSorted[(propertyValsSorted.length/2)])/2;
            } else {
              propertyAvg = propertyValsSorted[Math.floor(propertyValsSorted.length/2)];
            }
          };

          fema["DisasterDeclarationsSummaries"].forEach((disaster) => {

              Object.keys(Risk.DISASTER_TYPE).forEach((type) => {
                if(disaster["incidentType"].toLowerCase().includes(type.toLowerCase())) {
                  if(totalDisasters[type]) {
                    totalDisasters[type]++;
                  } else {
                    totalDisasters[type] = 1;
                  }
                }
              });

          });

          if(Object.keys(totalDisasters).length !== 0) {
            greatest_disaster = Object.keys(totalDisasters).reduce((a, b) => totalDisasters[a] > totalDisasters[b] ? a : b);


            for(key in totalDisasters) {
              if(totalDisasters[key] === totalDisasters[greatest_disaster]) {
                worst_disasters.push(key);
                total_disasters.push(key);
              } else {
                total_disasters.push(key);
              }
            }

          } else {
            greatest_disaster = 0;
          }

          if(attom["property"]) {
            attom["property"].forEach((property) => {
              let risk = Risk.calcRisk(property["assessment"]["assessed"]["assdttlvalue"], propertyAvg, fema["DisasterDeclarationsSummaries"].length, Risk.DISASTER_TYPE[greatest_disaster], Risk.RISK_DEMO["NORMAL"]);
              locations.push({
                lat: property["location"]["latitude"],
                long: property["location"]["longitude"],
                weight: risk
              });
            });
          };

          riskData = {
            greatest_disasters: worst_disasters,
            highest_value: totalDisasters[greatest_disaster],
            types: total_disasters
          };

          allData = {
            riskData: riskData,
            locations: locations
          }

          res.send(allData);
          return allData;
          //res.send([attom, fema]);
          //return [attom, fema];
        } catch (e) {
          console.error(e);
          res.status(500).send(e);
          return e;
        }
      };

      calculated_data();
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
