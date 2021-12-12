// import { editDocument } from "application";
// import { RepeatGrid } from "scenegraph";
// import { createTextDataSeries, RepeatGridTextDataSeries } from "./createTextDataSeries";
import './react-shim'
import React from 'react';
// import ReactDOM from 'react-dom';

// globals?
let panel: HTMLDivElement;
// let repeatGridTextObjects: RepeatGridTextDataSeries | undefined;

// https://www.adobe.io/xd/uxp/develop/tutorials/quick-start-panel/#create-the-ui
function create() {
    
    panel = document.createElement("div"); // [9]
    // ReactDOM.render(<App />, panel);

    console.log(panel);
    
    return panel;
}

const App = (props) => (<span>Working</span>);

// https://www.adobe.io/xd/uxp/develop/tutorials/quick-start-panel/#show-the-ui
function show(event) {
    if (!panel) event.node.appendChild(create()); // [2]
}

// https://www.adobe.io/xd/uxp/develop/tutorials/quick-start-panel/#update-your-ui
function update(selection, root) {

}

export const textDataSeriesEditor = {
    show,
    update
}
