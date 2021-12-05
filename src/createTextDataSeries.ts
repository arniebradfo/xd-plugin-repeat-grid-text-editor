import { CommandHandler, RepeatGrid, SceneNode, Text } from "scenegraph";

export const createTextDataSeries: CommandHandler = function (selection, root) {
    console.log({selection, root});

    const selectedRepeatGridItem = selection.items[0]
    // check to see if text?
    // TODO: multiple selection.items?

    // bubble up the SceneGraph, recording the guid of the parentNode and the index of the currentNode, stopping at the firstRepeatGrid
    const findPathToRepeatGridAncestor = findPathToAncestorOfType<RepeatGrid>(selectedRepeatGridItem, RepeatGrid)
    if (!findPathToRepeatGridAncestor) return false // not a child of RepeatGrid
    const [repeatGrid, pathFromSelected] = findPathToRepeatGridAncestor

    console.log(repeatGrid);

    // increment the root.childIndex to select the next element
    let selectedCellIndex = pathFromSelected[0]

    // TODO: for top2bottom traversal, increment by rowCount+1
    selectedCellIndex = selectedCellIndex + 1

    // if were' at the last item restart from the first
    if (selectedCellIndex === repeatGrid.children.length)
        selectedCellIndex = 0

    pathFromSelected[0] = selectedCellIndex

    // traverse the Repeat grid to find the next item
    const nextItemToSelect = findDecedentFromPath(pathFromSelected, repeatGrid) as Text
    // TODO: if null check ?
    console.log(nextItemToSelect.text);

    // TODO: Update Selection ? // https://adobexdplatform.com/plugin-docs/reference/selection.html
    // This is not possible due to plugin actions being limited to the editContext 
    // https://adobexdplatform.com/plugin-docs/reference/core/edit-context.html

}

function findDecedentFromPath(pathFromSelected:number[], rootNode:SceneNode): SceneNode {
    let currentNode = rootNode
    pathFromSelected.forEach(childIndex => {
        if (currentNode == null)
            return false 
        currentNode = currentNode.children.at(childIndex)
    })
    return currentNode
}

function findPathToAncestorOfType<T extends SceneNode>(
    node: SceneNode,
    Type: (typeof SceneNode)
): [T, number[]] | false {
    let path:number[] = []
    let activeNode: SceneNode = node
    while (!(activeNode instanceof Type)) {
        if (activeNode == null) return false
        path.push(indexOfChildInParent(activeNode))
        activeNode = (activeNode as SceneNode).parent
    }
    return [activeNode as T, path.reverse()] // activeNode is of Type
}

function indexOfChildInParent(
    childNode: SceneNode
): number {
    let index = 0
    // console.log(childNode.parent.children)
    childNode.parent.children.some((child) => {
        if (child.guid === childNode.guid) {
            return true
        } else {
            index++
            return false
        }
    })
    return index
}