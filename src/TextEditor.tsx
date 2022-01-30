import React, { ChangeEventHandler, FC, FocusEventHandler, HTMLProps, useCallback, useEffect, useRef, useState } from 'react';
import { editDocument } from 'application';
import { XdReactComponentProps } from './util/panel-controller';
import { CellLocation, RepeatGridTextDataSeries, TextDataSeriesNode } from './createTextDataSeries';

export interface TextEditorPanelProps extends XdReactComponentProps, HTMLProps<HTMLDivElement> {
    repeatGridTextDataSeries: RepeatGridTextDataSeries,
    textDataSeriesNode: TextDataSeriesNode,
    selectedCellLocation: CellLocation,
    shouldRetainFocus?: boolean,
    onTabNext?(): void,
    onTabPrevious?(): void,
}

export const TextEditor: FC<TextEditorPanelProps> = ({
    selection,
    root,
    repeatGridTextDataSeries,
    textDataSeriesNode,
    selectedCellLocation,
    shouldRetainFocus = false,
    className,
    onTabNext,
    onTabPrevious,
    disabled,
    ...props
}) => {

    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const proxyInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const { textDataSeries } = textDataSeriesNode;
        setValue(textDataSeries.join('\n'));
    }, [selection.items[0], setValue, textDataSeriesNode]);

    const textUpdated: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
        let textValue = event.target.value
            .replace(/\t/ig, `\n`) // replace tabs and newlines with a newline
            .replace(/\r\n/ig, '\n') // remove \r from \r\n pasted values, which would create 2 newlines
            .replace(/\r([^└])/ig, '\n$1') // remove all \r returns not followed by "└" 
            .replace(/\\r/ig, '\r└'); // add return when manually typed
        setValue(textValue);
        const textDataSeries = textValue
            .replace(/└/ig, '') // remove "└"s
            .split('\n')
            .map(line => line === '' ? ' ' : line);
        const { node } = textDataSeriesNode;
        editDocument({ editLabel: 'edit-text' }, selection => {
            repeatGridTextDataSeries.repeatGrid.attachTextDataSeries(node, textDataSeries)
        });
    };

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
        };

        const { currentTarget } = e;

        // Reset the selection to nothing
        currentTarget.setSelectionRange(0, end ? 0 : 1);

        // set selection to the correct value in the next frame
        // setTimeout tricks UXP into the correct behavior
        setTimeout(() => currentTarget.setSelectionRange(start, end), 1);

    }, [selectedCellLocation, textDataSeriesNode])

    const focusTextareaUnfocused = useCallback(() => {
        // manually trigger focus rather than with a pointer event so we can setSelectionRange
        if (document.activeElement !== textareaRef.current) {
            const ref = disabled ? proxyInputRef : textareaRef;
            ref.current?.focus();
        }
    }, [textDataSeriesNode, disabled]);

    useEffect(() => {
        if (shouldRetainFocus)
            focusTextareaUnfocused();
        else
            textareaRef.current?.blur();
    }, [shouldRetainFocus, textDataSeriesNode]);

    return (
        <div
            className={['TextEditor', className].join(' ')}
            onPointerEnter={focusTextareaUnfocused}
            onClick={disabled ? focusTextareaUnfocused : undefined}
            {...props}
        >

            <form className='TextEditor-textarea-wrapper' >

                <input hidden onFocus={onTabPrevious} className='TextEditor-hidden-nav-input' />

                {/* THE LINE NUMBERS DON'T ACCOUNT FOR LINE WRAPPING, SO THEY ARE COMMENTED FOR NOW :( */}
                {/* <div className='TextEditor-textarea-line-numbers'>
                    {value.split('\n').map((_, index) => {
                        let lineNumber = (index + 1).toString()
                        if (lineNumber.length === 1)
                            lineNumber = '0' + lineNumber
                        return (
                            <span key={lineNumber}>{lineNumber}</span>
                        )
                    })}
                </div> */}

                <textarea
                    className='TextEditor-textarea'
                    ref={textareaRef}
                    placeholder={`First Element Text\nSecond Element Text\nThird Element Text`}
                    value={value ? value : ''}
                    onChange={textUpdated}
                    onFocus={selectTextSelectionRange}
                    disabled={disabled}
                    style={disabled ? { pointerEvents: 'none' } : undefined}
                />

                {disabled && (
                    <input ref={proxyInputRef} hidden className='TextEditor-hidden-nav-input' />
                )}

                <input hidden onFocus={onTabNext} className='TextEditor-hidden-nav-input' />

            </form>

            {disabled && (
                <div className='TextEditor-warning xd-alert'>
                    <h4>Cannot Edit</h4>
                    Selected TextDataSeries is outside the Edit Context. {' '}
                    Select the surrounding Repeat Grid to enable all editing.
                </div>
            )}

        </div>
    );
};
