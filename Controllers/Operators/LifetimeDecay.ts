/// <reference path="../../lib/gl-matrix.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../ControllerOption.ts" />
/// <reference path="../../Operator.ts" />
import Particle from "../../Particle";

export default class LifetimeDecay extends Controller implements Operator {

    static displayName: string = "Lifetime Decay";
    static options: ControllerOption[] = [
    ];
    
    operate(particles: Particle[], timestep: number): void {
        let remove: number[] = [];

        for (let key = 0; key < particles.length; key++) {
            let particle = particles[key];
            particle.timeLeft -= timestep;

            if (particle.timeLeft <= 0) {
                remove.push(key);
            }
        }

        let offset = 0;
        for (let index of remove) {
            particles.splice(index - offset++, 1);
        }
    }
}