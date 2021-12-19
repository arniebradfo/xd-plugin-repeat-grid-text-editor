import React, { FC, useEffect } from 'react';
import { RootNode, Selection } from 'scenegraph';

interface Props extends React.HTMLProps<HTMLDivElement> {
    selection: Selection,
    root: RootNode,
}

export const App: FC<Props> = ({ selection, root, ...props }) => {

    console.log({ selection, root});

    return (
        <div {...props}>{selection.items.length}</div>
    );
};
