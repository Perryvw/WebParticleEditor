attribute vec3 aVertexPosition;

uniform mat4 projectionMatrix;
uniform mat4 modelviewMatrix;

varying vec3 fragPos;

void main(void) {
    fragPos = aVertexPosition;
    gl_Position = projectionMatrix * modelviewMatrix * vec4(aVertexPosition, 1.0);
}