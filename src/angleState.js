import { MATH } from "./mathUtils";

export class AngleState {
  static useDegrees = true; 

  static toDegrees = (rad) => rad * 180 / Math.PI;
  static toRadians = (deg) => deg * Math.PI / 180;

  static direction = 0;

  static angleDeg = null;
  static first = null;
  static second = null;
  static center = null;

  static zeroPoint = null;

  static rotate90() {
    this.direction = (this.direction + MATH.HALFPI + MATH.TWOPI) % (MATH.TWOPI);
    // console.log("DIR",this.direction);
  }

  static format(ang) {
    return AngleState.useDegrees ? `${AngleState.toDegrees(ang).toFixed(1)}°` : `${ang.toFixed(1)} rad`;
  }

  static text() {
    return AngleState.useDegrees ? "DEGREES" : "RADIANS";
  }

}