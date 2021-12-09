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
    console.log({ leaves });

    // transform leaves into textDataSeries
    const repeatGridTextDataSeries: { name: string, textDataSeries: string[] }[] = []
    leaves.forEach(leaf => {
        const textDataSeries = []
        repeatGrid.children.forEach(repeatCell => {
            textDataSeries.push((findDescendentFromPath(repeatCell, leaf.indexPath) as Text).text)
        })
        const name = (leaf.node as Text).name // leaf.node.hasDefaultName may be useful?
        repeatGridTextDataSeries.push({
            name,
            textDataSeries
        })
    });
    console.log(repeatGridTextDataSeries);

    // testing attachTextDataSeries
    // const attachNode = findDescendentFromPath(exampleRepeatCell, leaves[0].indexPath) as Text
    // repeatGrid.attachTextDataSeries(attachNode, ['this', 'is', 'a', 'test'])

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

function findDescendentFromPath(
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