import { HeatMapView } from "presentation-maps";
import { PANEL } from "../messages.js";
import { MAP_API_KEY, DEFAULT_MAP_LOCATION, DEFAULT_MAP_ZOOM } from "../constants.js";
import Logger from "../logger/logger.js";

const MOUNT_POINT = "#main";

const MAX_RADIUS = 40;

class MapView extends HeatMapView {
  constructor(data) {
    if (!data) {
      data = [];
    }
    super({
      "el": MOUNT_POINT,
      "template": ``,
      "name": "mapview",
      "style": "view",
      "lat": DEFAULT_MAP_LOCATION.LAT,
      "long": DEFAULT_MAP_LOCATION.LONG,
      "zoom": DEFAULT_MAP_ZOOM,
      "apikey": MAP_API_KEY,
      "geocode": true,
      "dissipating": true,
      "radius": 20,
      "data": data
    });
  };

  async render() {
    await super.render();
    return this;
  };

  async remove() {
    await super.remove();
    return this;
  };
};

export default MapView;
