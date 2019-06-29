import { AUTHOR, APP_NAME } from "../constants.js";

const initializeApp = async () => {
  try {
    document.write(`<p>Hello from ${AUTHOR}!  This is ${APP_NAME} version ${VERSION}.</p>`);
    console.log("Hello!");
  } catch(e) {
    const err = `Error initializing Application - ${e}`;
    throw new Error(err);
  }
};

export default initializeApp;
