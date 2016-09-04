/// <reference path="../../Controller.ts" />
/// <reference path="../../ControllerOption.ts" />
/// <reference path="../../Initializer.ts" />
import Particle from "../../Particle";

export default class LifteimeRandom extends Controller implements Initializer  {

    static displayName: string = "Lifetime Random";
    static options: ControllerOption[] = [
        ControllerOption.Number("min", "Minimum lifetime", "radius", 0),
        ControllerOption.Number("max", "Maximum lifetime", "", 1),
    ];

    initialize(particle: Particle): void {
        let min = Math.min(this.param["min"], this.param["max"]);
        let max = Math.max(this.param["min"], this.param["max"]);

        particle.lifetime = min + Math.random() * (max - min);
        particle.timeLeft = particle.lifetime;
    }
}