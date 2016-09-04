/// <reference path="../../lib/gl-matrix.d.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../ControllerOption.ts" />
/// <reference path="../../Operator.ts" />
import Particle from "../../Particle";

export default class MovementBasic extends Controller implements Operator {

    static displayName: string = "Movement Basic";
    static options: ControllerOption[] = [
        ControllerOption.Vec3("gravity", "Gravity", "", vec3.create())
    ];
    
    operate(particles: Particle[], timestep: number): void {
        for (let particle of particles) {
            let gravity = vec3.clone(this.param["gravity"]);
            vec3.scale(gravity, gravity, timestep);
            // Add gravity to the particle velocity
            vec3.add(particle.velocity, particle.velocity, gravity);

            // Calculate position step from velocity * frametime
            let step = vec3.clone(particle.velocity);
            vec3.scale(step, step, timestep);

            // Add step to position
            vec3.add(particle.position, particle.position, step);
        }
    }
}