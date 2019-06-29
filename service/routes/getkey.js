module.exports = (app) => {
  app.get("/getkey", (req, res) => {
    if (process.env.MAP_API_KEY) {
      res.status(200).send({ apikey: process.env.MAP_API_KEY });
    } else {
      res.status(500).send("No API Key exists.");
    }
  });
};
