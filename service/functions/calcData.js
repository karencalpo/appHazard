const asyncCall = require("./asyncCall.js");
const Risk = require("./calcRisk.js");
const Logger = require("../logger.js");

const calcData = async (headers, req, res) => {
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
  } catch (e) {
    Logger.error(e);
    res.status(500).send(e);
    return e;
  }
};

module.exports = calcData;
