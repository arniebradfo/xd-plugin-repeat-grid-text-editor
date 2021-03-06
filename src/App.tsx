import React, { useEffect, useMemo, useState } from 'react';
import './App.css'
import { XdReactComponent } from './util/panel-controller';
import { CellLocation, createTextDataSeries, isInEditContext, RepeatGridTextDataSeries } from './createTextDataSeries';
import { Icon } from './Icon';
import { TextEditor } from './TextEditor';
import { InfoButton } from './InfoButton';

export const App: XdReactComponent = ({ selection, root, ...props }) => {

    const [repeatGridTextDataSeries, setRepeatGridTextDataSeries] = useState<RepeatGridTextDataSeries>();
    const [selectedCellLocation, setSelectedCellLocation] = useState<CellLocation>();
    const [shouldRetainFocus, setShouldRetainFocus] = useState<boolean>(false);

    // setRepeatGridTextDataSeries when selection updates
    useEffect(() => {
        // don't retain focus if a user selection changes
        setShouldRetainFocus(false);
        const _repeatGridTextDataSeries = createTextDataSeries(selection);
        setRepeatGridTextDataSeries(_repeatGridTextDataSeries);
        setSelectedCellLocation(_repeatGridTextDataSeries?.cellLocation);
    }, [selection.items[0]]);

    // navigate to a new text node panel
    const selectTextNode = (index: number) => {
        // retain the selection on navigation to a new text node
        setShouldRetainFocus(true);
        setSelectedCellLocation({
            columnIndex: index,
            rowIndex: repeatGridTextDataSeries?.cellLocation?.rowIndex
        });
        setRepeatGridTextDataSeries(createTextDataSeries(selection));
    };

    // which text node are we editing
    const textDataSeriesNode = useMemo(() => (
        (repeatGridTextDataSeries == null || selectedCellLocation == null)
            ? undefined
            : repeatGridTextDataSeries.textDataSeriesNodes[selectedCellLocation.columnIndex]
    ), [repeatGridTextDataSeries, selectedCellLocation]);

    // we can't edit text nodes that are outside the Edit Context
    const disabled = textDataSeriesNode ? !isInEditContext(selection, textDataSeriesNode.node) : true;

    // which panel to show // navigation state
    const showNoPanel = !repeatGridTextDataSeries;
    const showSelectionPanel = repeatGridTextDataSeries && selectedCellLocation == null;
    const showTextEditorPanel = repeatGridTextDataSeries && selectedCellLocation != null && textDataSeriesNode;

    // navigation functions
    const nodeIndexes = showTextEditorPanel
        ? loopingPrevNextArrayIndex(repeatGridTextDataSeries.textDataSeriesNodes.length, selectedCellLocation.columnIndex)
        : undefined;
    const navigateNext = () => selectTextNode(nodeIndexes!.next);
    const navigatePrevious = () => selectTextNode(nodeIndexes!.previous);
    const navigateBack = () => setSelectedCellLocation(undefined);

    // The InfoButton and popover
    // UXP doesn't support css z-index !?
    // So... the element containing InfoButton2 needs to come last in the html
    // ...but needs to be on top, so we use flex order to manage this in App.css
    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
    const InfoButton2 = () => (
        <InfoButton
            isOpen={isInfoOpen}
            onClose={() => setIsInfoOpen(false)}
            onOpen={() => setIsInfoOpen(true)}
        />
    );

    return (
        <div className='App'>

            {showNoPanel && (
                <div className='SelectionPanel-footer xd-hint'>
                    Select A Repeat Grid
                </div>
            )}

            {showSelectionPanel && (
                <div className='SelectionPanel'>

                    <div className='SelectionPanel-list'>
                        <div className='SelectionPanel-list-item SelectionPanel-list-item-repeatgrid'>
                            <Icon iconPath='RepeatGrid' className='SelectionPanel-list-item-icon' />
                            <span className='SelectionPanel-list-item-name util-ellipsis'>
                                {repeatGridTextDataSeries.repeatGrid.name}
                            </span>
                        </div>
                        {repeatGridTextDataSeries.textDataSeriesNodes.length === 0 && (
                            <div className='SelectionPanel-list-item SelectionPanel-list-item-textobject disabled' >
                                <span className='SelectionPanel-list-item-name xd-hint util-ellipsis' >
                                    No Text Objects
                                </span>
                            </div>
                        )}
                        {repeatGridTextDataSeries.textDataSeriesNodes.map((textDataSeriesNode, index) => (
                            <div
                                key={textDataSeriesNode.node.guid}
                                onClick={() => selectTextNode(index)}
                                className='SelectionPanel-list-item SelectionPanel-list-item-textobject'
                            >
                                <Icon iconPath='TextObject' className='SelectionPanel-list-item-icon' />
                                <span
                                    className={[
                                        'SelectionPanel-list-item-name',
                                        'util-ellipsis',
                                        isInEditContext(selection, textDataSeriesNode.node) ? undefined : 'disabled'
                                    ].join(' ')}
                                >
                                    {textDataSeriesNode.name.replace(/\r/ig, ' ')}
                                </span>
                                <Icon iconPath='ChevronRight' className='SelectionPanel-list-item-arrow' />
                            </div>
                        ))}
                    </div>

                    <div className='SelectionPanel-footer xd-hint'>
                        Select a Text Object to edit
                    </div>

                    {/* PUTTING THIS LAST IS THE ONLY WAY TO GET IT TO Z-INDEX CORRECTLY */}
                    <div className='SelectionPanel-header'>
                        <span className='xd-detail'>
                            {'Repeat Grid Text Objects'.toUpperCase()}
                        </span>
                        <InfoButton2 />
                    </div>

                </div>
            )}

            {showTextEditorPanel && (
                <div className='TextEditorPanel'>

                    <div className='TextEditorPanel-header xd-heading util-ellipsis'>
                        {repeatGridTextDataSeries.textDataSeriesNodes[nodeIndexes!.current].name}
                    </div>

                    <TextEditor
                        className='TextEditorPanel-TextEditor'
                        onTabNext={navigateNext}
                        onTabPrevious={navigatePrevious}
                        {...{
                            selection,
                            root,
                            selectedCellLocation,
                            repeatGridTextDataSeries,
                            textDataSeriesNode,
                            shouldRetainFocus,
                            disabled
                        }}
                    />

                    <sp-divider size="small" class="TextEditorPanel-divider"></sp-divider>

                    <div className='TextEditorPanel-footer'>
                        <div className='xd-button xd-button--outlined' onClick={navigatePrevious}>
                            <Icon iconPath='ChevronLeftSmall' />
                            <span className='text'>{'Previous'}</span>
                        </div>
                        <span className='xd-hint util-ellipsis'>Shift+Tab</span>
                        <div className='flex-splitter' />
                        <span className='xd-hint util-ellipsis'>Tab</span>
                        <div className='xd-button xd-button--outlined' onClick={navigateNext}>
                            <span className='text'>{'Next'}</span>
                            <Icon iconPath='ChevronRightSmall' />
                        </div>
                    </div>

                    {/* PUTTING THIS LAST IS THE ONLY WAY TO GET IT TO Z-INDEX CORRECTLY */}
                    <div className='TextEditorPanel-nav'>
                        <div className='TextEditorPanel-back xd-button' onClick={navigateBack}>
                            <Icon iconPath='ChevronLeftSmall' />
                            <span className='xd-detail text'>{'All Text Objects'.toUpperCase()}</span>
                        </div>
                        <InfoButton2 />
                    </div>

                </div>
            )}

        </div>
    );
};

const loopingPrevNextArrayIndex = (length: number, index: number) => {

    const current = index;
    let next = current + 1;
    let previous = current - 1;

    // if last item, loop to start
    next = next === length ? 0 : next;

    // if first item, loop to end
    previous = previous < 0 ? length - 1 : previous;

    return { current, next, previous }
};

