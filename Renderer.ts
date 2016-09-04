interface Renderer extends Controller {
    render(particles: Particle[], projectionMatrix: Mat4, modelViewMatrix: Mat4): void;
}