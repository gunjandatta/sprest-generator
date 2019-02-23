// Load the library
var Components = require("gd-bs").Components;
var $REST = require("gd-sprest");

// Export the library function
module.exports = function () {
    var ddlLib = null;
    var ddlLibProps = null;
    var tbLibArgs = null;
    var tbLibPropArgs = null;

    var init = function () {
        // Render the dropdown
        ddlLib = Components.Dropdown({
            el: document.getElementById("lib-ddl"),
            placeholder: "Library",
            items: [
                {
                    text: "List",
                    value: "List"
                }
            ],
            onChange: function (item, el) {
                // Get the mapper value
                var lib = $REST[item.value]("List");

                // Render the args
                tbLibArgs = Components.InputGroup({
                    el: document.getElementById("lib-args"),
                    placeholder: item.text + " Arguments:",
                    type: Components.InputGroupTypes.TextField
                });

                // Parse the lib
                var items = [];
                for (let key in lib) {
                    // Ensure this is a function
                    if (typeof (lib[key]) === "function") {
                        // Add the item
                        items.push({ text: key });
                    }
                }

                // Render the properties dropdown
                ddlLibProps = Components.Dropdown({
                    el: document.getElementById("lib-props"),
                    items,
                    placeholder: item.text + " Properties"
                });

                // Render the property arguments
                tbLibPropArgs = Components.InputGroup({
                    el: document.getElementById("lib-prop-args"),
                    placeholder: item.text + " Arguments:",
                    type: Components.InputGroupTypes.TextArea
                });
            }
        });

        // Render the generate button
        Components.Button({
            el: document.getElementById("output-btn"),
            text: "Generate",
            onClick: () => {
                // Clear the content
                var elContent = document.getElementById("output-content");
                elContent.innerHTML = "";

                // Get the selected method
                var method = ddlLib.getValue();
                method = method ? method.value : null;

                // Get the method arguments
                var methodArgs = tbLibArgs.getValue();
                methodArgs = methodArgs ? [methodArgs] : [];

                // Get the selected property
                var prop = ddlLibProps.getValue();
                prop = prop ? prop.text : null;

                // Get the selected property arguments
                var propArgs = null;
                try { propArgs = JSON.parse("[" + tbLibPropArgs.getValue() + "]") } catch { propArgs = [] }

                // Get the $REST object
                var obj = $REST[method].apply(null, methodArgs);
                obj = obj[prop].apply(obj, propArgs);
                if (obj) {
                    // Get the information
                    var info = obj.getInfo();

                    // Render the information
                    elContent.innerHTML = [
                        "<h5>Url</h5>",
                        info.url.replace("file://", ""),
                        "<h5>Method</h5>",
                        info.method,
                        "<h5>Body</h5>",
                        info.data || ""
                    ].join('\n');
                }
            }
        });
    }

    return {
        init
    };
}();
