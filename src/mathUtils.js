export const MATH = {
  TWOPI: Math.PI * 2
}

export function calculateGoniometerAngle(center, firstPoint, secondPoint) {
  // Angle from center to first point
  const angle1 = Math.atan2(
    firstPoint.y - center.y, 
    firstPoint.x - center.x
  );
  
  // Angle from center to second point
  const angle2 = Math.atan2(
    secondPoint.y - center.y, 
    secondPoint.x - center.x
  );

  //SMALLEST AMGLE IN RAD
  let diff = Math.abs(angle2 - angle1) % (2 * Math.PI);
  let angleRad = diff > Math.PI ? 2 * Math.PI - diff : diff;
  
  return angleRad;
}

export function calculateMidPointAngles(center, firstPoint, secondPoint) {
  // Angle from center to first point
  const angle1 = Math.atan2(
    firstPoint.y - center.y, 
    firstPoint.x - center.x
  );
  
  // Angle from center to second point
  const angle2 = Math.atan2(
    secondPoint.y - center.y, 
    secondPoint.x - center.x
  );

  return [
    angle1, angle2
  ];
}

export function getSectorCenter(center, startAngle, endAngle, radius) {

  const angle = (startAngle + endAngle) / 2;
  const sectorAngle = endAngle - startAngle;
  
  const distance = (4 * radius * Math.sin(sectorAngle / 2)) / (3 * sectorAngle);
  
  return {
    x: center.x + distance * Math.cos(angle),
    y: center.y + distance * Math.sin(angle)
  };
}

export function distBetweenTwoPoints(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}