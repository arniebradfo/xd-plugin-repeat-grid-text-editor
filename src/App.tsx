import { editDocument } from 'application';
import React, { FC, useEffect, useState } from 'react';
import { RepeatGrid, RootNode, Selection } from 'scenegraph';
import { createTextDataSeries, RepeatGridTextDataSeries } from './createTextDataSeries';
import { XdReactApp } from './util/panel-controller';

export const App: XdReactApp = ({ selection, root, ...props }) => {

    const [value, setValue] = useState('')
    const [repeatGridTextDataSeries, setRepeatGridTextDataSeries] = useState<RepeatGridTextDataSeries>()

    console.log({ selection, root });

    useEffect(() => {
        console.log('useEffect');

        if (!(selection.items[0] instanceof RepeatGrid)) {
            console.log('setValue(undefined)');

            setValue('')
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
        <div>
            <textarea
                placeholder='Select a RepeatGrid'
                value={value ? value : ''}
                onChange={textUpdated}
                style={{ height: 500, backgroundColor: 'white' }}
                disabled={value===''}
            />
        </div>
    );
};
