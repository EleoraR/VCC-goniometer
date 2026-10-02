import {calculateMidPointAngles, getSectorCenter, MATH} from './mathUtils.js';
import {AngleState} from './angleState.js'
import './styles.css'; 

export const CONSTANTS = {
  CIRCLE_RADIUS: 200,
  SECTOR_RADIUS: 70,
  SLICES: 12,
  CIRCLE_COLOR: '#747474',
  DOT_RADIUS: 5,
  DRAG_RADIUS: 8,
  LINE_WIDTH: 2,
  TEXT_FONT_SIZE: 16,
  TEXT_COLOR: 'black',
  LINE_COLOR: '#1e4759',
  SECTOR_COLOR: '#009f964d'
}

export function drawDistText(ctx, dist, x, y, fontSize = CONSTANTS.TEXT_FONT_SIZE, color = CONSTANTS.TEXT_COLOR) {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${dist.toFixed(2)}`, x, y);
}

export function drawAngleText(ctx, angle, x, y, fontSize = CONSTANTS.TEXT_FONT_SIZE, color = CONSTANTS.TEXT_COLOR) {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${angle}`, x, y);
  
}

export function drawDot(ctx, x, y, color = CONSTANTS.TEXT_COLOR, radius = CONSTANTS.DOT_RADIUS) {
  ctx.fillStyle = color;
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, MATH.TWOPI);
  ctx.fill();
  
}

export function drawLine(ctx, x1, y1, x2, y2, color = CONSTANTS.LINE_COLOR, lineWidth = CONSTANTS.LINE_WIDTH) {
  ctx.setLineDash([10, 5]);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);    
  ctx.lineTo(x2, y2);    
  ctx.stroke();
  ctx.setLineDash([]);          
}

export function midPointArea(ctx, center, first, second, angleDeg, radius = CONSTANTS.SECTOR_RADIUS, fillColor = CONSTANTS.SECTOR_COLOR) {

  const [startAngle, endAngle] = calculateMidPointAngles(center, first, second);

  ctx.beginPath();
  ctx.moveTo(center.x, center.y);   
  ctx.arc(center.x,center.y,radius,startAngle,endAngle,false);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();

  const sectorCenPt = getSectorCenter(center, startAngle, endAngle, radius);

  const labelText = `${AngleState.toDegrees(angleDeg).toFixed(1)}°`;

  drawAngleText(ctx, labelText, sectorCenPt.x, sectorCenPt.y);
}

export function drawUnitCircle(ctx, center, radius = CONSTANTS.CIRCLE_RADIUS, color = CONSTANTS.CIRCLE_COLOR)  {

  let slices = CONSTANTS.SLICES

  // Draw the circle
  ctx.strokeStyle = 'black';
  ctx.lineWidth = CONSTANTS.LINE_WIDTH;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, MATH.TWOPI);
  ctx.stroke();

  // Draw center point
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(center.x, center.y, 4, 0, MATH.TWOPI);
  ctx.fill();

  //Draw slices
  ctx.setLineDash([10, 5]);
  ctx.lineWidth = 1;

  for (let i = 0; i < slices; i++) {
    ctx.strokeStyle = color;

    //math func
    const angle = (i * MATH.TWOPI) / slices;
    const step = (MATH.TWOPI) / slices;
    const labelAngle = i * step - Math.PI / 2;
    let labelText = angle;

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(center.x + radius * Math.cos(angle), center.y + radius * Math.sin(angle));
    
    const point = {
      x: (center.x + (radius * 0.85) * Math.cos(labelAngle)),
      y: (center.y + (radius * 0.85) * Math.sin(labelAngle))
    }

    if (AngleState.useDegrees) {
      labelText = `${AngleState.toDegrees(angle).toFixed(1)}°`;
    } else {
      labelText = piLabel(i, slices);
    }
     
    drawAngleText(ctx, labelText, point.x, point.y);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}


//make universal
function piLabel(i, slices) {
  // angle = 2π * i / slices = π * (2i / slices)
  let n = 2 * i
  let d = slices;
  //computes the greatest common divisor (GCD)
  const g = (a, b) => (b ? g(b, a % b) : a);
  const k = g(n, d);
  n /= k; // n = n/k
  d /= k; // d = d/k
  if (n === 0) return "0";
  //1 = 1pi
  const num = n === 1 ? "π" : `${n}π`;
  //if there is a denominator 
  return d === 1 ? num : `${num}/${d}`;
}

