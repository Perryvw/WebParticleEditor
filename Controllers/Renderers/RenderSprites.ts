/// <reference path="../../lib/gl-matrix.d.ts" />
/// <reference path="../../ShaderManager.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../../Renderer.ts" />
import Particle from "../../Particle";

export default class RenderSprites extends Controller implements Renderer {

    static displayName: string = "Render Sprites";
    static options: ControllerOption[] = [
    ];

    gl: WebGLRenderingContext;
    buffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext) {
        super();

        this.gl = gl;

        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        let vertices: number[] = [
            -1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }

    render(particles: Particle[], projectionMatrix: Mat4, modelViewMatrix: Mat4): void {
        let gl = this.gl;
        let shader = ShaderManager.shader["renderSprite"];

        gl.useProgram(shader);

        gl.uniformMatrix4fv(gl.getUniformLocation(shader, "projectionMatrix"), false, new Float32Array(projectionMatrix));
        gl.uniformMatrix4fv(gl.getUniformLocation(shader, "modelviewMatrix"), false, new Float32Array(modelViewMatrix));

        for (let particle of particles) {
            let modelMatrix = mat4.fromScaling(mat4.create(), vec3.fromValues(particle.radius, particle.radius, particle.radius));

            let rotation = mat4.getRotation(quat.create(), modelViewMatrix);
            quat.invert(rotation, rotation);

            let rotationTransMatrix = mat4.fromRotationTranslation(mat4.create(), rotation, particle.position);
            mat4.multiply(modelMatrix, rotationTransMatrix, modelMatrix);

            // Position/Radius uniform
            gl.uniformMatrix4fv(gl.getUniformLocation(shader, "modelMatrix"), false, new Float32Array(modelMatrix));
            // Color uniform
            gl.uniform3f(gl.getUniformLocation(shader, "color"), particle.color[0], particle.color[1], particle.color[2]);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.enableVertexAttribArray(gl.getAttribLocation(shader, "aVertexPosition"));
            gl.vertexAttribPointer(gl.getAttribLocation(shader, "aVertexPosition"), 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }


}