import { editDocument } from 'application';
import React, { ChangeEventHandler, FC, FocusEventHandler, HTMLProps, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CellLocation, createTextDataSeries, isInEditContext, RepeatGridTextDataSeries } from './createTextDataSeries';
import { XdReactComponent, XdReactComponentProps } from './util/panel-controller';
import './App.css'
import { Icon } from './Icon';

export const App: XdReactComponent = ({ selection, root, ...props }) => {

    const [repeatGridTextDataSeries, setRepeatGridTextDataSeries] = useState<RepeatGridTextDataSeries>()
    const [selectedCellLocation, setSelectedCellLocation] = useState<CellLocation>()
    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false)

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
        <div className='App' >

            {showNoPanel && (
                // <div className='xd-heading'>Select A Repeat Grid</div>
                <div className='SelectionPanel-footer'>
                    Select A Repeat Grid
                </div>
            )}

            {showSelectionPanel && (
                <div className='SelectionPanel'>
                    <div className='SelectionPanel-header'>
                        <span className='xd-detail'>
                            {'Repeat Grid Text Objects'.toUpperCase()}
                        </span>
                        <InfoButton isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} onOpen={() => setIsInfoOpen(true)} />
                    </div>
                    <div className='SelectionPanel-list'>
                        <div className='SelectionPanel-list-item SelectionPanel-list-item-repeatgrid'>
                            <Icon iconPath='RepeatGrid' className='SelectionPanel-list-item-icon' />
                            <span className='SelectionPanel-list-item-text'>
                                {repeatGridTextDataSeries.repeatGrid.name}
                            </span>
                        </div>
                        {repeatGridTextDataSeries.textDataSeriesNodes.map((textDataSeriesNode, index) => (
                            <div
                                key={textDataSeriesNode.node.guid}
                                onClick={() => selectTextNode(index)}
                                className='SelectionPanel-list-item SelectionPanel-list-item-textobject'
                            >
                                <Icon iconPath='TextObject' className='SelectionPanel-list-item-icon' />
                                <span className='SelectionPanel-list-item-text'>
                                    {textDataSeriesNode.name}
                                </span>
                                <Icon iconPath='ChevronRight' className='SelectionPanel-list-item-arrow' />
                            </div>
                        ))}
                    </div>
                    {/* <div className='flex-splitter' /> */}
                    {/* <sp-divider size="small"></sp-divider> */}
                    <div className='SelectionPanel-footer'>
                        Select a Text Object to edit
                    </div>
                </div>
            )}

            {showTextEditorPanel && (
                <div className='TextEditorPanel'>
                    <div className='TextEditorPanel-nav'>
                        <div className='TextEditorPanel-back xd-button' onClick={returnToHomePanel}>
                            <Icon iconPath='ChevronLeftSmall' />
                            <span className='xd-detail text'>{'All Text Objects'.toUpperCase()}</span>
                        </div>
                        <InfoButton isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} onOpen={() => setIsInfoOpen(true)} />
                    </div>
                    <div className='TextEditorPanel-header xd-heading'>
                        {repeatGridTextDataSeries.textDataSeriesNodes[nodeIndexes!.current].name}
                    </div>
                    <TextEditor
                        className='TextEditorPanel-TextEditor'
                        repeatGridTextDataSeries={repeatGridTextDataSeries}
                        selectedCellLocation={selectedCellLocation}
                        {...{ selection, root }}
                    />
                    <sp-divider size="small"></sp-divider>
                    <div className='TextEditorPanel-footer'>
                        <div className='xd-button xd-button--outlined' onClick={() => selectTextNode(nodeIndexes!.previous)}>
                            <Icon iconPath='ChevronLeftSmall' />
                            <span className='text'>{'Previous'}</span>
                        </div>
                        <div className='xd-button xd-button--outlined' onClick={() => selectTextNode(nodeIndexes!.next)}>
                            <span className='text'>{'Next'}</span>
                            <Icon iconPath='ChevronRightSmall' />
                        </div>
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

export const TextEditor: FC<TextEditorPanelProps> = ({
    selection,
    root,
    repeatGridTextDataSeries,
    selectedCellLocation,
    className,
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
        <div
            className={['TextEditor', className].join(' ')}
            {...props}
        >
            <textarea
                className='TextEditor-textarea'
                ref={textareaRef}
                placeholder='Select a RepeatGrid'
                value={value ? value : ''}
                onChange={textUpdated}
                onFocus={selectTextSelectionRange}
                disabled={isOutsideEditContext}
            />
            {isOutsideEditContext && (
                <div className='TextEditor-warning'>
                    Selected TextDataSeries is outside the Edit Context
                </div>
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

    return { current, next, previous }
}


export interface InfoButtonProps extends Omit<HTMLProps<HTMLDivElement>, 'onClick'> {
    isOpen?: boolean
    onOpen?(): void
    onClose?(): void
}

const InfoButton: FC<InfoButtonProps> = ({ isOpen, onOpen, onClose, className, ...props }) => {
    return (<>
        <Icon
            iconPath='Info'
            onClick={isOpen ? onClose : onOpen}
            className={[className, 'InfoButton'].join(' ')}
            {...props}
        />
        {isOpen && (
            <div>
                <span onClick={onClose}>X</span>
                Instructional Content
            </div>
        )}
    </>)
}