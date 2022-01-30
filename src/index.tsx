import { App } from "./App";
import PanelController from "./util/panel-controller";

export const commands = {}

export const panels = {
    app: new PanelController(App)
}
