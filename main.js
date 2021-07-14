const { RepeatGrid } = require("scenegraph");

function tabToNext(selection) {
    console.log(selection)
    
    const selectedRepeatGridItem = selection.items[0] // check to see if text?
    selectedRepeatGridItem.name = 'test'
    console.log(selectedRepeatGridItem.name);
    console.log(selectedRepeatGridItem.hasDefaultName);
    console.log(selectedRepeatGridItem.guid);

    // bubble up to find most recent parent that is RepeatGrid
    const [repeatGridAncestor, repeatGridInstanceGroup] = findMostRecentAncestorOfType(selectedRepeatGridItem, RepeatGrid)
    console.log(repeatGridAncestor);
    console.log(selectedRepeatGridInstanceGroup);
    if (repeatGridAncestor === false)
        return false
    
    // bubble up the SceneGraph, recording the guid of the parentNode and the index of the currentNode
    // stop at the first Repeat Grid
    
    // find the index of the RepeatGrid item that is selected.
    // find the index/id of the Group item that is selected.
    // move to the next instance of that item, or the first if last

}

function findMostRecentAncestorOfType(node, type) {
    if (node.parent == null)
        return [false, node]
    if (node.parent instanceof type)
        return [node.parent, node]
    else
        return findMostRecentAncestorOfType(node.parent, type)
}

module.exports = {
    commands: {
        tabToNext
    }
};