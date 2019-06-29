import { Header as BaseHeader } from "presentation-components";
import { APP_NAME } from "../constants.js";
import { DISPLAY_ABOUT } from "../messages.js";

const AVATAR_IMAGE = "avatar";
const MENU = "menu";
const SEARCH = "searchbar";

class Header extends BaseHeader {
  constructor(options) {
    super({
      "el": "#header",
      "name": "header"
    });
    this.template = `
      <nav id="${MENU}"></nav>
      <figure data-${this.name}="logo" data-click="logo" class="logo" id="${AVATAR_IMAGE}"></figure>
      <h1>${APP_NAME}</h1>
      <div id="${SEARCH}" class="${SEARCH}></div>
      <div id="progress" class="progress"></div>
    `;
  };

  logo(e) {
    this.sendMessage(DISPLAY_ABOUT);
  };
};

export default Header;
