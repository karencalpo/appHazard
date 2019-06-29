import { Mediator as BaseMediator } from "presentation-mediator";
import Application from "../application/application.js";
import Logger from "../logger/logger.js";
import * as MESSAGES from "../messages.js";
import * as CONSTANTS from "../constants.js";
import { displayErrorMessage, displayNotification, displayMessage, displayAbout } from "./functions/mediation.js";
import requestHeatmap from "./functions/requestHeatmap.js";

class Mediator extends BaseMediator {
  constructor() {
    super({
      "name": "appmediator"
    });
    this.on(MESSAGES.DISPLAY_ABOUT, (message) => {
      displayAbout(this);
    });

    this.on(MESSAGES.DISPLAY_ERROR_MESSAGE, (message) => {
      displayErrorMessage(message, this);
    });

    this.on(MESSAGES.DISPLAY_MESSAGE, (message, title) => {
      displayMessage(message, title, this);
    });

    this.on(MESSAGES.DISPLAY_NOTIFICATION, (message, title) => {
      displayNotification(message, title, this);
    });

    this.on(MESSAGES.NAVIGATION, (where) => {
      if (where) {
        Application.navigate(where);
      } else {
        Logger.warn("Can not navigate to nowhere.");
      }
    });

    this.on(MESSAGES.TOGGLE_HEATMAP_COLOR, () => {
      this.publish(MESSAGES.PANEL, MESSAGES.TOGGLE_HEATMAP_COLOR);
    });

    this.on(MESSAGES.TOGGLE_HEATMAP_RADIUS, () => {
      this.publish(MESSAGES.PANEL, MESSAGES.TOGGLE_HEATMAP_RADIUS);
    });

    this.on(MESSAGES.TOGGLE_HEATMAP_OPACITY, () => {
      this.publish(MESSAGES.PANEL, MESSAGES.TOGGLE_HEATMAP_OPACITY);
    });

    this.on(MESSAGES.SEARCH, (term) => {
      this.publish(MESSAGES.PANEL, MESSAGES.SEARCH_MAP_RESULTS, term);
    });

    this.on(MESSAGES.REQUEST_RISK_HEATMAP, (results) => {
      this.requestHeatmap(results);
    });
  };

  async requestHeatmap(results) {
    try {
      this.indicator.setInProgress();
      await requestHeatmap(results, this);
    } catch(e) {
      Logger.error(e);
      this.displayErrorMessage("A system error occured, please try again.");
    }
    this.indicator.setComplete();
  };

  displayErrorMessage(message) {
    displayErrorMessage(message, this);
  };

  displayMessage(message, title) {
    displayMessage(message, title, this);
  };
};

export default Mediator;
