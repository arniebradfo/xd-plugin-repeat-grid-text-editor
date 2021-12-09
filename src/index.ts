import { createTextDataSeries } from "./createTextDataSeries";
import { logSelection } from "./logSelection";
import { textDataSeriesEditor } from "./textDataSeriesEditor";
import { CommandHandler } from "scenegraph";
type CommandId = string

export const commands: {
    [key: CommandId]: CommandHandler
} = {
    createTextDataSeries,
    editRepeatContent: logSelection,
}

export const panels = {
    textDataSeriesEditor
}
