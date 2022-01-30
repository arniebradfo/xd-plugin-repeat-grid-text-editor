import React, { FC, HTMLProps } from 'react';
import { Icon } from './Icon';

export interface InfoButtonProps extends Omit<HTMLProps<HTMLDivElement>, 'onClick'> {
    isOpen?: boolean
    onOpen?(): void
    onClose?(): void
}

export const InfoButton: FC<InfoButtonProps> = ({ isOpen, onOpen, onClose, className, ...props }) => {
    return (
        <div
            className={[className, 'InfoWrapper'].join(' ')}
            onPointerLeave={onClose}
            {...props}
        >
            <Icon
                iconPath='Info'
                onClick={isOpen ? onClose : onOpen}
                className='InfoButton'
            />
            {isOpen && (
                <div className='InfoPanel'>
                    <div className='InfoPanel-header'>Keybindings</div>
                    {[
                        ['Tab', 'Next Text Object'],
                        ['Shift+Tab', 'Previous Text Object'],
                        ['Type "\\r"', 'Insert a carriage return'],
                    ].map(([command, hint]) => (
                        <div className='InfoPanel-grid' key={command}>
                            <span className='InfoPanel-grid-command'>{command}</span>
                            <span className='xd-hint'>{hint}</span>
                        </div>
                    ))}
                </div>
            )}
        </div >
    );
};
