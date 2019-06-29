import { AUTHOR, APP_NAME } from "../constants.js";
import Mediator from "../views/mediator.js";
import Article from "../components/article.js";
import Application from "../application/application.js";
import Logger from "../logger/logger.js";

const initializeApp = async () => {
  try {
    document.write(`<p>Hello from ${AUTHOR}!  This is ${APP_NAME} version ${VERSION}.</p>`);
    Logger.info("Hello!");
    Logger.info({ "test": "test"});

    Application.mediator = new Mediator();
    if (!Application.mediator) {
      throw new Error("Error creating mediator!");
    }

    Application.mediator.article = new Article();
    if (!Application.mediator.article) {
      throw new Error("Error creating mediator!");
    }

    let view = await Application.mediator.article.render();
    if (!view) {
      throw new Error("Error rendering mediator!");
    }

    const p = await Application.start();
    if (!p) {
      throw new Error("Error starting application!");
    }

  } catch(e) {
    const err = `Error initializing Application - ${e}`;
    throw new Error(err);
  }
};

export default initializeApp;
