import { editDocument } from "application";
import { Rectangle, RepeatGrid } from "scenegraph";

let panel;

// https://www.adobe.io/xd/uxp/develop/tutorials/quick-start-panel/#create-the-ui
function create() {

    function increaseRectangleSize(event) {
        console.log((document.querySelector("#txtV") as HTMLInputElement).value);
        
        // // [2]
        // const height = Number((document.querySelector("#txtV") as HTMLInputElement).value); // [4]
        // const width = Number((document.querySelector("#txtH") as HTMLInputElement).value); // [5]

        // // [6]
        // editDocument({ editLabel: "Increase rectangle size" }, function (
        //     selection
        // ) {
        //     const selectedRectangle = selection.items[0] as Rectangle; // [7]
        //     selectedRectangle.width = width; // [8]
        //     selectedRectangle.height = height;
        // });
    }

    panel = document.createElement("div"); // [9]
    panel.innerHTML = html; // [10]
    // (panel.querySelector("textarea") as HTMLTextAreaElement).addEventListener("input", increaseRectangleSize); // [11]

    return panel; // [12] 
}

// [1]
const html = // html
    `<style>
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
        width:90%;
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
    }
</style>

<form method="dialog" id="main">
    <div class="row break">
        <sp-textarea class="textarea" placeholder="edit it" multiline="true" >
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
function update(selection) {
    // [1]
    const form = document.querySelector("form"); // [3]
    const warning = document.querySelector("#warning"); // [4]

    if (!selection || !(selection.items[0] instanceof RepeatGrid)) {
        // [5]
        form.className = "hide";
        warning.className = "show";
    } else {
        form.className = "show";
        warning.className = "hide";
    }
}
export const textDataSeriesEditor = {
    show,
    update
}
