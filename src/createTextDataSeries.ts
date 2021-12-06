import { CommandHandler, GraphicNode, RepeatGrid, SceneNode, Text } from "scenegraph";

export const createTextDataSeries: CommandHandler = function (selection, root) {
    console.log({ selection, root });

    const selectedRepeatGridItem = selection.items[0]
    // check to see if text?
    // TODO: multiple selection.items?

    // bubble up the SceneGraph, recording the guid of the parentNode and the index of the currentNode, stopping at the firstRepeatGrid
    const findPathToRepeatGridAncestor = findPathToAncestorOfType<RepeatGrid>(selectedRepeatGridItem, RepeatGrid)
    if (!findPathToRepeatGridAncestor) return false // not a child of RepeatGrid
    const { node: repeatGrid, indexPath: pathFromSelected } = findPathToRepeatGridAncestor
    console.log(repeatGrid)

    // traverse repeatGrid first child and set of Text Nodes 
    const exampleRepeatCell = repeatGrid.children.at(0)
    const leaves = getSceneNodeLeaves(exampleRepeatCell)

    // transform leaves into textDataSeries
    const repeatGridTextDataSeries: { name: string, textDataSeries: string[]}[] = []
    leaves.forEach(leaf => {
        const textDataSeries = []
        repeatGrid.children.forEach(repeatCell => {
            textDataSeries.push((findDecedentFromPath(repeatCell, leaf.indexPath) as Text).text)
        })
        const name = (leaf.node as Text).name // leaf.node.hasDefaultName may be useful?
        repeatGridTextDataSeries.push({
            name,
            textDataSeries
        })   
    });
    console.log(repeatGridTextDataSeries);
    
    // // increment the root.childIndex to select the next element
    // let selectedCellIndex = pathFromSelected[0]

    // // TODO: for top2bottom traversal, increment by rowCount+1
    // selectedCellIndex = selectedCellIndex + 1

    // // if were' at the last item restart from the first
    // if (selectedCellIndex === repeatGrid.children.length)
    //     selectedCellIndex = 0

    // pathFromSelected[0] = selectedCellIndex

    // // traverse the Repeat grid to find the next item
    // const nextItemToSelect = findDecedentFromPath(repeatGrid, pathFromSelected) as Text
    // // TODO: if null check ?
    // console.log(nextItemToSelect.text);

    // TODO: Update Selection ? // https://adobexdplatform.com/plugin-docs/reference/selection.html
    // This is not possible due to plugin actions being limited to the editContext 
    // https://adobexdplatform.com/plugin-docs/reference/core/edit-context.html

}

type NodeAndPath<T extends SceneNode = SceneNode> = {
    node: T,
    indexPath: number[]
}

function getSceneNodeLeaves(
    node: SceneNode,
    indexPath: number[] = []
): NodeAndPath<GraphicNode>[] {
    if (node.children.length === 0) {
        const graphicNode = node as GraphicNode
        return [{ node: graphicNode, indexPath }]
    }
    const leaves = []
    node.children.forEachRight((node, ii) => {
        leaves.push(getSceneNodeLeaves(node, [...indexPath, ii]))
    })
    return leaves.flat()
}

function findDecedentFromPath(
    node: SceneNode,
    indexPath: number[],
): SceneNode {
    let currentNode = node
    indexPath.forEach(childIndex => {
        if (currentNode == null)
            return false
        currentNode = currentNode.children.at(childIndex)
    })
    return currentNode
}

function findPathToAncestorOfType<T extends SceneNode = SceneNode>(
    node: SceneNode,
    Type: (typeof SceneNode)
): NodeAndPath<T> | false {
    let path: number[] = []
    let activeNode: SceneNode = node
    while (!(activeNode instanceof Type)) {
        if (activeNode == null) return false
        path.push(indexOfChildInParent(activeNode))
        activeNode = (activeNode as SceneNode).parent
    }
    return {
        node: activeNode as T,
        indexPath: path.reverse()
    }
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