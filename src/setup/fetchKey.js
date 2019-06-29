import { SERVICE } from "../constants.js";

const fetchKey = async () => {
  return fetch(`${SERVICE}/getkey`)
  .then( (response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Problem requesting: ${response.status} ${response.statusText}`);
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
