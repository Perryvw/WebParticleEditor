precision mediump float;

varying vec3 fragPos;

void main(void) {
    float red = (1.0 - clamp(abs(fragPos.x), 0.0, 1.0)) * fragPos.y;
    float green = (1.0 - clamp(abs(fragPos.y), 0.0, 1.0)) * fragPos.x;
    vec3 color = vec3(1.0) - red * vec3(0.0, 1.0, 1.0) - green * vec3(1.0, 0.0, 1.0);
    gl_FragColor = vec4(color, 1.0);
}