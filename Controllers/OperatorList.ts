// Initialiser Imports
import MovementBasic from "./Operators/MovementBasic";
import LifetimeDecay from "./Operators/LifetimeDecay";

export const OperatorList: ControllerType[] = [
	MovementBasic,
	LifetimeDecay
];

interface ControllerType extends Function {
	displayName: string;
}