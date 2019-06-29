import { DirectiveView } from "presentation-decorator";
import { TOGGLE_HEATMAP_COLOR, TOGGLE_HEATMAP_RADIUS, TOGGLE_HEATMAP_OPACITY } from "../messages.js";

const MOUNT_POINT = "#control";

class ControlPanelView extends DirectiveView {
  constructor() {
    super({
      "el": MOUNT_POINT,
      "name": "controlpanelview",
      "style": "view"
    });

    this.template = `
      <div id="floating-panel">
        <button data-${this.name}="changegradient" data-click="changeGradient" title="Toggle color of heatmap.">Change gradient</button>
        <button data-${this.name}="changeradius" data-click="changeRadius" title="Toggle radius of heatmap.">Change radius</button>
        <button data-${this.name}="changeopacity" data-click="changeOpacity" title="Toggle opacity of heatmap.">Change opacity</button>
      </div>
    `;
  };

  changeGradient(e) {
    this.sendMessage(TOGGLE_HEATMAP_COLOR);
  };

  changeRadius(e) {
    this.sendMessage(TOGGLE_HEATMAP_RADIUS);
  };

  changeOpacity(e) {
    this.sendMessage(TOGGLE_HEATMAP_OPACITY);
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

export default ControlPanelView;
