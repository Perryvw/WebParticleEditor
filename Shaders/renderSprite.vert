attribute vec3 aVertexPosition;

uniform mat4 projectionMatrix;
uniform mat4 modelviewMatrix;

uniform mat4 modelMatrix;

varying vec3 fragPos;

void main(void) {
    fragPos = aVertexPosition;
    gl_Position = projectionMatrix * modelviewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
}