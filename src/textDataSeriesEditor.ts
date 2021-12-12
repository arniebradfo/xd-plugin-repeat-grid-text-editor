import { editDocument } from "application";
import { Rectangle, RepeatGrid } from "scenegraph";
import { createTextDataSeries } from "./createTextDataSeries";

// globals?
let panel: HTMLDivElement;
let repeatGridTextObjects;

// https://www.adobe.io/xd/uxp/develop/tutorials/quick-start-panel/#create-the-ui
function create() {

    function textUpdated(event) {
        console.log(event.target.value);
        // console.log(repeatGridTextObjects);
        // repeatGridTextObjects.repeatGridTextDataSeries[0].textDataSeries.join('\n')
        const { node } = repeatGridTextObjects.repeatGridTextDataSeries[0]
        const textDataSeries = event.target.value.split('\n').map(line => line === '' ? ' ' : line);
        console.log(textDataSeries);

        editDocument({ editLabel: 'edit-text' }, selection => {
            repeatGridTextObjects.repeatGrid.attachTextDataSeries(node, textDataSeries)
        })

    }

    panel = document.createElement("div"); // [9]
    panel.innerHTML = html; // [10]
    (panel.querySelector("#text-editor") as HTMLTextAreaElement).addEventListener("input", textUpdated); // [11]

    return panel; // [12] 
}

// [1]
const style = // css
    `
.break {
    flex-wrap: wrap;
}
label.row > span {
    color: #8E8E8E;
    width: 20px;
    text-align: right;
    font-size: 9px;
}
label.row input {
    flex: 1 1 auto;
}
form {
    width: 100%;
    padding: 0px;
}
.show {
    display: block;
}
.hide {
    display: none;
}
.textarea{
    resize: vertical;
    height: 500px;
    width: 100%;
}
`
const html = // html
    `
<style>${style}</style>

<form method="dialog" id="main">
    <div class="row break">
        <sp-textarea class="textarea" id="text-editor" placeholder="edit it" multiline="true" >
            <sp-label slot="label">{Text Field Name}</sp-label>
        </sp-textarea>
    </div>
</form>

<p id="warning">Select a Repeat Grid</p>    
`;

// https://www.adobe.io/xd/uxp/develop/tutorials/quick-start-panel/#show-the-ui
function show(event) {
    // [1]
    if (!panel) event.node.appendChild(create()); // [2]
}

// https://www.adobe.io/xd/uxp/develop/tutorials/quick-start-panel/#update-your-ui
function update(selection, root) {
    // [1]
    const form = document.querySelector("form"); // [3]
    const warning = document.querySelector("#warning"); // [4]

    if (!selection || !(selection.items[0] instanceof RepeatGrid)) {
        // [5]
        form.className = "hide";
        warning.className = "show";
        repeatGridTextObjects = undefined
    } else {
        form.className = "show";
        warning.className = "hide";
        if (!repeatGridTextObjects) {
            repeatGridTextObjects = createTextDataSeries(selection, root);
            (panel.querySelector("#text-editor") as HTMLTextAreaElement).value = repeatGridTextObjects.repeatGridTextDataSeries[0].textDataSeries.join('\n')
        }
    }


}

export const textDataSeriesEditor = {
    show,
    update
}
