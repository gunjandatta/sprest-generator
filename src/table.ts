import { Components } from "gd-bs";
import { $REST } from "gd-sprest";
import { Mapper } from "gd-sprest/build/mapper";

/**
 * Main Table
 */
export const MainTable = (el: HTMLElement, libName: string, libType: string) => {
    let isList = libName == "List";

    // Set the selected library and mapper
    let lib = $REST[libName];

    // Render the arguments
    let tbArgs = Components.InputGroup({
        el,
        placeholder: isList ? "List Name" : libName + " Url"
    });

    // Method to clear the child rows
    let clearChildRows = (el: HTMLElement) => {
        // Get the parent row
        let row = el.parentElement;
        while (row && row.nodeName != "TR") { row = row.parentElement; }

        // Ensure the row was found
        if (row) {
            // Get the index
            let idx = parseInt(row.getAttribute("data-idx"));

            // Get the rows
            let rows = table.el.querySelectorAll("tbody > tr");
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];

                // See if this row is below this row
                if (parseInt(row.getAttribute("data-idx")) > idx) {
                    // Remove this row
                    row.parentElement.removeChild(row);
                }
            }
        }
    }

    // Render a table
    let table = Components.Table({
        el,
        className: "mt-3",
        columns: [
            {
                name: "type",
                title: "Type"
            },
            {
                name: "method",
                title: "Method"
            },
            {
                name: "args",
                title: "Arguments"
            }
        ],
        onRenderCell: (el, column, data) => {
            let { libName, libType } = data;

            // See if this is the method
            if (column.name == "method") {
                let items: Array<Components.IDropdownItem> = [];
                let mapper = Mapper[libType];

                // See if properties exist
                if (mapper["properties"]) {
                    // Add a header
                    items.push({ text: "Properties", isHeader: true });

                    // Parse the properties
                    for (let i = 0; i < mapper["properties"].length; i++) {
                        let prop = mapper["properties"][i];

                        let info = prop.split('|');
                        let name = info[0];
                        let hasType = info.length > 1;
                        let hasFunc = info.length > 2;

                        // See if a type exists
                        if (hasType) {
                            // Add the property
                            items.push({
                                text: name,
                                data: { returnType: info[1] }
                            });
                        }

                        // See if sub-function exists
                        if (hasFunc) {
                            // Add the property
                            items.push({
                                text: name + "(arg)",
                                data: { argNames: ["arg"], returnType: info[3] }
                            });
                        }
                    }

                    // Add a header
                    items.push({ text: "Methods", isHeader: true });
                }

                // Parse the items
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
                    onChange: (item: Components.IDropdownItem, ev) => {
                        // Update the dropdown label
                        let label = ddl.el.querySelector(".btn.dropdown-toggle");

                        // Clear the child rows
                        clearChildRows(ev.currentTarget as HTMLElement);

                        // See if an item is selected
                        if (item) {
                            let methodInfo = item.data;

                            // Set the label
                            label.innerHTML = item.text

                            // See if this is not a function
                            if (item.text.indexOf('(') < 0) {
                                // Update the label
                                label.innerHTML += "(" + (methodInfo.argNames || []).join(', ') + ")";
                            }

                            // See if the method info has a type
                            if (methodInfo.returnType) {
                                // Get the name
                                let name = methodInfo.returnType.split('.');
                                name = name[name.length - 1];

                                // Add the row
                                table.addRows([{ libName: name, libType: methodInfo.returnType }]);
                            }
                        } else {
                            // Revert the label
                            label.innerHTML = "Select a Property or Method";
                        }
                    }
                });
            }
            // Else, see if this is the type
            else if (column.name == "type") {
                // Set the type
                el.innerHTML = libType;
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
        }
    });

    // Add a blank row
    table.addRows([{ libName, libType }]);

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
                let action = row.querySelector(".action-ddl .btn").innerHTML.trim().split('(')[0];

                // Get the action arguments
                let actionArgs = null;
                try {
                    // Convert the value to an array
                    actionArgs = (new Function("var i = [" + (row.querySelector(".action-tb input") as HTMLInputElement).value + " ]; return i;"))();
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