import { SERVICE } from "../constants.js";

const fetchKey = async () => {
  return fetch(`${SERVICE}/getkey`)
  .then( (response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Problem requesting from Google: ${response.status} ${response.statusText} - ${response.body}`);
    }
  })
  .then( (json) => {
    return json.apikey;
  })
  .catch( (e) => {
    throw e;
  });
};

export default fetchKey;
