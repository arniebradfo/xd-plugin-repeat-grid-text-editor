import { editDocument } from 'application';
import React, { FC, useEffect, useState } from 'react';
import { RepeatGrid, RootNode, Selection } from 'scenegraph';
import { createTextDataSeries, RepeatGridTextDataSeries } from './createTextDataSeries';

interface Props extends React.HTMLProps<HTMLDivElement> {
    selection: Selection,
    root: RootNode,
}

export const App: FC<Props> = ({ selection, root, ...props }) => {

    const [value, setValue] = useState<string | undefined>()
    const [repeatGridTextDataSeries, setRepeatGridTextDataSeries] = useState<RepeatGridTextDataSeries>()

    console.log({ selection, root });

    useEffect(() => {
        console.log('useEffect');

        if (!(selection.items[0] instanceof RepeatGrid)) {
            console.log('setValue(undefined)');

            setValue(undefined)
            return
        }

        const _repeatGridTextDataSeries = createTextDataSeries(selection) as RepeatGridTextDataSeries
        setRepeatGridTextDataSeries(_repeatGridTextDataSeries);

        if (!_repeatGridTextDataSeries) return
        const node = _repeatGridTextDataSeries.textDataSeriesNodes[0]
        setValue(node.textDataSeries.join('\n'))

    }, [selection.items[0], setValue, setRepeatGridTextDataSeries])


    function textUpdated(event) {
        console.log('textUpdated');

        if (!repeatGridTextDataSeries) return

        const textValue = event.target.value
        setValue(textValue)
        const textDataSeries = textValue.split('\n').map(line => line === '' ? ' ' : line);

        const { node } = repeatGridTextDataSeries.textDataSeriesNodes[0]
        editDocument({ editLabel: 'edit-text' }, selection => {
            repeatGridTextDataSeries.repeatGrid.attachTextDataSeries(node, textDataSeries)
        })
    }

    // yarn add https://www.npmjs.com/package/@adobe/react-spectrum

    console.log(value);
    
    return (
        <div {...props}>
            <textarea
                placeholder='Select a RepeatGrid'
                value={value ? value : undefined}
                onChange={textUpdated}
                style={{ height: 500, backgroundColor: 'white' }}
                disabled={value == null}
            />
        </div>
    );
};
