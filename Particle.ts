export default class Particle {

    color: Vec3;
    lifetime: number;
    orientation: Quat;
    position: Vec3;
    radius: number;
    velocity: Vec3;

    timeLeft: number;

    constructor() {
        this.color = vec3.fromValues(1, 1, 1);
        this.lifetime = 0;
        this.orientation = quat.create();
        this.position = vec3.create();
        this.radius = 1;
        this.velocity = vec3.create();

        this.timeLeft = 0;
    }
}