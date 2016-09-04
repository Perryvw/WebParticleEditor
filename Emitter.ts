interface Emitter extends Controller {
    callback: Function;

    /**
        Start spawning.
    */
    start(): void;

    /**
        Stop emitting.
    */
    stop(): void;
    
    /**
        Advance the Emitter's internal clock.
    */
    tick(frameTime: number): void;
}