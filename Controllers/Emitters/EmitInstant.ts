/// <reference path="../../Controller.ts" />
/// <reference path="../../Emitter.ts" />
import Particle from "../../Particle";

export default class EmitInstant extends Controller implements Emitter  {

    static displayName: string = "Emit Instantly";
    static options: ControllerOption[] = [
        ControllerOption.Number("amount", "Amount", "", 30)
    ];

    callback: Function;

    constructor(callback: Function) {
        super();
        this.callback = callback;
    }

    start() {
        for (let i = 0; i < this.param["amount"]; i++) {
            let particle = new Particle();
            this.callback(particle);
        }
    }

    stop() {
    }

    tick(frameTime: number) {
    }
}