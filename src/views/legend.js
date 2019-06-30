import { DirectiveView } from "presentation-decorator";
//import {  } from "../messages.js";
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
  };
};

export default LegendView;
