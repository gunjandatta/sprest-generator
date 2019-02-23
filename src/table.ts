import { Components } from "gd-bs";
import { $REST } from "gd-sprest";
import { Mapper } from "gd-sprest/build/mapper";

/**
 * Main Table
 */
export const MainTable = (el: HTMLElement, libName: string) => {
    let isList = libName == "List";

    // Set the selected library and mapper
    let lib = $REST[libName];

    // Render the arguments
    let tbArgs = Components.InputGroup({
        el,
        placeholder: isList ? "List Name" : libName + " Url"
    });

    // Render a table
    let table = Components.Table({
        el,
        className: "mt-3",
        columns: [
            {
                name: "action",
                title: "Action"
            },
            {
                name: "args",
                title: "Arguments"
            }
        ],
        onRenderCell: (el, column) => {
            // See if this is the action
            if (column.name == "action") {
                let items: Array<Components.IDropdownItem> = [];

                // Parse the items
                let mapper = Mapper["SP." + libName];
                for (let methodName in mapper) {
                    let methodInfo = mapper[methodName];

                    // Skip the properties
                    if (methodName != "properties") {
                        // Add the item
                        items.push({
                            data: methodInfo,
                            text: methodName,
                            value: (methodInfo.argNames || []).join(', ')
                        });
                    }
                }

                // Render a dropdown
                let ddl = Components.Dropdown({
                    className: "action-ddl",
                    el,
                    items,
                    label: "Select a Property or Method",
                    onChange: (item: Components.IDropdownItem) => {
                        // Update the dropdown label
                        let label = ddl.el.querySelector(".btn.dropdown-toggle");

                        // See if an item is selected
                        if (item) {
                            // Set the label
                            label.innerHTML = item.text;
                        } else {
                            // Revert the label
                            label.innerHTML = "Select a Property or Method";
                        }
                    }
                });
            }
            // Else, this is the arguments
            else {
                // Render a textbox
                Components.InputGroup({
                    className: "action-tb",
                    el,
                    appendedButtons: [
                        {
                            onClick: () => {
                                // Display the text in a modal window
                            }
                        }
                    ]
                });
            }
        },
        rows: [{}]
    });

    // Render the generate button
    Components.Button({
        className: "mb-3",
        el,
        text: "Generate",
        onClick: () => {
            // Clear the output
            let elOutput = document.getElementById("output-info") as HTMLElement;
            while (elOutput.firstChild) { elOutput.removeChild(elOutput.firstChild); }

            // Get the lib args
            let args = [tbArgs.getValue() || ""];

            // Get the lib object
            let obj = lib.apply(null, args);

            // Get the rows
            let rows = table.el.querySelectorAll("tbody > tr");
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];

                // Get the action
                let action = row.querySelector(".action-ddl .btn").innerHTML.trim();

                // Get the action arguments
                let actionArgs = null;
                try {
                    actionArgs = JSON.parse("[" + (row.querySelector(".action-tb input") as HTMLInputElement).value + "]");
                }
                catch{ actionArgs = null; }

                // Ensure the action exists
                debugger;
                if (obj[action] && typeof (obj[action]) === "function") {
                    // Update the object
                    obj = obj[action].apply(obj, actionArgs);
                }
            }

            // Get the information
            let info = obj ? obj["getInfo"]() : null;
            if (info) {
                // Render the information
                elOutput.innerHTML = [
                    "<h3>URL:</h3>",
                    info.url.replace(/^file\:\/\//, ""),
                    "<h3>Request Type:</h3>",
                    info.method,
                    "<h3>Body:</h3>",
                ].join('\n');

                // Add the request data
                let elData = document.createElement("div");
                elData.innerText += info.data || "";
                elOutput.appendChild(elData);
            } else {
                // Render an alert
                Components.Alert({
                    header: "Error",
                    content: "Please check that the required arguments are provided."
                });
            }
        }
    });
}