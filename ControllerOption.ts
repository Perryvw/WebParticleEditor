enum ControllerOptionType {
    Boolean,
    Number,
    Vec3
}

class ControllerOption {
    type: ControllerOptionType;

    key: string;
    name: string;
    description: string;
    defVal: any;

    onValueChanged: (key: string, value: any) => void;

    constructor(type: ControllerOptionType, key: string, name: string, description: string, defVal: any) {
        this.type = type;
        this.key = key;
        this.name = name;
        this.description = description;
        this.defVal = defVal;

        this.onValueChanged = function(){};
    }

    getOptionHTML(controller: Controller): HTMLElement {
        let node = document.createElement("div");
        node.className = "ControllerOption";

        let text = document.createTextNode(this.name);
        node.appendChild(text);

        switch(this.type) {
            case ControllerOptionType.Boolean:
                let tick = document.createElement("input");
                tick.className = "ControllerOptionTick";
                tick.setAttribute("type", "checkbox");
                tick.checked = controller.param[this.key];

                tick.addEventListener("change", () => this.onValueChanged(this.key, tick.checked));

                node.appendChild(tick);
                break;
            case ControllerOptionType.Number:
                let inp = document.createElement("input");
                inp.className = "ControllerOptionNumber";
                inp.setAttribute("type", "number");
                inp.value = controller.param[this.key];

                inp.addEventListener("change", () => this.onValueChanged(this.key, parseInt(inp.value)));

                node.appendChild(inp);
                break;
            case ControllerOptionType.Vec3:
                let inp1 = document.createElement("input");
                inp1.className = "ControllerOptionVectorComponent";
                inp1.setAttribute("type", "number");
                inp1.value = controller.param[this.key][0];

                let inp2 = document.createElement("input");
                inp2.className = "ControllerOptionVectorComponent";
                inp2.setAttribute("type", "number");
                inp2.value = controller.param[this.key][1];

                let inp3 = document.createElement("input");
                inp3.className = "ControllerOptionVectorComponent";
                inp3.setAttribute("type", "number");
                inp3.value = controller.param[this.key][2];

                let callback = function() {
                    let vec = vec3.create();
                    try {
                        vec[0] = parseInt(inp1.value);
                        vec[1] = parseInt(inp2.value);
                        vec[2] = parseInt(inp3.value);
                    } catch (e) {
                    }

                    this.onValueChanged(this.key, vec);
                }

                inp1.addEventListener("change", callback.bind(this));
                inp2.addEventListener("change", callback.bind(this));
                inp3.addEventListener("change", callback.bind(this));

                node.appendChild(inp3);
                node.appendChild(inp2);
                node.appendChild(inp1);

                break;
            default:
                console.error("Unknown controller option type for option " + this.key);
        }

        return node;
    }

    static Boolean(key: string, name: string, description: string, defVal: any) {
        return new ControllerOption(ControllerOptionType.Boolean, key, name, description, defVal);
    }

    static Number(key: string, name: string, description: string, defVal: any) {
        return new ControllerOption(ControllerOptionType.Number, key, name, description, defVal);
    }

    static Vec3(key: string, name: string, description: string, defVal: any) {
        return new ControllerOption(ControllerOptionType.Vec3, key, name, description, defVal);
    }
}