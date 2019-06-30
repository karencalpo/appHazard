// Web Service
const port = 8080;
const sslPort = 8443;
const localSSLURI = `https://localhost:${sslPort}`;
const SSLURI = `https://10.251.216.133:${sslPort}`;
const webServiceURI = `http://10.251.216.133:${port}`;
const localWebServiceURI = `http://localhost:${port}`;

module.exports.ALLOWED_ORIGINS = [localSSLURI, SSLURI, webServiceURI, localWebServiceURI];

module.exports.ABOUT = "Clustered Express Service";

module.exports.PORT = port;

module.exports.ATTOM_PROPERTIES_DATA = {
  hostname: `api.gateway.attomdata.com`,
  headers: { accept: `application/json`, apikey: process.env.ATTOM_API_KEY},
  port: 443
};

module.exports.FEMA_DATA = {
  hostname: `www.fema.gov`,
  headers: { "Content-Type": `application/json`},
  port: 443
};
