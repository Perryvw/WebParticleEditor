// Initialiser Imports
import RenderSprites from "./Renderers/RenderSprites";

export const RendererList: ControllerType[] = [
    RenderSprites
];

interface ControllerType extends Function {
    displayName: string;
}