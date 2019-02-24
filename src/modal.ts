import { Components } from "gd-bs";

/**
 * Modal
 */
export const Modal = (args: string, onClose: (args: string) => void) => {
    let tb: Components.IFormControl = null;

    // Create a modal dialog element
    let el = document.querySelector("#modal-dlg");
    if (el == null) {
        // Create the element
        el = document.createElement("div");
        el.id = "modal-dlg";
        document.body.appendChild(el);
    }

    // Create the modal
    let modal = Components.Modal({
        el,
        isLarge: true,
        title: "Arguments",
        onClose: () => {
            // Call the event
            onClose(tb.getValue());

            // Remove the element
            document.body.removeChild(el);
        },
        onRenderBody: (el) => {
            // Render a textbox
            tb = Components.FormControl({
                el,
                type: Components.FormControlTypes.TextArea,
                value: args
            });
        }
    });

    // Display the modal
    modal.show();
}