import ParticleSystem from "./ParticleSystem";
import RenderWindow from "./RenderWindow";
import DialogManager from "./DialogManager";

// Operator lists
import { RendererList } from "./Controllers/RendererList";
import { OperatorList } from "./Controllers/OperatorList";
import { InitializerList } from "./Controllers/InitializerList";
import { EmitterList } from "./Controllers/EmitterList";


let elem = (id: string) => document.getElementById(id);

class ParticleEditor {

    previousTick: number;

    paused: boolean;

    system: ParticleSystem;
    renderWindow: RenderWindow;

    constructor() {
        this.previousTick = new Date().getTime();
        this.paused = false;
        this.system = new ParticleSystem();
        this.renderWindow = new RenderWindow(<HTMLCanvasElement>elem("canvas"));

        elem("Add1").addEventListener("click", this.onAddRenderer.bind(this));
        elem("Add2").addEventListener("click", this.onAddOperator.bind(this));
        elem("Add3").addEventListener("click", this.onAddInitializer.bind(this));
        elem("Add4").addEventListener("click", this.onAddEmitter.bind(this));

        elem("PlayBtn").addEventListener("click", (ev: MouseEvent) => { ev.preventDefault(); this.paused = false; this.system.restart(); });
        elem("PauseBtn").addEventListener("click", (ev: MouseEvent) => { ev.preventDefault(); this.paused = !this.paused; });
        elem("StopBtn").addEventListener("click", (ev: MouseEvent) => { ev.preventDefault(); this.system.stop(true); });
        elem("StopBtn2").addEventListener("click", (ev: MouseEvent) => { ev.preventDefault(); this.system.stop(false); });

        window.requestAnimationFrame(this.tick.bind(this));
    }

    onAddRenderer(event: MouseEvent) {
        DialogManager.open("ControllerSelect", { list : RendererList }, (function(result: any) {
            // Make renderer and add it to the UI
            let renderer = new result(this.renderWindow.gl);
            this.addControllerButton(renderer, elem("CList1"));
            renderer.onRemove = () => this.removeController(renderer, this.system.renderers);

            // Add renderer to particle system
            this.system.renderers.push(renderer);

            // Restart system
            this.system.restart();

            // Restart on parameter change
            renderer.onParamChanged = () => this.system.restart();
        }).bind(this));
    }

    onAddOperator(event: MouseEvent) {
        DialogManager.open("ControllerSelect", { list : OperatorList }, (function(result: any) {
            // Make renderer and add it to the UI
            let operator = new result();
            this.addControllerButton(operator, elem("CList2"));
            operator.onRemove = () => this.removeController(operator, this.system.operators);

            // Add renderer to particle system
            this.system.operators.push(operator);

            // Restart system
            this.system.restart();

            // Restart on parameter change
            operator.onParamChanged = () => this.system.restart();
        }).bind(this));
    }

    onAddInitializer(event: MouseEvent) {
        DialogManager.open("ControllerSelect", { list : InitializerList }, (function(result: any) {
            // Make renderer and add it to the UI
            let initializer = new result();
            this.addControllerButton(initializer, elem("CList3"));
            initializer.onRemove = () => this.removeController(initializer, this.system.initializers);

            // Add renderer to particle system
            this.system.initializers.push(initializer);

            // Restart system
            this.system.restart();

            // Restart on parameter change
            initializer.onParamChanged = () => this.system.restart();
        }).bind(this));
    }

    onAddEmitter(event: MouseEvent) {
        DialogManager.open("ControllerSelect", { list : EmitterList }, (function(result: any) {
            // Make renderer and add it to the UI
            let emitter = new result(this.system.onParticleSpawn.bind(this.system));
            this.addControllerButton(emitter, elem("CList4"));
            emitter.onRemove = () => this.removeController(emitter, this.system.emitters);

            // Add renderer to particle system
            this.system.emitters.push(emitter);

            // Restart system
            this.system.restart();

            // Restart on parameter change
            emitter.onParamChanged = () => this.system.restart();
        }).bind(this));
    }

    addControllerButton(controller: Controller, targetList: HTMLElement): void {        
        let button = controller.getButton();
        button.addEventListener("click", (ev: UIEvent) => this.controllerClick(ev, controller));
        targetList.appendChild(button);
    }

    removeController(controller: Controller, list: Controller[]) {
        list.splice(list.indexOf(controller), 1)
        this.system.restart();
    }

    controllerClick(ev: UIEvent, controller: Controller) {
        controller.populateOptions(elem("optionList"));
    }

    createTextBox(text: string): HTMLDivElement {
        let div = document.createElement("div");
        let textNode = document.createTextNode(text);
        div.appendChild(textNode);

        return div;
    }

    tick(): void {
        // Calculate frame time
        let time = new Date().getTime();
        let frameTime = (time - this.previousTick)/1000;
        this.previousTick = time;

        elem("fpsInfo").innerText = "FPS: " + Math.floor(1/frameTime);
        elem("particleInfo").innerText = "Particles: " + this.system.particles.length;

        // Update system state
        this.system.tick(this.paused ? 0 : frameTime);

        // Render the window
        this.renderWindow.render();

        // Render the particle system
        this.system.render(this.renderWindow.gl, this.renderWindow.projectionMatrix, this.renderWindow.modelViewMatrix);

        // Request next frame
        window.requestAnimationFrame(this.tick.bind(this));
    }
}

let editor = new ParticleEditor();