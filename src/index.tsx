import { CommandHandler } from "scenegraph";
import { App } from "./App";
import { logSelection } from "./logSelection";
import PanelController from "./util/panel-controller";

type CommandId = string;

export const commands: {
    [key: CommandId]: CommandHandler
} = {
    logSelection,
}

export const panels = {
    app: new PanelController(App)
}
