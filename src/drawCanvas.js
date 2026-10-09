import {calculateMidPointAngles, getSectorCenter, MATH} from './mathUtils.js';
import {AngleState} from './angleState.js'
import { APP_CONSTANTS  } from './clearStyles.js';
import './styles.css'; 

export const CONSTANTS = {
  // CIRCLE_RADIUS: 200,
  SECTOR_RADIUS: 70,
  SLICES: 12,
  CIRCLE_COLOR: '#747474',
  DOT_RADIUS: 5,
  DRAG_RADIUS: 8,
  LINE_WIDTH: 2,
  TEXT_FONT_SIZE: 16,
  DEFAULT_COLOR: 'black',
  LINE_COLOR: '#1e4759',
  SECTOR_COLOR: '#009f964d'
}

export function drawDistText(ctx, dist, x, y, fontSize = CONSTANTS.TEXT_FONT_SIZE, color = CONSTANTS.DEFAULT_COLOR) {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${dist.toFixed(2)}`, x, y);
}

export function drawAngleText(ctx, angle, x, y, fontSize = CONSTANTS.TEXT_FONT_SIZE, color = CONSTANTS.DEFAULT_COLOR) {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let labelAngle = AngleState.format(angle);
  ctx.fillText(`${labelAngle}`, x, y);
}

export function drawDot(ctx, x, y, radius = CONSTANTS.DOT_RADIUS, color = CONSTANTS.DEFAULT_COLOR) {
  ctx.fillStyle = color;
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, MATH.TWOPI);
  ctx.fill();
}

export function drawLine(ctx, x1, y1, x2, y2, dashed = [10, 5], color = CONSTANTS.LINE_COLOR, lineWidth = CONSTANTS.LINE_WIDTH) {
  ctx.setLineDash(dashed);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);    
  ctx.lineTo(x2, y2);    
  ctx.stroke();
  ctx.setLineDash([]);          
}

export function drawArc(ctx, x, y, radius, startAngle, endAngle, color, counterclockwise = false) {
  ctx.beginPath();
  ctx.moveTo(x, y);   
  ctx.arc(x,y,radius,startAngle,endAngle,false);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export function midPointArea(ctx, center, first, second, angleDeg, radius = APP_CONSTANTS.CIRCLE_RADIUS, fillColor = CONSTANTS.SECTOR_COLOR) {
  const [startAngle, endAngle] = calculateMidPointAngles(center, first, second);
  drawArc(ctx, center.x,center.y,radius,startAngle,endAngle, fillColor);
  const sectorCenPt = getSectorCenter(center, startAngle, endAngle, radius);
  drawAngleText(ctx, angleDeg, sectorCenPt.x, sectorCenPt.y);
}

function drawCircleOutline(ctx, center, radius, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = CONSTANTS.LINE_WIDTH;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, MATH.TWOPI);
  ctx.stroke();
}

export function drawUnitCircle(ctx, center, radius = APP_CONSTANTS.CIRCLE_RADIUS, color = CONSTANTS.CIRCLE_COLOR)  {

  let slices = CONSTANTS.SLICES

  drawCircleOutline(ctx, center, radius, CONSTANTS.DEFAULT_COLOR);

  drawDot(ctx, center.x, center.y, CONSTANTS.DOT_RADIUS, color);

  for (let i = 0; i < slices; i++) {
   
    const angle = (i * MATH.TWOPI) / slices;
    const step = (MATH.TWOPI) / slices;
    const labelAngle = i * step - Math.PI / 2;

    drawLine(ctx, center.x, center.y, center.x + radius * Math.cos(angle), center.y + radius * Math.sin(angle), [10, 5], color, 1);
    
    const labelPoint = {
      x: (center.x + (radius * 0.85) * Math.cos(labelAngle)),
      y: (center.y + (radius * 0.85) * Math.sin(labelAngle))
    }
     
    drawAngleText(ctx, angle, labelPoint.x, labelPoint.y);
  }

}

