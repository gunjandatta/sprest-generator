import { render } from "./app";

// Initialize the library
export const SPRESTGenerator = (el: HTMLElement) => {
    // Render the template to the element
    el.innerHTML = [
        '<div id="nav"></div>',
        '<div class="container-fluid">',
        '<div id="content"></div><div id="output-info"></div>',
        '</div>'
    ].join('\n');

    // Render the app
    render(el);
}

// Set the global variable
window["SPRESTGenerator"] = SPRESTGenerator;