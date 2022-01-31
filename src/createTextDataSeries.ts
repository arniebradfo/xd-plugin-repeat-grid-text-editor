import { GraphicNode, RepeatGrid, RootNode, SceneNode, Text, Selection, SymbolInstance } from "scenegraph";

// create data object that represents all Text DataSeries in a selected RepeatGrid 
export const createTextDataSeries = function (selection: Selection, root?: RootNode): RepeatGridTextDataSeries | undefined {

    const selectedRepeatGridItem = selection.items[0];

    // bubble up the SceneGraph, recording the guid of the parentNode and the index of the currentNode, stopping at the firstRepeatGrid
    const findPathToRepeatGridAncestor = findPathToAncestorOfType<RepeatGrid>(selectedRepeatGridItem, RepeatGrid);
    if (!findPathToRepeatGridAncestor)
        return; // not a child of RepeatGrid
    const { node: repeatGrid, indexPath: pathFromSelected } = findPathToRepeatGridAncestor;

    // traverse the selected repeatGrid child and set of Text Nodes 
    const selectedRowIndex = pathFromSelected[0] || 0;
    const selectedRepeatCell = repeatGrid.children.at(selectedRowIndex);
    if (!selectedRepeatCell)
        return; // selectedRowIndex was out of range
    const leaves = getSceneNodeLeaves<Text>(selectedRepeatCell, [], Text);

    // transform leaves into textDataSeries
    const textDataSeriesNodes: TextDataSeriesNode[] = [];
    let cellLocation: CellLocation | undefined = undefined;
    leaves.forEach((leaf, columnIndex) => {
        const textDataSeries: string[] = [];
        repeatGrid.children.forEach((repeatCell, rowIndex) => {
            const textNode = findDescendentFromPath(repeatCell, leaf.indexPath) as Text;
            textDataSeries.push(textNode.text);
            if (selectedRepeatGridItem instanceof Text && textNode.guid === selectedRepeatGridItem.guid) {
                cellLocation = { columnIndex, rowIndex };
            }
        })
        const name = (leaf.node).name; // leaf.node.hasDefaultName may be useful?
        textDataSeriesNodes.push({
            ...leaf,
            name,
            textDataSeries
        });
    });

    return { textDataSeriesNodes, repeatGrid, cellLocation };

};

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

// get the bottom most decedents of a SceneNode
function getSceneNodeLeaves<T extends GraphicNode = GraphicNode>(
    node: SceneNode,
    indexPath: number[] = [],
    Type: (typeof GraphicNode) = GraphicNode,
    boundaryTypes: (typeof SceneNode)[] = [RepeatGrid, SymbolInstance]
): NodeAndPath<T>[] {

    // check for RepeatGrid or Component instance
    if (boundaryTypes.find(BoundaryType => node instanceof BoundaryType) != null)
        return [];

    // if wer are at the bottom of the tree, return
    if (node.children.length === 0) {
        const graphicNode = node as GraphicNode;
        // check for Text node
        if (graphicNode instanceof Type)
            return [{ node: graphicNode as T, indexPath }];
        else
            return [];
    }

    // if there are children, recurse...
    const leaves: NodeAndPath<T>[][] = [];
    node.children.forEachRight((node, ii) => {
        const leaf = getSceneNodeLeaves<T>(node, [...indexPath, ii], Type);
        leaves.push(leaf);
    })

    return leaves.flat();
}

// navigate the decedents of a node to find a specific node
function findDescendentFromPath<T extends SceneNode = SceneNode>(
    node: SceneNode,
    indexPath: number[],
): T {
    let currentNode = node;
    indexPath.forEach(childIndex => {
        const currentChild = currentNode.children.at(childIndex);
        if (currentChild)
            currentNode = currentChild;
    });
    return currentNode as T;
}

// return the closest ancestor of a specified type, and return the index path to it
function findPathToAncestorOfType<T extends SceneNode = SceneNode>(
    node: SceneNode,
    Type: (typeof SceneNode)
): NodeAndPath<T> | undefined {
    let path: number[] = [];
    let activeNode: SceneNode | null = node;
    // loop over ancestors and record path
    while (!(activeNode instanceof Type)) {
        if (activeNode == null)
            return; // no ancestor of type
        path.push(indexOfChildInParent(activeNode));
        activeNode = (activeNode as SceneNode).parent;
    }
    return {
        node: activeNode as T,
        // reverse path so we can find original node again
        indexPath: path.reverse() 
    };
}

// 
function indexOfChildInParent(
    childNode: SceneNode
): number {
    let index = 0;
    childNode.parent?.children.some((child) => {
        if (child.guid === childNode.guid) {
            return true;
        } else {
            index++;
            return false;
        }
    })
    return index;
}

// can a SceneNode be edited
export function isInEditContext(selection: Selection, node: SceneNode | null): boolean {
    if (node == null)
        return false;
    if (node.guid === selection.editContext.guid)
        return true;
    else
        return isInEditContext(selection, node.parent);
}
