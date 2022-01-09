import { editDocument } from 'application';
import React, { ChangeEventHandler, FC, FocusEventHandler, HTMLProps, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CellLocation, createTextDataSeries, isInEditContext, RepeatGridTextDataSeries } from './createTextDataSeries';
import { XdReactComponent, XdReactComponentProps } from './util/panel-controller';

export const App: XdReactComponent = ({ selection, root, ...props }) => {

    const [repeatGridTextDataSeries, setRepeatGridTextDataSeries] = useState<RepeatGridTextDataSeries>()
    const [selectedCellLocation, setSelectedCellLocation] = useState<CellLocation>()

    useEffect(() => {
        const _repeatGridTextDataSeries = createTextDataSeries(selection)
        setRepeatGridTextDataSeries(_repeatGridTextDataSeries);
        setSelectedCellLocation(_repeatGridTextDataSeries?.cellLocation)
    }, [selection.items[0]])

    const selectTextNode = (index: number) => {
        setSelectedCellLocation({
            columnIndex: index,
            rowIndex: repeatGridTextDataSeries?.cellLocation?.rowIndex
        })
        setRepeatGridTextDataSeries(createTextDataSeries(selection));
    }

    const returnToHomePanel = () => setSelectedCellLocation(undefined)
    const showNoPanel = !repeatGridTextDataSeries
    const showSelectionPanel = repeatGridTextDataSeries && selectedCellLocation == null
    const showTextEditorPanel = repeatGridTextDataSeries && selectedCellLocation != null

    const nodeIndexes = showTextEditorPanel
        ? loopingPrevNextArrayIndex(repeatGridTextDataSeries.textDataSeriesNodes.length, selectedCellLocation.columnIndex)
        : undefined

    return (
        <div
        // style={{ fontFamily: 'Adobe Clean, sans serif' }}
        >

            {showNoPanel && (
                <div>Select A Repeat Grid</div>
            )}

            {showSelectionPanel && (
                <div>
                    <div style={{ display: 'flex' }}>
                        <span>Repeat Grid Text Objects</span>
                        <span>?</span>
                    </div>
                    {repeatGridTextDataSeries.textDataSeriesNodes.map((textDataSeriesNode, index) => (
                        <a
                            key={textDataSeriesNode.node.guid}
                            onClick={() => selectTextNode(index)}
                            style={{ display: 'flex' }}
                        >
                            <span>T</span>
                            <span>{textDataSeriesNode.name}</span>
                            <span>&gt;</span>
                        </a>
                    ))}
                </div>
            )}

            {showTextEditorPanel && (
                <div>
                    <a onClick={returnToHomePanel}>{'⬅ All Text Objects'}</a>
                    <div>{repeatGridTextDataSeries.textDataSeriesNodes[nodeIndexes!.current].name}</div>
                    <TextEditorPanel
                        repeatGridTextDataSeries={repeatGridTextDataSeries}
                        selectedCellLocation={selectedCellLocation}
                        {...{ selection, root }}
                    />
                    <div>
                        <a onClick={() => selectTextNode(nodeIndexes!.previous)}>Previous</a>
                        <a onClick={() => selectTextNode(nodeIndexes!.next)}>Next</a>
                    </div>
                </div>
            )}

        </div>
    )
}

export interface TextEditorPanelProps extends XdReactComponentProps, HTMLProps<HTMLDivElement> {
    repeatGridTextDataSeries: RepeatGridTextDataSeries,
    selectedCellLocation: CellLocation
}

export const TextEditorPanel: FC<TextEditorPanelProps> = ({
    selection,
    root,
    repeatGridTextDataSeries,
    selectedCellLocation,
    ...props
}) => {

    const [value, setValue] = useState('')

    const textDataSeriesNode = useMemo(() => (
        repeatGridTextDataSeries.textDataSeriesNodes[selectedCellLocation.columnIndex]
    ), [repeatGridTextDataSeries, selectedCellLocation])

    const isOutsideEditContext = !isInEditContext(selection, textDataSeriesNode.node)

    useEffect(() => {
        const { textDataSeries } = textDataSeriesNode
        setValue(textDataSeries.join('\n'))
    }, [selection.items[0], setValue, textDataSeriesNode])

    const textUpdated: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
        // if (!repeatGridTextDataSeries) return // unnecessary?

        const textValue = event.target.value
        setValue(textValue)
        const textDataSeries = textValue.split('\n').map(line => line === '' ? ' ' : line);

        const { node } = textDataSeriesNode
        editDocument({ editLabel: 'edit-text' }, selection => {
            repeatGridTextDataSeries.repeatGrid.attachTextDataSeries(node, textDataSeries)
        })
    }

    const selectTextSelectionRange: FocusEventHandler<HTMLTextAreaElement> = useCallback((e) => {

        let start = 0;
        let end = 0;
        const { rowIndex } = selectedCellLocation;
        if (rowIndex != null) {
            start = textDataSeriesNode
                .textDataSeries
                .slice(0, rowIndex)
                .join('\n')
                .length + (rowIndex > 0 ? 1 : 0);
            end = start + textDataSeriesNode.textDataSeries[rowIndex].length;
        }

        const { currentTarget } = e;

        // Reset the selection to nothing
        currentTarget.setSelectionRange(0, end ? 0 : 1);

        // set selection to the correct value in the next frame
        // this tricks UXP into the correct behavior
        setTimeout(() => currentTarget.setSelectionRange(start, end), 1);

    }, [selectedCellLocation, textDataSeriesNode])

    // force focus on every render cycle to trigger selectTextSelectionRange()
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    textareaRef.current?.focus()

    return (
        <div {...props} >
            <textarea
                ref={textareaRef}
                style={{ height: 500, backgroundColor: 'white' }}
                placeholder='Select a RepeatGrid'
                value={value ? value : ''}
                onChange={textUpdated}
                onFocus={selectTextSelectionRange}
                disabled={isOutsideEditContext}
            />
            {isOutsideEditContext && (
                <sp-label>Selected TextDataSeries is outside the Edit Context</sp-label>
            )}
        </div>
    );
};

const loopingPrevNextArrayIndex = (length: number, index: number) => {

    const current = index
    let next = current + 1
    let previous = current - 1

    // if last item, loop to start
    next = next === length ? 0 : next

    // if first item, loop to end
    previous = previous < 0 ? length - 1 : previous

    return {
        current,
        next,
        previous
    }
}
