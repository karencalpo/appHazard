// Helper Functions
const https = require("https");
const Logger = require("../logger.js");
const CONSTANTS = require("../constants.js");

module.exports = (app) => {
  app.post("/property", (req, res) => {
    const property_url = encodeURI(`/propertyapi/v1.0.0/attomavm/detail?address1=${req.body.address}&address2=${req.body.city}`);
    const ATTOM_SINGLE_PROPERTY = CONSTANTS.ATTOM_PROPERTIES_DATA;
    ATTOM_SINGLE_PROPERTY["path"] = property_url;

    if(req.body.address && req.body.city) {
      https.get(ATTOM_SINGLE_PROPERTY, (response) => {

        let stream = "";

        response.on("data", (chunk) => {
          stream += chunk;
        });

        response.on("end", () => {
            try {
              const data = JSON.parse(stream);

              if(data["status"]["msg"] === "SuccessWithoutResult") {
                res.send({});
              } else {
                if(data && data.property) {
                  res.send(data.property[0]);
                } else {
                  res.status(400).send("Bad address or city.");
                }
              }
            } catch(e) {
              Logger.error(e);
              res.status(500).send(e.message);
            }
        }).on(`error`, (e) => {
            Logger.error(e);
            res.status(500).send(e.message);
        });

      });

    } else {
      res.status(400).send("Requires address and city.");
    }
  });

};
