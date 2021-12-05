import { CommandHandler, RootNode, XDSelection } from "scenegraph";

export const editRepeatContent: CommandHandler = function (selection, root) {
    console.log({ selection, root });
    // TODO: try a textarea/table solution in a panel
}
