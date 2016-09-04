import ParticleSystem from "./ParticleSystem";

export default class RenderWindow {
    canvas: HTMLElement;
    gl: WebGLRenderingContext;

    width: number = 0;
    height: number = 0;

    camera: Camera;

    gridBuffer: WebGLBuffer;

    ready: boolean;

    // Scene matrices
    projectionMatrix: Mat4;
    modelViewMatrix: Mat4;

    constructor(element: HTMLCanvasElement) {
        this.canvas = element;
        this.gl = <WebGLRenderingContext>element.getContext("webgl");

        // Set canvas size
        this.updateSize();

        // Listen for future resizes
        window.addEventListener("resize", this.onResize.bind(this));

        // Init GL
        this.initGL(this.gl);
        this.camera = new Camera();
        this.camera.updateProjection(this.width / this.height);

        // Set ready to false - we are not ready to render yet
        this.ready = false;

        this.initBuffer(this.gl);

        ShaderManager.init(this.gl, (function() {
            this.ready = true;
        }).bind(this));
    }

    onResize(event: UIEvent): void {
        // Set canvas size
        this.updateSize();

        // Update camera
        this.camera.updateProjection(this.width / this.height);
    }

    updateSize() {
        this.width = window.innerWidth - 600;
        this.height = window.innerHeight - 35;

        this.canvas.setAttribute("width", this.width.toString());
        this.canvas.setAttribute("height", this.height.toString());
    }

    initBuffer(gl: WebGLRenderingContext) {
        this.gridBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.gridBuffer);

        let vertices: number[] = [];

        // Generate grid
        for (let i = 0; i < 11; i++) {
            let j = i - 5;
            vertices = vertices.concat([j * 20, 100, 0, j * 20, -100, 0]);
        }
        for (let i = 0; i < 11; i++) {
            let j = i - 5;
            vertices = vertices.concat([100, j * 20, 0, -100, j * 20, 0]);
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }

    initGL(gl: WebGLRenderingContext): void {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        this.render();
    }

    render(): void {
        // Only render when ready
        if (!this.ready) return;

        let gl = this.gl;

        // Set viewport and clear buffers
        gl.viewport(0, 0, this.width, this.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.projectionMatrix = this.camera.projectionMatrix;
        this.modelViewMatrix = this.camera.matrix;

        // Draw the grid
        this.drawGrid(this.gl);
    }

    drawGrid(gl: WebGLRenderingContext): void {
        // Set shader
        let shader = ShaderManager.shader["grid"];

        gl.useProgram(shader);

        // Load scene matrices to uniforms
        gl.uniformMatrix4fv(gl.getUniformLocation(shader, "projectionMatrix"), false, new Float32Array(this.projectionMatrix));
        gl.uniformMatrix4fv(gl.getUniformLocation(shader, "modelviewMatrix"), false, new Float32Array(this.modelViewMatrix));

        // Draw grid lines
        gl.bindBuffer(gl.ARRAY_BUFFER, this.gridBuffer);
        gl.enableVertexAttribArray(gl.getAttribLocation(shader, "aVertexPosition"));
        gl.vertexAttribPointer(gl.getAttribLocation(shader, "aVertexPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINES, 0, 44);
    }
}