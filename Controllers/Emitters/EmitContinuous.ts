/// <reference path="../../Controller.ts" />
/// <reference path="../../ControllerOption.ts" />
/// <reference path="../../Emitter.ts" />
import Particle from "../../Particle";

export default class EmitContinuous extends Controller implements Emitter  {

    static displayName: string = "Emit Continuous";
    static options: ControllerOption[] = [
        ControllerOption.Number("rate", "Emission rate", "", 50)
    ];

    callback: Function;

    spawning: boolean;
    nextSpawn = 0;

    constructor(callback: Function) {
        super();
        this.callback = callback;

        this.spawning = false;
    }

    start() {
        this.spawning = true;
    }

    stop() {
        this.spawning = false;
    }

    tick(frameTime: number) {
        if (this.spawning) {
            // Calculate spawn interval
            let interval = 1/this.param["rate"];

            // Subtract frametime from next spawn waiting time
            this.nextSpawn -= frameTime;

            // Spawn until spawn wait is positive again
            while (this.nextSpawn <= 0) {
                this.spawn();
                this.nextSpawn += interval;
            }
        }
    }

    spawn() {
        let particle = new Particle();
         this.callback(particle);
    }
}