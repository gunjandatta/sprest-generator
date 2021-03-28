import { render } from "./app";
import "./styles.css";

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
    render(el.querySelector("#nav"));
}

// Find the target element and initialize the app
let el = document.querySelector("#request-generator") as HTMLElement;
if (el) { SPRESTGenerator(el); }