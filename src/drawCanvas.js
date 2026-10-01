import {calculateMidPointAngles, getSectorCenter} from './mathUtils.js';
import './styles.css'; 

const CONSTANTS = {
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

const toDegrees = (rad) => rad * 180 / Math.PI;
const toRadians = (deg) => deg * Math.PI / 180;

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
  ctx.fillText(`${angle.toFixed(1)}°`, x, y);
}

export function drawDot(ctx, x, y, color = CONSTANTS.TEXT_COLOR, radius = CONSTANTS.DOT_RADIUS) {
  ctx.fillStyle = color;
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2);
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

export function midPointArea(ctx, center, first, second, angleDeg, selectedPoint, radius = CONSTANTS.SECTOR_RADIUS, fillColor = CONSTANTS.SECTOR_COLOR) {

  const [startAngle, endAngle] = calculateMidPointAngles(center, first, second);

  ctx.beginPath();
  ctx.moveTo(center.x, center.y);   
  ctx.arc(center.x,center.y,radius,startAngle,endAngle,false);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();

  const sectorCenPt = getSectorCenter(center, startAngle, endAngle, radius, selectedPoint, first, second);
  drawAngleText(ctx, angleDeg, sectorCenPt.x, sectorCenPt.y);
}

export function drawUnitCircle(ctx, center, radius = CONSTANTS.CIRCLE_RADIUS, color = CONSTANTS.CIRCLE_COLOR)  {

  let slices = CONSTANTS.SLICES
  let offset = 20;

  // Draw the circle
  ctx.strokeStyle = 'black';
  ctx.lineWidth = CONSTANTS.LINE_WIDTH;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Draw center point
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(center.x, center.y, 4, 0, Math.PI * 2);
  ctx.fill();

  //Draw slices
  ctx.setLineDash([10, 5]);
  ctx.lineWidth = 1;

  for (let i = 0; i < slices; i++) {
    ctx.strokeStyle = color;
    const angle = (i * 2 * Math.PI) / slices;
    const step = (2 * Math.PI) / slices;
    const labelAngle = i * step - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(center.x + radius * Math.cos(angle), center.y + radius * Math.sin(angle));
    const point = {
      x: (center.x + (radius * 0.85) * Math.cos(labelAngle)),
      y: (center.y + (radius * 0.85) * Math.sin(labelAngle))
    }
    const labelText = toDegrees(angle);
    drawLabels(ctx, labelText, point);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

function drawLabels(ctx, text, point) {
  ctx.fillStyle = 'black';
  ctx.font = `16px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${text.toFixed(1)}°`, point.x, point.y);
}