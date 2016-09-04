type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];
type Mat4 = number[];
type Quat = [number, number, number, number];

declare interface IVec2 {

}

declare interface IVec3 {
    add(out: Vec3, vecA: Vec3, vecB: Vec3): Vec3;
    clone(vector: Vec3): Vec3;
    create(): Vec3;
    fromValues(x: number, y: number, z: number): Vec3;
    normalize(out: Vec3, vec: Vec3): Vec3;
    scale(out: Vec3, vector: Vec3, scalar: number): Vec3;
}

declare interface IVec4 {
    create(): Vec4;
}

declare interface IQuat {
    create(): Quat;
    invert(out: Quat, quat: Quat): Quat;
}

declare interface IMat4 {
    create(): Mat4;
    lookAt(out: Mat4, eye: Vec3, target: Vec3, up: Vec3): Mat4;
    perspective(out: Mat4, fov: number, aspect: number, near: number, far: number): Mat4;
    fromTranslation(out: Mat4, position: Vec3): Mat4;
    fromScaling(out: Mat4, scale: Vec3): Mat4;
    fromRotationTranslation(out: Mat4, rotation: Quat, position: Vec3): Mat4;
    multiply(out: Mat4, matrix1: Mat4, matrix2: Mat4): Mat4;
    getRotation(out: Quat, mat: Mat4): Quat;
}

declare var vec2: IVec2;
declare var vec3: IVec3;
declare var vec4: IVec4;
declare var mat4: IMat4;
declare var quat: IQuat;