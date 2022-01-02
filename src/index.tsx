import { App } from "./App";
import { logSelection } from "./logSelection";
import PanelController from "./util/panel-controller";

export const commands = {
    logSelection,
}

export const panels = {
    app: new PanelController(App)
}
