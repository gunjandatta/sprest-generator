import { Components } from "gd-bs";
import { MainTable } from "./table";

// Renders the main app
export const render = (el: HTMLElement) => {
    // Render the menu
    Components.Nav({
        el,
        isTabs: true,
        items: [
            {
                isActive: true,
                title: "List",
                onRenderTab: (el, item) => { MainTable(el, item.title, "SP." + item.title); }
            },
            {
                title: "Navigation",
                onRenderTab: (el, item) => { MainTable(el, item.title, "navigationservicerest"); }
            },
            {
                title: "People Manager",
                onRenderTab: (el) => { MainTable(el, "PeopleManager", "peoplemanager"); }
            },
            {
                title: "People Picker",
                onRenderTab: (el) => { MainTable(el, "PeoplePicker", "peoplepicker"); }
            },
            {
                title: "Search",
                onRenderTab: (el, item) => { MainTable(el, item.title, "Microsoft.Office.Server.Search.REST.SearchService"); }
            },
            {
                title: "Site",
                onRenderTab: (el, item) => { MainTable(el, item.title, "SP." + item.title); }
            },
            {
                title: "Social Feed",
                onRenderTab: (el) => { MainTable(el, "SocialFeed", "socialfeed"); }
            },
            {
                title: "Utility",
                onRenderTab: (el, item) => { MainTable(el, item.title, "utility"); }
            },
            {
                title: "Web",
                onRenderTab: (el, item) => { MainTable(el, item.title, "SP." + item.title); }
            }
        ]
    });
}
