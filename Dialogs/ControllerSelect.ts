import Dialog from "../Dialog";

export default class ControllerSelect extends Dialog {
    onCreated(params: {list: ControllerType[]}) {
        let list = document.getElementById("SelectList");
        for (let controller of params.list) {
            let option = document.createElement("a");
            option.className = "ControllerSelectOption";
            option.setAttribute("href", "#");
            option.appendChild(document.createTextNode(controller.displayName));

            option.addEventListener("click", (event: MouseEvent) => this.onOptionClick(event, controller));

            list.appendChild(option);
        }
    }

    onOptionClick(event: MouseEvent, controller: ControllerType) {
        this.result(controller);
        this.close();
        event.preventDefault();
    }
}

interface ControllerType extends Function {
    displayName: string;
    options: ControllerOption[];
}