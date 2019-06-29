import { ProgressIndicator as BaseProgressIndicator } from "presentation-indicators";

class ProgressIndicator extends BaseProgressIndicator {
  constructor() {
    super({
      "el": "#progress"
    });
  };
};

export default ProgressIndicator;
