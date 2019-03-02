import { Components } from "gd-bs";
import { $REST } from "gd-sprest";
import { Mapper, Mapper_Old } from "gd-sprest/build/mapper";
import { Modal } from "./modal";

/**
 * Main Table
 */
export const MainTable = (el: HTMLElement, libName: string, libType: string) => {
    let isList = libName == "List";

    // Set the selected library and mapper
    let lib = $REST[libName];

    // Render the web url
    let tbWebUrl = Components.InputGroup({
        el,
        placeholder: "Site Url"
    });

    // See if this is a list
    let tbListName: Components.IInputGroup = null;
    if (isList) {
        tbListName = Components.InputGroup({
            el,
            placeholder: "List Name"
        });
    }

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
                let mapper = Mapper[libType] || Mapper_Old[libType];

                // Ensure the mapper exists
                if (mapper == null) { return; }

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
                let tb = Components.InputGroup({
                    className: "action-tb",
                    el,
                    appendedButtons: [{
                        text: "Popout",
                        type: Components.ButtonTypes.Secondary,
                        onClick: () => {
                            // Display the args in a modal
                            Modal(tb.getValue(), (args) => {
                                // Update the text box
                                tb.setValue(args);
                            });
                        }
                    }]
                });
            }
        }
    });

    // Add a blank row
    table.addRows([{ libName, libType }]);

    // Method to get the information
    let getInfo = () => {
        let obj = null;
        let webUrl = tbWebUrl.getValue() || "";

        // See if this is a list
        if (isList) {
            // Set the lib object
            obj = $REST.Web(webUrl).Lists(tbListName.getValue() || "");
        } else {
            // Set the lib object
            obj = lib.apply(null, [webUrl]);
        }

        // Get the rows
        let rows = table.el.querySelectorAll("tbody > tr");
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];

            // Get the action
            let action: any = row.querySelector(".action-ddl .btn");
            action = action ? action.innerHTML.trim().split('(')[0] : null;

            // Ensure the action exists
            if (action == null || action == "Select a Property or Method") { break; }

            // Get the action arguments
            let actionArgs = null;
            try {
                // Convert the value to an array
                actionArgs = (new Function("var i = [" + (row.querySelector(".action-tb input") as HTMLInputElement).value + " ]; return i;"))();
            }
            catch{ actionArgs = null; }

            // Ensure the action exists
            if (obj[action] && typeof (obj[action]) === "function") {
                // Update the object
                obj = obj[action].apply(obj, actionArgs);
            }
        }

        // Return the information
        return obj ? obj["getInfo"]() : null;
    }

    // Render the generate button
    Components.Button({
        className: "mb-3",
        el,
        text: "Generate",
        onClick: () => {
            // Clear the output
            let elOutput = document.getElementById("output-info") as HTMLElement;
            while (elOutput.firstChild) { elOutput.removeChild(elOutput.firstChild); }

            // Get the information
            let info = null;
            try { info = getInfo(); }
            catch { }

            // Ensure it exists
            if (info) {
                // Parse the header information
                let headers = [];
                for (let key in info.headers) {
                    // Add the header
                    headers.push(key + ": " + info.headers[key]);
                }

                // Render the information
                elOutput.innerHTML = [
                    "<h3>URL:</h3>",
                    "<p>" + info.url.replace(/^file\:\/\//, "") + "</p>",
                    "<h3>Header</h3>",
                    "<p>" + headers.join("</p><p>") + "</p>",
                    "<h3>Body:</h3>",
                ].join('\n');

                // Add the request data
                let elData = document.createElement("p");
                elData.innerText += info.data || "";
                elOutput.appendChild(elData);
            } else {
                // Render an alert
                Components.Alert({
                    el: elOutput,
                    type: Components.AlertTypes.Danger,
                    header: "Error w/ Arguments",
                    content: "The arguments provided are not in the correct format."
                });
            }
        }
    });
}