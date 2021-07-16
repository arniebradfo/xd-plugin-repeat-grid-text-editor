'use strict';
const { RepeatGrid } = require("scenegraph");

function tabToNext(selection) {
    console.log(selection);

    const selectedRepeatGridItem = selection.items[0]
    // check to see if text?
    // TODO: multiple selection.items?

    // bubble up the SceneGraph, recording the guid of the parentNode and the index of the currentNode, stopping at the firstRepeatGrid
    const [repeatGrid, pathFromSelected] = findPathToAncestorOfType(selectedRepeatGridItem, RepeatGrid)
    console.log(pathFromSelected);

    if (repeatGrid == null)
        return false

    // increment the root.childIndex to select the next element
    let selectedCellIndex = pathFromSelected[0]
    
    // TODO: for top2bottom traversal, increment by rowCount+1
    selectedCellIndex = selectedCellIndex + 1
    
    // if were' at the last item restart from the first
    if (selectedCellIndex === repeatGrid.children.length)
        selectedCellIndex = 0
    
    pathFromSelected[0] = selectedCellIndex

    // traverse the Repeat grid to find the next item
    const nextItemToSelect = findDecedentFromPath(pathFromSelected, repeatGrid)
    // TODO: if null check ?
    console.log(nextItemToSelect.text);

    // TODO: Update Selection ? // https://adobexdplatform.com/plugin-docs/reference/selection.html
    // This is not possible due to plugin actions being limited to the editContext 
    // https://adobexdplatform.com/plugin-docs/reference/core/edit-context.html

}

function findDecedentFromPath(pathFromSelected, rootNode) {
    let currentNode = rootNode
    pathFromSelected.forEach(childIndex => {
        if (currentNode == null)
            return false
        currentNode = currentNode.children.at(childIndex)
    })
    return currentNode
}

function findPathToAncestorOfType(node, Type) {
    let path = []
    let activeNode = node
    while (!(activeNode instanceof Type)) {
        if (activeNode == null)
            return [false, []]
        path.push(indexOfChildInParent(activeNode))
        activeNode = activeNode.parent
    }
    return [activeNode, path.reverse()] // activeNode is of Type
}

function indexOfChildInParent(childNode) {
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

module.exports = {
    tabToNext
};