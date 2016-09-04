import Particle from "./Particle";

type ForceGenerator = any;
type Constraint = any;
type ChildController = any;

export default class ParticleSystem {

    // The list of particles currently present in the system
    particles: Particle[];

    // Controllers
    renderers: Renderer[];
    operators: Operator[];
    initializers: Initializer[];
    emitters: Emitter[];
    forceGenerators: ForceGenerator[];
    constraints: Constraint[];
    children: ChildController[];

    // Constructor
    public constructor() {
        this.particles = [];

        this.renderers = [];
        this.operators = [];
        this.initializers = [];
        this.emitters = [];
        this.forceGenerators = [];
        this.constraints = [];
        this.children = [];
    }

    // (Re)Start the simulation
    public start(): void {
        // Clear old particles
        this.particles = [];

        // Reset all controllers
        this.resetControllers();

        // Start all emitters
        for (let emitter of this.emitters) {
            emitter.start();
        }
    }

    // Stop the simulation
    public stop(endcap: boolean): void {

        // Stop all emitters
        for (let emitter of this.emitters) {
            emitter.stop();
        }

        // Immediately destroy all particles if there is no endcap
        if (!endcap) {
            this.particles = [];
        }
    }

    // Restart the particle simulation
    public restart(): void {
        this.stop(false);
        this.start();
    }

    private resetControllers() {
        for (let renderer of this.renderers) renderer.reset();
        for (let operator of this.operators) operator.reset();
        for (let initializer of this.initializers) initializer.reset();
        for (let emitter of this.emitters) emitter.reset();
    }

    // Update the particle system state
    public tick(frameTime: number): void {
        if (frameTime !== 0) {
            // Update particles
            for (let operator of this.operators) {
                operator.operate(this.particles, frameTime);
            }

            // Tick emitters
            for (let emitter of this.emitters) {
                emitter.tick(frameTime);
            }
        }
    }

    public render(gl: WebGLRenderingContext, projectionMatrix: Mat4, modelViewMatrix: Mat4): void {
        for (let renderer of this.renderers) {
            (<Renderer>renderer).render(this.particles, projectionMatrix, modelViewMatrix);
        }
    }

    // Event handler for particle spawn
    public onParticleSpawn(particle: Particle): void {
        // Remember particle
        this.particles.push(particle);

        // Run initializers
        for (let initializer of this.initializers) {
            initializer.initialize(particle);
        }
    }
}