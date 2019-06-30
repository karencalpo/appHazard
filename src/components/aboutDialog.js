import { DialogView } from "presentation-dialogs";
import { APP_NAME, AUTHOR, DIALOG_EL } from "../constants.js";

class AboutDialog extends DialogView {
  constructor() {
    super({
      "el": DIALOG_EL,
      "buttons": {
        "cancel": "cancel"
      },
      "style": "bigForm about",
      "name": "about",
      "body": `
        <h2>Visulize Property data and Risk</h2>
        <h3>Version ${VERSION}</h3>
        <p>Show risk for an area.</p>
        <p class="author">Written by ${AUTHOR}</p>
        <figure class="logo"></figure>
      `,
      "title": `About ${APP_NAME}`
    });
  };
};

export default AboutDialog;
