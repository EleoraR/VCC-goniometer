export class AngleState {
  static useDegrees = true; 

  static toDegrees = (rad) => rad * 180 / Math.PI;
  static toRadians = (deg) => deg * Math.PI / 180;

}