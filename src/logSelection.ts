import { CommandHandler } from "scenegraph";

export const logSelection: CommandHandler = function (selection, root) {
    console.log({ selection, root});
}
