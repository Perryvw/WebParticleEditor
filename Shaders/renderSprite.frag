precision mediump float;

uniform vec3 color;

varying vec3 fragPos;

void main(void) {
    gl_FragColor = vec4(color, 1.0);
}