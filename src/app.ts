import { Components } from "gd-bs";
import { MainTable } from "./table";

// Renders the main app
export const render = (el: HTMLElement) => {
    let elNav: HTMLElement = el.querySelector("#nav");
    let elContent: HTMLElement = el.querySelector("#content");

    // Render the menu
    Components.Navbar({
        className: "mb-3",
        el: elNav,
        brand: "$REST Generator",
        type: Components.NavbarTypes.Dark,
        items: [
            { text: "List" },
            { text: "Web" },
            { text: "Site" }
        ],
        onClick: (item) => {
            // Clear the content
            while (elContent.firstChild) { elContent.removeChild(elContent.firstChild); }

            // Render the content
            MainTable(elContent, item.text);
        }
    });

    // Render the content
    MainTable(elContent, "List");
}
