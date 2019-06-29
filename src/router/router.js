import Application from "../application/application.js";
import { Router as BaseRouter } from "presentation-router";



const TRANSITION = {
  "in": 250,
  "out": 250
};

const loadViewAndObserve = async (router, view) => {
  await router.loadView(view);
  await Application.mediator.observeColleagueAndTrigger(view, PANEL, view.name);
  return true;
};

class Router extends BaseRouter {
  constructor() {
    super({
      "transition": TRANSITION,
      "routes": {
        "": () => {

        }
      }
    });
  };

  cleanup() {
    if (this.view) {
      Application.mediator.dismissColleagueTrigger(this.view, PANEL, this.view.name);
    }
    return super.cleanup();
  };
};

export default Router;
