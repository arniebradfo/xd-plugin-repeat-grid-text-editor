'use strict';
const { RepeatGrid } = require("scenegraph");

function tabToNext(selection) {

    const selectedRepeatGridItem = selection.items[0] // check to see if text?

    // bubble up the SceneGraph, recording the guid of the parentNode and the index of the currentNode
    // stop at the first Repeat Grid
    const pathFromSelected = findPathToAncestorOfType(selectedRepeatGridItem, RepeatGrid)
    console.log(pathFromSelected);

    // find next instance
    
    // increment the root.childIndex to select the next element
    const repeatGridPathRoot = pathFromSelected[0]
    let repeatGridNextIndex = repeatGridPathRoot.childIndex + 1 // for top2bottom increment by rowCount+1
    if (repeatGridNextIndex === repeatGridPathRoot.node.children.length)
        repeatGridNextIndex = 0
    pathFromSelected[0].childIndex = repeatGridNextIndex

    const nextItemToSelect = findDecedentFromPath(pathFromSelected, repeatGridPathRoot.node)
    console.log(nextItemToSelect.text);

    // find the index of the RepeatGrid item that is selected.
    // find the index/id of the Group item that is selected.
    // move to the next instance of that item, or the first if last

}

function findDecedentFromPath(pathFromSelected, rootNode) {
    let currentNode = rootNode
    pathFromSelected.forEach(pathNode => {
        currentNode = currentNode.children.at(pathNode.childIndex)
    })
    return currentNode
}

function findPathToAncestorOfType(node, type) {
    let path = []
    let activeNode = node
    while ((activeNode != null) && !(activeNode instanceof type)) {
        path.push({
            node: activeNode.parent,
            childIndex: indexOfChildInParent(activeNode)
        })
        activeNode = activeNode.parent
    }
    if (activeNode.parent == null)
        return false
    else
        return path.reverse()
}

function indexOfChildInParent(childNode) {
    let index = 0
    // console.log(childNode.parent.children);
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
    commands: {
        tabToNext
    }
};