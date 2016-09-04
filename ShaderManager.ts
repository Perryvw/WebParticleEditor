type ShaderData = {name: string, path: string, fragment: boolean};

class ShaderManager {
    static shaders: ShaderData[] = [
        {name : "grid", path : "Shaders/grid.vert", fragment : false},
        {name : "grid", path : "Shaders/grid.frag", fragment : true},

        {name : "renderSprite", path : "Shaders/renderSprite.vert", fragment : false},
        {name : "renderSprite", path : "Shaders/renderSprite.frag", fragment : true}
    ];

    static toLoad: number;
    static callback: Function;
    static shader: {[name: string]: WebGLProgram};
    static shaderSource: {[name: string]: string};

    static gl: WebGLRenderingContext;

    static init(gl: WebGLRenderingContext, callback: Function): void {
        this.toLoad = this.shaders.length;
        this.callback = callback;

        this.shader = {};
        this.shaderSource = {};

        this.gl = gl;

        for (let shader of this.shaders) {
            let request = new XMLHttpRequest();
            request.addEventListener("load", (event) => this.onLoad(shader, event));
            request.addEventListener("error", (event) => this.onError(shader, event));
            request.open("GET", shader.path);
            request.send();
        }
    }

    static createShader(name: string, vertexSource: string, fragmentSource: string) {
        let vShader = this.compileProgram(this.gl, vertexSource, false);
        let fShader = this.compileProgram(this.gl, fragmentSource, true);

        let program = this.gl.createProgram();
        this.gl.attachShader(program, vShader);
        this.gl.attachShader(program, fShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error("Could not link shader: " + name);
        }

        this.shader[name] = program;
        console.log("Successfully loaded shader '" + name + "'.");
    }

    static compileProgram(gl: WebGLRenderingContext, source: string, fragment: boolean) {
        let shader = fragment ? gl.createShader(gl.FRAGMENT_SHADER) : gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    static onLoad(shader: ShaderData, event: any) {
        this.toLoad--;

        if (this.shaderSource[shader.name] === undefined) {
            this.shaderSource[shader.name] = event.currentTarget.responseText;
        } else {
            let vertexSource = shader.fragment ? this.shaderSource[shader.name] : event.currentTarget.responseText;
            let fragmentSource = !shader.fragment ? this.shaderSource[shader.name] : event.currentTarget.responseText;

            this.createShader(shader.name, vertexSource, fragmentSource);
        }

        if (this.toLoad === 0) this.onLoadComplete();
    }

    static onError(shader: ShaderData, event: any) {
        console.error("Error loading shader " + shader.path);
        this.toLoad--;

        if (this.toLoad === 0) this.onLoadComplete();
    }

    static onLoadComplete() {
        this.callback();
    }
}