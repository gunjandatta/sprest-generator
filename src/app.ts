import { Components } from "gd-bs";
import { MainTable } from "./table";

// Renders the main app
export const render = (el: HTMLElement) => {
    let elNav: HTMLElement = el.querySelector("#nav");

    // Render the menu
    Components.Nav({
        className: "mb-3",
        el: elNav,
        isTabs: true,
        items: [
            {
                isActive: true,
                title: "List",
                onRenderTab: (item, el) => { MainTable(el, item.title, "SP." + item.title); }
            },
            {
                title: "Site",
                onRenderTab: (item, el) => { MainTable(el, item.title, "SP." + item.title); }
            },
            {
                title: "Web",
                onRenderTab: (item, el) => { MainTable(el, item.title, "SP." + item.title); }
            }
        ]
    });
}
