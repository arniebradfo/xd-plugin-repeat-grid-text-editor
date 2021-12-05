import { tabToNext } from "./tabToNext";
import { editRepeatContent } from "./editRepeatContent";
import { CommandHandler } from "scenegraph";
type CommandId = string

export const commands: {
    [key: CommandId]: CommandHandler
} = {
    tabToNext,
    editRepeatContent,
}

