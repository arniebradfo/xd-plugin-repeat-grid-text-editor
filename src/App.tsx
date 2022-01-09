import { editDocument } from 'application';
import React, { FC, FocusEventHandler, HTMLProps, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CellLocation, createTextDataSeries, RepeatGridTextDataSeries } from './createTextDataSeries';
import { XdReactComponent, XdReactComponentProps } from './util/panel-controller';

export const App: XdReactComponent = ({ selection, root, ...props }) => {
    // console.log({ selection, root });
    // console.log('Render App');

    const [repeatGridTextDataSeries, setRepeatGridTextDataSeries] = useState<RepeatGridTextDataSeries>()
    const [selectedCellLocation, setSelectedCellLocation] = useState<CellLocation>()

    useEffect(() => {
        const _repeatGridTextDataSeries = createTextDataSeries(selection)
        setRepeatGridTextDataSeries(_repeatGridTextDataSeries);
        setSelectedCellLocation(_repeatGridTextDataSeries?.cellLocation)
    }, [selection.items[0]])

    const selectTextNode = (index: number) => {
        setSelectedCellLocation({ columnIndex: index })
        setRepeatGridTextDataSeries(createTextDataSeries(selection));
    }

    return (
        <div style={{ fontFamily: 'Adobe Clean, sans serif' }}>
            {repeatGridTextDataSeries?.textDataSeriesNodes.map((textDataSeriesNode, index) => (
                <a
                    key={textDataSeriesNode.node.guid}
                    onClick={() => selectTextNode(index)}
                    style={{ color: index === selectedCellLocation?.columnIndex ? 'gray' : undefined }}
                >
                    {textDataSeriesNode.name}
                </a>
            ))}
            {(repeatGridTextDataSeries && selectedCellLocation != null) ? (
                <TextEditorPanel
                    repeatGridTextDataSeries={repeatGridTextDataSeries}
                    selectedCellLocation={selectedCellLocation}
                    {...{ selection, root }}
                />
            ) : (
                <div>Select A Text Node</div>
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

    useEffect(() => {
        const node = repeatGridTextDataSeries.textDataSeriesNodes[selectedCellLocation.columnIndex]
        setValue(node.textDataSeries.join('\n'))
    }, [selection.items[0], setValue, repeatGridTextDataSeries, selectedCellLocation])

    function textUpdated(event) {
        if (!repeatGridTextDataSeries) return

        const textValue = event.target.value
        setValue(textValue)
        const textDataSeries = textValue.split('\n').map(line => line === '' ? ' ' : line);

        const { node } = repeatGridTextDataSeries.textDataSeriesNodes[selectedCellLocation.columnIndex]
        editDocument({ editLabel: 'edit-text' }, selection => {
            // console.log('attachTextDataSeries', node.text);
            repeatGridTextDataSeries.repeatGrid.attachTextDataSeries(node, textDataSeries)
        })
    }

    const selectTextSelectionRange: FocusEventHandler<HTMLTextAreaElement> = useCallback((e) => {
        const { currentTarget } = e

        // Reset the selection to nothing
        currentTarget.setSelectionRange(0, 1)

        // set selection to the correct value in the next frame
        // this tricks UXP into the correct behavior
        setTimeout(() => {
            // TODO: set selection range to correct line
            currentTarget.setSelectionRange(0, 0)
        }, 1);
    }, [])

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
            />
        </div>
    );
};
