// Initialiser Imports
import EmitInstant from "./Emitters/EmitInstant";
import EmitContinuous from "./Emitters/EmitContinuous";

export const EmitterList: ControllerType[] = [
    EmitInstant,
    EmitContinuous
];

interface ControllerType extends Function {
    displayName: string;
}