import React from 'react';
import ReactDOM from 'react-dom';
import { Selection, RootNode } from 'scenegraph';
import { App } from '../App';

export default class PanelController {

    rootNode: HTMLDivElement = document.createElement('div');
    
    attachment: any = null;

    constructor() {
        ["show", "hide", "update"].forEach(fn => this[fn] = this[fn].bind(this));
    }

    show = (event: any) => {
        this.attachment = event.node;
        this.attachment.appendChild(this.rootNode);
    }

    hide = () => {
        this.attachment.removeChild(this.rootNode);
    }

    update = (selection: Selection, root: RootNode) => {
        ReactDOM.render(<App selection={selection} root={root} />, this.rootNode);
    }
};