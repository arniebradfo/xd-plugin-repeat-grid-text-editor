import './react-shim'
import './node_modules/react/index.js'
import './node_modules/react-dom/index.js'
// import { logSelection } from "./logSelection";
import { textDataSeriesEditor } from "./textDataSeriesEditor";
// import { CommandHandler } from "scenegraph";
// type CommandId = string

// export const commands: {
//     [key: CommandId]: CommandHandler
// } = {
//     createTextDataSeries,
//     editRepeatContent: logSelection,
// }

export const panels = {
    textDataSeriesEditor
}
