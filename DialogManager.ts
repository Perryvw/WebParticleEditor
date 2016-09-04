import Dialog from "./Dialog";
import ControllerSelect from "./Dialogs/ControllerSelect";

const DialogList: {[name: string]: any} = {
    "ControllerSelect": ControllerSelect
};

export default class DialogManager {
    static open(name: string, params: Object, callback: (result: any) => void) {
        // Create dialog element
        let element = document.createElement("div");
        element.className = "Dialog";
        // Show element
        document.body.appendChild(element);

        // Create close button
        let closeBtn = document.createElement("a");
        closeBtn.className = "DialogCloseButton";
        closeBtn.setAttribute("href", "#");
        closeBtn.appendChild(document.createTextNode("X"));
        element.appendChild(closeBtn);

        // Create content div
        let content = document.createElement("div");
        element.appendChild(content);

        // Create dialog object
        let dialog = new DialogList[name](element);

        closeBtn.addEventListener("click", function(event: MouseEvent) {
            dialog.close();
            event.preventDefault();
        });

        // Load dialog content
        let request = new XMLHttpRequest();
        // Success handler
        request.addEventListener("load", function(event: any) {
            // Set content
            content.innerHTML = event.currentTarget.responseText;

            // Center dialog
            let size = element.getBoundingClientRect();
            element.style.marginLeft = (-size.width / 2) + "px";
            element.style.marginTop = (-size.height / 2) + "px";

            // Set callback
            dialog.onResult = callback;

            // Send creation event to dialog
            dialog.onCreated(params);
        });
        // Error handler
        request.addEventListener("error", function() {
            console.error("Failed to load dialog content " + name + ".html");
            dialog.close();
        });
        request.open("GET", "Dialogs/" + name + ".html");
        request.send();
    }
}