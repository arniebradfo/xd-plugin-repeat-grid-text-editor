import { CommandHandler, GraphicNode, RepeatGrid, RootNode, SceneNode, Text, Selection } from "scenegraph";

export const createTextDataSeries = function (selection: Selection, root?: RootNode): RepeatGridTextDataSeries | undefined {
    // console.log({ selection, root });

    const selectedRepeatGridItem = selection.items[0]
    if (!(selectedRepeatGridItem instanceof RepeatGrid || selectedRepeatGridItem instanceof Text)) return

    // bubble up the SceneGraph, recording the guid of the parentNode and the index of the currentNode, stopping at the firstRepeatGrid
    const findPathToRepeatGridAncestor = findPathToAncestorOfType<RepeatGrid>(selectedRepeatGridItem, RepeatGrid)
    if (!findPathToRepeatGridAncestor) return // not a child of RepeatGrid
    const { node: repeatGrid, indexPath: pathFromSelected } = findPathToRepeatGridAncestor

    // traverse repeatGrid first child and set of Text Nodes 
    const exampleRepeatCell = repeatGrid.children.at(0)
    if (!exampleRepeatCell) return
    const leaves = getSceneNodeLeaves(exampleRepeatCell) as NodeAndPath<Text>[]
    // console.log({ leaves });

    // transform leaves into textDataSeries
    const textDataSeriesNodes: TextDataSeriesNode[] = []
    let cellLocation: CellLocation | undefined = undefined;
    leaves.forEach((leaf, columnIndex) => {
        const textDataSeries: string[] = []
        repeatGrid.children.forEach((repeatCell, rowIndex) => {
            const textNode = findDescendentFromPath(repeatCell, leaf.indexPath) as Text
            textDataSeries.push(textNode.text)
            if (selectedRepeatGridItem instanceof Text && textNode.guid === selectedRepeatGridItem.guid) {
                cellLocation = { columnIndex, rowIndex }
            }
        })
        const name = (leaf.node as Text).name // leaf.node.hasDefaultName may be useful?
        textDataSeriesNodes.push({
            ...leaf,
            name,
            textDataSeries
        })
    });

    return { textDataSeriesNodes, repeatGrid, cellLocation }

}

export interface RepeatGridTextDataSeries {
    repeatGrid: RepeatGrid,
    textDataSeriesNodes: TextDataSeriesNode[],
    cellLocation?: CellLocation,
}

export interface CellLocation {
    columnIndex: number,
    rowIndex?: number,
}
export interface TextDataSeriesNode extends NodeAndPath<Text> {
    name: string,
    textDataSeries: TextDataSeries,
}

export type TextDataSeries = string[]

export interface NodeAndPath<T extends SceneNode = SceneNode> {
    node: T,
    indexPath: number[]
}

function getSceneNodeLeaves(
    node: SceneNode,
    indexPath: number[] = []
): NodeAndPath<GraphicNode>[] {
    // TODO: check for Text node
    // TODO: check for Component instance
    if (node.children.length === 0) {
        const graphicNode = node as GraphicNode
        return [{ node: graphicNode, indexPath }]
    }
    const leaves: NodeAndPath<GraphicNode>[][] = []
    node.children.forEachRight((node, ii) => {
        const leaf = getSceneNodeLeaves(node, [...indexPath, ii])
        leaves.push(leaf)
    })
    return leaves.flat()
}

function findDescendentFromPath(
    node: SceneNode,
    indexPath: number[],
): SceneNode {
    let currentNode = node
    indexPath.forEach(childIndex => {
        const currentChild = currentNode.children.at(childIndex)
        if (currentChild)
            currentNode = currentChild
    })
    return currentNode
}

function findPathToAncestorOfType<T extends SceneNode = SceneNode>(
    node: SceneNode,
    Type: (typeof SceneNode)
): NodeAndPath<T> | undefined {
    let path: number[] = []
    let activeNode: SceneNode | null = node
    while (!(activeNode instanceof Type)) {
        if (activeNode == null)
            break
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
    childNode.parent?.children.some((child) => {
        if (child.guid === childNode.guid) {
            return true
        } else {
            index++
            return false
        }
    })
    return index
}