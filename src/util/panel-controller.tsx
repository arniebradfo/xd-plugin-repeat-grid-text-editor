import React from 'react';
import ReactDOM from 'react-dom';
import { Selection, RootNode } from 'scenegraph';

export default class PanelController {

    app: XdReactComponent;
    rootNode: HTMLDivElement = document.createElement('div');
    attachment?: HTMLBodyElement;

    constructor(App: XdReactComponent) {
        this.app = App;
        ["show", "hide", "update"].forEach(fn => this[fn] = this[fn].bind(this));
    }

    show = (event: UxpShowPanelEvent) => {        
        this.attachment = event.node;
        this.attachment.appendChild(this.rootNode);
    }

    hide = () => {
        this.attachment?.removeChild(this.rootNode);
    }

    update = (selection: Selection, root: RootNode) => {
        const App = this.app
        ReactDOM.render(<App selection={selection} root={root} />, this.rootNode);
    }
};

export interface XdReactComponentProps { // extends React.HTMLProps<HTMLDivElement> {
    selection: Selection,
    root: RootNode,
}
export interface XdReactComponent extends React.FC<XdReactComponentProps> {}
export interface UxpShowPanelEvent extends Event {
    node: HTMLBodyElement,
    type: 'uxpshowpanel',
    panelId: string,
}