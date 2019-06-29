import { AUTHOR, APP_NAME } from "../constants.js";
import Application from "../application/application.js";
import Logger from "../logger/logger.js";

const initializeApp = async () => {
  try {
    document.write(`<p>Hello from ${AUTHOR}!  This is ${APP_NAME} version ${VERSION}.</p>`);
    Logger.info("Hello!");
    Logger.info({ "test": "test"});

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
