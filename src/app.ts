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
                title: "Navigation",
                onRenderTab: (item, el) => { MainTable(el, item.title, "navigationservicerest"); }
            },
            {
                title: "People Manager",
                onRenderTab: (item, el) => { MainTable(el, "PeopleManager", "peoplemanager"); }
            },
            {
                title: "People Picker",
                onRenderTab: (item, el) => { MainTable(el, "PeoplePicker", "peoplepicker"); }
            },
            {
                title: "Search",
                onRenderTab: (item, el) => { MainTable(el, item.title, "Microsoft.Office.Server.Search.REST.SearchService"); }
            },
            {
                title: "Site",
                onRenderTab: (item, el) => { MainTable(el, item.title, "SP." + item.title); }
            },
            {
                title: "Social Feed",
                onRenderTab: (item, el) => { MainTable(el, "SocialFeed", "socialfeed"); }
            },
            {
                title: "Utility",
                onRenderTab: (item, el) => { MainTable(el, item.title, "utility"); }
            },
            {
                title: "Web",
                onRenderTab: (item, el) => { MainTable(el, item.title, "SP." + item.title); }
            }
        ]
    });
}
