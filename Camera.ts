class Camera {
    position: Vec3;
    target: Vec3;
    matrix: Mat4;
    projectionMatrix: Mat4;

    fov: number = Math.PI / 2;
    near: number = 0.1;
    far: number = 1000;

    constructor() {
        this.position = vec3.fromValues(120, 120, 120);
        this.target = vec3.create();

        this.matrix = mat4.create();
        this.projectionMatrix = mat4.create();

        this.updateMatrix();
    }

    updateMatrix(): void {
        mat4.lookAt(this.matrix, this.position, this.target, vec3.fromValues(0, 0, 1));
    }

    updateProjection(aspectRatio: number) {
        mat4.perspective(this.projectionMatrix, this.fov, aspectRatio, this.near, this.far);
    }
}