const https = require("https");

const asyncCall = (header) => {
  return new Promise((resolve, reject) => {
    const request = https.get(header, (response) => {
      let stream = "";

      response.on("data", (chunk) => {
          stream += chunk;
      });

      response.on("end", () => {
        try {
          const data = JSON.parse(stream);
          resolve(data);
        } catch(e) {
          reject(e);
        }
      });
    }).on("error", (e) => {
      reject(e);
    });
  });
};

module.exports = asyncCall;
