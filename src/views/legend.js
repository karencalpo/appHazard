import { DirectiveView } from "presentation-decorator";
import Dom from "presentation-dom";
import { PANEL, TOGGLE_HEATMAP_COLOR } from "../messages.js";

const MOUNT_POINT = "#legend";

class LegendView extends DirectiveView {
  constructor(heatmap) {
    super({
      "el": MOUNT_POINT,
      "name": "legendview",
      "style": "view"
    });

    this.template = `
      <h1>Legend</h1>
      <div>
        <div class="bar"></div>
        <div class="ticks">
          <span class="low">Low</span>
          <span class="high">High</span>
        </div>
      </div>
    `;
    this._winter = false;

    this.on(PANEL, async (message, data) => {
      if (message === TOGGLE_HEATMAP_COLOR) {
        if (this._winter) {
          this.setSummer();
        } else {
          this.setWinter();
        }
      }
    });
  };

  setWinter() {
    Dom.addClass(this.el, "winter");
    this._winter = true;
  };

  setSummer() {
    Dom.removeClass(this.el, "winter");
    this._winter = false;
  };
};

export default LegendView;
