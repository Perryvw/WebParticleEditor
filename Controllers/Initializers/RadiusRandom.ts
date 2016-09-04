/// <reference path="../../Controller.ts" />
/// <reference path="../../ControllerOption.ts" />
/// <reference path="../../Initializer.ts" />
import Particle from "../../Particle";

export default class RadiusRandom extends Controller implements Initializer  {

    static displayName: string = "Radius Random";
    static options: ControllerOption[] = [
        ControllerOption.Number("min", "Minimum radius", "radius", 1),
        ControllerOption.Number("max", "Maximum radius", "", 2),
    ];

    initialize(particle: Particle): void {
        let min = Math.min(this.param["min"], this.param["max"]);
        let max = Math.max(this.param["min"], this.param["max"]);

        particle.radius = min + Math.random() * (max - min);
    }
}