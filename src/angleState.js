export class AngleState {
  static useDegrees = true; 

  static toDegrees = (rad) => rad * 180 / Math.PI;
  static toRadians = (deg) => deg * Math.PI / 180;

  static format(rad) {
    return this.useDegrees
      ? `${Math.round(this.toDegrees(rad))}°`
      : `${(rad / Math.PI).toFixed(2)}π`;
  }

}