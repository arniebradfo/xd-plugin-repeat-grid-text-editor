import { createTextDataSeries } from "./createTextDataSeries";
import { logSelection } from "./logSelection";
import { CommandHandler } from "scenegraph";
type CommandId = string

export const commands: {
    [key: CommandId]: CommandHandler
} = {
    createTextDataSeries,
    editRepeatContent: logSelection,
}
