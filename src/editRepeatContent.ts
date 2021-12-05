import { CommandHandler, RootNode, XDSelection, RepeatGrid } from "scenegraph";

export const editRepeatContent: CommandHandler = function (selection, root) {
    console.log({ selection });

    if (!(selection.items[0] instanceof RepeatGrid)) return
    
    const repeatGrid = selection.items[0]
    console.log(repeatGrid);
    
    repeatGrid.children.forEach(node => {
        console.log(node);
    })

    // TODO: try a textarea/table solution in a panel
}
