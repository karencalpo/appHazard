import { DirectiveView } from "presentation-decorator";
import { SEARCH } from "../messages.js";
const MOUNT_POINT = "#searchbar";

class SearchBarView extends DirectiveView {
  constructor(heatmap) {
    super({
      "el": MOUNT_POINT,
      "name": "searchbarview",
      "style": "view"
    });

    this.template = `
      <form name="searchform">
        <i class="material-icons md_light searchicon">search</i>
        <input data-${this.name}="search" type="search" name="search" placeholder="Search"/>
        <button type="submit" name="search" data-${this.name}="searchbutton" data-click="search">Search</button>
      </form>
    `;
  };

  async search(e) {
    e.preventDefault();
    const search = this.model.get("search");
    if (search) {
      this.sendMessage(SEARCH, search);
    }
  };

  async render() {
    await super.render();
    this.delegateEvents();
    return this;
  };

  async remove() {
    return super.remove();
  };
};

export default SearchBarView;
