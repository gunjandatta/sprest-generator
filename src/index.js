var Components = require("gd-bs").Components;
var lib = require("./lib");

// Render the title
Components.Jumbotron({
    el: document.querySelector("header"),
    title: "SharePoint REST Request Generator",
    content: "Generates the request information for the SharePoint REST API."
});

// Initialize the library
lib.init();