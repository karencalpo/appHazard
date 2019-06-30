import { HeatMapView } from "presentation-maps";
import ControlPanelView from "./controlPanel.js";
import LegendView from "./legend.js";
import { PANEL, SEARCH_MAP_RESULTS, REQUEST_RISK_HEATMAP, PRODUCE_HEATMAP,
  TOGGLE_HEATMAP_COLOR, TOGGLE_HEATMAP_RADIUS, TOGGLE_HEATMAP_OPACITY,
  PRODUCE_RISK_DETAILS } from "../messages.js";
import { DEFAULT_MAP_LOCATION, DEFAULT_MAP_ZOOM, GRADIENT } from "../constants.js";
import Logger from "../logger/logger.js";
import getPropertyData from "./functions/getPropertyData.js";

const MOUNT_POINT = "#main";

const MAX_RADIUS = 40;

import renderDisasters from "./functions/renderDisasters.js";

const iconBase = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/';

class MapView extends HeatMapView {
  constructor(options) {
    if (!options) {
      options = {};
    }

    if (!options.data) {
      options.data = [];
    }

    super({
      "el": MOUNT_POINT,
      "template": `
        <div id="control"></div>
        <aside id="legend" class="legend"></aside>
      `,
      "name": "mapview",
      "style": "view",
      "lat": DEFAULT_MAP_LOCATION.LAT,
      "long": DEFAULT_MAP_LOCATION.LONG,
      "zoom": DEFAULT_MAP_ZOOM,
      "apikey": options.apikey,
      "geocode": true,
      "dissipating": true,
      "radius": 20,
      "data": options.data
    });

    this.on(PANEL, async (message, data) => {
      if (message === SEARCH_MAP_RESULTS) {
        await this.geocode(data, this.setLocation.bind(this));
      } else if (message === PRODUCE_HEATMAP) {
        await this.produceHeatmap(data);
      } else if (message === TOGGLE_HEATMAP_COLOR) {
        this.heatmap.set("gradient", this.heatmap.get("gradient") ? null : GRADIENT);
      } else if (message === TOGGLE_HEATMAP_RADIUS) {
        this.heatmap.set("radius", (this.heatmap.get("radius") !== MAX_RADIUS) ? MAX_RADIUS : this._radius);
      } else if (message === TOGGLE_HEATMAP_OPACITY) {
        this.heatmap.set("opacity", this.heatmap.get("opacity") ? null : 0.2);
        this.setMarker(iconBase + "parking_lot_maps.png", 37.7906941, -122.3910195);
      } else if (message === PRODUCE_RISK_DETAILS) {
        data.propData = await getPropertyData(data.address.address, data.address.city);
        await this.popup(data);
      } else {
        Logger.warn(`Unknown message ${message}`);
      }
    });
  };

  popup(data) {
    Logger.debug("Popup", data);
    return this.addMarkerPopup(`
      <aside class="popup">
        <h1>Risk &amp; Property</h1>
        <h2>Address</h2>
        <p>${(data.address.formatted) ? data.address.formatted : "Unavailable" }</p>
        <h2>Highest Occuring Disasters</h2>
        <p>${renderDisasters(data.greatest_disasters)}</p>
        <h2>Latitude</h2>
        <p>${(data.address.lat)}</p>
        <h2>Longitude</h2>
        <p>${(data.address.long)}</p>
      </aside>
    `);
  };

  /**
   * callback for geocode
   */
  setLocation(results) {
    this.sendMessage(REQUEST_RISK_HEATMAP, results);
  };

  async render() {
    await super.render();
    this._control = new ControlPanelView();
    this._legend = new LegendView();
    await this._control.render();
    this.mediator.observeColleagueAndTrigger(this._control, PANEL, this._control.name);
    await this._legend.render();
    this.mediator.observeColleagueAndTrigger(this._legend, PANEL, this._legend.name);
    return this;
  };

  async remove() {
    await this.mediator.dismissColleagueTrigger(this._legend, PANEL, this._legend.name);
    await this.mediator.dismissColleagueTrigger(this._control, PANEL, this._control.name);
    await this._control.remove();
    await this._legend.remove();
    await super.remove();
    return this;
  };
};

export default MapView;
