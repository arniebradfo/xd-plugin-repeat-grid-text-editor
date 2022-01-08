import { editDocument } from 'application';
import React, { FC, FocusEventHandler, HTMLProps, useEffect, useState } from 'react';
import { RepeatGrid } from 'scenegraph';
import { CellLocation, createTextDataSeries, RepeatGridTextDataSeries } from './createTextDataSeries';
import { XdReactComponent, XdReactComponentProps } from './util/panel-controller';
import { WC } from './WC';

export const App: XdReactComponent = ({ selection, root, ...props }) => {
    // console.log({ selection, root });

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

        console.log('textUpdated');

        if (!repeatGridTextDataSeries) return

        const textValue = event.target.value
        setValue(textValue)
        const textDataSeries = textValue.split('\n').map(line => line === '' ? ' ' : line);

        const { node } = repeatGridTextDataSeries.textDataSeriesNodes[selectedCellLocation.columnIndex]
        editDocument({ editLabel: 'edit-text' }, selection => {
            repeatGridTextDataSeries.repeatGrid.attachTextDataSeries(node, textDataSeries)
        })
    }

    // TODO: Select the correct line on focus
    const onFocus: FocusEventHandler<HTMLTextAreaElement> = (e) => {
        // onMouseUp does a e.currentTarget.select() after focus occurs?
        // This doesn't work on parent: onMouseUpCapture={e => { e.preventDefault(); e.stopPropagation(); }}
        // or its some other event
        const { currentTarget } = e
        setTimeout(() => {
            currentTarget.setSelectionRange(5, 10) // sometimes works
        }, 0);
    }

    return (
        <WC {...props}
            onInput={textUpdated} // this is called twice
        >
            <sp-textarea // can this textarea even set Selection?
                placeholder='Select a RepeatGrid'
                value={value ? value : ''}
                // onChange={textUpdated}
                style={{ height: 500, backgroundColor: 'white' }}
                // disabled={value === ''}
                // onFocus={onFocus}
            ></sp-textarea>
        </WC>
    );
};

