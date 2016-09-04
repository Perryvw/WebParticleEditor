// Initialiser Imports
import PositionOnRing from "./Initializers/PositionOnRing";
import PositionInSphere from "./Initializers/PositionInSphere";
import LifetimeRandom from "./Initializers/LifetimeRandom";
import ColorRandom from "./Initializers/ColorRandom";
import RadiusRandom from "./Initializers/RadiusRandom";

export const InitializerList: ControllerType[] = [
	PositionOnRing,
	PositionInSphere,
	LifetimeRandom,
	ColorRandom,
	RadiusRandom
];

interface ControllerType extends Function {
	displayName: string;
}