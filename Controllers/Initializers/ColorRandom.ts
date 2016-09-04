/// <reference path="../../lib/gl-matrix.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../ControllerOption.ts" />
/// <reference path="../../Initializer.ts" />
import Particle from "../../Particle";

export default class ColorRandom extends Controller implements Initializer  {

    static displayName: string = "Color Random";
    static options: ControllerOption[] = [
    ];

    initialize(particle: Particle): void {
        particle.color = vec3.fromValues(Math.random(), Math.random(), Math.random());
    }
}