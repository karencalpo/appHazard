import { GOOGLE_MAP_URL, SERVICE } from "../../constants.js";
import { PANEL, PRODUCE_HEATMAP, PRODUCE_RISK_DETAILS } from "../../messages.js";
import Logger from "../../logger/logger.js";
import Application from "../../application/application.js";

const requestHeatmap = (results, mediator) => {
  if (results) {
    Logger.debug(new Date(), "results", results);
    const latitude = results[0].geometry.location.lat();
    const longitude = results[0].geometry.location.lng();

    // call geocode
    Logger.debug(new Date(), "call geocode");
    Logger.debug(new Date(), "key", Application.MAP_API_KEY);
    return fetch(`${GOOGLE_MAP_URL}?latlng=${latitude},${longitude}&key=${Application.MAP_API_KEY}`)
    .then( (response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Problem requesting from Google: ${response.status} ${response.statusText} - ${response.body}`);
      }
    })
    .then( (json) => {
      // find the largest dataset
      Logger.debug(new Date(), "find the largest dataset");
      let i = 0;
      let results = null;
      let index = 0;

      for (i; i < json.results.length; i++) {
        const num = json.results[i].address_components.length;
        if ((results && num > results.address_components.length) || (!results)) {
          results = json.results[i];
          index = i;
        }
      }
      Logger.debug(new Date(), "Largest Dataset", results);
      return results;
    })
    .then( (results) => {
      // convert to address object
      Logger.debug(new Date(), "convert to address object");
      const address = {
        "lat": results.geometry.location.lat,
        "long": results.geometry.location.lng,
        "formatted": results.formatted_address
      };

      let i = 0;
      const l = results.address_components.length;
      for(i = 0; i < l; i++) {
        const ac = results.address_components[i];
        const types = ac.types[0];
        if (types === "street_number") {
          address.address = `${ac.long_name} `;
        } else if (types === "route") {
          address.address += ac.long_name;
        } else if (types === "locality") {
          address.city = ac.long_name;
        } else if (types === "administrative_area_level_2") {
          address.county = ac.long_name.replace("County", "(County)");
        } else if (types === "administrative_area_level_1") {
          address.state = ac.short_name;
        } else if (types === "postal_code") {
          address.zip = ac.short_name;
        }
      }
      return address;
    })
    .then( (address) => {
      // check if we have required fields
      Logger.debug(new Date(), address);
      if (!address.county || !address.state || !address.city) {
        throw new Error(`Not enough data to calculate risk.`);
      };
      return address;
    })
    .then( (address) => {
      // request location data and add address data
      Logger.debug(new Date(), "request location data and add address data");
      return fetch(`${SERVICE}/properties?lat=${address.lat}&long=${address.long}&address=${encodeURIComponent(address.address)}&city=${encodeURIComponent(address.city)}&county=${encodeURIComponent(address.county)}&state=${encodeURIComponent(address.state)}&zip=${encodeURIComponent(address.zip)}`)
      .then( (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Problem requesting: ${response.status} ${response.statusText} - ${response.body}`);
        }
      })
      .then( (locations) => {
        if (!locations) {
          locations = {
            "locations": [],
            "riskData": {}
          }
        }
        if (locations && !locations.riskData) {
          locations.riskData = {};
        }
        locations.riskData.address = address;
        return locations;
      })
    })
    .then( (json) => {
      // produce heatmap by async request
      Logger.debug(new Date(), "locations", json);
      if (json && json.locations && Array.isArray(json.locations) && json.locations.length > 0) {
        mediator.publish(PANEL, PRODUCE_HEATMAP, json.locations);
      } else {
        mediator.displayMessage("This address did not contain risk data.", "Risk Data");
      }
      return json;
    })
    .then( (json) => {
      // produce risk and property details
      Logger.debug(new Date(), "produce risk and property details");
      if (json && json.riskData) {
        mediator.publish(PANEL, PRODUCE_RISK_DETAILS, json.riskData);
      }
      return json;
    })
    .catch( (e) => {
      Logger.debug(`Request Caught error ${e.message}`);
      throw e;
    });
  } else {
    throw new Error("Geocode returned no location.");
  }
};

export default requestHeatmap;
