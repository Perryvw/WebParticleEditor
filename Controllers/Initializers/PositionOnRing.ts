/// <reference path="../../Controller.ts" />
/// <reference path="../../Initializer.ts" />
import Particle from "../../Particle";

export default class PositionOnRing extends Controller implements Initializer  {

    static displayName: string = "Position On Ring";
    static options: ControllerOption[] = [
        ControllerOption.Number("radius", "Ring radius", "radius", 100),
        ControllerOption.Number("amount", "Amount in ring", "", 100),
        ControllerOption.Boolean("uniform", "Uniform distribution", "uniform", false)
    ];

    index: number = 0;

    initialize(particle: Particle): void {
        let angle = this.param["uniform"] ? 2 * Math.PI * (this.index++)/(this.param["amount"]): Math.random() * Math.PI * 2;
        let radius = parseInt(this.param["radius"]);
        particle.position = vec3.fromValues(radius * Math.cos(angle), radius * Math.sin(angle), 0);
    }

    reset() {
        this.index = 0;
    }
}