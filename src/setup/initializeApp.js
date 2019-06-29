import Mediator from "../views/mediator.js";
import Article from "../components/article.js";
import Header from "../components/header.js";
import Application from "../application/application.js";
import SearchBarView from "../views/searchBar.js";
import ProgressIndicator from "../components/indicator.js";
import { HEADER } from "../messages.js";
import Logger from "../logger/logger.js";
import fetchKey from "./fetchKey.js";

const initializeApp = async () => {
  try {
    Application.mediator = new Mediator();
    if (!Application.mediator) {
      throw new Error("Error creating mediator!");
    }

    Application.mediator.article = new Article();
    if (!Application.mediator.article) {
      throw new Error("Error creating mediator!");
    }

    Application.mediator.header = new Header();
    if (!Application.mediator.header) {
      throw new Error("Error creating header!");
    }

    Application.mediator.search = new SearchBarView();
    if (!Application.mediator.search) {
      throw new Error("Error creating search!");
    }

    Application.mediator.indicator = new ProgressIndicator();
    if (!Application.mediator.indicator) {
      throw new Error("Error creating indicator!");
    }

    let view = await Application.mediator.article.render();
    if (!view) {
      throw new Error("Error rendering mediator!");
    }

    view = await Application.mediator.header.render();
    if (!view) {
      throw new Error("Error rendering header!");
    }

    view = await Application.mediator.search.render();
    if (!view) {
      throw new Error("Error rendering search!");
    }

    view = await Application.mediator.indicator.render();
    if (!view) {
      throw new Error("Error rendering indicator!");
    }

    Application.mediator.observeColleagueAndTrigger(Application.mediator.article, HEADER, "article");
    Application.mediator.observeColleagueAndTrigger(Application.mediator.header, HEADER, "header");
    Application.mediator.observeColleagueAndTrigger(Application.mediator.search, HEADER, "search");
    Application.mediator.observeColleagueAndTrigger(Application.mediator.indicator, HEADER, "indicator");

    if (!Application.mediator.channels) {
      throw new Error("Error observing views!");
    }

    Application.MAP_API_KEY = await fetchKey();

    const p = await Application.start();
    if (!p) {
      throw new Error("Error starting application!");
    }
  } catch(e) {
    const err = `Error initializing Application - ${e}`;
    if (Application.mediator) {
      Application.mediator.displayErrorMessage("Error initializing Application");
    }
    Logger.error(e);
    //throw new Error(err);
  }
};

export default initializeApp;
