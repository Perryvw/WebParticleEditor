type Particle = any;

interface Operator extends Controller {
    operate(particles: Particle[], timestep: number): void;
}