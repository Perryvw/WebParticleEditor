/// <reference path="../../lib/gl-matrix.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../ControllerOption.ts" />
/// <reference path="../../Initializer.ts" />
import Particle from "../../Particle";

export default class PositionInSphere extends Controller implements Initializer  {

    static displayName: string = "Position In Sphere";
    static options: ControllerOption[] = [
        ControllerOption.Number("radius", "Ring radius", "radius", 100)
    ];

    initialize(particle: Particle): void {
        let vec = vec3.fromValues(Math.random(), Math.random(), Math.random());
        vec3.normalize(vec, vec);

        vec3.scale(vec, vec, Math.random() * this.param["radius"])

        particle.position = vec;
    }
}