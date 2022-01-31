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

/** responsible for editing a TextDataSeries */
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

    useEffect(() => {
        const { textDataSeries } = textDataSeriesNode;
        setValue(textDataSeries.join('\n')); // join the textDataSeries into a value with newlines 
    }, [selection.items[0], setValue, textDataSeriesNode]);

    const textUpdated: ChangeEventHandler<HTMLTextAreaElement> = (event) => {

        // \n represents a skip to the next Text node
        // \r represents a new line in the current Text node - ie a carriage returns
        // \r are visually represented as "└" in the textarea to (hopefully) avoid confusion with \n
        // a blank line is replaced with a blank space " " or it will be ignored by the RepeatGrid

        // set textarea value & manage newlines and carriage returns
        let textValue = event.target.value
            .replace(/\t/ig, `\n`) // replace tabs and newlines with a newline
            .replace(/\r\n/ig, '\n') // remove \r from \r\n pasted values, which would create 2 newlines
            .replace(/\r([^└])/ig, '\n$1') // remove all \r returns not followed by "└" 
            .replace(/\\r/ig, '\r└'); // add return when manually typed
        setValue(textValue);

        // create textDataSeries string
        const textDataSeries = textValue
            .replace(/└/ig, '') // remove "└"s
            .split('\n') // split newlines into Text node contents
            .map(line => line === '' ? ' ' : line); // change blank lines to a single space so they aren't deleted
        
        const { node } = textDataSeriesNode;
        editDocument({ editLabel: 'edit-text' }, selection => {
            repeatGridTextDataSeries.repeatGrid.attachTextDataSeries(node, textDataSeries)
        });
    };

    // selects(highlights) the textarea's text range corresponding to the selected Text node - for faster editing
    const selectTextSelectionRange: FocusEventHandler<HTMLTextAreaElement> = useCallback((e) => {
        let start = 0;
        let end = 0;
        const { rowIndex } = selectedCellLocation;

        // get the selection range of the currently selected row's text node
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

    // manage textarea focus
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const proxyInputRef = useRef<HTMLInputElement>(null);
    const focusTextareaUnfocused = useCallback(() => {
        // The UXP textarea automatically selects all contents onPointerUp, and WONT LET US CHANGE IT!! so...
        // manually trigger focus rather than with a pointer event so we can setSelectionRange
        if (document.activeElement !== textareaRef.current) {
            // if the textarea is disabled, it can't be selected so we select a hidden input as proxy
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


    // TABBING //
    // Tabbing is handled by the hidden inputs (TextEditor-hidden-nav-input)
    // We preserve the native tabbing functionally of moving to the next form element
    // and trigger the navigation when these elements are tabbed to (onFocus)
    // there is a third hidden proxy input for when the textarea is disabled and cannot receive focus

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
