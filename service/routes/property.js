// Helper Functions
const https = require("https");
const Logger = require("../logger.js");

module.exports = (app) => {
  app.post("/single_property", (app_req, app_res) => {
    const single_property_url = encodeURI(`/propertyapi/v1.0.0/attomavm/detail?address1=${app_req.body.address}&address2=${app_req.body.city}`);
    const ATTOM_SINGLE_PROPERTY = {
      hostname: `api.gateway.attomdata.com`,
      port: 443,
      path: single_property_url,
      headers: { accept: `application/json`, apikey: `ef4e2dafba28149f3f3c987e3a1ea57c`}
    };
    console.log(app_req.body);
    if(app_req.body.address && app_req.body.city) {
      https.get(ATTOM_SINGLE_PROPERTY, (response) => {
        let stream = "";

        response.on("data", (chunk) => {
          stream += chunk;
        });

        response.on("end", () => {
          try {
            const data = JSON.parse(stream);
            app_res.send(data.property[0]);
          } catch(e) {
            Logger.error(e);
            app_res.status(500).send(e.message);
          }

        }).on(`error`, (e) => {
            Logger.error(e);
            app_res.status(500).send(e.message);
        });

      });
    } else {
      app_res.status(400).send("Requires address and city.");
    }
  });

};
