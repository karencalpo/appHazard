import { SERVICE } from "../../constants.js";
import Logger from "../../logger/logger.js";

const getPropertyData = (address, city) => {
  if (address && city) {
    return fetch(`${SERVICE}/property`, {
        method: "POST",
        body: JSON.stringify({ "address": address, "city": city }),
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    })
    .then( (response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Problem requesting: ${response.status} ${response.statusText} - ${response.body}`);
      }
    })
    .catch( (e) => {
      throw e;
    });
  } else {
    return {}
  }
};

export default getPropertyData;
