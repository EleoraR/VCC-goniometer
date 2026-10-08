export class AngleState {
  static useDegrees = true; 

  static toDegrees = (rad) => rad * 180 / Math.PI;
  static toRadians = (deg) => deg * Math.PI / 180;

  static format(ang) {
    return AngleState.useDegrees ? `${AngleState.toDegrees(ang).toFixed(1)}°` : `${ang.toFixed(1)} rad`;
  }

  static text() {
    return AngleState.useDegrees ? "Degrees" : "Radians";
  }

}