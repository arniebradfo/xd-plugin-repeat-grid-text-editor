import React from 'react';
import ReactDOM from 'react-dom';
import { Selection, RootNode } from 'scenegraph';

export default class PanelController {

    app: XdReactApp;
    rootNode: HTMLDivElement = document.createElement('div');
    attachment?: HTMLBodyElement;

    constructor(App: XdReactApp) {
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

export interface XdReactAppProps { // extends React.HTMLProps<HTMLDivElement> {
    selection: Selection,
    root: RootNode,
}
export interface XdReactApp extends React.FC<XdReactAppProps> {}
export interface UxpShowPanelEvent extends Event {
    node: HTMLBodyElement,
    type: 'uxpshowpanel',
    panelId: string,
}