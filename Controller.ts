class Controller {

    static displayName: string = "[[UNNAMED CONTROLLER]]";
    static options: ControllerOption[] = [];

    param: {[key: string]: any};

    onParamChanged: (key: string, value: any) => void = function(key: string, value: any) {};

    constructor() {
        this.param = {};

        for (let option of (<ControllerType>this.constructor).options) {
            this.param[option.key] = option.defVal;
        }
    }

    // Controller reset to be overwritten
    reset() {
    }

    getButton(): HTMLDivElement {
        let elem = document.createElement("div");
        elem.className = "ControllerBtn";

        let textNode = document.createTextNode((<ControllerType>this.constructor).displayName);
        elem.appendChild(textNode);

        return elem;
    }

    populateOptions(container: HTMLElement): void {
        // Clear container
        container.innerHTML = "";

        // Add options
        for (let option of (<ControllerType>this.constructor).options) {
            let elem = option.getOptionHTML(this);
            option.onValueChanged = this.onOptionChange.bind(this);

            container.appendChild(elem);
        }
    }

    onOptionChange(key: string, value: any): void {
        this.param[key] = value;
        this.onParamChanged(key, value);
    }
}

interface ControllerType extends Function {
    displayName: string;
    options: ControllerOption[];
}